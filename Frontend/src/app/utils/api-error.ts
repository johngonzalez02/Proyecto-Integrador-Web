/** Convierte un error HTTP en un mensaje legible para el usuario. */
export function apiError(err: unknown): string {
  const e = err as { error?: { error?: string }; status?: number };
  if (e?.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.';
  }
  return e?.error?.error ?? 'Ocurrió un error inesperado';
}