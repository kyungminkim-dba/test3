/**
 * 인증 폼 Zod 스키마
 */

import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("유효한 이메일 주소를 입력하세요"),
  password: z
    .string()
    .min(1, "비밀번호를 입력하세요")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력하세요")
      .email("유효한 이메일 주소를 입력하세요"),
    username: z
      .string()
      .min(1, "사용자명을 입력하세요")
      .min(3, "사용자명은 최소 3자 이상이어야 합니다")
      .max(100, "사용자명은 최대 100자까지 가능합니다")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다"
      ),
    password: z
      .string()
      .min(1, "비밀번호를 입력하세요")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 소문자, 대문자, 숫자를 각각 1개 이상 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력하세요"),
    fullName: z
      .string()
      .max(100, "이름은 최대 100자까지 가능합니다")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// 프로필 업데이트 스키마
export const updateProfileSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요").optional(),
  username: z
    .string()
    .min(3, "사용자명은 최소 3자 이상이어야 합니다")
    .max(100, "사용자명은 최대 100자까지 가능합니다")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다"
    )
    .optional(),
  fullName: z.string().max(100, "이름은 최대 100자까지 가능합니다").optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
