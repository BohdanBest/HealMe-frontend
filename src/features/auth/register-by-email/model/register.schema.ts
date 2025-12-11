import { z } from "zod";
import { Gender } from "../../../../shared/api/types/auth";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email обов'язковий" })
      .email({ message: "Некоректний email" }),

    password: z
      .string()
      .min(6, { message: "Пароль має бути мінімум 6 символів" }), // Вимога бекенду

    confirmPassword: z.string().min(1, { message: "Підтвердіть пароль" }),

    firstName: z.string().min(1, { message: "Ім'я обов'язкове" }),
    lastName: z.string().min(1, { message: "Прізвище обов'язкове" }),

    // Для Gender нам доведеться конвертувати рядок у число (enum),
    // бо HTML select повертає string "0" або "1"
    gender: z.coerce.number().pipe(z.nativeEnum(Gender)),

    isDoctor: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"], // Помилка підсвітиться під цим полем
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
