interface CategoryBadgeProps {
  label: string;
}

export default function CategoryBadge({
  label,
}: CategoryBadgeProps) {
  return (
    <span className="inline-block rounded-md bg-blue-900/50 px-3 py-1 text-xs font-semibold tracking-widest text-blue-300 uppercase">
      {label}
    </span>
  );
}