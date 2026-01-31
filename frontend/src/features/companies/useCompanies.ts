import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies";
import type { Company } from "../../types/company";

export function useCompanies() {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const pageSize = 10; // correspond au DRF default

	async function load(p = page) {
		setLoading(true);

		const { data } = await companiesApi.list(p);

		setCompanies(data.results);
		setCount(data.count);

		setLoading(false);
	}

	async function create(payload: any) {
		try {
			await companiesApi.create(payload);
			await load();
		} catch (e: any) {
			console.log("DRF error →", e.response?.data);
			throw e;
		}
	}

	async function update(id: number, payload: any) {
		await companiesApi.update(id, payload);
		await load();
	}

	async function remove(id: number) {
		await companiesApi.delete(id);
		await load();
	}

	function next() {
		if (page * pageSize < count) {
			const p = page + 1;
			setPage(p);
			load(p);
		}
	}

	function previous() {
		if (page > 1) {
			const p = page - 1;
			setPage(p);
			load(p);
		}
	}

	useEffect(() => {
		load(1);
	}, []);

	return {
		companies,
		loading,
		create,
		update,
		remove,
		next,
		previous,
		page,
		count,
	};
}
