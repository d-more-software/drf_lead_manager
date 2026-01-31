import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Company } from "../../types/company";

type Paginated<T> = { results: T[] };

type Props = {
	value: number | null;
	onChange: (id: number | null) => void;
};

export default function CompanySearchSelect({ value, onChange }: Props) {
	const [query, setQuery] = useState("");
	const [companies, setCompanies] = useState<Company[]>([]);

useEffect(() => {
  async function load() {
    const { data } = await api.get<Paginated<Company>>("/companies/", {
      params: { search: query || "" },
    });

    setCompanies(Array.isArray(data.results) ? data.results : []);
  }

  load();
}, [query]);


	return (
		<div className="flex flex-col gap-2">
			<input
				className="input input-bordered"
				placeholder="Rechercher entreprise..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>

			<select
				className="select select-bordered"
				value={value ?? ""}
				onChange={(e) =>
					onChange(e.target.value ? Number(e.target.value) : null)
				}
			>
				<option value="">Sélectionner une entreprise</option>

				{companies.map((c) => (
					<option key={c.id} value={c.id}>
						{c.name}
					</option>
				))}
			</select>
		</div>
	);
}
