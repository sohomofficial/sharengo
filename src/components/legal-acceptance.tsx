"use client";

import { PrivacyDialog } from "./privacy-dialog";
import { TermsDialog } from "./terms-dialog";

interface LegalAcceptanceProps {
  className?: string;
}

export function LegalAcceptance({
  className = "",
}: Readonly<LegalAcceptanceProps>) {
  return (
    <div className={`text-sm text-center text-muted-foreground ${className}`}>
      <p>
        By using ShareNGo, you agree to our{" "}
        <TermsDialog
          trigger={
            <button
              type="button"
              className="text-primary hover:underline font-medium"
            >
              Terms & Conditions
            </button>
          }
        />{" "}
        and{" "}
        <PrivacyDialog
          trigger={
            <button
              type="button"
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </button>
          }
        />
        .
      </p>
    </div>
  );
}
