import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/fornecedor.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private dbService: DbService) {}

  addFornecedor(fornecedor: Fornecedor): Promise<number> {
    return this.dbService.fornecedores.add(fornecedor);
  }

  getAllFornecedores(): Promise<Fornecedor[]> {
    return this.dbService.fornecedores.toArray();
  }
}
