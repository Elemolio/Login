import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  correo: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  errorMsg: string = '';
  successMsg: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  cambiarContrasena() {
    this.errorMsg = '';
    this.successMsg = '';

    // Validación de los campos
    if (!this.nuevaContrasena || this.nuevaContrasena.length < 4) {
      this.errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    // Llamada al servidor para cambiar la contraseña
    this.http.post<any>('http://localhost:3000/api/auth/cambiar-contrasena', {
      correo: this.correo,
      contrasena: this.nuevaContrasena
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.successMsg = 'Contraseña cambiada con éxito. Redirigiendo al login...';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          this.errorMsg = res.message || 'Error al cambiar la contraseña';
        }
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error en el servidor';
      }
    });
  }

  volver() {
    this.router.navigate(['/login']);
  }
}