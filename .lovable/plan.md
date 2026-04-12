

## Change Booking Window from 21 to 14 Days

Update the `BOOKING_WINDOW_DAYS` constant in `src/components/booking/bookingData.ts` from `21` to `14`. This single constant controls both the calendar date range and the display text, so no other files need changes.

### Technical Detail
- **File**: `src/components/booking/bookingData.ts`
- **Change**: Line with `export const BOOKING_WINDOW_DAYS = 21;` → `export const BOOKING_WINDOW_DAYS = 14;`

