import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroFornecedorComponent } from './cadastro-fornecedor/cadastro-fornecedor.component';
import { ListarFornecedorComponent } from './listar-fornecedor/listar-fornecedor.component';
import { Fornecedor } from '../../modelos/fornecedor.model';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, CadastroFornecedorComponent, ListarFornecedorComponent],
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css']
})
export class FornecedoresComponent {
  abaAtiva: 'listagem' | 'cadastro' = 'listagem';
  @ViewChild(ListarFornecedorComponent) listarComp?: ListarFornecedorComponent;
  fornecedorSelecionado: Fornecedor | undefined;

  selecionarAba(aba: 'listagem' | 'cadastro') {
    this.abaAtiva = aba;
  }

  novoFornecedor() {
    this.fornecedorSelecionado = undefined;
    this.selecionarAba('cadastro');
  }

  onEditar(fornecedor: Fornecedor) {
    this.fornecedorSelecionado = fornecedor;
    this.selecionarAba('cadastro');
  }

  onSaved() {
    this.fornecedorSelecionado = undefined;
    this.selecionarAba('listagem');
    this.listarComp?.carregarFornecedores();
  }

  onRemoved() {
    this.listarComp?.carregarFornecedores();
  }
}
