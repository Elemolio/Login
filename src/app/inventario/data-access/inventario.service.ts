import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Producto } from '../../producto/interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/instrumentos';  // La URL de tu API

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al cargar productos:', error);
        return of([]);  // Retorna array vacío si falla
      })
    ).subscribe(productos => {
      this.productosSubject.next(productos);
    });
  }

  getCantidadDisponible(id: number): number {
    let cantidad = 0;
    this.productos$.subscribe(productos => {
      const producto = productos.find(p => p.id === id);
      cantidad = producto ? producto.cantidad : 0;  // Devuelve la cantidad disponible o 0 si no se encuentra
    }).unsubscribe();
    return cantidad;
  }

  agregarProducto(producto: Producto): void {
    this.http.post<Producto>(this.apiUrl, producto).subscribe({
      next: nuevoProducto => {
        const productos = this.productosSubject.value;
        this.productosSubject.next([...productos, nuevoProducto]);
      },
      error: err => {
        console.error('Error al agregar producto:', err);
      }
    });
  }

  actualizarProducto(producto: Producto): void {
    this.http.put<Producto>(`${this.apiUrl}/${producto.id}`, producto).subscribe({
      next: productoActualizado => {
        const productos = this.productosSubject.value;
        const index = productos.findIndex(p => p.id === productoActualizado.id);
        if (index !== -1) {
          productos[index] = productoActualizado;
          this.productosSubject.next([...productos]);
        }
      },
      error: err => {
        console.error('Error al actualizar producto:', err);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.http.delete<{ message: string, id: number }>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        const productos = this.productosSubject.value.filter(p => p.id !== id);
        this.productosSubject.next(productos);
      },
      error: err => {
        console.error('Error al eliminar producto:', err);
      }
    });
  }
}