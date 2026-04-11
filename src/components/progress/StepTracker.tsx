export interface Step {
  id: string;
  label: string;
  description?: string;
}

export default function StepTracker({
  steps,
  currentStepId,
}: {
  steps: Step[];
  currentStepId: string;
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden space-y-4 md:space-y-0 md:flex md:space-x-8">
          {steps.map((step, stepIdx) => {
            const isCompleted = stepIdx < currentIndex;
            const isCurrent = stepIdx === currentIndex;
            const isUpcoming = stepIdx > currentIndex;

            return (
              <li key={step.id} className="relative md:flex-1">
                <div className={`group flex flex-col p-4 border-l-4 md:border-l-0 md:border-t-4 transition-colors duration-300 ${
                  isCompleted
                    ? 'border-brand hover:border-brand-strong'
                    : isCurrent
                    ? 'border-brand'
                    : 'border-surface-2'
                }`}>
                  <span className={`text-xs font-semibold tracking-wider uppercase ${
                    isCompleted || isCurrent ? 'text-brand' : 'text-text-tertiary'
                  }`}>
                    Step {stepIdx + 1}
                  </span>
                  <span className={`text-sm font-medium mt-1 ${
                    isCompleted || isCurrent ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-xs text-text-tertiary mt-0.5 line-clamp-1">
                      {step.description}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
