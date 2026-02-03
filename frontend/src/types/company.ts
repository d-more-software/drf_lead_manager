export type Company = {
	id: number;

	name: string;
	sector: string;
	email: string;
	phone?: string;

	province: string;
	city: string;
	address?: string;

	responsible_name?: string;
	responsible_function?: string;

	accountant_name?: string;
	accountant_contact?: string;

	observation?: string;

	credit_limit: string | null; // decimal → string
	status: "normal" | "warning" | "contentious";

	total_due: string;

	created_at: string;
	updated_at: string;
};
