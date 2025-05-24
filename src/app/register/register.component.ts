import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  confirmarContrasena = '';
  rol = 'cliente'; // Puedes dejar fijo o permitir elegir
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.nombre || !this.correo || !this.contrasena || !this.confirmarContrasena) {
      this.errorMsg = 'Por favor llena todos los campos';
      return;
    }

    if (this.contrasena.length < 4) {
      this.errorMsg = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.rol) {
      this.errorMsg = 'Por favor selecciona un tipo de usuario';
      return;
    }

    this.loading = true;

    this.http.post<any>('http://localhost:3000/api/auth/register', {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      rol: this.rol
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMsg = 'Registro exitoso. Puedes iniciar sesión.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMsg = res.message || 'Error al registrar usuario';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error en el servidor';
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}