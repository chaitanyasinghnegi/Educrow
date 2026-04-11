export default function ProgressBar({
  progress = 0,
  label,
  showLabel = true,
  height = 'h-2',
  color = 'bg-brand',
  trackColor = 'bg-surface-2',
}: {
  progress?: number;
  label?: string;
  showLabel?: boolean;
  height?: string;
  color?: string;
  trackColor?: string;
}) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full flex flex-col gap-2">
      {showLabel && label && (
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-text-secondary">{label}</span>
          <span className="text-text-primary">{safeProgress}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full ${trackColor} ${height}`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
