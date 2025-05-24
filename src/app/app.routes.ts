import { Routes } from '@angular/router';
import { ProductoComponent } from './producto/ui/producto.component';
import { CarritoComponent } from './carrito/ui/carrito.component';
import { InventarioComponent } from './inventario/ui/inventario.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'cambiar-contrasena', component: CambiarContrasenaComponent},
    {path: 'productos', component: ProductoComponent},
    {path: 'carrito', component: CarritoComponent},
    {path: 'inventario', component: InventarioComponent}
];
