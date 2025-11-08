'use client';

import { useState, useEffect, useRef } from 'react';
import { BackendType, getActiveBackend, setActiveBackend } from '@/lib/backend-config';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function BackendSelector() {
  const [selectedBackend, setSelectedBackend] = useState<BackendType>('n8n');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar el backend seleccionado al iniciar
    const activeBackend = getActiveBackend();
    setSelectedBackend(activeBackend);
    
    console.log('%c🚀 BackendSelector inicializado', 'color: #9C27B0; font-weight: bold; font-size: 12px;');
    console.log(`%cBackend activo: ${activeBackend}`, 'color: #9C27B0; font-size: 12px;');
  }, []);

  // Cerrar dropdown cuando se haga click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBackendChange = (backend: BackendType) => {
    if (backend === selectedBackend) {
      console.log(`%c⚠️  El backend ${backend} ya estaba seleccionado`, 'color: #FF9800; font-weight: bold;');
      setShowDropdown(false);
      return;
    }
    
    setSelectedBackend(backend);
    setActiveBackend(backend);
    setShowDropdown(false);
    
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF6B00;');
    console.log(
      `%c🔄 CAMBIO DE BACKEND EN LA UI`,
      'color: #FF6B00; font-weight: bold; font-size: 13px;'
    );
    console.log(`%cNuevo backend seleccionado: ${backend.toUpperCase()}`, 'color: #FFB74D; font-weight: bold; font-size: 12px;');
    console.log(`%cTiempo: ${new Date().toLocaleTimeString()}`, 'color: #0099CC; font-size: 11px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF6B00;');
    
    // Refrescar la página para aplicar los cambios
    router.refresh();
  };

  const getBackendLabel = (backend: BackendType): string => {
    return backend === 'n8n' ? 'n8n' : 'Python';
  };

  const getBackendColor = (backend: BackendType): string => {
    return backend === 'n8n' ? 'bg-purple-500' : 'bg-orange-500';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center px-3 py-2 text-sm font-medium rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:shadow-sm"
      >
        <div className={`w-2 h-2 rounded-full mr-2 ${getBackendColor(selectedBackend)}`} />
        <span className="mr-2">{getBackendLabel(selectedBackend)}</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </button>
      
      {showDropdown && (
        <div className="absolute left-0 mt-2 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl py-2 z-10 border border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={() => handleBackendChange('n8n')}
            className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
              selectedBackend === 'n8n' 
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-3 ${selectedBackend === 'n8n' ? 'bg-purple-500' : 'bg-gray-300'}`} />
            n8n
          </button>
          <button
            onClick={() => handleBackendChange('python')}
            className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
              selectedBackend === 'python' 
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-3 ${selectedBackend === 'python' ? 'bg-orange-500' : 'bg-gray-300'}`} />
            Python
          </button>
        </div>
      )}
    </div>
  );
}