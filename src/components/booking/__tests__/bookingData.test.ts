import { describe, it, expect } from "vitest";
import {
  getSlotAvailability,
  getBookingEndTime,
  getAllowedSlots,
  getBlockedSlots,
  getTotalBookingTime,
  getServiceDuration,
} from "../bookingData";

describe("Service durations", () => {
  it("returns correct durations (without buffer)", () => {
    expect(getServiceDuration("essential")).toBe(2);
    expect(getServiceDuration("signature")).toBe(3);
    expect(getServiceDuration("interior")).toBe(5);
    expect(getServiceDuration("diamond")).toBe(6);
  });

  it("adds 30-min buffer to total booking time", () => {
    expect(getTotalBookingTime("essential")).toBe(2.5);
    expect(getTotalBookingTime("signature")).toBe(3.5);
    expect(getTotalBookingTime("interior")).toBe(5.5);
    expect(getTotalBookingTime("diamond")).toBe(6.5);
  });
});

describe("Booking end times", () => {
  it("Essential at 9am ends at 11:30", () => {
    expect(getBookingEndTime("9am", "essential")).toBe(11.5);
  });
  it("Signature at 12:30pm ends at 4:00pm", () => {
    expect(getBookingEndTime("1230pm", "signature")).toBe(16);
  });
  it("Interior at 9am ends at 2:30pm", () => {
    expect(getBookingEndTime("9am", "interior")).toBe(14.5);
  });
  it("Ultimate at 9am ends at 3:30pm", () => {
    expect(getBookingEndTime("9am", "diamond")).toBe(15.5);
  });
});

describe("Package-level slot restrictions (no fallback)", () => {
  // Use a date far in the future so fallback is never active
  const farDate = "2099-01-15";

  it("Ultimate only allowed at 9am", () => {
    expect(getAllowedSlots("diamond", farDate)).toEqual(["9am"]);
  });
  it("Interior only allowed at 9am", () => {
    expect(getAllowedSlots("interior", farDate)).toEqual(["9am"]);
  });
  it("Signature allowed at 12:30 and 3:00 only", () => {
    expect(getAllowedSlots("signature", farDate)).toEqual(["1230pm", "3pm"]);
  });
  it("Essential allowed at 12:30 and 3:00 only", () => {
    expect(getAllowedSlots("essential", farDate)).toEqual(["1230pm", "3pm"]);
  });
});

describe("Blocked slots from existing bookings", () => {
  it("Ultimate at 9am blocks 12:30 AND 3:00 (ends 3:30pm)", () => {
    expect(getBlockedSlots("9am", "diamond")).toEqual(["1230pm", "3pm"]);
  });
  it("Interior at 9am blocks 12:30 but NOT 3:00 (ends 2:30pm)", () => {
    expect(getBlockedSlots("9am", "interior")).toEqual(["1230pm"]);
  });
  it("Signature at 12:30 blocks 3:00 (ends 4:00pm)", () => {
    expect(getBlockedSlots("1230pm", "signature")).toEqual(["3pm"]);
  });
  it("Essential at 12:30 does NOT block 3:00 (ends 3:00pm exactly)", () => {
    // 3pm start (15) is NOT < 15 end, so not blocked
    expect(getBlockedSlots("1230pm", "essential")).toEqual([]);
  });
});

describe("Overlap prevention via getSlotAvailability", () => {
  // Use a clean date with no mock bookings
  const cleanDate = "2099-06-10";

  it("Essential cannot book 9am (package restriction)", () => {
    const result = getSlotAvailability(cleanDate, "essential", "9am");
    expect(result.allowed).toBe(false);
  });

  it("Ultimate cannot book 3pm (package restriction)", () => {
    const result = getSlotAvailability(cleanDate, "diamond", "3pm");
    expect(result.allowed).toBe(false);
  });

  it("Signature CAN book 12:30 on a clean date", () => {
    const result = getSlotAvailability(cleanDate, "signature", "1230pm");
    expect(result.allowed).toBe(true);
  });

  it("Interior CAN book 9am on a clean date", () => {
    const result = getSlotAvailability(cleanDate, "interior", "9am");
    expect(result.allowed).toBe(true);
  });
});
