import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: 'Iniciar Sesión',
};

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900 p-4 overflow-hidden">
      <LoginForm />
    </div>
  );
}