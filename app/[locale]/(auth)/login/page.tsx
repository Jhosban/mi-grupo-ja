import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: 'Iniciar Sesión',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <LoginForm />
    </div>
  );
}