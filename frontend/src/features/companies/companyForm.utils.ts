import type { Company } from "../../types/company";

/*
  Form shape strictement contrôlée
  -> jamais undefined
*/
export type CompanyForm = {
	name: string;
	sector: string;
	email: string;
	phone: string;
	province: string;
	city: string;
	address: string;
	responsible_name: string;
	responsible_function: string;
	accountant_name: string;
	accountant_contact: string;
	credit_limit: number;
	observation: string;
};

/* =========================
   Etat vide (create)
   ========================= */
export const EMPTY_COMPANY_FORM: CompanyForm = {
	name: "",
	sector: "",
	email: "",
	phone: "",
	province: "",
	city: "",
	address: "",
	responsible_name: "",
	responsible_function: "",
	accountant_name: "",
	accountant_contact: "",
	credit_limit: 0,
	observation: "",
};

/* =========================
   API -> Form (normalize)
   ========================= */
export function normalizeCompanyToForm(company?: Company | null): CompanyForm {
	if (!company) return EMPTY_COMPANY_FORM;

	return {
		name: company.name ?? "",
		sector: company.sector ?? "",
		email: company.email ?? "",
		phone: company.phone ?? "",
		province: company.province ?? "",
		city: company.city ?? "",
		address: company.address ?? "",
		responsible_name: company.responsible_name ?? "",
		responsible_function: company.responsible_function ?? "",
		accountant_name: company.accountant_name ?? "",
		accountant_contact: company.accountant_contact ?? "",
		observation: company.observation ?? "",
		credit_limit: Number(company.credit_limit ?? 0),
	};
}
