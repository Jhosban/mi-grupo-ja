"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (password.length < 7) {
      setError("La contraseña debe tener al menos 7 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      // Iniciar sesión automáticamente después del registro
      const locale = getCurrentLocale();
      // Marcar que es un usuario nuevo para mostrar el modal
      localStorage.setItem('new_user_registration', 'true');
      await signIn("credentials", {
        email,
        password,
        callbackUrl: `/${locale}/chat`,
      });
      
    } catch (error: any) {
      setError(error.message || "Error al registrar el usuario");
      console.error("Error en registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener la localización actual de la URL
  const getCurrentLocale = () => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split('/');
      if (pathSegments.length > 1 && pathSegments[1]) {
        return pathSegments[1];
      }
    }
    return "es-ES";
  };
  
  const handleGoogleLogin = () => {
    const locale = getCurrentLocale();
    signIn("google", { callbackUrl: `/${locale}/chat` });
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      {/* Header con logo/icono */}
      <div className="text-center mb-6">
        <div className="mx-auto w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200 dark:shadow-emerald-800/20">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Crear cuenta
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Únete y comienza tu experiencia de aprendizaje
        </p>
      </div>

      {/* Formulario con scroll invisible */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[75vh] overflow-y-auto scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-700/50 border-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="Tu nombre completo"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-700/50 border-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-700/50 border-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="Mínimo 7 caracteres"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-700/50 border-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-70 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Creando cuenta...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Crear Cuenta
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white/70 dark:bg-gray-800/70 text-sm text-gray-500 dark:text-gray-400">
              O regístrate con
            </span>
          </div>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-11 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-white dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar con Google
        </Button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <a 
              href={`/${getCurrentLocale()}/login`} 
              className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
            >
              Iniciar Sesión
            </a>
          </p>
        </div>

        {/* Terms text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Al registrarte, aceptas nuestros{" "}
            <a href="#" className="underline hover:text-emerald-600 transition-colors">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-emerald-600 transition-colors">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}