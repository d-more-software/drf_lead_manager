import { api } from "./axios";
import type { Contract } from "../types/contract";

type Payload = Omit<Contract, "id">;

export const contractsApi = {
    
	list: () => api.get<Contract[]>("/api/contracts/"),

	create: (data: Payload) => api.post<Contract>("/api/contracts/", data),

	update: (id: number, data: Partial<Payload>) =>
		api.patch<Contract>(`/api/contracts/${id}/`, data),

	delete: (id: number) => api.delete(`/api/contracts/${id}/`),
};
