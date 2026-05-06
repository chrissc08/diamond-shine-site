import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setLiveBookings } from "@/components/booking/bookingData";

let loaded = false;

export function useLiveBookings() {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    supabase
      .rpc("get_booked_slots")
      .then(({ data, error }) => {
        if (error) {
          console.error("get_booked_slots", error);
          loaded = false;
          return;
        }
        if (data) {
          setLiveBookings(
            data.map((r: any) => ({
              date: r.booking_date,
              slotId: r.time_slot_id,
              packageId: r.package_id,
            })),
          );
        }
      });
  }, []);
}

export function refreshLiveBookings() {
  loaded = false;
}