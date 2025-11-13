
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface MenuItem {
  label: string;
  link: string;
  active?: boolean;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isDarkMode = false;
  menuItems: MenuItem[] = [
    { label: 'Início', link: '/' },
    { label: 'Serviços', link: '/servicos' },
    { label: 'Clientes', link: '/clientes/listar-clientes' },
    { label: 'Fornecedores', link: '/fornecedores' },
    { label: 'Atividades', link: '/atividades/listar-atividades' },
    { label: 'Estoque', link: '/estoque' },
    { label: 'Suporte', link: '/suporte' }
  ];

  ngOnInit(): void {
    this.checkPreferredTheme();
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    // Fallback para um pixel transparente para evitar loops de erro
    imgElement.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  }

  MostraMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleNavClick(event: Event, item: MenuItem): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }

  private checkPreferredTheme(): void {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.isDarkMode = savedTheme === "dark";
    } else {
      this.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }
}
