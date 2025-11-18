import { Injectable } from '@angular/core';
import { db } from './db.service';
import { Produto } from '../modelos/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  async getAllProdutos(): Promise<Produto[]> { 
    return db.produtos.toArray();
  }

  async addProduto(produto: Produto): Promise<number> {
    return db.produtos.add(produto);
  }

  async updateProduto(produto: Produto): Promise<number> { 
  }

  async deleteProduto(id: number): Promise<void> { 
    return db.produtos.delete(id);
  }

  async getProdutoById(id: number): Promise<Produto | undefined> { 
    return db.produtos.get(id);
  }

}
