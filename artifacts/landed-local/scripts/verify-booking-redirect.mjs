import assert from "node:assert/strict";
import { registerBookingSuccess } from "../src/scripts/booking-success.ts";

const registrations = [];
let destination;
const fakeCalApi = (...args) => registrations.push(args);

registerBookingSuccess(fakeCalApi, "/before-our-call", (path) => {
  destination = path;
});

assert.equal(registrations.length, 1);
assert.equal(registrations[0][0], "on");
assert.equal(registrations[0][1].action, "bookingSuccessful");
assert.equal(destination, undefined, "navigation waits for Cal.com's success event");

registrations[0][1].callback();
assert.equal(destination, "/before-our-call");
console.log("Booking redirect passed: Cal.com success navigates to the configured pre-call path.");
