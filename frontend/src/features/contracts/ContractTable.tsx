import { useState } from "react";
import type { Contract, BillingFrequency } from "../../types/contract";
import ContractDetailModal from "./ContractDetailModal";

type Props = {
  contracts?: Contract[];
  onEdit: (c: Contract) => void;
  onDelete: (id: number) => void;
};

const FREQ_LABEL: Record<BillingFrequency, string> = {
  MONTHLY: "Mensuel",
  QUARTERLY: "Trimestriel",
  HALF_YEARLY: "Semestriel",
  YEARLY: "Annuel",
};

function money(v: number | string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(Number(v || 0));
}

export default function ContractTable({
  contracts = [],
  onEdit,
  onDelete,
}: Props) {
  const [detailContract, setDetailContract] = useState<Contract | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  if (!contracts.length) {
    return (
      <div className="text-center opacity-60 py-10">
        Aucun contrat
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE (cards) ================= */}
      <div className="md:hidden space-y-3">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="card bg-base-100 border shadow-sm p-4 space-y-2"
            onClick={() => {
              setDetailContract(c);
              setOpenDetail(true);
            }}
          >
            <div className="flex justify-between font-medium">
              <span>{c.company}</span>
              <span>{money(c.amount_due)}</span>
            </div>

            <div className="text-sm opacity-70">{c.name}</div>

            <div className="text-xs opacity-60">
              {FREQ_LABEL[c.billing_frequency]} • {c.start_date}
            </div>

            <div
              className="flex gap-2 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn btn-xs flex-1"
                onClick={() => onEdit(c)}
              >
                Modifier
              </button>

              {c.id != null && (
                <button
                  className="btn btn-xs btn-error flex-1"
                  onClick={() => onDelete(c.id)}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP (table) ================= */}
      <div className="hidden md:block overflow-x-auto rounded-box border bg-base-100">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Nom</th>
              <th>Montant</th>
              <th>Fréquence</th>
              <th>Début</th>
              <th>Fin</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {contracts.map((c) => (
              <tr key={c.id}>
                <td>{c.company}</td>
                <td>{c.name}</td>
                <td>{money(c.amount_due)}</td>
                <td>{FREQ_LABEL[c.billing_frequency]}</td>
                <td>{c.start_date}</td>
                <td>{c.end_date ?? "—"}</td>

                <td className="space-x-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => onEdit(c)}
                  >
                    Modifier
                  </button>

                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => {
                      setDetailContract(c);
                      setOpenDetail(true);
                    }}
                  >
                    Détails
                  </button>

                  {c.id != null && (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => onDelete(c.id)}
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContractDetailModal
        open={openDetail}
        contract={detailContract}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
}
