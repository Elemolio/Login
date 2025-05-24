import { Injectable } from "@angular/core";
import { Producto } from "../../producto/interfaces/producto";
import { InventarioService } from "../../inventario/data-access/inventario.service";

@Injectable({
  providedIn: "root"
})
export class CarritoService {
  private carrito: Producto[] = [];

  constructor(private inventarioService: InventarioService) {}

  agregarProducto(producto: Producto, cantidad: number) {
  // Verificar si el producto ya existe en el carrito
  const productoExistente = this.carrito.find(p => p.id === producto.id);

  if (productoExistente) {
    // Si el producto ya está en el carrito, verificar que no se sobrepase el límite
    const cantidadMaxima = this.inventarioService.getCantidadDisponible(producto.id);
    const cantidadTotal = productoExistente.cantidad + cantidad;  // Sumar la cantidad actual en el carrito y la nueva cantidad

    if (cantidadTotal <= cantidadMaxima) {
      productoExistente.cantidad += cantidad;  // Aumentar la cantidad en el carrito
    } else {
      alert('No puedes agregar más de la cantidad disponible en inventario.');
    }
  } else {
    // Si no existe, agregar el producto con la cantidad
    const cantidadMaxima = this.inventarioService.getCantidadDisponible(producto.id);
    
    if (cantidad <= cantidadMaxima) {
      const nuevoProducto = { ...producto, cantidad };
      this.carrito.push(nuevoProducto);
    } else {
      alert('No puedes agregar más de la cantidad disponible en inventario.');
    }
  }
}


  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  generarXML() {
  console.log('Generando XML para el carrito: ', this.carrito);
  
  let subtotal = 0;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;

  this.carrito.forEach((producto) => {
    // Asegurarse de que la cantidad esté definida y sea mayor a 0
    if (producto.cantidad > 0) {
      xml += `<producto id="${producto.id}">
                 <nombre>${producto.nombre}</nombre>
                 <precio>${producto.precio}</precio>
                 <cantidad>${producto.cantidad}</cantidad>
               </producto>\n`;

      subtotal += producto.precio * producto.cantidad;
    }
  });

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  xml += `<subtotal>${subtotal.toFixed(2)}</subtotal>
          <iva>${iva.toFixed(2)}</iva>
          <total>${total.toFixed(2)}</total>
        </recibo>`;

  console.log('XML generado:', xml);

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'recibo.xml';
  a.href = url;
  document.body.appendChild(a);
  a.click();

  // Limpiar el enlace de descarga y URL
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

  eliminarProducto(producto: Producto): void {
    // Eliminar solo esa entrada específica del carrito (por objeto)
    const index = this.carrito.indexOf(producto);
    if (index !== -1) {
      this.carrito.splice(index, 1);
    }
  }

  actualizarCantidadProducto(id: number, cantidad: number) {
    const producto = this.carrito.find(p => p.id === id);
    if (producto && cantidad >= 0) {
      if (cantidad <= producto.cantidad) {
        producto.cantidad = cantidad;
      } else {
        alert('No puedes agregar más de la cantidad disponible en inventario.');
      }
    }
  }

  // Vaciar el carrito después del pago
  pagarCarrito(ordenId: string) {
    // Aquí puedes agregar la lógica para registrar el pago en tu base de datos o realizar otras acciones

    // Vaciar el carrito
    this.carrito = [];
    console.log('Carrito vaciado después del pago de la orden', ordenId);
  }
}