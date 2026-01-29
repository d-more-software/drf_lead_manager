export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="card bg-base-200 p-6 shadow">
      <div className="text-sm opacity-60">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
