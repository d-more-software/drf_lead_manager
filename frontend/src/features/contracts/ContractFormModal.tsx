import { useState, useEffect } from "react";
import type { Contract, BillingFrequency } from "../../types/contract";
import CompanySearchSelect from "../companies/CompanySearchSelect";

type Props = {
  open: boolean;
  initial?: Contract | null;
  onClose: () => void;
  onSubmit: (data: Contract) => void;
};

const EMPTY_FORM: Contract = {
  company: 0,
  name: "",
  start_date: "",
  end_date: null,
  billing_frequency: "MONTHLY",
  billing_day: 1,
  amount_due: "",
  payment_method: "",
  notes: "",
};

export default function ContractFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<Contract>(initial ?? EMPTY_FORM);

  useEffect(() => {
    setForm(initial ?? EMPTY_FORM);
  }, [initial, open]);

  if (!open) return null;

  function set<K extends keyof Contract>(key: K, value: Contract[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    onSubmit({
      ...form,
      end_date: form.end_date || null,
      amount_due: String(form.amount_due), // number → string pour l'API
    });
    onClose();
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl space-y-4">

        <h3 className="text-lg font-bold">
          {initial ? "Modifier le contrat" : "Nouveau contrat"}
        </h3>

        <div className="grid grid-cols-2 gap-3">

          {/* Company */}
          <CompanySearchSelect
            value={form.company}
            onChange={(id) => set("company", id ?? 0)}
          />

          {/* Obligatoire */}
          <input
            className="input input-bordered"
            placeholder="Nom du contrat"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />

          <input
            type="date"
            className="input input-bordered"
            placeholder="Date de début"
            value={form.start_date}
            onChange={(e) => set("start_date", e.target.value)}
          />

          <input
            type="date"
            className="input input-bordered"
            placeholder="Date de fin (optionnel)"
            value={form.end_date ?? ""}
            onChange={(e) => set("end_date", e.target.value || null)}
          />

          <select
            className="select select-bordered"
            value={form.billing_frequency}
            onChange={(e) =>
              set("billing_frequency", e.target.value as BillingFrequency)
            }
          >
            <option value="MONTHLY">Mensuel</option>
            <option value="QUARTERLY">Trimestriel</option>
            <option value="HALF_YEARLY">Semestriel</option>
            <option value="YEARLY">Annuel</option>
          </select>

          <input
            type="number"
            min={1}
            max={28}
            className="input input-bordered"
            placeholder="Jour de facturation"
            value={form.billing_day}
            onChange={(e) => set("billing_day", Number(e.target.value))}
          />

          <input
            type="number"
            min={0}
            step="0.01"
            className="input input-bordered"
            placeholder="Montant dû"
            value={form.amount_due}
            onChange={(e) => set("amount_due", e.target.value)}
          />

          {/* Optionnels */}
          <input
            className="input input-bordered col-span-2"
            placeholder="Méthode de paiement (optionnel)"
            value={form.payment_method}
            onChange={(e) => set("payment_method", e.target.value)}
          />

          <textarea
            className="textarea textarea-bordered col-span-2"
            placeholder="Notes (optionnel)"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />

        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={submit}>
            Sauvegarder
          </button>
        </div>

      </div>
    </div>
  );
}
