
import { Component, ChangeDetectionStrategy } from "@angular/core";
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
export class HeaderComponent {
  isMenuOpen = false;
  menuItems: MenuItem[] = [
    { label: 'Início', link: '/' },
    { label: 'Serviços', link: '/servicos' },
    { label: 'Clientes', link: '/clientes/listar-clientes' },
    { label: 'Fornecedores', link: '/fornecedores' },
    { label: 'Atividades', link: '/atividades/listar-atividades' },
    { label: 'Estoque', link: '/estoque' },
  ];

  // Método chamado quando a imagem do logo falha ao carregar
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement; // Converte o target do evento para HTMLImageElement
    // Define um pixel transparente  como fallback para evitar loops infinitos de erro
    // Se o fallback também falhasse, não geraria outro evento de erro
    imgElement.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  }

  // Alterna a visibilidade do menu mobile (abre/fecha)
  MostraMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Inverte o valor booleano: true vira false e vice-versa
  }

  // Gerencia o clique em um item do menu de navegação
  handleNavClick(event: Event, item: MenuItem): void {
    this.menuItems.forEach(menuItem => menuItem.active = false); // Remove a marcação 'active' de todos os itens
    item.active = true; // Marca apenas o item clicado como ativo
  }

}
