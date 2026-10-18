export { USE_MOCK_DATA } from "./config";
export {
  getSampleTrip,
  getTripSync,
  listTrips,
  getSavedTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  isUuid,
  mapRowToTrip,
} from "./trips";
export {
  GOA_SHARED_TRIP,
  getSharedTripSync,
  getSharedTrip,
  setShared,
  type SharedTripResult,
} from "./sharing";
export { getCuratedTrips, getCuratedTripsAsync } from "./curated";
export {
  getCurrentUser,
  getCurrentUserAsync,
  getCurrentUserSync,
  requireUser,
  useCurrentUser,
  useAuth,
  isUserLoggedIn,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  sendPasswordResetEmail,
  loginUser,
  logoutUser,
  toggleMockAuth,
  isSupabaseConfigured,
  type User,
} from "./auth";
