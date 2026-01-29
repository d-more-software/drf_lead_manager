import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies";
import type { Company } from "../../types/company";


export function useCompanies() {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		const { data } = await companiesApi.list();
		setCompanies(data);
		setLoading(false);
	}

	async function create(payload: any) {
		await companiesApi.create(payload);
		await load();
	}

	async function update(id: number, payload: any) {
		await companiesApi.update(id, payload);
		await load();
	}

	async function remove(id: number) {
		await companiesApi.delete(id);
		await load();
	}

	useEffect(() => {
		load();
	}, []);

	return { companies, loading, create, update, remove };
}
