"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop - sin onClick para prevenir el cierre */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl transform transition-all duration-300 scrollbar-hide ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="flex items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                ¡Importante! Información sobre Talksy
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-0">
                Lee esta información antes de continuar
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Estado Beta Warning */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Aplicación en Estado Beta
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Talksy se encuentra en desarrollo temprano. Los modelos de IA pueden ocasionalmente 
                  proporcionar respuestas imprecisas o generar información incorrecta (alucinaciones). 
                  Esto es normal en esta fase de desarrollo.
                </p>
              </div>
            </div>
          </div>

          {/* Cambio de Modelo */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                  Cambio de Modelo en Conversaciones
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Si inicias una conversación con un modelo y deseas cambiar a otro, 
                  te recomendamos crear una nueva conversación para obtener mejores resultados.
                </p>
              </div>
            </div>
          </div>

          {/* Tips adicionales */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              💡 Consejos para una mejor experiencia:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Sé específico en tus preguntas para obtener mejores respuestas</li>
              <li>• Si una respuesta no es satisfactoria, intenta reformular tu pregunta</li>
              <li>• Usa archivos claros y bien nombrados para mejorar el contexto</li>
              <li>• Revisa las fuentes cuando quieras verificar una respuesta</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Esta información se mostrará solo una vez</span>
          </div>
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            He Leído y Entiendo
          </Button>
        </div>
      </div>
    </div>
  );
}