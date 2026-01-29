export type BillingFrequency =
	| "MONTHLY"
	| "QUARTERLY"
	| "HALF_YEARLY"
	| "YEARLY";

export type Contract = {
	id: number;

	company: number; // FK id
	name: string;

	start_date: string; // YYYY-MM-DD
	end_date?: string | null;

	billing_frequency: BillingFrequency;
	billing_day: number;

	amount_due: string; // decimal -> string

	payment_method?: string;
	notes?: string;
};
