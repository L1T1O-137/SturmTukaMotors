import { Component, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produto } from '../../../modelos/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-produto',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-produto.component.html',
  styleUrl: './cadastro-produto.component.css'
})
export class CadastroProdutoComponent implements OnChanges {
  private fb = inject(FormBuilder);
  
  formProduto = this.fb.group({
    nome: ['', Validators.required],
    preco: [null as number | null, Validators.required],
    quantidade: [null as number | null, Validators.required],

  });


  @Input() produtoEdit?: Produto;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  constructor(
    private produtoService: ProdutoService,
  ) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes['produtoEdit'] && this.produtoEdit) {
      this.formProduto.patchValue({
        nome: this.produtoEdit.nome,
        preco: this.produtoEdit.preco,
        quantidade: this.produtoEdit.quantidade,

      });
    }
    if (changes['produtoEdit'] && !this.produtoEdit) {
      this.formProduto.reset();
    }
  }

  get editMode(): boolean {
    return !!this.produtoEdit?.id;
  }

  addProduto() {
    if (!this.formProduto.valid) return;

    const baseProduto = new Produto(
      this.formProduto.value.nome!,
      Number(this.formProduto.value.preco!),
      Number(this.formProduto.value.quantidade!));
    if (this.editMode) {
      baseProduto.id = this.produtoEdit!.id;
      this.produtoService.updateProduto(baseProduto).then(() => {
        Swal.fire('Atualizado!', 'O produto foi atualizado com sucesso.', 'success');
        this.saved.emit(); 
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
