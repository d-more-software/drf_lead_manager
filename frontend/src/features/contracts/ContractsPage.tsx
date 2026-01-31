import { useState } from "react";
import ContractTable from "./ContractTable";
import ContractFormModal from "./ContractFormModal";
import { useContracts } from "./useContracts";

import type { Contract } from "../../types/contract";

export default function ContractsPage() {
	const {
		contracts,
		loading,
		create,
		update,
		remove,
		count,
		page,
		next,
		previous,
	} = useContracts();

	const [editing, setEditing] = useState<Contract | null>(null);
	const [open, setOpen] = useState(false);

	if (loading) return <div>Loading...</div>;

	function handleSubmit(data: Partial<Contract>) {
		editing?.id != null ? update(editing.id, data) : create(data);
	}

	return (
		<div className="space-y-4">
			<button
				className="btn btn-primary"
				onClick={() => {
					setEditing(null);
					setOpen(true);
				}}
			>
				Nouveau contrat
			</button>

			<ContractTable
				contracts={contracts}
				onEdit={(c) => {
					setEditing(c);
					setOpen(true);
				}}
				onDelete={remove}
			/>

			{/* ✅ Pagination */}
			<div className="flex justify-between items-center">
				<button
					className="btn btn-sm"
					onClick={previous}
					disabled={page === 1}
				>
					Précédent
				</button>

				<span className="text-sm">
					Page {page} — {count} contrats
				</span>

				<button
					className="btn btn-sm"
					onClick={next}
					disabled={page * 10 >= count}
				>
					Suivant
				</button>
			</div>

			<ContractFormModal
				open={open}
				initial={editing}
				onClose={() => setOpen(false)}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
