import { api } from "./axios";

export type BillingStats = {
	total_unpaid: number;
	overdue: number;
	paid_this_month: number;
	invoices_count: number;
};

export const billingStatsApi = () => api.get<BillingStats>("/billing/stats/");
