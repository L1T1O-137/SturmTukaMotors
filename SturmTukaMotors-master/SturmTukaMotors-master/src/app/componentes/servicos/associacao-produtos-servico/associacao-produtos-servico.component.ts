import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { Produto } from '../../../modelos/produto.model';
import { ProdutoServico } from '../../../modelos/produto-servico.model';
import { ProdutoService } from '../../../services/produto.service';
import { ProdutoServicoService } from '../../../services/produto-servico.service';

@Component({
  selector: 'app-associacao-produtos-servico',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './associacao-produtos-servico.component.html',
  styleUrls: ['./associacao-produtos-servico.component.css']
})
export class AssociacaoProdutosServicoComponent implements OnInit {
  @Input() servicoIdInput?: number;
  produtos: Produto[] = [];
  produtosOriginal: Produto[] = [];
  produtosSelecionados: Produto[] = [];
  produtosSelecionadosIds: Set<number> = new Set<number>();
  quantidades: Map<number, number> = new Map<number, number>();
  servicoId!: number;
  produtoIdSelecionado!: number;
  qtdeProduto!: number;

  constructor(
    private produtoServicoService: ProdutoServicoService,
    private produtoService: ProdutoService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.servicoId = this.servicoIdInput ?? Number(this.route.snapshot.paramMap.get('id'));
    const allProdutos = await this.produtoService.getAllProdutos();
    this.produtos = allProdutos;
    this.produtosOriginal = [...allProdutos];
    await this.loadAllProdutosAssociacoesIndexedDb();
  }

  async loadAllProdutosAssociacoesIndexedDb(): Promise<void> {
    try {
      const associations = await this.produtoServicoService.getAssociacoesByServicoId(this.servicoId);
      this.produtosSelecionadosIds = new Set(associations.map(a => a.produtoId));
      // Preenche o mapa de quantidades a partir das associações existentes
      associations.forEach(a => this.quantidades.set(a.produtoId, a.quantidade));
      const produtosPromises = Array.from(this.produtosSelecionadosIds).map(id => this.produtoService.getProdutoById(id));
      const encontrados = await Promise.all(produtosPromises);
      for (const produto of encontrados) {
        if (produto) {
          const idx = this.produtosOriginal.findIndex(p => p.id === produto.id);
          if (idx > -1) {
            const movido = this.produtosOriginal.splice(idx, 1)[0];
            this.produtosSelecionados.push(movido);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar produtos associados:', error);
    }
  }

  async solicitarQuantidadeDoProduto(): Promise<void> {
    const { value: quantidadeInput } = await Swal.fire({
      title: 'Quantidade do Produto',
      input: 'number',
      inputLabel: 'Digite a quantidade do produto',
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return 'Por favor, digite a quantidade válida e maior que zero!';
        }
        return null as any;
      }
    });
    if (quantidadeInput !== undefined && quantidadeInput !== null && !isNaN(Number(quantidadeInput))) {
      this.qtdeProduto = Number(quantidadeInput);
      this.confirmAdicaoProdutoQuantidade();
    }
  }

  confirmAdicaoProdutoQuantidade(): void {
    this.produtosSelecionadosIds.add(this.produtoIdSelecionado);
    const novaAssociacao: ProdutoServico = {
      servicoId: this.servicoId,
      produtoId: this.produtoIdSelecionado,
      quantidade: this.qtdeProduto
    };
    this.quantidades.set(this.produtoIdSelecionado, this.qtdeProduto);
    this.produtoServicoService.updateProdutoServico(novaAssociacao).then(() => {
      console.log('Associação salva:', novaAssociacao);
      Swal.fire({
        icon: 'success',
        title: 'Produto associado!',
        text: `Quantidade: ${this.qtdeProduto}`,
        timer: 1500,
        showConfirmButton: false
      });
    }).catch(err => {
      console.error('Erro ao salvar associação:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao associar',
        text: 'Tente novamente.'
      });
    });
  }

  dropped(event: CdkDragDrop<Produto[]>, isConcluded: boolean) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const produto = event.container.data[event.currentIndex];
      const pid = produto.id;
      if (pid != null) {
        if (this.produtosSelecionadosIds.has(pid)) {
          this.produtosSelecionadosIds.delete(pid);
          this.produtoIdSelecionado = pid;
          this.produtoServicoService.getAssociacoesById(this.servicoId, pid).then(() => {
            this.produtoServicoService.deleteServicoProdutoAssociacao(this.servicoId, pid);
          });
          this.quantidades.delete(pid);
        } else {
          this.produtoIdSelecionado = pid;
          this.solicitarQuantidadeDoProduto();
        }
      }
    }
  }

  getQuantidade(produtoId: number | undefined): number | undefined {
    if (produtoId == null) return undefined;
    return this.quantidades.get(produtoId);
  }

  async editarQuantidade(produto: Produto): Promise<void> {
    const pid = produto.id;
    if (pid == null) return;
    const atual = this.quantidades.get(pid) ?? 1;
    const { value: quantidadeInput } = await Swal.fire({
      title: 'Editar Quantidade',
      input: 'number',
      inputLabel: 'Informe a nova quantidade',
      inputValue: String(atual),
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return 'Por favor, digite a quantidade válida e maior que zero!';
        }
        return null as any;
      }
    });
    if (quantidadeInput != null && !isNaN(Number(quantidadeInput)) && Number(quantidadeInput) > 0) {
      const novaQtd = Number(quantidadeInput);
      this.quantidades.set(pid, novaQtd);
      const assoc: ProdutoServico = { servicoId: this.servicoId, produtoId: pid, quantidade: novaQtd };
      await this.produtoServicoService.updateProdutoServico(assoc);
    }
  }

  async verificarAssociacoes(): Promise<void> {
    const assoc = await this.produtoServicoService.getAssociacoesByServicoId(this.servicoId);
    console.log('Associações no banco para serviço', this.servicoId, ':', assoc);
    if (assoc.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Nenhuma associação',
        text: 'Não há produtos associados salvos no banco de dados.'
      });
    } else {
      const lista = assoc.map(a => `Produto ID ${a.produtoId}: ${a.quantidade} unidades`).join('<br>');
      Swal.fire({
        icon: 'info',
        title: `${assoc.length} associação(ões) encontrada(s)`,
        html: lista
      });
    }
  }
}
