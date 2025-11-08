import { Injectable } from '@angular/core';
import { db } from './db.service';
import { Fornecedor } from '../modelos/fornecedor.model';

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  // Retorna todos os fornecedores armazenados
  async getAllFornecedores(): Promise<Fornecedor[]> {
    return db.fornecedores.toArray();
  }

  // Adiciona novo fornecedor e retorna o id gerado
  async addFornecedor(fornecedor: Fornecedor): Promise<number> {
    return db.fornecedores.add(fornecedor);
  }

  // Remove fornecedor pelo id
  async deleteFornecedor(id: number): Promise<void> {
    return db.fornecedores.delete(id);
  }

  // Atualiza fornecedor existente (se id presente)
  async updateFornecedor(fornecedor: Fornecedor): Promise<number> {
    return db.fornecedores.put(fornecedor);
  }
  
  // Busca um fornecedor específico pelo id (retorna undefined se não existir)
  async getFornecedorById(id: number): Promise<Fornecedor | undefined> {
    return db.fornecedores.get(id);
  }
}