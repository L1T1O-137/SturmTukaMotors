import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  onHeroError(event: Event) {
    const img = event.target as HTMLImageElement;
    //  caminhos alternativos comuns antes de cair no pixel transparente
    const tried = img.getAttribute('data-tried') || '';
    if (!tried.includes('abs') && !img.src.includes('/assets/')) {
      img.setAttribute('data-tried', tried + ' abs');
      img.src = '/assets/imgs/banner.jpg';
      return;
    }
    if (!tried.includes('public')) {
      img.setAttribute('data-tried', tried + ' public');
      img.src = '/imgs/banner.jpg';
      return;
    }
    // Fallback final: pixel transparente para evitar layout quebrado
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  }
}
