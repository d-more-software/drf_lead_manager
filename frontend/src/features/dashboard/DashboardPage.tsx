import StatCard from "./StatCard";
import { useBillingStats } from "./useBillingStats";

function money(v: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(Number(v));
}

export default function DashboardPage() {
  const { data, loading } = useBillingStats();

  if (loading) return <div>Loading…</div>;
  if (!data) return <div>Error</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total unpaid"
        value={money(data.total_unpaid)}
      />

      <StatCard
        title="Overdue"
        value={money(data.overdue)}
      />

      <StatCard
        title="Paid this month"
        value={money(data.paid_this_month)}
      />

      <StatCard
        title="Invoices count"
        value={data.invoices_count}
      />
    </div>
  );
}
