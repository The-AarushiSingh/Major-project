const STATUS_LABELS = ["Open", "In progress", "Completed", "Approved", "Cancelled"];
const STATUS_CLASSES = ["open", "progress", "completed", "approved", "cancelled"];
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function shortAddress(address) {
  if (!address) return "Not assigned";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function statusLabel(status) {
  return STATUS_LABELS[Number(status)] || "Unknown";
}

export function statusClass(status) {
  return STATUS_CLASSES[Number(status)] || "open";
}

export { ZERO_ADDRESS };
