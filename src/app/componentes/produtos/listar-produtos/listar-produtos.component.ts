import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../../modelos/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { Fornecedor } from '../../../modelos/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';

@Component({
  selector: 'app-listar-produtos',
  imports: [CommonModule],
  templateUrl: './listar-produtos.component.html',
  styleUrl: './listar-produtos.component.css'
})
export class ListarProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  // Map para cachear nomes de fornecedores e evitar múltiplas consultas ao DB
  fornecedoresMap: Map<number, string> = new Map();
  // Eventos para o pai (Estoque) controlar edição e refresh externo
  @Output() editar = new EventEmitter<Produto>();
  @Output() removed = new EventEmitter<void>();

  constructor(
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit() {
    this.getAllProdutos();
  }

  /** Busca todos produtos e resolve nomes dos fornecedores */
  getAllProdutos() {
    this.produtoService.getAllProdutos().then(produtos => {
      this.produtos = produtos;
      this.resolveNomesFornecedorProdutos();
    });
  }

  /** Dispara evento de edição para o pai abrir o formulário preenchido */
  onEditar(produto: Produto) {
    this.editar.emit(produto);
  }

  /** Confirma e exclui um produto, recarregando a lista ao final */
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

  /**
   * Percorre produtos e resolve nome do fornecedor para cada um.
   * Usa Map para cache e evita consultas redundantes ao IndexedDB.
   */
  resolveNomesFornecedorProdutos() {
    this.produtos.forEach(produto => {
      if (produto.fornecedorId) {
        // Verifica cache primeiro
        if (this.fornecedoresMap.has(produto.fornecedorId)) {
          produto.nomeFornecedor = this.fornecedoresMap.get(produto.fornecedorId);
        } else {
          // Busca do DB e adiciona ao cache
          this.fornecedorService.getFornecedorById(produto.fornecedorId)
            .then((fornecedor: Fornecedor | undefined) => {
              if (fornecedor !== undefined) {
                produto.nomeFornecedor = fornecedor.nome;
                this.fornecedoresMap.set(produto.fornecedorId!, fornecedor.nome);
              }
            });
        }
      }
    });
  }
}
