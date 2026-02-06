import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies";
import { useToast } from "../../components/ui/ToastProvider";
import type { Company } from "../../types/company";

type Params = {
	page?: number;
	search?: string;
};

export function useCompanies() {
	const { show } = useToast();

	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);

	const [search, setSearch] = useState("");

	const pageSize = 10;

	/* =========================
	   FETCH
	   ========================= */

	async function load(params?: Params) {
		try {
			setLoading(true);

			const final = {
				page: params?.page ?? page,
				search: params?.search ?? search,
			};

			const { data } = await companiesApi.list(final);

			setCompanies(data.results ?? []);
			setCount(data.count ?? 0);

			setPage(final.page);
			setSearch(final.search ?? "");
		} catch (err) {
			show("Erreur chargement entreprises", "error");
		} finally {
			setLoading(false);
		}
	}

	/* =========================
	   SEARCH
	   ========================= */

	function searchCompanies(q: string) {
		load({ page: 1, search: q });
	}

	/* =========================
	   CRUD
	   ========================= */

	async function create(payload: Partial<Company>) {
		try {
			await companiesApi.create(payload);
			show("Entreprise créée", "success");
			load();
		} catch {
			show("Erreur création entreprise", "error");
		}
	}

	async function update(id: number, payload: Partial<Company>) {
		try {
			await companiesApi.update(id, payload);
			show("Entreprise modifiée", "success");
			load();
		} catch {
			show("Erreur modification entreprise", "error");
		}
	}

	async function remove(id: number) {
		try {
			await companiesApi.delete(id);
			show("Entreprise supprimée", "success");
			load();
		} catch {
			show("Erreur suppression entreprise", "error");
		}
	}

	/* =========================
	   PAGINATION
	   ========================= */

	function next() {
		if (page * pageSize < count) {
			load({ page: page + 1 });
		}
	}

	function previous() {
		if (page > 1) {
			load({ page: page - 1 });
		}
	}

	useEffect(() => {
		load({ page: 1 });
	}, []);

	return {
		companies,
		loading,
		create,
		update,
		remove,
		next,
		previous,
		searchCompanies,
		page,
		count,
	};
}
