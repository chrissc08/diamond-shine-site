## Goal

Guarantee that a Signature (or Essential) Reset booked into the 9:00 AM fallback slot **never** blocks the 12:30 PM slot — regardless of buffer math or future duration tweaks.

## Current behavior (the math)

- Signature = 3h service + 0.5h buffer → 9:00 AM start ends at **12:30 PM exactly**
- Essential = 2h + 0.5h buffer → 9:00 AM start ends at **11:30 AM**
- Overlap check uses strict `<` (`requestedStart < existingEnd`), so 12:30 is technically *not* blocked today.

The problem: it's a fragile coincidence. If anyone ever bumps the buffer to 45 min, or changes Signature to 3.5h, 12:30 silently disappears. There's also zero breathing room for Signature — it ends the exact second the next appointment starts.

## The fix

Add an explicit rule in `getBlockedSlots` and `getSlotAvailability` (in `src/components/booking/bookingData.ts`):

> When a small service (Signature or Essential) takes the 9:00 AM fallback slot, it can **never** block the 12:30 PM or 3:00 PM slots.

Implementation outline:

1. In `getBlockedSlots(slotId, packageId)`: if `slotId === "9am"` AND `packageId` is `"signature"` or `"essential"`, return `[]` (no slots blocked).
2. In `getSlotAvailability` overlap loops: skip the overlap check entirely when the *existing* booking is a Signature/Essential at 9 AM — those small services are guaranteed not to spill into later slots.
3. Update the unit tests in `src/components/booking/__tests__/bookingData.test.ts`:
   - Add: `Signature at 9am blocks no slots`
   - Add: `Essential at 9am blocks no slots`
   - Add: `getSlotAvailability` allows Signature at 12:30 even when another Signature is booked at 9 AM same day.

## Why this is the right approach

- **Explicit > implicit.** The rule is now stated in code, not hidden inside floating-point arithmetic.
- **Future-proof.** Buffer or duration changes won't accidentally swallow 12:30.
- **Matches business intent.** The fallback exists to *fill* the day, not to cannibalize the next slot.

## Files touched

- `src/components/booking/bookingData.ts` — add carve-out in `getBlockedSlots` and `getSlotAvailability`
- `src/components/booking/__tests__/bookingData.test.ts` — add 3 new tests

No UI changes required.