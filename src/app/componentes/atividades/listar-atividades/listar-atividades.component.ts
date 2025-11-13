import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Atividade, CategoriaAtividade, Prioridade } from '../../../modelos/atividade.model';
import { AtividadeService } from '../../../services/atividade.service';
import { FuncionarioService } from '../../../services/funcionario.service';
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
  funcionarios: any[] = [];

  // Controle visual
  private processingIds = new Set<number>();

  filtroCategoria: CategoriaAtividade | 'Todas' = 'Todas';
  filtroPrioridade: Prioridade | 'Todas' = 'Todas';


  constructor(
    private atividadeService: AtividadeService,
    private funcionarioService: FuncionarioService,
    private router: Router,
    private produtoServicoService: ProdutoServicoService,
    private produtoService: ProdutoService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.funcionarios = await this.funcionarioService.getAllFuncionarios();
    this.atividades = await this.atividadeService.getAllAtividades();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filtered = this.atividades.filter(a => {
      const categoriaMatch = this.filtroCategoria === 'Todas' || a.categoria === this.filtroCategoria;
      const prioridadeMatch = this.filtroPrioridade === 'Todas' || a.prioridade === this.filtroPrioridade;
      return categoriaMatch && prioridadeMatch;
    });
  }

  priorityClass(p?: Prioridade): string {
    switch (p) {
      case Prioridade.Urgente: return 'badge text-bg-danger';
      case Prioridade.Alta: return 'badge text-bg-warning text-dark';
      case Prioridade.Media: return 'badge text-bg-info text-dark';
      case Prioridade.Baixa: return 'badge text-bg-secondary';
      default: return 'badge text-bg-light text-dark';
    }
  }

  addAtividade(): void {
    this.router.navigate(['/atividades/cadastro-atividade']);
  }

  editAtividade(id: number): void {
    this.router.navigate(['/atividades/editar-atividade', id]);
  }

  async deleteAtividade(id: number): Promise<void> {
    const result = await Swal.fire({
      title: 'Remover atividade?',
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      await this.atividadeService.deleteAtividade(id);
      await this.load();
      Swal.fire({ icon: 'success', title: 'Removida!', timer: 2200, showConfirmButton: false });
    }
  }

  async concluirAtividade(a: Atividade): Promise<void> {
    if (!a.id) return;
    if (this.processingIds.has(a.id)) return;
    this.processingIds.add(a.id);
    if (!a.servicoId) {
      await Swal.fire({ icon: 'info', title: 'Sem serviço associado', text: 'Associe um serviço à atividade para concluir e dar baixa no estoque.' });
      this.processingIds.delete(a.id);
      return;
    }
    
    // Carrega associações produto<-quantidade do serviço
    const assoc = await this.produtoServicoService.getAssociacoesByServicoId(a.servicoId);
    if (!assoc || assoc.length === 0) {
      await Swal.fire({ icon: 'info', title: 'Nenhum produto associado', text: 'Não há produtos associados a este serviço.' });
      this.processingIds.delete(a.id);
      return;
    }

    // Valida estoque suficiente
    const produtos = await Promise.all(assoc.map(as => this.produtoService.getProdutoById(as.produtoId)));
    const faltantes = assoc.filter((as, idx) => {
      const p = produtos[idx];
      return !p || p.quantidade < as.quantidade;
    });
    if (faltantes.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Estoque insuficiente',
        html: 'Um ou mais produtos não possuem quantidade suficiente para a baixa. Ajuste o estoque ou a quantidade associada e tente novamente.'
      });
      this.processingIds.delete(a.id);
      return;
    }

    // Aplica baixa
    await Promise.all(assoc.map(async (as, idx) => {
      const p = produtos[idx]!;
      p.quantidade = p.quantidade - as.quantidade;
      await this.produtoService.updateProduto(p);
    }));
  }
}

