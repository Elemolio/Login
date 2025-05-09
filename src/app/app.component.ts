import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [ RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'proyecto1';
}