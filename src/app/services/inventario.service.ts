import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Producto } from '../models/producto';
import { map, Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private storageKey = 'productosInventario';
  private productos: Producto[] = [];
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.cargarDesdeLocalStorage();
  }

  private cargarDesdeLocalStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    this.productos = data ? JSON.parse(data) : [];
    this.productosSubject.next(this.productos);
  }

  private guardarEnLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.productos));
  }

  obtenerProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  agregarProducto(producto: Producto): void {
    producto.id = this.productos.length + 1;
    this.productos.push(producto);
    this.guardarEnLocalStorage();
    this.productosSubject.next(this.productos);
  }

  modificarProducto(id: number, productoActualizado: Producto): void {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos[index] = { ...productoActualizado, id };
      this.guardarEnLocalStorage();
      this.productosSubject.next(this.productos);
    }
  }

  eliminarProducto(id: number): void {
    this.productos = this.productos.filter(p => p.id !== id);
    this.guardarEnLocalStorage();
    this.productosSubject.next(this.productos);
  }

  descargarXML(): void {
    const xmlString = this.generarXMLDesdeProductos(this.productos);
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private generarXMLDesdeProductos(productos: Producto[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const productosXML = productos.map(prod => `
      <producto>
        <id>${prod.id}</id>
        <nombre>${prod.nombre}</nombre>
        <precio>${prod.precioP}</precio>
        <imagen>${prod.imagen}</imagen>
      </producto>
    `).join('');
    
    return `${xmlHeader}<productos>${productosXML}</productos>`;
  }
}