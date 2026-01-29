import StatCard from "./StatCard";
import { useBillingStats } from "./useBillingStats";

function money(v: number) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XAF",
	}).format(v);
}

export default function DashboardPage() {
	const { data, loading } = useBillingStats();

	if (loading) return <div>Chargement…</div>;
	if (!data) return <div>Erreur lors du chargement des statistiques</div>;

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Tableau de bord</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total impayé"
					value={money(data.total_unpaid)}
				/>
				<StatCard title="En retard" value={money(data.overdue)} />
				<StatCard
					title="Payé ce mois"
					value={money(data.paid_this_month)}
				/>
				<StatCard
					title="Nombre de factures"
					value={data.invoices_count}
				/>
			</div>
		</div>
	);
}
