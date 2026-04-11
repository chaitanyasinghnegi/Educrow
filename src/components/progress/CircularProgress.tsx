export default function CircularProgress({
  progress = 0,
  size = 60,
  strokeWidth = 4,
  label,
  color = 'text-brand',
  trackColor = 'text-surface-2',
}: {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  trackColor?: string;
}) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center gap-2">
      <div className="relative flex items-center justify-center transform -rotate-90">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            className={trackColor}
          />
          {/* Foreground circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            className={`${color} drop-shadow-[0_0_2px_currentColor] transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center transform rotate-90 text-sm font-semibold text-text-primary">
          {safeProgress}%
        </div>
      </div>
      {label && <span className="text-xs font-medium text-text-secondary">{label}</span>}
    </div>
  );
}
