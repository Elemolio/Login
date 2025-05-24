import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  errorMsg = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMsg = '';
    if (!this.correo || !this.contrasena) {
      this.errorMsg = 'Por favor ingresa correo y contraseña';
      return;
    }
    this.loading = true;

    this.http.post<any>('http://localhost:3000/api/auth/login', {
      correo: this.correo,
      contrasena: this.contrasena
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          localStorage.setItem('user', JSON.stringify(res.data));
          if (res.data.rol === 'cliente') {
            this.router.navigate(['/productos']);
          } else if (res.data.rol === 'administrador') {
            this.router.navigate(['/inventario']);
          } else {
            this.errorMsg = 'Rol de usuario no válido';
          }
        } else {
          this.errorMsg = res.message || 'Error de autenticación';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error al comunicarse con el servidor';
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  irARecuperar() {
    this.router.navigate(['/cambiar-contrasena']);
  }
}