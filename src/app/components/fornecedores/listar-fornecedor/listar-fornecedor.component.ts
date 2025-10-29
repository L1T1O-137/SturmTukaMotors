import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { db } from '../../../services/db.service';

@Component({
  selector: 'app-listar-fornecedor',
  imports: [],
  templateUrl: './listar-fornecedor.component.html',
  styleUrl: './listar-fornecedor.component.css'
})
export class ListarFornecedorComponent implements OnInit {
  fornecedores: Cliente[] = []
  constructor(private fornecedorService: ClienteService) { }
  ngOnInit() {
    this.getAllFornecedores();
  }
  getAllFornecedores() {
    this.fornecedorService.getAllClientes().then(cliente => {
      this.fornecedores = cliente;
    });
  }
  getFornecedorById(id: number) {
    return db.clientes.get(id);
    }
    updateFornecedor(fornecedor: Cliente) {
    return db.clientes.put(fornecedor);
    }
    deleteFornecedor(id: number) {
    return db.clientes.delete(id);
    }
}
