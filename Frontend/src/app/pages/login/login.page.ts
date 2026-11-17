import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private userService = inject(UserService);
  private router = inject(Router);

  correo = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit(): void {
    if (!this.correo.trim() || !this.password) {
      this.error.set('Ingresa tu correo y tu contraseña');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userService.login(this.correo.trim(), this.password).subscribe({
      next: (user) => this.router.navigate([this.userService.homeFor(user.rol)]),
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }
}