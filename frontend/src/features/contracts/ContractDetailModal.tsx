import type { Contract } from "../../types/contract";

type Props = {
	open: boolean;
	contract: Contract | null;
	onClose: () => void;
};
const BILLING_LABELS: Record<Contract["billing_frequency"], string> = {
	MONTHLY: "Mensuel",
	QUARTERLY: "Trimestriel",
	HALF_YEARLY: "Semestriel",
	YEARLY: "Annuel",
};

export default function ContractDetailModal({
	open,
	contract,
	onClose,
}: Props) {
	if (!open || !contract) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-3xl space-y-4">
				<h3 className="text-lg font-bold">Détails du contrat</h3>

				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col">
						<label className="font-semibold">Entreprise</label>
						<input
							className="input input-bordered"
							value={contract.company ?? contract.company}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">Nom du contrat</label>
						<input
							className="input input-bordered"
							value={contract.name}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">Date de début</label>
						<input
							className="input input-bordered"
							value={contract.start_date ?? ""}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">Date de fin</label>
						<input
							className="input input-bordered"
							value={contract.end_date ?? "—"}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">
							Fréquence de facturation
						</label>
						<input
							className="input input-bordered"
							value={BILLING_LABELS[contract.billing_frequency]}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">
							Jour de facturation
						</label>
						<input
							className="input input-bordered"
							value={contract.billing_day ?? ""}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">Montant dû</label>
						<input
							className="input input-bordered"
							value={Number(contract.amount_due).toLocaleString(
								"fr-FR",
								{
									style: "currency",
									currency: "XAF",
								},
							)}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-semibold">
							Méthode de paiement
						</label>
						<input
							className="input input-bordered"
							value={contract.payment_method || "Optionnel"}
							readOnly
						/>
					</div>

					<div className="flex flex-col col-span-2">
						<label className="font-semibold">Notes</label>
						<textarea
							className="textarea textarea-bordered"
							value={contract.notes || "Optionnel"}
							readOnly
						/>
					</div>
				</div>

				<div className="modal-action">
					<button className="btn" onClick={onClose}>
						Fermer
					</button>
				</div>
			</div>
		</div>
	);
}
