import { Component, inject, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produto } from '../../../modelos/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { Fornecedor } from '../../../modelos/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-produto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-produto.component.html',
  styleUrl: './cadastro-produto.component.css'
})
export class CadastroProdutoComponent implements OnInit, OnChanges {
  // FormBuilder injetado para construção do formulário reativo
  private fb = inject(FormBuilder);
  
  // Formulário reativo com validações obrigatórias
  formProduto = this.fb.group({
    nome: ['', Validators.required],
    preco: [null as number | null, Validators.required],
    quantidade: [null as number | null, Validators.required],
    fornecedorId: [null as number | null, Validators.required]
  });

  // Lista de fornecedores carregada no init para popular o select
  fornecedores: Fornecedor[] = [];

  // Produto em edição recebido do pai (Estoque); se presente entra em modo edição
  @Input() produtoEdit?: Produto;
  // Emite para o componente pai que um save (criação/atualização) foi concluído
  @Output() saved = new EventEmitter<void>();
  // Emite quando o usuário cancela a edição para limpar seleção no pai
  @Output() cancelEdit = new EventEmitter<void>();

  constructor(
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit() {
    this.loadFornecedores();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Quando um produto para edição chega, preenche o formulário
    if (changes['produtoEdit'] && this.produtoEdit) {
      this.formProduto.patchValue({
        nome: this.produtoEdit.nome,
        preco: this.produtoEdit.preco,
        quantidade: this.produtoEdit.quantidade,
        fornecedorId: this.produtoEdit.fornecedorId
      });
    }
    // Se foi removido (undefined), reseta form para modo criação
    if (changes['produtoEdit'] && !this.produtoEdit) {
      this.formProduto.reset();
    }
  }

  get editMode(): boolean {
    return !!this.produtoEdit?.id;
  }

  /** Carrega todos fornecedores disponíveis para o select */
  loadFornecedores() {
    this.fornecedorService.getAllFornecedores().then(fornecedores => {
      this.fornecedores = fornecedores;
    });
  }

  /** Cria ou atualiza produto dependendo do modo */
  addProduto() {
    if (!this.formProduto.valid) return;

    const baseProduto = new Produto(
      this.formProduto.value.nome!,
      Number(this.formProduto.value.preco!),
      Number(this.formProduto.value.quantidade!),
      Number(this.formProduto.value.fornecedorId!)
    );
    // Se estamos editando, preserva o id original
    if (this.editMode) {
      baseProduto.id = this.produtoEdit!.id;
      this.produtoService.updateProduto(baseProduto).then(() => {
        Swal.fire('Atualizado!', 'O produto foi atualizado com sucesso.', 'success');
        this.saved.emit(); // Pai fará refresh e trocar aba
        this.formProduto.reset();
      });
    } else {
      this.produtoService.addProduto(baseProduto).then(() => {
        Swal.fire('Cadastro realizado!', 'O produto foi cadastrado com sucesso.', 'success');
        this.saved.emit();
        this.formProduto.reset();
      });
    }
  }

  cancelarEdicao() {
    this.formProduto.reset();
    this.produtoEdit = undefined;
    this.cancelEdit.emit();
  }
}
