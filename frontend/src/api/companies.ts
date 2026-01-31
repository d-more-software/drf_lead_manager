import { api } from "./axios";
import type { Company } from "../types/company";
import type { Paginated } from "../types/pagination";

type Payload = Partial<
	Omit<Company, "id" | "status" | "total_due" | "created_at" | "updated_at">
>;

export const companiesApi = {
	list: (page = 1) =>
		api.get<Paginated<Company>>(`/api/companies/?page=${page}`),

	create: (data: Payload) => api.post<Company>("/api/companies/", data),

	update: (id: number, data: Payload) =>
		api.patch<Company>(`/api/companies/${id}/`, data),

	delete: (id: number) => api.delete(`/api/companies/${id}/`),
};
