import { z } from "zod";

// Individual PIN requirement schemas
export const pinRequirements = {
  length: z.string().min(4, "Must be at least 4 characters"),
  number: z.string().regex(/\d/, "Must contain at least 1 number"),
  letter: z.string().regex(/[a-zA-Z]/, "Must contain at least 1 letter"),
  special: z
    .string()
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least 1 special character"
    ),
} as const;

// PIN strength checking function using Zod
export function checkPinStrength(pin: string) {
  const requirements = [
    {
      schema: pinRequirements.length,
      text: "At least 4 characters",
      id: "length",
    },
    {
      schema: pinRequirements.number,
      text: "At least 1 number",
      id: "number",
    },
    {
      schema: pinRequirements.letter,
      text: "At least 1 letter",
      id: "letter",
    },
    {
      schema: pinRequirements.special,
      text: "At least 1 special character",
      id: "special",
    },
  ];

  return requirements.map((req) => ({
    met: req.schema.safeParse(pin).success,
    text: req.text,
    id: req.id,
  }));
}

// Comprehensive PIN validation schema (all requirements)
export const strongPinSchema = z
  .string()
  .refine((pin) => pinRequirements.length.safeParse(pin).success, {
    message: "PIN must be at least 4 characters",
  })
  .refine((pin) => pinRequirements.number.safeParse(pin).success, {
    message: "PIN must contain at least 1 number",
  })
  .refine((pin) => pinRequirements.letter.safeParse(pin).success, {
    message: "PIN must contain at least 1 letter",
  })
  .refine((pin) => pinRequirements.special.safeParse(pin).success, {
    message: "PIN must contain at least 1 special character",
  });

// Relaxed PIN validation schema (minimum requirements - at least 2 out of 3 basic requirements)
export const basicPinSchema = z.string().refine(
  (pin) => {
    if (!pin || pin.trim() === "") return true; // Optional field

    const basicRequirements = [
      pinRequirements.length,
      pinRequirements.number,
      pinRequirements.letter,
    ];

    const metRequirements = basicRequirements.filter(
      (req) => req.safeParse(pin).success
    ).length;

    return metRequirements >= 2; // At least 2 out of 3 requirements
  },
  {
    message:
      "PIN must be at least 4 characters and contain both letters and numbers.",
  }
);

// Optional PIN schema (can be empty or must meet basic requirements)
export const optionalPinSchema = z
  .string()
  .optional()
  .refine(
    (pin) => {
      if (!pin || pin.trim() === "") return true; // Optional field
      return basicPinSchema.safeParse(pin).success;
    },
    {
      message:
        "PIN must be at least 4 characters and contain both letters and numbers.",
    }
  );
