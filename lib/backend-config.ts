/**
 * Este archivo maneja la configuración del backend activo.
 * La app funciona con n8n como backend único.
 */

export type BackendType = 'n8n';

export const backendConfig = {
  activeBackend: 'n8n' as BackendType
};

/**
 * Función para cambiar el backend activo
 * Notifica al usuario del cambio y guarda en localStorage
 */
export function setActiveBackend(backend: BackendType): void {
  if (typeof window !== 'undefined') {
    const previousBackend = localStorage.getItem('activeBackend') as BackendType;
    localStorage.setItem('activeBackend', backend);

    if (previousBackend !== backend) {
      window.dispatchEvent(new CustomEvent('backendChanged', { detail: { backend } }));
    }
  }
}

/**
 * Función para obtener el backend activo.
 * Mantiene compatibilidad con el storage local, pero solo devuelve n8n.
 */
export function getActiveBackend(): BackendType {
  if (typeof window !== 'undefined') {
    localStorage.setItem('activeBackend', 'n8n');
  }
  return backendConfig.activeBackend;
}

/**
 * Función para loguear el backend activo
 */
export function logActiveBackend(): void {
  if (typeof window !== 'undefined') {
    const activeBackend = getActiveBackend();
    console.log(
      `%c✅ Backend activo: ${activeBackend}`, 
      'color: #00AA00; font-weight: bold;'
    );
  }
}