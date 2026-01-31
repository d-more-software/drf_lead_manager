import { useState } from "react";
import { useCompanies } from "./useCompanies";
import CompanyTable from "./CompanyTable";
import CompanyFormModal from "./CompanyFormModal";
import type { Company } from "../../types/company";
import { useAuth } from "../auth/AuthContext";

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

  if (loading) return <div>Loading...</div>;

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
    <div className="space-y-6">
      {isAdmin && (
        <button className="btn btn-primary" onClick={openCreate}>
          Nouvelle Entreprise
        </button>
      )}

      <CompanyTable
        companies={companies}
        isAdmin={!!isAdmin}
        onEdit={openEdit}
        onDelete={remove}
      />

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center">
        <button className="btn btn-sm" onClick={previous}>
          Précédent
        </button>

        <span className="text-sm">
          Page {page} — {count} entreprises
        </span>

        <button className="btn btn-sm" onClick={next}>
          Suivant
        </button>
      </div>

      <CompanyFormModal
        open={isOpen}
        initial={editing}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
