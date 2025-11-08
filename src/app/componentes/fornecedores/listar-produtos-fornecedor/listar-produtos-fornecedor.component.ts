import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../../../modelos/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { Fornecedor } from '../../../modelos/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';

@Component({
  selector: 'app-listar-produtos-fornecedor',
  imports: [CommonModule],
  templateUrl: './listar-produtos-fornecedor.component.html',
  styleUrl: './listar-produtos-fornecedor.component.css'
})
export class ListarProdutosFornecedorComponent implements OnInit {
  produtos: Produto[] = [];
  fornecedorId!: number;
  nomeFornecedor!: string;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit() {
    this.fornecedorId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProdutosByFornecedorId(this.fornecedorId);
    this.getNomeFornecedorById(this.fornecedorId);
  }

  async getProdutosByFornecedorId(fornecedorId: number) {
    this.produtos = await this.produtoService.getProdutosByFornecedorId(fornecedorId);
  }

  async getNomeFornecedorById(fornecedorId: number) {
    const fornecedor = await this.fornecedorService.getFornecedorById(fornecedorId);
    if (fornecedor) {
      this.nomeFornecedor = fornecedor.nome;
    }
  }
}
