"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  /** Threshold in pixels to show the button */
  showAfter?: number;
  /** Custom className for styling */
  className?: string;
  /** Smooth scroll behavior */
  smooth?: boolean;
}

export function BackToTop({
  showAfter = 400,
  className = "",
  smooth = true,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Clean up
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 ${className}`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

// Alternative compact version
export function BackToTopCompact({
  showAfter = 300,
  className = "",
}: {
  showAfter?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > showAfter);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      } ${className}`}
    >
      <Button
        onClick={scrollToTop}
        size="sm"
        variant="secondary"
        className="rounded-full shadow-md hover:shadow-lg backdrop-blur-sm bg-background/80 border"
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4 mr-1" />
        Top
      </Button>
    </div>
  );
}
