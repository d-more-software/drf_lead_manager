import { useEffect, useState } from "react";
import { billingStatsApi } from "../../api/billing";

export type BillingStats = {
  total_unpaid: string;
  overdue: string;
  paid_this_month: string;
  invoices_count: number;
};

export function useBillingStats() {
  const [data, setData] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await billingStatsApi();
      setData(res.data);
      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
