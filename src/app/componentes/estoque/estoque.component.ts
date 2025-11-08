import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroProdutoComponent } from '../produtos/cadastro-produto/cadastro-produto.component';
import { ListarProdutosComponent } from '../produtos/listar-produtos/listar-produtos.component';
import { Produto } from '../../modelos/produto.model';

@Component({
  selector: 'app-estoque',
  imports: [CommonModule, CadastroProdutoComponent, ListarProdutosComponent],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.css'
})
export class EstoqueComponent {
  // Controla qual aba está ativa (cadastro ou listagem)
  abaAtiva: 'cadastro' | 'listagem' = 'listagem';
  // Referência ao componente de listagem para forçar reload quando necessário
  @ViewChild(ListarProdutosComponent) listarComp?: ListarProdutosComponent;
  // Produto selecionado para edição
  produtoSelecionado: Produto | undefined;

  selecionarAba(aba: 'cadastro' | 'listagem') {
    this.abaAtiva = aba;
  }

  // Acionada ao clicar em editar na lista
  onEditar(produto: Produto) {
    this.produtoSelecionado = produto;
    this.selecionarAba('cadastro');
  }

  // Após salvar (criar ou atualizar), volta para listagem e recarrega
  onSaved() {
    this.produtoSelecionado = undefined;
    this.selecionarAba('listagem');
    this.listarComp?.getAllProdutos();
  }

  onRemoved() {
    this.listarComp?.getAllProdutos();
  }
}
