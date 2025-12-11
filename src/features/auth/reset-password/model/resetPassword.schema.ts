import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email обов'язковий" })
      .email({ message: "Некоректний формат email" }),

    token: z.string().min(1, { message: "Токен відновлення обов'язковий" }),

    newPassword: z
      .string()
      .min(6, { message: "Пароль має бути мінімум 6 символів" }),

    confirmNewPassword: z
      .string()
      .min(1, { message: "Підтвердіть новий пароль" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Паролі не співпадають",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
