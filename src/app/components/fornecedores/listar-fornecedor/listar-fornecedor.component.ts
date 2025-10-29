import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { db } from '../../../services/db.service';

@Component({
  selector: 'app-listar-fornecedor',
  imports: [],
  templateUrl: './listar-fornecedor.component.html',
  styleUrl: './listar-fornecedor.component.css'
})
export class ListarFornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = []
  constructor(private fornecedorService: FornecedorService) { }
  ngOnInit() {
    this.getAllFornecedores();
  }
  getAllFornecedores() {
    this.fornecedorService.getAllFornecedores().then(fornecedores => {
      this.fornecedores = fornecedores;
    });
  }
  getFornecedorById(id: number) {
    return db.fornecedores.get(id);
    }
    updateFornecedor(fornecedor: Fornecedor) {
    return db.fornecedores.put(fornecedor);
    }
    deleteFornecedor(id: number) {
    return db.fornecedores.delete(id);
    }
}
