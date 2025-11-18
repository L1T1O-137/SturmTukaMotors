
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface MenuItem {
  label: string;
  link: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HeaderComponent {
  menuItems: MenuItem[] = [
    { label: 'Início', link: '/' },
    { label: 'Serviços', link: '/servicos' },
    { label: 'Clientes', link: '/clientes' },
    { label: 'Atividades', link: '/atividades' },
    { label: 'Estoque', link: '/estoque' },
  ];
}
