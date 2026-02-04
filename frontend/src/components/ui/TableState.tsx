import type { ReactNode } from "react";

type Props = {
	loading?: boolean;
	error?: string | null;
	empty?: boolean;
	emptyMessage?: string;
	children: ReactNode;
};

/*
  Usage:
  <TableState loading error empty>
    <Table ... />
  </TableState>
*/

export default function TableState({
	loading,
	error,
	empty,
	emptyMessage = "Aucune donnée",
	children,
}: Props) {
	/* =========================
     Loading
  ========================= */
	if (loading) {
		return (
			<div className="flex justify-center py-10">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
	}

	/* =========================
     Error
  ========================= */
	if (error) {
		return (
			<div className="alert alert-error shadow">
				<span>{error}</span>
			</div>
		);
	}

	/* =========================
     Empty
  ========================= */
	if (empty) {
		return (
			<div className="text-center py-10 text-base-content/60">
				{emptyMessage}
			</div>
		);
	}

	/* =========================
     Table
  ========================= */
	return <>{children}</>;
}
