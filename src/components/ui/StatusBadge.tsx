type Status = "want" | "visited";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<Status, string> = {
    want: "bg-[#FFDCDC] text-text-primary",
    visited: "bg-[#FFD6BA] text-text-primary",
  };

  const labels: Record<Status, string> = {
    want: "WANT TO VISIT",
    visited: "VISITED",
  };

  return (
    <span
      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
