"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ClockTimerProps {
  /** Timer mode: 'countdown' counts down from a target time, 'countup' counts up from start time, 'clock' shows current time */
  mode?: "countdown" | "countup" | "clock";
  /** Target timestamp for countdown mode (in milliseconds) */
  targetTime?: number;
  /** Start timestamp for countup mode (in milliseconds) */
  startTime?: number;
  /** Show the clock icon */
  showIcon?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
  /** Show days in the timer */
  showDays?: boolean;
}

export function ClockTimer({
  mode = "clock",
  targetTime,
  startTime,
  showIcon = true,
  className = "",
  onComplete,
  showDays = false,
}: ClockTimerProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    let timeValue = 0;

    switch (mode) {
      case "countdown":
        if (!targetTime) return "00:00:00";
        timeValue = Math.max(0, targetTime - currentTime);
        if (timeValue === 0 && onComplete) {
          onComplete();
        }
        break;
      case "countup":
        if (!startTime) return "00:00:00";
        timeValue = Math.max(0, currentTime - startTime);
        break;
      case "clock":
      default: {
        const now = new Date(currentTime);
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      }
    }

    // Convert milliseconds to time units
    const totalSeconds = Math.floor(timeValue / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (showDays && days > 0) {
      return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (mode === "countdown" && targetTime) {
      const remaining = targetTime - currentTime;
      const total =
        targetTime - (startTime || targetTime - 24 * 60 * 60 * 1000); // Default to 24h if no start time
      const percentage = remaining / total;

      if (percentage < 0.1) return "text-destructive"; // Red when < 10% remaining
      if (percentage < 0.25) return "text-orange-500"; // Orange when < 25% remaining
      if (percentage < 0.5) return "text-yellow-500"; // Yellow when < 50% remaining
      return "text-foreground"; // Default color
    }
    return "text-foreground";
  };

  return (
    <div
      className={`flex items-center gap-2 font-mono ${getTimerColor()} ${className}`}
    >
      {showIcon && <Clock className="h-4 w-4" />}
      <span className="text-sm font-medium tabular-nums">{formatTime()}</span>
    </div>
  );
}

// Preset components for common use cases
export function CountdownTimer({
  targetTime,
  onComplete,
  className,
  showDays = false,
}: {
  targetTime: number;
  onComplete?: () => void;
  className?: string;
  showDays?: boolean;
}) {
  return (
    <ClockTimer
      mode="countdown"
      targetTime={targetTime}
      onComplete={onComplete}
      className={className}
      showDays={showDays}
    />
  );
}

export function CountupTimer({
  startTime,
  className,
  showDays = false,
}: {
  startTime: number;
  className?: string;
  showDays?: boolean;
}) {
  return (
    <ClockTimer
      mode="countup"
      startTime={startTime}
      className={className}
      showDays={showDays}
    />
  );
}

export function LiveClock({ className }: { className?: string }) {
  return <ClockTimer mode="clock" className={className} />;
}
