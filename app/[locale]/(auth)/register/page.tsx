import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: 'Crear Cuenta',
};

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900 p-4 overflow-hidden">
      <RegisterForm />
    </div>
  );
}