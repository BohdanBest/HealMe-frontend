import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email обов'язковий" })
    .email({ message: "Некоректний формат email" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
