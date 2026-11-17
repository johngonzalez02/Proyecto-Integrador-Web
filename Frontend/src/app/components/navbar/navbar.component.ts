import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

interface NavbarConfig {
  url: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private userService = inject(UserService);

  user = this.userService.currentUser;

  private configByRole: Record<UserRole, NavbarConfig[]> = {
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

  private roleLabels: Record<UserRole, string> = {
    client: 'Cliente',
    agent: 'Agente',
    admin: 'Administrador',
  };

  get role(): UserRole {
    return this.user()?.rol ?? 'client';
  }

  get navbarConfig(): NavbarConfig[] {
    return this.configByRole[this.role];
  }

  get roleLabel(): string {
    return this.roleLabels[this.role];
  }

  get home(): string {
    return this.userService.homeFor(this.user()?.rol ?? null);
  }

  get initials(): string {
    const name = this.user()?.nombre ?? '';
    return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }

  logout(): void {
    this.userService.logout();
  }
}