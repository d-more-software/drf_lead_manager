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

	if (loading) return <div className="p-6">Loading...</div>;

	function handleSubmit(data: Partial<Contract>) {
		if (editing) update(editing.id, data);
		else create(data);
	}

	return (
		<div className="space-y-6 p-4 md:p-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<h1 className="text-xl font-bold">Contrats</h1>

				<button
					className="btn btn-primary w-full md:w-auto"
					onClick={() => {
						setEditing(null);
						setOpen(true);
					}}
				>
					Nouveau contrat
				</button>
			</div>

			{/* Table responsive */}
			<div className="overflow-x-auto bg-base-100 rounded-xs shadow">
				<ContractTable
					contracts={contracts}
					onEdit={(c) => {
						setEditing(c);
						setOpen(true);
					}}
					onDelete={remove}
				/>
			</div>

			{/* Pagination responsive */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-3">
				<button
					className="btn btn-sm w-full md:w-auto"
					onClick={previous}
					disabled={page === 1}
				>
					Précédent
				</button>

				<span className="text-sm opacity-70 text-center">
					Page {page} — {count} contrats
				</span>

				<button
					className="btn btn-sm w-full md:w-auto"
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
