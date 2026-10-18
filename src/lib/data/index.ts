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
  requireUser,
  useCurrentUser,
  isUserLoggedIn,
  loginUser,
  logoutUser,
  toggleMockAuth,
  type User,
} from "./auth";
