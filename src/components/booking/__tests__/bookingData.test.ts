import { describe, it, expect } from "vitest";
import {
  getSlotAvailability,
  getAllowedSlots,
  getBlockedSlots,
  setLiveBookings,
  timeSlots,
} from "../bookingData";

describe("Time slots", () => {
  it("exposes only 10am and 2pm", () => {
    expect(timeSlots.map((s) => s.id)).toEqual(["10am", "2pm"]);
  });
});

describe("Allowed slots per package", () => {
  it("Essential and Signature can book both slots", () => {
    expect(getAllowedSlots("essential")).toEqual(["10am", "2pm"]);
    expect(getAllowedSlots("signature")).toEqual(["10am", "2pm"]);
  });
  it("Interior and Ultimate only at 10am", () => {
    expect(getAllowedSlots("interior")).toEqual(["10am"]);
    expect(getAllowedSlots("diamond")).toEqual(["10am"]);
  });
});

describe("Blocked slots", () => {
  it("Essential/Signature block nothing", () => {
    expect(getBlockedSlots("10am", "essential")).toEqual([]);
    expect(getBlockedSlots("2pm", "signature")).toEqual([]);
  });
  it("Interior/Ultimate book the whole day", () => {
    expect(getBlockedSlots("10am", "interior")).toEqual(["2pm"]);
    expect(getBlockedSlots("10am", "diamond")).toEqual(["2pm"]);
  });
});

describe("Availability", () => {
  const date = "2099-06-10";

  it("Essential @10am and Signature @2pm coexist (no overlap blocking)", () => {
    setLiveBookings([{ date, slotId: "10am", packageId: "essential" }]);
    expect(getSlotAvailability(date, "signature", "2pm").allowed).toBe(true);
    expect(getSlotAvailability(date, "essential", "2pm").allowed).toBe(true);
  });

  it("Interior @10am blocks the 2pm slot for everyone", () => {
    setLiveBookings([{ date, slotId: "10am", packageId: "interior" }]);
    expect(getSlotAvailability(date, "essential", "2pm").allowed).toBe(false);
    expect(getSlotAvailability(date, "signature", "2pm").allowed).toBe(false);
  });

  it("Interior cannot be booked if any other booking exists that day", () => {
    setLiveBookings([{ date, slotId: "2pm", packageId: "essential" }]);
    expect(getSlotAvailability(date, "interior", "10am").allowed).toBe(false);
    expect(getSlotAvailability(date, "diamond", "10am").allowed).toBe(false);
  });

  it("Same slot cannot be double-booked", () => {
    setLiveBookings([{ date, slotId: "10am", packageId: "essential" }]);
    expect(getSlotAvailability(date, "signature", "10am").allowed).toBe(false);
  });
});