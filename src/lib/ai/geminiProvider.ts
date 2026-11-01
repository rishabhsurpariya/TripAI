import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL } from "./config";
import {
  AIProvider,
  GenerateStructuredOptions,
  AIRateLimitError,
  AIValidationError,
  AIGenerationError,
} from "./types";

/**
 * Gemini AI Provider implementation
 * Uses the official Google Gen AI SDK behind the AIProvider interface.
 * Configured with JSON mode, 429 backoff retry, and Zod validation self-correction retry.
 */
export class GeminiProvider implements AIProvider {
  name = "gemini";
  private ai: GoogleGenAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        "GEMINI_API_KEY is not configured in environment variables."
      );
    }
    this.ai = new GoogleGenAI({ apiKey: key });
    this.model = model || GEMINI_MODEL;
  }

  /**
   * Helper to check if an error is a 429 rate limit, 503 high demand, or quota exhaustion.
   */
  private isRateLimitError(err: any): boolean {
    const msg = (err?.message || "").toLowerCase();
    const status = err?.status || err?.statusCode || 0;
    return (
      status === 429 ||
      status === 503 ||
      msg.includes("429") ||
      msg.includes("503") ||
      msg.includes("resource_exhausted") ||
      msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("high demand") ||
      msg.includes("unavailable")
    );
  }

  private isTransientNetworkError(err: any): boolean {
    const msg = (err?.message || "").toLowerCase();
    return (
      msg.includes("fetch failed") ||
      msg.includes("econnreset") ||
      msg.includes("etimedout") ||
      msg.includes("socket")
    );
  }

  /**
   * Generates structured data validated by a Zod schema.
   * Handles:
   * 1. 429/503 rate-limit with one backoff retry -> AIRateLimitError
   * 2. Transient network error with one retry -> AIGenerationError
   * 3. Zod validation failure with one prompt correction retry -> AIValidationError
   */
  async generateStructured<T>({
    systemPrompt,
    prompt,
    schema,
    stageName,
  }: GenerateStructuredOptions<T>): Promise<T> {
    const executeCall = async (currentPrompt: string): Promise<string> => {
      try {
        const response = await this.ai.models.generateContent({
          model: this.model,
          contents: currentPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const text = response.text;
        if (!text) {
          throw new AIGenerationError("Empty response from AI model.");
        }
        return text;
      } catch (err: any) {
        if (this.isRateLimitError(err)) {
          // Wait briefly and retry once
          console.warn(
            `[GeminiProvider:${stageName}] Rate limit or service busy encountered. Retrying in 1.8s...`
          );
          await new Promise((r) => setTimeout(r, 1800));

          try {
            const retryResponse = await this.ai.models.generateContent({
              model: this.model,
              contents: currentPrompt,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                temperature: 0.3,
              },
            });
            const text = retryResponse.text;
            if (!text) throw new AIGenerationError("Empty response on retry.");
            return text;
          } catch (retryErr: any) {
            console.error(
              `[GeminiProvider:${stageName}] Rate limit confirmed after retry:`,
              retryErr?.message
            );
            throw new AIRateLimitError("busy, try again soon");
          }
        }

        if (this.isTransientNetworkError(err)) {
          console.warn(
            `[GeminiProvider:${stageName}] Transient network error (${err?.message}). Retrying in 1.5s...`
          );
          await new Promise((r) => setTimeout(r, 1500));
          try {
            const retryResponse = await this.ai.models.generateContent({
              model: this.model,
              contents: currentPrompt,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                temperature: 0.3,
              },
            });
            const text = retryResponse.text;
            if (!text) throw new AIGenerationError("Empty response on retry.");
            return text;
          } catch (retryErr: any) {
            console.error(
              `[GeminiProvider:${stageName}] Network error persisted on retry:`,
              retryErr?.message
            );
            throw new AIGenerationError(
              retryErr?.message || "Network error communicating with AI provider."
            );
          }
        }

        console.error(
          `[GeminiProvider:${stageName}] Model invocation error:`,
          err?.message
        );
        throw new AIGenerationError(
          err?.message || "Failed to generate content from AI provider."
        );
      }
    };

    // First attempt
    const rawText = await executeCall(prompt);
    let parsedJson: any;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseErr) {
      console.warn(
        `[GeminiProvider:${stageName}] Initial JSON parse failed. Retrying with explicit JSON instruction...`
      );
    }

    if (parsedJson) {
      const validationResult = schema.safeParse(parsedJson);
      if (validationResult.success) {
        return validationResult.data;
      }

      console.warn(
        `[GeminiProvider:${stageName}] Schema validation failed on first attempt:`,
        validationResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")
      );
    }

    // Self-correction retry: retry once with validation issue included in prompt
    const retryPrompt = `${prompt}

CRITICAL: Your previous response was invalid or failed validation.
Error details: ${parsedJson ? "Fields did not match the required JSON schema" : "Malformed JSON"}.
Please return ONLY a strictly valid JSON object conforming exactly to the requested schema.`;

    const retryRawText = await executeCall(retryPrompt);
    try {
      const retryParsedJson = JSON.parse(retryRawText);
      const retryValidationResult = schema.safeParse(retryParsedJson);
      if (retryValidationResult.success) {
        return retryValidationResult.data;
      }

      console.error(
        `[GeminiProvider:${stageName}] Validation failed after retry:`,
        retryValidationResult.error.issues
      );
      throw new AIValidationError("AI response failed schema validation after retry.");
    } catch (err: any) {
      if (err instanceof AIRateLimitError || err instanceof AIValidationError) {
        throw err;
      }
      console.error(
        `[GeminiProvider:${stageName}] JSON parsing failed on retry:`,
        err?.message
      );
      throw new AIValidationError("AI response was not valid JSON after retry.");
    }
  }
}

// Global provider singleton instance
let defaultProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!defaultProvider) {
    defaultProvider = new GeminiProvider();
  }
  return defaultProvider;
}
