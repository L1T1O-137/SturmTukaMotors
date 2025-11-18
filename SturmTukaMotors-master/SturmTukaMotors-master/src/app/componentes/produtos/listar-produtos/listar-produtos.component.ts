import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../../modelos/produto.model';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-listar-produtos',
  imports: [CommonModule],
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.css']
})
export class ListarProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  @Output() editar = new EventEmitter<Produto>();
  @Output() removed = new EventEmitter<void>();

  constructor(
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    this.getAllProdutos();
  }

  getAllProdutos() {
    this.produtoService.getAllProdutos().then(produtos => {
      this.produtos = produtos;
    });
  }

  onEditar(produto: Produto) {
    this.editar.emit(produto);
  }

  async onExcluir(produto: Produto) {
    const Swal = (await import('sweetalert2')).default;
    const confirm = await Swal.fire({
      title: 'Excluir produto?',
      text: `Tem certeza que deseja remover "${produto.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      await this.produtoService.deleteProduto(produto.id!);
      await Swal.fire('Removido!', 'Produto removido com sucesso.', 'success');
      this.getAllProdutos();
      this.removed.emit();
    }
  }

}
