/**
 * Utilidades compartidas para el backend n8n.
 */

import { BackendType } from '@/lib/backend-config';
import { N8nSessionData } from './n8n/types';

export type SessionData = N8nSessionData;

/**
 * Información de sesión unificada para cualquier backend
 */
export type UnifiedSessionData = {
  backend: BackendType;
  uploadedAt: string;
  n8nData?: N8nSessionData;
};

/**
 * Valida si hay una sesión válida para el backend
 */
export function isValidSession(sessionData: any, backend: BackendType): boolean {
  return !!sessionData || backend === 'n8n';
}

/**
 * Obtiene los datos de sesión específicos del backend
 */
export function getSessionDataForBackend(
  sessionData: any, 
  backend: BackendType
): SessionData | null {
  if (!sessionData || backend !== 'n8n') return null;
  return sessionData as N8nSessionData;
}

/**
 * Formatea información de sesión para logging
 */
export function formatSessionInfo(backend: BackendType, sessionData: any): string {
  return `✅ n8n: Listo (sin sesión requerida)`;
}
