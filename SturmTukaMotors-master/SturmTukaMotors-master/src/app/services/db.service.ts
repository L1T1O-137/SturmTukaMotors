import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Cliente } from '../modelos/cliente.model';
import { Produto } from '../modelos/produto.model';
import { Servico } from '../modelos/servico.model';
import { ProdutoServico } from '../modelos/produto-servico.model';
import { Atividade, Prioridade } from '../modelos/atividade.model';

@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  // Tabelas do banco de dados IndexedDB
  clientes!: Table<Cliente, number>;
  produtos!: Table<Produto, number>;
  servicos!: Table<Servico, number>;
  produtosServico!: Table<ProdutoServico, [number, number]>; // Chave composta [servicoId, produtoId] servindo para evitar duplicatas, exemplos: [1, 2], [1, 3], [2, 4], não permitindo repetição
  atividades!: Table<Atividade, number>;

  constructor() {
    super('SturmTukaMotorsDB');


    this.version(12).stores({
    
      clientes: '++id, nome, cpf, fone, email, fotoUrl, endereco',

      produtos: '++id, nome, preco, quantidade',

      servicos: '++id, nome, descricao, preco',

      produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade',

      atividades: '++id, nome, categoria, dataInicio, dataFim, clienteId, servicoId, prioridade'
    }).upgrade(async (tx) => {
      try {
        await tx.table('atividades').toCollection().modify((atividade: any) => {
          if (!atividade.prioridade) {
            atividade.prioridade = Prioridade.Media;
          }
        });
      } catch (erro) {
        console.error('Erro durante migração de prioridades:', erro);
      }
    });
  }
}

export const db = new DbService();
