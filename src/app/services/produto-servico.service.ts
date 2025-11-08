import { Injectable } from '@angular/core';
import { db } from './db.service';
import { ProdutoServico } from '../modelos/produto-servico.model';

@Injectable({ providedIn: 'root' })
export class ProdutoServicoService {
  getAllProdutosServicos(): Promise<ProdutoServico[]> {
    return db.produtosServico.toArray();
  }

  async getAssociacoesByServicoId(servicoId: number): Promise<ProdutoServico[]> {
    return db.produtosServico.where('servicoId').equals(servicoId).toArray();
  }

  async getAssociacoesById(servicoId: number, produtoId: number): Promise<ProdutoServico[]> {
    return db.produtosServico.where({ servicoId, produtoId }).toArray();
  }

  async deleteServicoProdutoAssociacao(servicoId: number, produtoId: number): Promise<void> {
    return db.produtosServico.delete([servicoId, produtoId]);
  }

  async addMultiplosProdutosServicoAssociacoes(associations: ProdutoServico[]): Promise<[number, number][]> {
    // Dexie bulkPut returns keys; for compound keys, cast to tuple
    return db.produtosServico.bulkPut(associations) as unknown as Promise<[number, number][]>;
  }

  // Futuras operações de associação podem ser adicionadas aqui
  addProdutoServico(rel: ProdutoServico) {
    return db.produtosServico.add(rel);
  }

  updateProdutoServico(rel: ProdutoServico) {
    return db.produtosServico.put(rel);
  }

  deleteProdutoServico(servicoId: number, produtoId: number) {
    return db.produtosServico.delete([servicoId, produtoId]);
  }
}
