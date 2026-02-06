import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useToast } from "../../components/ui/ToastProvider"; // ← ton toast custom
import type { Contract } from "../../types/contract";

type Paginated<T> = {
	results: T[];
	count: number;
	next: string | null;
	previous: string | null;
};

export function useContracts() {
	const { show } = useToast();

	const [contracts, setContracts] = useState<Contract[]>([]);
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(1);

	const pageSize = 10;

	/* =========================
	   FETCH
	   ========================= */

	async function fetchAll(p = page) {
		try {
			setLoading(true);

			const res = await api.get<Paginated<Contract>>("/contracts/", {
				params: { page: p },
			});

			setContracts(res.data.results ?? []);
			setCount(res.data.count ?? 0);
		} catch (err: any) {
			console.error(err);
			show("Erreur chargement contrats", "error");
		} finally {
			setLoading(false);
		}
	}

	/* =========================
	   CRUD + TOAST
	   ========================= */

	async function create(payload: Partial<Contract>) {
		try {
			await api.post("/contracts/", payload);
			show("Contrat créé", "success");
			await fetchAll();
		} catch (err: any) {
			console.error(err);
			show(
				err?.response?.data?.detail || "Erreur création contrat",
				"error"
			);
		}
	}

	async function update(id: number, payload: Partial<Contract>) {
		try {
			await api.put(`/contracts/${id}/`, payload);
			show("Contrat modifié", "success");
			await fetchAll();
		} catch (err: any) {
			console.error(err);
			show(
				err?.response?.data?.detail || "Erreur modification contrat",
				"error"
			);
		}
	}

	async function remove(id: number) {
		try {
			await api.delete(`/contracts/${id}/`);
			show("Contrat supprimé", "success");
			await fetchAll();
		} catch (err: any) {
			console.error(err);
			show(
				err?.response?.data?.detail || "Erreur suppression contrat",
				"error"
			);
		}
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
	};
}
