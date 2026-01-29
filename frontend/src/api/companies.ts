import { api } from "./axios";
import type { Company } from "../types/company";

type Payload = Partial<
	Omit<Company, "id" | "status" | "total_due" | "created_at" | "updated_at">
>;

export const companiesApi = {
	list: () => api.get<Company[]>("/api/companies/"),

	create: (data: Payload) => api.post<Company>("/api/companies/", data),

	update: (id: number, data: Payload) =>
		api.patch<Company>(`/api/companies/${id}/`, data),

	delete: (id: number) => api.delete(`/api/companies/${id}/`),
};
