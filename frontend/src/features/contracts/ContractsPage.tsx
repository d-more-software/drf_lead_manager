import { useState } from "react";
import { useContracts } from "./useContracts";
import { useCompanies } from "../companies/useCompanies";
import ContractTable from "./ContractTable";
import ContractFormModal from "./ContractFormModal";
import type { Contract } from "../../types/contract";
import { useAuth } from "../auth/AuthContext";

export default function ContractsPage() {
	const { contracts, loading, create, update, remove } = useContracts();
	const { companies } = useCompanies();
	const { user } = useAuth();

	const isAdmin = user?.is_agency_admin;

	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<Contract | null>(null);

	if (loading) return <div>Loading...</div>;

	return (
		<div className="space-y-6">
			{isAdmin && (
				<button
					className="btn btn-primary"
					onClick={() => {
						setEditing(null);
						setOpen(true);
					}}
				>
					New contract
				</button>
			)}

			<ContractTable
				contracts={contracts}
				companies={companies}
				isAdmin={isAdmin}
				onEdit={(c: Contract) => {
					setEditing(c);
					setOpen(true);
				}}
				onDelete={remove}
			/>

			<ContractFormModal
				open={open}
				initial={editing}
				companies={companies}
				onClose={() => setOpen(false)}
				onSubmit={(data: any) =>
					editing ? update(editing.id, data) : create(data)
				}
			/>
		</div>
	);
}
