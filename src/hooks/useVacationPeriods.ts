import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VacationPeriod {
  id: string;
  start_date: string;
  end_date: string;
  message: string | null;
  active: boolean;
}

let cache: VacationPeriod[] | null = null;
let cachePromise: Promise<VacationPeriod[]> | null = null;

async function fetchVacations(): Promise<VacationPeriod[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("vacation_periods")
      .select("*")
      .eq("active", true)
      .gte("end_date", today);
    if (error) {
      console.error("vacation fetch", error);
      return [];
    }
    cache = data || [];
    return cache;
  })();
  return cachePromise;
}

export function clearVacationCache() {
  cache = null;
  cachePromise = null;
}

export function useVacationPeriods() {
  const [periods, setPeriods] = useState<VacationPeriod[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let mounted = true;
    fetchVacations().then((p) => {
      if (mounted) {
        setPeriods(p);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { periods, loading };
}

export function isDateInVacation(date: Date, periods: VacationPeriod[]): VacationPeriod | null {
  const ds = date.toISOString().split("T")[0];
  return periods.find((p) => ds >= p.start_date && ds <= p.end_date) || null;
}