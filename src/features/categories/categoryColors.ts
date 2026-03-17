export const CATEGORY_COLORS = [
  { bg: "#FFDCDC", text: "#A63030" },
  { bg: "#FFF9B0", text: "#7A6600" },
  { bg: "#B8F0C8", text: "#1A6B35" },
  { bg: "#B8DCFF", text: "#1A4A8B" },
  { bg: "#E8C8FF", text: "#5A1A8B" },
] as const;

export const PRESET_COLORS = CATEGORY_COLORS.map((c) => c.bg);

export function getCategoryTextColor(bgColor: string): string {
  return (
    CATEGORY_COLORS.find((c) => c.bg === bgColor)?.text ?? "#3A2E2A"
  );
}
