/**
 * 회원가입 페이지
 */

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <RegisterForm />
    </div>
  );
}
