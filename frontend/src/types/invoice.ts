export type InvoiceStatus =
	| "draft"
	| "sent"
	| "pending"
	| "paid"
	| "overdue"
	| "cancelled";

export type Invoice = {
	id: number;

	invoice_number: string;

	issue_date: string; // read-only
	due_date: string;

	company: number;
	contract: number | null; // optional backend

	amount_total: string;
	amount_paid: string; // read-only
	amount_due: string; // read-only

	status: InvoiceStatus; // read-only
	notes: string;

	created_at: string;
};
