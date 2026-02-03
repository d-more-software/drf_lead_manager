import { useEffect, useState } from "react";
import type { Invoice } from "../../types/invoice";
import CompanySearchSelect from "../companies/CompanySearchSelect";

type Props = {
  open: boolean;
  initial?: Invoice | null;
  onClose: () => void;
  onSubmit: (data: {
    company: number;
    contract: number | null;
    due_date: string;
    amount_total: string;
    notes: string;
  }) => void;
};

type FormState = {
  company: number;
  contract: number | null;
  due_date: string;
  amount_total: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  company: 0,
  contract: null,
  due_date: "",
  amount_total: "",
  notes: "",
};

function moneyValid(v: string) {
  return Number(v) > 0;
}

export default function InvoiceFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (initial) {
      setForm({
        company: initial.company,
        contract: initial.contract,
        due_date: initial.due_date,
        amount_total: initial.amount_total,
        notes: initial.notes ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial, open]);

  if (!open) return null;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    if (!form.company) return;
    if (!form.due_date) return;
    if (!moneyValid(form.amount_total)) return;

    onSubmit(form);
    onClose();
  }

  const isInvalid =
    !form.company || !form.due_date || !moneyValid(form.amount_total);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl space-y-4">

        <h3 className="font-bold text-lg">
          {initial ? "Modifier la facture" : "Nouvelle facture"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Company (required) */}
          <CompanySearchSelect
            value={form.company}
            onChange={(id) => set("company", id ?? 0)}
          />

          {/* Contract (optional) */}
          <input
            type="number"
            className="input input-bordered"
            placeholder="ID contrat (optionnel)"
            value={form.contract ?? ""}
            onChange={(e) =>
              set("contract", e.target.value ? Number(e.target.value) : null)
            }
          />

          {/* Due date (required) */}
          <input
            type="date"
            className="input input-bordered"
            value={form.due_date}
            onChange={(e) => set("due_date", e.target.value)}
          />

          {/* Amount (required) */}
          <input
            type="number"
            min={0}
            step="0.01"
            className="input input-bordered"
            placeholder="Montant total"
            value={form.amount_total}
            onChange={(e) => set("amount_total", e.target.value)}
          />

          {/* Notes (optional) */}
          <textarea
            className="textarea textarea-bordered md:col-span-2"
            placeholder="Notes (optionnel)"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Annuler
          </button>

          <button
            className="btn btn-primary"
            disabled={isInvalid}
            onClick={submit}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
