import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Atividade, CategoriaAtividade, Prioridade } from '../../../modelos/atividade.model';
import { AtividadeService } from '../../../services/atividade.service';

import { ProdutoServicoService } from '../../../services/produto-servico.service';
import { ProdutoService } from '../../../services/produto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-atividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-atividades.component.html',
  styleUrls: ['./listar-atividades.component.css']
})
export class ListarAtividadesComponent implements OnInit {
  atividades: Atividade[] = [];
  filtered: Atividade[] = []; 
  categorias = Object.values(CategoriaAtividade);
  prioridades = Object.values(Prioridade);

  // Eventos emitidos para o componente pai (hub)
  @Output() editar = new EventEmitter<Atividade>();
  @Output() removido = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();


  filtroCategoria: CategoriaAtividade | 'Todas' = 'Todas';
  filtroPrioridade: Prioridade | 'Todas' = 'Todas';

  private processandoIds = new Set<number>();


  constructor(
    private atividadeService: AtividadeService,
    private router: Router,
    private produtoServicoService: ProdutoServicoService,
    private produtoService: ProdutoService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarAtividades();
  }

  async carregarAtividades(): Promise<void> {
    this.atividades = await this.atividadeService.getAllAtividades();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.filtered = this.atividades.filter(a => {
      const categoriaMatch = this.filtroCategoria === 'Todas' || a.categoria === this.filtroCategoria;
      const prioridadeMatch = this.filtroPrioridade === 'Todas' || a.prioridade === this.filtroPrioridade;
      return categoriaMatch && prioridadeMatch;
    });
  }

  obterClassePrioridade(prioridade?: Prioridade): string {
    switch (prioridade) {
      case Prioridade.Urgente: return 'badge text-bg-danger';
      case Prioridade.Alta: return 'badge text-bg-warning text-dark';
      case Prioridade.Media: return 'badge text-bg-info text-dark';
      case Prioridade.Baixa: return 'badge text-bg-secondary';
      default: return 'badge text-bg-light text-dark';
    }
  }

  adicionarAtividade(): void {
    this.novo.emit();
  }

  editarAtividade(id: number): void {
    const atividade = this.atividades.find(a => a.id === id);
    if (atividade) {
      this.editar.emit(atividade);
    }
  }

  async removerAtividade(id: number): Promise<void> {
    const resultado = await Swal.fire({
      title: 'Remover atividade?',
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    });
    
    if (resultado.isConfirmed) {
      await this.atividadeService.deleteAtividade(id);
      await this.carregarAtividades();
      this.removido.emit();
      Swal.fire({ icon: 'success', title: 'Removida!', timer: 2200, showConfirmButton: false });
    }
  }

  async concluirAtividade(atividade: Atividade): Promise<void> {
    console.log('Tentando concluir atividade:', atividade);
    
    if (!atividade.id || this.processandoIds.has(atividade.id)) return;
    
    this.processandoIds.add(atividade.id);
    
    console.log('servicoId da atividade:', atividade.servicoId, 'tipo:', typeof atividade.servicoId);
    
    if (!atividade.servicoId) {
      await Swal.fire({ 
        icon: 'info', 
        title: 'Sem serviço associado', 
        text: 'Associe um serviço à atividade para concluir e dar baixa no estoque.' 
      });
      this.processandoIds.delete(atividade.id);
      return;
    }

    console.log('Buscando associações para servicoId:', atividade.servicoId);
    
    const associacoes = await this.produtoServicoService.getAssociacoesByServicoId(atividade.servicoId);
    console.log('Associações encontradas:', associacoes);
    
    if (!associacoes || associacoes.length === 0) {
      await Swal.fire({ 
        icon: 'info', 
        title: 'Nenhum produto associado', 
        html: `Não há produtos associados ao serviço ID ${atividade.servicoId}.<br>Vá em Serviços → selecione o serviço → Associar Produtos.` 
      });
      this.processandoIds.delete(atividade.id);
      return;
    }

    const produtos = await Promise.all(
      associacoes.map(assoc => this.produtoService.getProdutoById(assoc.produtoId))
    );
    
    const produtosSemEstoque = associacoes.filter((assoc, index) => {
      const produto = produtos[index];
      return !produto || produto.quantidade < assoc.quantidade;
    });
    
    if (produtosSemEstoque.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Estoque insuficiente',
        text: 'Um ou mais produtos não possuem quantidade suficiente para a baixa. Ajuste o estoque ou a quantidade associada.'
      });
      this.processandoIds.delete(atividade.id);
      return;
    }

    await Promise.all(
      associacoes.map(async (assoc, index) => {
        const produto = produtos[index]!; // Produto correspondente à associação
        produto.quantidade -= assoc.quantidade; // Subtrai a quantidade usada
        await this.produtoService.updateProduto(produto); // Atualiza no banco de dados
      })
    );

    await Swal.fire({
      icon: 'success',
      title: 'Atividade concluída!',
      text: 'Baixa no estoque realizada com sucesso.',
      timer: 2500,
      showConfirmButton: false
    });

    this.processandoIds.delete(atividade.id);
    await this.carregarAtividades();
  }
}
