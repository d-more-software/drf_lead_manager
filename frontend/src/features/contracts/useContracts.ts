import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useToast } from "../../components/ui/ToastProvider";
import type { Contract } from "../../types/contract";

type Paginated<T> = {
	results: T[];
	count: number;
};

export function useContracts() {
	const { show } = useToast();

	const [contracts, setContracts] = useState<Contract[]>([]);
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const pageSize = 10;

	/* =========================
	   FETCH
	   ========================= */

	async function fetchAll(p = page, q = search) {
		try {
			setLoading(true);

			const res = await api.get<Paginated<Contract>>("/contracts/", {
				params: {
					page: p,
					search: q || undefined, // reset si vide
				},
			});

			setContracts(res.data.results ?? []);
			setCount(res.data.count ?? 0);
		} catch {
			show("Erreur chargement contrats", "error");
		} finally {
			setLoading(false);
		}
	}

	/* =========================
	   SEARCH
	   ========================= */

	function searchContracts(value: string) {
		setSearch(value);
		setPage(1);
		fetchAll(1, value);
	}

	/* =========================
	   CRUD
	   ========================= */

	async function create(payload: Partial<Contract>) {
		await api.post("/contracts/", payload);
		show("Contrat créé", "success");
		fetchAll();
	}

	async function update(id: number, payload: Partial<Contract>) {
		await api.put(`/contracts/${id}/`, payload);
		show("Contrat modifié", "success");
		fetchAll();
	}

	async function remove(id: number) {
		await api.delete(`/contracts/${id}/`);
		show("Contrat supprimé", "success");
		fetchAll();
	}

	/* =========================
	   PAGINATION
	   ========================= */

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
		searchContracts,
		search,
	};
}
