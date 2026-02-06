export const INVOICE_STATUS_LABELS: Record<string, string> = {
	draft: "Brouillon",
	sent: "Envoyée",
	pending: "En attente",
	paid: "Payée",
	partial: "Partielle",
	overdue: "En retard",
	cancelled: "Annulée",
};

export function invoiceStatusLabel(status?: string) {
	if (!status) return "";
	return INVOICE_STATUS_LABELS[status] ?? status;
}
