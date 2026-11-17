import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  private userService = inject(UserService);
  private router = inject(Router);
  private locations = inject(LocationService);

  cities = toSignal(this.locations.getCities(), { initialValue: [] });
  loading = signal(false);
  error = signal<string | null>(null);

  form = {
    rol: 'client',
    identificacion: '',
    nombre: '',
    correo: '',
    direccion: '',
    city_id: null as number | null,
    telefono: '',
    experiencia: 0,
    password: '',
    confirm: '',
  };

  submit(): void {
    const f = this.form;

    if (!f.identificacion.trim() || !f.nombre.trim() || !f.correo.trim() || !f.direccion.trim() || !f.city_id) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }
    if (f.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (f.password !== f.confirm) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const payload: Record<string, unknown> = {
      rol: f.rol,
      identificacion: f.identificacion.trim(),
      nombre: f.nombre.trim(),
      correo: f.correo.trim(),
      direccion: f.direccion.trim(),
      city_id: f.city_id,
      password: f.password,
      telefonos: f.telefono.trim() ? [f.telefono.trim()] : [],
    };
    if (f.rol === 'agent') payload['experiencia'] = Number(f.experiencia) || 0;

    this.userService.register(payload).subscribe({
      next: (user) => this.router.navigate([this.userService.homeFor(user.rol)]),
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }
}