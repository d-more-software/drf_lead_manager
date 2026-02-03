import { useState } from "react";
import { usePayments } from "../payments/usePayments";

type Props = {
  open: boolean;
  invoiceId: number | null;
  maxAmount: number;
  onClose: () => void;
//   onSuccess: () => void;
};

export default function InvoicePaymentModal({
  open,
  invoiceId,
  maxAmount,
  onClose,
//   onSuccess,
}: Props) {
  const { create } = usePayments();

  const [amount, setAmount] = useState("");
  const [method, setMethod] =
    useState<"cash" | "bank" | "mobile" | "crypto">("cash");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !invoiceId) return null;

async function submit() {
  if (invoiceId == null || !amount) return;

  setLoading(true);

  try {
    await create({
      invoice: invoiceId, // maintenant garanti number
      amount,
      payment_method: method,
      reference: reference || undefined,
    });

    setAmount("");
    setReference("");

    // onSuccess();
    onClose();
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-md space-y-4">

        <h3 className="text-lg font-bold">
          Enregistrer un paiement
        </h3>

        <div className="text-sm opacity-60">
          Reste à payer : {maxAmount} XAF
        </div>

        <div className="space-y-3">

          <input
            type="number"
            step="0.01"
            min={0}
            max={maxAmount}
            className="input input-bordered w-full"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="select select-bordered w-full"
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
            <option value="mobile">Mobile Money</option>
            <option value="crypto">Crypto</option>
          </select>

          <input
            className="input input-bordered w-full"
            placeholder="Référence (optionnel)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Annuler
          </button>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={submit}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
