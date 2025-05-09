import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito:Producto[] = [];
  agregarProducto(producto:Producto){
    this.carrito.push(producto);
  }

  obtenerCarrito():Producto[]{
    return this.carrito;
  }
  generarXML(): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;
    xml += `  <Factura>\n`;
    xml += `    <Encabezado>\n`;
    xml += `      <Emisor>\n`;
    xml += `        <Nombre>Nombre de la empresa</Nombre>\n`;
    xml += `        <RFC>RFCEmpresa</RFC>\n`;
    xml += `        <Domicilio>Ceti Colomos #12</Domicilio>\n`;
    xml += `      </Emisor>\n`;
    xml += `      <Receptor>\n`;
    xml += `        <Nombre>Larisa Alvarez</Nombre>\n`;
    xml += `      </Receptor>\n`;
    xml += `      <Fecha>2021-10-12</Fecha>\n`;
    xml += `      <NumFactura>1234</NumFactura>\n`;
    xml += `    </Encabezado>\n`;
    xml += `    <Detalles>\n`;
    this.carrito.forEach((producto) => {
      xml += `        <producto>\n`;
      xml += `          <id>${producto.id}</id>\n`;
      xml += `          <nombre>${producto.nombre}</nombre>\n`;
      xml += `          <precio>${producto.precioP}</precio>\n`;
      xml += `        </producto>\n`;
    });
    xml += `    </Detalles>\n`;

    let subtotal = this.carrito.reduce((sum, producto) => sum + Number(producto.precioP), 0);
    let iva = subtotal * 0.16;
    let total = subtotal + iva;
    
    xml += `    <Totales>\n`;
    xml += `      <subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
    xml += `      <iva>${iva.toFixed(2)}</iva>\n`;
    xml += `      <total>${total.toFixed(2)}</total>\n`;
    xml += `    </Totales>\n`;
    xml += `  </Factura>\n`;
    xml += `</recibo>`;
  
    return xml;
  }
  
  

  descargarXML(xml:string){
    const blob = new Blob([xml], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  eliminarProducto(index:number){
    this.carrito.splice(index, 1);
  }
  
}