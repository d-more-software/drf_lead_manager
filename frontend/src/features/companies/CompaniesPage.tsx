import { useState } from "react";
import { useCompanies } from "./useCompanies";
import CompanyTable from "./CompanyTable";
import CompanyFormModal from "./CompanyFormModal";
import type { Company } from "../../types/company";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function CompaniesPage() {
	const {
		companies,
		loading,
		create,
		update,
		remove,
		next,
		previous,
		page,
		count,
	} = useCompanies();

	const { user } = useAuth();
	const isAdmin = user?.is_agency_admin;

	const [isOpen, setIsOpen] = useState(false);
	const [editing, setEditing] = useState<Company | null>(null);

	const [toDelete, setToDelete] = useState<Company | null>(null);
	const [loadingDelete, setLoadingDelete] = useState(false);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-40">
				<span className="loading loading-spinner loading-md" />
			</div>
		);
	}

	function openCreate() {
		setEditing(null);
		setIsOpen(true);
	}

	function openEdit(company: Company) {
		setEditing(company);
		setIsOpen(true);
	}

	async function handleSubmit(data: any) {
		if (editing) {
			await update(editing.id, data);
		} else {
			await create(data);
		}
	}

	return (
		<div className="space-y-6 p-3 md:p-6">
			{/* Header actions */}
			{isAdmin && (
				<div className="flex flex-col md:flex-row md:justify-between gap-3">
					<button
						className="btn btn-primary w-full md:w-auto"
						onClick={openCreate}
					>
						Nouvelle entreprise
					</button>
				</div>
			)}

			{/* Table */}
			<CompanyTable
				companies={companies}
				isAdmin={!!isAdmin}
				onEdit={openEdit}
				onDelete={(i) => setToDelete(i)}
			/>

			{/* Pagination */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-3">
				<button
					className="btn btn-sm w-full md:w-auto"
					onClick={previous}
				>
					Précédent
				</button>

				<span className="text-sm opacity-70 text-center">
					Page {page} — {count} entreprises
				</span>

				<button className="btn btn-sm w-full md:w-auto" onClick={next}>
					Suivant
				</button>
			</div>

			{/* Modal */}
			<CompanyFormModal
				open={isOpen}
				initial={editing}
				onClose={() => setIsOpen(false)}
				onSubmit={handleSubmit}
			/>

			<ConfirmDialog
				open={!!toDelete}
				title="Supprimer l'entreprise"
				message="Cette action est irréversible."
				loading={loadingDelete}
				onClose={() => setToDelete(null)}
				onConfirm={async () => {
					if (!toDelete) return;

					setLoadingDelete(true);
					await remove(toDelete.id);
					setLoadingDelete(false);

					setToDelete(null);
					// fetch();
				}}
			/>
		</div>
	);
}
