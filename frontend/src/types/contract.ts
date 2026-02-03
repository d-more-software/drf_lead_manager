export type BillingFrequency =
	| "MONTHLY"
	| "QUARTERLY"
	| "HALF_YEARLY"
	| "YEARLY";

export type Contract = {
	id: number;

	company: number; // FK id
	name: string;

	start_date: string | null; // YYYY-MM-DD
	end_date?: string | null;

	billing_frequency: BillingFrequency;
	billing_day: number | null;

	amount_due: string; // decimal -> string

	payment_method?: string;
	notes?: string;
};


