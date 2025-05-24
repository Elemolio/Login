import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  correo = '';
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  solicitarRecuperacion() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.correo) {
      this.errorMsg = 'Por favor ingresa tu correo electrónico';
      return;
    }

    this.loading = true;

    this.http.post<any>('http://localhost:3000/api/auth/recuperar-contrasena', {
      correo: this.correo
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMsg = 'Se ha enviado un enlace de recuperación a tu correo electrónico';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        } else {
          this.errorMsg = res.message || 'Error al procesar la solicitud';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error en el servidor';
      }
    });
  }

  volver() {
    this.router.navigate(['/login']);
  }
} 