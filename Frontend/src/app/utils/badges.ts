export function reservationBadge(estado: string): string {
  const classes: Record<string, string> = {
    Reservada: 'text-bg-warning',
    Confirmada: 'text-bg-success',
    Cancelada: 'text-bg-danger',
  };
  return classes[estado] ?? 'text-bg-secondary';
}

export function eventBadge(estado: string): string {
  const classes: Record<string, string> = {
    Programado: 'text-bg-secondary',
    'En Boleteria': 'text-bg-primary',
    'En Vivo': 'text-bg-success',
    Finalizado: 'text-bg-dark',
    Cancelado: 'text-bg-danger',
  };
  return classes[estado] ?? 'text-bg-secondary';
}