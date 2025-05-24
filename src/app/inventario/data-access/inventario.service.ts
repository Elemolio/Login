import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Producto } from '../../producto/interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/instrumentos';  // La URL de tu API

  constructor(private http: HttpClient) {
    this.cargarProductos(); // Al iniciar, cargamos los productos desde la base de datos
  }

  // Método para cargar los productos desde la base de datos (MySQL)
  cargarProductos(): void {
    this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al cargar los productos:', error);
        return [];
      })
    ).subscribe(productos => {
      this.productosSubject.next(productos);  // Actualizar los productos disponibles
    });
  }

  // Método para agregar un nuevo producto
  agregarProducto(producto: Producto): void {
    const productos = this.productosSubject.value;
    const maxId = Math.max(...productos.map(p => p.id), 0);
    producto.id = maxId + 1; // Asignar un nuevo ID al producto

    this.productosSubject.next([...productos, producto]); // Añadir el nuevo producto
  }

  // Método para actualizar un producto
  actualizarProducto(producto: Producto): void {
    const productos = this.productosSubject.value;
    const index = productos.findIndex(p => p.id === producto.id);

    if (index !== -1) {
      productos[index] = { ...producto };
      this.productosSubject.next([...productos]);  // Actualizar los productos
    }
  }

  // Método para eliminar un producto
  eliminarProducto(id: number): void {
    const productos = this.productosSubject.value;
    this.productosSubject.next(productos.filter(p => p.id !== id));  // Eliminar el producto
  }

  // Obtener el producto por su ID
  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productosSubject.value.find(p => p.id === id);
  }

  // Obtener la cantidad disponible de un producto desde la base de datos
  getCantidadDisponible(id: number): number {
    let cantidad = 0;
    this.productos$.subscribe(productos => {
      const producto = productos.find(p => p.id === id);
      cantidad = producto ? producto.cantidad : 0;  // Devuelve la cantidad disponible o 0 si no se encuentra
    }).unsubscribe();
    return cantidad;
  }

}