import { Injectable } from '@angular/core';
import { db } from './db.service';
import { Produto } from '../modelos/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  async getAllProdutos(): Promise<Produto[]> { // async: permite usar await e retorna uma Promise de produtos
    return db.produtos.toArray();
  }

  async addProduto(produto: Produto): Promise<number> { // async: operação assíncrona no IndexedDB; retorna Promise com o id
    return db.produtos.add(produto);
  }

  async updateProduto(produto: Produto): Promise<number> { // async: atualização assíncrona; retorna Promise com o id atualizado
    return db.produtos.put(produto);
  }

  async deleteProduto(id: number): Promise<void> { // async: exclusão assíncrona; retorna uma Promise que resolve sem valor
    return db.produtos.delete(id);
  }

  async getProdutoById(id: number): Promise<Produto | undefined> { // async: busca assíncrona; retorna Promise com Produto ou undefined
    return db.produtos.get(id);
  }
  // promise = uma operação assíncrona que pode ser resolvida (com sucesso) ou rejeitada (com erro)
  // async/await = sintaxe para trabalhar com Promises de forma mais legível, parecendo síncrona
}
