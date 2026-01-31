import { api } from "./axios";
import type { Contract } from "../types/contract";

type Paginated<T> = {
	results: T[];
};

export async function listContracts(): Promise<Contract[]> {
	const { data } = await api.get<Paginated<Contract>>("/contracts/");
	return data.results;
}

export async function createContract(payload: Partial<Contract>) {
	const { data } = await api.post<Contract>("/contracts/", payload);
	return data;
}

export async function updateContract(id: number, payload: Partial<Contract>) {
	const { data } = await api.patch<Contract>(`/contracts/${id}/`, payload);
	return data;
}

export async function deleteContract(id: number) {
	await api.delete(`/contracts/${id}/`);
}
