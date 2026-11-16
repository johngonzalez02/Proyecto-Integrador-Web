import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';

interface NavbarConfig {
  url: string;
  label: string;
  icon: string;
}

type Role = 'client' | 'agent' | 'admin';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private router = inject(Router);
  private userService = inject(UserService);

  private configByRole: Record<Role, NavbarConfig[]> = {
    client: [
      { url: '/client/events', label: 'Eventos', icon: 'calendar-event' },
      { url: '/client/reservations', label: 'Mis reservas', icon: 'ticket-perforated' },
    ],
    agent: [
      { url: '/agent/events', label: 'Eventos', icon: 'calendar-event' },
      { url: '/agent/create-event', label: 'Crear evento', icon: 'plus-circle' },
      { url: '/agent/reservations', label: 'Reservas', icon: 'clipboard-check' },
    ],
    admin: [{ url: '/admin', label: 'Reportes', icon: 'bar-chart-line' }],
  };

  private roleLabels: Record<Role, string> = {
    client: 'Cliente',
    agent: 'Agente',
    admin: 'Administrador',
  };

  role: Role = this.getRole();
  navbarConfig: NavbarConfig[] = this.configByRole[this.role];
  roleLabel = this.roleLabels[this.role];
  user = toSignal(this.userService.getUserByRole(this.role));

  get initials(): string {
    const u = this.user();
    return u ? `${u.nombre[0]}${u.apellido[0]}` : '';
  }

  getRole(): Role {
    const url = this.router.url;
    if (url.includes('/agent')) return 'agent';
    if (url.includes('/admin')) return 'admin';
    return 'client';
  }
}