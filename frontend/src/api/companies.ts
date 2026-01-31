import { api } from "./axios";
import type { Company } from "../types/company";
import type { Paginated } from "../types/pagination";

type Payload = Partial<
	Omit<Company, "id" | "status" | "total_due" | "created_at" | "updated_at">
>;

export const companiesApi = {
	list: (page = 1) =>
		api.get<Paginated<Company>>(`/companies/?page=${page}`),

	create: (data: Payload) => api.post<Company>("/companies/", data),

	update: (id: number, data: Payload) =>
		api.patch<Company>(`/companies/${id}/`, data),

	delete: (id: number) => api.delete(`/companies/${id}/`),
};
