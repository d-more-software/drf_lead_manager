import { useState, useEffect } from "react";
import type { Company } from "../../types/company";
import { normalizeCompanyToForm, type CompanyForm } from "./companyForm.utils";

type Props = {
	open: boolean;
	initial?: Company | null;
	onClose: () => void;
	onSubmit: (data: CompanyForm) => void;
};

export default function CompanyFormModal({
	open,
	initial,
	onClose,
	onSubmit,
}: Props) {
	const [form, setForm] = useState<CompanyForm>(
		normalizeCompanyToForm(initial),
	);

	useEffect(() => {
		setForm(normalizeCompanyToForm(initial));
	}, [initial, open]);

	if (!open) return null;

	function setField<K extends keyof CompanyForm>(
		key: K,
		value: CompanyForm[K],
	) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	function submit() {
		onSubmit(form);
		onClose();
	}

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-3xl space-y-4">
				<h3 className="text-lg font-bold">
					{initial ? "Modifier l’entreprise" : "Nouvelle entreprise"}
				</h3>

				<div className="grid grid-cols-2 gap-3">
					<input
						className="input input-bordered"
						placeholder="Nom"
						value={form.name}
						onChange={(e) => setField("name", e.target.value)}
					/>

					<input
						className="input input-bordered"
						placeholder="Secteur"
						value={form.sector}
						onChange={(e) => setField("sector", e.target.value)}
					/>

					<input
						className="input input-bordered"
						placeholder="Email"
						value={form.email}
						onChange={(e) => setField("email", e.target.value)}
					/>

					<input
						className="input input-bordered"
						placeholder="Téléphone (optionnel)"
						value={form.phone}
						onChange={(e) => setField("phone", e.target.value)}
					/>

					<input
						className="input input-bordered"
						placeholder="Province (optionnel)"
						value={form.province}
						onChange={(e) => setField("province", e.target.value)}
					/>

					<input
						className="input input-bordered"
						placeholder="Ville"
						value={form.city}
						onChange={(e) => setField("city", e.target.value)}
					/>

					<input
						className="input input-bordered col-span-2"
						placeholder="Adresse (optionnel)"
						value={form.address}
						onChange={(e) => setField("address", e.target.value)}
					/>

					<input
						className="input input-bordered"
						placeholder="Responsable (optionnel)"
						value={form.responsible_name}
						onChange={(e) =>
							setField("responsible_name", e.target.value)
						}
					/>

					<input
						className="input input-bordered"
						placeholder="Fonction responsable (optionnel)"
						value={form.responsible_function}
						onChange={(e) =>
							setField("responsible_function", e.target.value)
						}
					/>

					<input
						className="input input-bordered"
						placeholder="Comptable (optionnel)"
						value={form.accountant_name}
						onChange={(e) =>
							setField("accountant_name", e.target.value)
						}
					/>

					<input
						className="input input-bordered"
						placeholder="Contact comptable (optionnel)"
						value={form.accountant_contact}
						onChange={(e) =>
							setField("accountant_contact", e.target.value)
						}
					/>

					<input
						type="number"
						min={0}
						step="0.01"
						className="input input-bordered"
						placeholder="Limite de crédit (XAF)"
						value={form.credit_limit}
						onChange={(e) =>
							setField("credit_limit", Number(e.target.value))
						}
					/>

					<textarea
						className="textarea textarea-bordered col-span-2"
						placeholder="Observation (optionnel)"
						value={form.observation}
						onChange={(e) =>
							setField("observation", e.target.value)
						}
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
