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
		searchCompanies,
		page,
		count,
	} = useCompanies();

	const { user } = useAuth();
	const isAdmin = user?.is_agency_admin;

	const [query, setQuery] = useState("");

	const [isOpen, setIsOpen] = useState(false);
	const [editing, setEditing] = useState<Company | null>(null);

	const [toDelete, setToDelete] = useState<Company | null>(null);
	const [loadingDelete, setLoadingDelete] = useState(false);

	function openCreate() {
		setEditing(null);
		setIsOpen(true);
	}

	function openEdit(company: Company) {
		setEditing(company);
		setIsOpen(true);
	}

	async function handleSubmit(data: any) {
		editing ? await update(editing.id, data) : await create(data);
	}

	function handleSearch(v: string) {
		setQuery(v);
		searchCompanies(v);
	}

	// function resetSearch() {
	// 	setQuery("");
	// 	searchCompanies("");
	// }

	return (
		<div className="space-y-6 p-3 md:p-6">

			{/* Header */}
			<div className="flex flex-col md:flex-row md:justify-between gap-3">

				<div className="flex gap-2 w-full md:w-80">
					<input
						value={query}
						onChange={(e) => handleSearch(e.target.value)}
						className="input input-bordered w-full"
						placeholder="Rechercher entreprise..."
					/>

					{/* {query && (
						<button
							className="btn btn-ghost"
							onClick={resetSearch}
						>
						 ✕
						</button>
					)} */}
				</div>

				{isAdmin && (
					<button
						className="btn btn-primary w-full md:w-auto"
						onClick={openCreate}
					>
						Nouvelle entreprise
					</button>
				)}
			</div>

			{/* Table */}
			<div className="relative">
				{loading && (
					<div className="absolute inset-0 bg-base-100/60 flex items-center justify-center z-10">
						<span className="loading loading-spinner" />
					</div>
				)}

				<CompanyTable
					companies={companies}
					isAdmin={!!isAdmin}
					onEdit={openEdit}
					onDelete={(i) => setToDelete(i)}
				/>
			</div>

			{/* Pagination */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-3">
				<button className="btn btn-sm w-full md:w-auto" onClick={previous}>
					Précédent
				</button>

				<span className="text-sm opacity-70">
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
				}}
			/>
		</div>
	);
}
