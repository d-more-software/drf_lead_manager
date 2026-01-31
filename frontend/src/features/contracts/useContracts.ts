import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Contract } from "../../types/contract";

type Paginated<T> = {
	results: T[];
	count: number;
	next: string | null;
	previous: string | null;
};

export function useContracts() {
	const [contracts, setContracts] = useState<Contract[]>([]);
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(1);
	const pageSize = 10; // correspond au default DRF

	async function fetchAll(p = page) {
		setLoading(true);

		const res = await api.get<Paginated<Contract>>("/contracts/", {
			params: { page: p },
		});

		setContracts(res.data.results ?? []);
		setCount(res.data.count ?? 0);

		setLoading(false);
	}

	async function create(payload: Partial<Contract>) {
		await api.post("/contracts/", payload);
		fetchAll();
	}

	async function update(id: number, payload: Partial<Contract>) {
		await api.put(`/contracts/${id}/`, payload);
		fetchAll();
	}

	async function remove(id: number) {
		await api.delete(`/contracts/${id}/`);
		fetchAll();
	}

	function next() {
		if (page * pageSize < count) {
			const p = page + 1;
			setPage(p);
			fetchAll(p);
		}
	}

	function previous() {
		if (page > 1) {
			const p = page - 1;
			setPage(p);
			fetchAll(p);
		}
	}

	useEffect(() => {
		fetchAll(1);
	}, []);

	return {
		contracts,
		loading,
		count,
		page,
		create,
		update,
		remove,
		next,
		previous,
	};
}
