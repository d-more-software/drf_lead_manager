import { useEffect, useState } from "react";
import { contractsApi } from "../../api/contract";
import type { Contract } from "../../types/contract";


export function useContracts() {
	const [contracts, setContracts] = useState<Contract[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		const { data } = await contractsApi.list();
		setContracts(data);
		setLoading(false);
	}

	async function create(payload: any) {
		await contractsApi.create(payload);
		await load();
	}

	async function update(id: number, payload: any) {
		await contractsApi.update(id, payload);
		await load();
	}

	async function remove(id: number) {
		await contractsApi.delete(id);
		await load();
	}

	useEffect(() => {
		load();
	}, []);

	return { contracts, loading, create, update, remove };
}
