import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email обов'язковий" })
    .email({ message: "Некоректний формат email" }),

  password: z.string().min(1, { message: "Пароль обов'язковий" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
