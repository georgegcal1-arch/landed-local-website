type BookingEventApi = (...args: unknown[]) => void;

/** Register the shared post-booking destination for a Cal.com inline embed. */
export function registerBookingSuccess(
  api: BookingEventApi,
  destination: string,
  navigate: (path: string) => void,
) {
  api("on", {
    action: "bookingSuccessful",
    callback: () => navigate(destination),
  });
}
