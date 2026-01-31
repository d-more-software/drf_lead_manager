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
              <td>{c.company ?? c.company}</td>
              <td>{c.name}</td>
              <td>{Number(c.amount_due).toLocaleString("fr-FR")} XAF</td>
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
                  Voir détails
                </button>

                <button
                  className="btn btn-xs btn-error"
                  onClick={() => c.id !== undefined && onDelete(c.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ContractDetailModal
        open={openDetail}
        contract={detailContract}
        onClose={() => setOpenDetail(false)}
      />
    </>
  );
}
