import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Fornecedor } from '../modelos/fornecedor.model';
import { Cliente } from '../modelos/cliente.model';
import { Produto } from '../modelos/produto.model';
import { Servico } from '../modelos/servico.model';
import { ProdutoServico } from '../modelos/produto-servico.model';
import { Funcionario } from '../modelos/funcionario.model';
import { Atividade, Prioridade } from '../modelos/atividade.model';

@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  fornecedores!: Table<Fornecedor, number>;
  clientes!: Table<Cliente, number>; // Tabela de clientes
  produtos!: Table<Produto, number>; // Tabela de produtos
  servicos!: Table<Servico, number>; // Tabela de serviços
  produtosServico!: Table<ProdutoServico, [number, number]>; // Tabela intermediária Produto-Serviço
  funcionarios!: Table<Funcionario, number>; // Tabela de funcionários
  atividades!: Table<Atividade, number>; // Tabela de atividades

  constructor() {
    super('SturmTukaMotorsDB');
    // Definição do schema do IndexedDB via Dexie
    // ++id => chave primária autoincremental
    // Demais campos são indexados para facilitar buscas
    // HISTÓRICO DE VERSÕES:
    // v1: fornecedores
    // v2: adicionada tabela clientes
    // v3: adicionada tabela produtos
    // v4: adicionadas tabelas servicos e produtosServico
    // v5: adicionada tabela funcionarios e ajustados índices de clientes
    // v6: adicionada tabela atividades com índice em funcionarioIds
    // v7: Removido índice em prioridade de atividades
    // v8: adicionada propriedade 'prioridade' às atividades e ajustado schema
    // v9: migração para popular campo 'prioridade' em atividades existentes
  this.version(9).stores({
      fornecedores: '++id, nome, cpf, fone',
      clientes: '++id, nome, cpf, fone, email, fotoUrl, endereco',
      produtos: '++id, nome, preco, quantidade, fornecedorId',
      servicos: '++id, nome, descricao, preco',
      produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade',
      funcionarios: '++id, nome, fone, email, fotoUrl, funcao, dataAdmissao',
      atividades: '++id, nome, categoria, dataInicio, dataFim, clienteId, servicoId, funcionarioIds*, prioridade'
    }).upgrade(async (tx) => {
      // Ao atualizar para v9, garanta que atividades existentes tenham prioridade definida
      try {
        await tx.table('atividades').toCollection().modify((a: any) => {
          if (!a.prioridade) {
            a.prioridade = Prioridade.Media;
          }
        });
      } catch (e) {
        // Se a migração falhar por qualquer razão, apenas ignore para não bloquear o db aberto
        console.error('Erro durante migração de prioridades (v9):', e);
      }
    });
  }
}

export const db = new DbService();
