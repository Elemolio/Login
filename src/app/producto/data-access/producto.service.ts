import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';  // Asegúrate de que la interfaz esté importada

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Cambié la URL para que apunte a la API del backend que obtiene los productos de MySQL
  private apiUrl = 'http://localhost:3000/api/instrumentos'; // URL de la API que devuelve los productos de la BD

  constructor(private http: HttpClient) {}

  // Método para obtener los productos desde la base de datos (MySQL)
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);  // Realiza la solicitud HTTP para obtener los productos desde el backend
  }
}