import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListarClientesComponent } from '../clientes/listar-clientes/listar-clientes.component';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { CadastroClienteComponent } from "./cadastro-cliente/cadastro-cliente.component";

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ListarClientesComponent, CadastroClienteComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent  implements OnInit {
  abaAtiva: 'listagem' | 'cadastro';
  @ViewChild(ListarClientesComponent) listarComp?: ListarClientesComponent;
  clienteSelecionado: Cliente | undefined;
  private clienteService = inject(ClienteService);
  
  constructor(private route: ActivatedRoute) {
    this.abaAtiva = 'listagem';
  }
    onEditar(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.selecionarAba('cadastro');
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      const cliente = await this.clienteService.getClienteById(id);
      if (cliente) {
        this.onEditar(cliente);
      }
    }
  }

  selecionarAba(aba: 'listagem' | 'cadastro') { this.abaAtiva = aba; }

  novoCliente() { this.clienteSelecionado = undefined; this.selecionarAba('cadastro'); }
  onSaved() { this.clienteSelecionado = undefined; this.selecionarAba('listagem'); this.listarComp?.loadClientes(); }
  Remocaocarregar() { this.listarComp?.loadClientes(); }
  Remocaoconseguir() { this.listarComp?.loadClientes(); }
}
