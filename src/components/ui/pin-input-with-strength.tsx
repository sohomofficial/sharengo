"use client";

import { useId, useMemo, useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { checkPinStrength } from "@/lib/pin-validation";

interface PinInputWithStrengthProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function PinInputWithStrength({
  value,
  onChange,
  placeholder = "Enter a secure PIN",
  disabled = false,
  id: providedId,
}: Readonly<PinInputWithStrengthProps>) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const strength = checkPinStrength(value);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a PIN";
    if (score <= 1) return "Weak PIN";
    if (score <= 2) return "Fair PIN";
    if (score === 3) return "Good PIN";
    return "Strong PIN";
  };

  // Only show strength indicator if PIN field has some content
  const showStrengthIndicator = value.length > 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          id={id}
          className="pe-9"
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={
            showStrengthIndicator ? `${id}-description` : undefined
          }
          disabled={disabled}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide PIN" : "Show PIN"}
          aria-pressed={isVisible}
          disabled={disabled}
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* PIN strength indicator - only show when there's content */}
      {showStrengthIndicator && (
        <>
          <div
            className="bg-border h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="PIN strength"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            />
          </div>

          {/* PIN strength description */}
          <p
            id={`${id}-description`}
            className="text-foreground text-sm font-medium"
          >
            {getStrengthText(strengthScore)}. Recommended:
          </p>

          {/* PIN requirements list */}
          <ul className="space-y-1" aria-label="PIN requirements">
            {strength.map((req) => (
              <li key={req.id} className="flex items-center gap-2">
                {req.met ? (
                  <CheckIcon
                    size={12}
                    className="text-emerald-500"
                    aria-hidden="true"
                  />
                ) : (
                  <XIcon
                    size={12}
                    className="text-muted-foreground/80"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs ${
                    req.met ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Requirement met" : " - Requirement not met"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
