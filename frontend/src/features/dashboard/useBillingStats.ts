import { useEffect, useState } from "react";
import { billingStatsApi, type BillingStats } from "../../api/billing";

export function useBillingStats() {
	const [data, setData] = useState<BillingStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		billingStatsApi()
			.then((res) => {
				setData({
					total_unpaid: Number(res.data.total_unpaid ?? 0),
					overdue: Number(res.data.overdue ?? 0),
					paid_this_month: Number(res.data.paid_this_month ?? 0),
					invoices_count: res.data.invoices_count ?? 0,
				});
			})
			.finally(() => setLoading(false));
	}, []);

	return { data, loading };
}
