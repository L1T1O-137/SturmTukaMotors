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
  abaAtiva: 'cadastro' | 'listagem' = 'listagem';
  @ViewChild(ListarProdutosComponent) listarComp?: ListarProdutosComponent;
  produtoSelecionado: Produto | undefined;

  selecionarAba(aba: 'cadastro' | 'listagem') {
    this.abaAtiva = aba;
  }

  onEditar(produto: Produto) {
    this.produtoSelecionado = produto;
    this.selecionarAba('cadastro');
  }

  onSaved() {
    this.produtoSelecionado = undefined;
    this.selecionarAba('listagem');
    this.listarComp?.getAllProdutos();
  }

  onRemoved() {
    this.listarComp?.getAllProdutos();
  }
}
