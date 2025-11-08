import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Fornecedor } from '../../../modelos/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-fornecedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './listar-fornecedor.component.html',
  styleUrls: ['./listar-fornecedor.component.css']
})
export class ListarFornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  filtro = new FormControl('');
  fornecedoresFiltrados: Fornecedor[] = [];
  fornecedoresPaginados: Fornecedor[] = [];
  paginaAtual = 1;
  itensPorPagina = 5;
  @Output() editar = new EventEmitter<Fornecedor>();
  @Output() removed = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();

  constructor(private fornecedorService: FornecedorService, private router: Router) {}

  async ngOnInit() {
    this.filtro.valueChanges.subscribe(() => {
      this.aplicarFiltrosEAtualizarPagina();
    });
    await this.carregarFornecedores();
  }

  async carregarFornecedores(): Promise<void> {
    this.fornecedores = await this.getAllFornecedores();
    this.aplicarFiltrosEAtualizarPagina();
  }

  async getAllFornecedores(): Promise<Fornecedor[]> {
    return await this.fornecedorService.getAllFornecedores();
  }

  getFornecedoresFiltrados(): Fornecedor[] {
    const filtro = this.filtro.value?.toLowerCase() || '';
    return this.fornecedores.filter(fornecedor => {
      return fornecedor.nome.toLowerCase().includes(filtro) ||
             fornecedor.cpf.toLowerCase().includes(filtro) ||
             fornecedor.fone.toLowerCase().includes(filtro);
    });
  }

  aplicarFiltrosEAtualizarPagina(): void {
    this.fornecedoresFiltrados = this.getFornecedoresFiltrados();
    this.paginaAtual = 1;
    this.atualizarPagina();
  }

  atualizarPagina(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.fornecedoresPaginados = this.fornecedoresFiltrados.slice(inicio, fim);
  }

  get totalPages(): number {
    return Math.ceil(this.fornecedoresFiltrados.length / this.itensPorPagina);
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.paginaAtual = pagina;
      this.atualizarPagina();
    }
  }

  anterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPagina();
    }
  }

  proxima(): void {
    if (this.paginaAtual < this.totalPages) {
      this.paginaAtual++;
      this.atualizarPagina();
    }
  }

  editFornecedor(id: number) {
    const fornecedor = this.fornecedores.find(f => f.id === id);
    if (fornecedor) {
      this.editar.emit(fornecedor);
    }
  }

  async deleteFornecedor(id: number) {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta a��o n�o pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      await this.fornecedorService.deleteFornecedor(id);
      await this.carregarFornecedores();
      this.removed.emit();
      Swal.fire('Exclu�do!', 'O fornecedor foi exclu�do com sucesso.', 'success');
    }
  }

  viewProdutosFornecedor(id: number) {
    this.router.navigate(['/fornecedor', id, 'produtos']);
  }

  goToCadastro() {
    this.novo.emit();
  }
}
