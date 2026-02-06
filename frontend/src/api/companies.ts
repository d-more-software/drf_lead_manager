import { api } from "./axios";
import type { Company } from "../types/company";
import type { Paginated } from "../types/pagination";

type Payload = Partial<
	Omit<Company, "id" | "status" | "total_due" | "created_at" | "updated_at">
>;

type ListParams = {
	page?: number;
	search?: string;
};

export const companiesApi = {
	list: (params?: ListParams) =>
		api.get<Paginated<Company>>("/companies/", {
			params,
		}),

	create: (data: Payload) =>
		api.post<Company>("/companies/", data),

	update: (id: number, data: Payload) =>
		api.patch<Company>(`/companies/${id}/`, data),

	delete: (id: number) =>
		api.delete(`/companies/${id}/`),
};
