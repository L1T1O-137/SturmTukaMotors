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

    // Definição do schema do banco de dados
    // ++id => chave primária com auto-incremento
    // Demais campos são indexados para permitir buscas eficientes

    // HISTÓRICO DE VERSÕES DO SCHEMA:
    // v1:  Criação inicial com tabela fornecedores
    // v2:  Adicionada tabela clientes
    // v3:  Adicionada tabela produtos
    // v4:  Adicionadas tabelas servicos e produtosServico (associação produto-serviço)
    // v5:  Adicionada tabela funcionarios e ajustados índices de clientes
    // v6:  Adicionada tabela atividades com índice em funcionarioIds
    // v7:  Removido índice em prioridade de atividades
    // v8:  Adicionada propriedade 'prioridade' às atividades e ajustado schema
    // v9:  Migração para popular campo 'prioridade' em atividades existentes
    // v10: Removido fornecedorId de produtos (fornecedores descontinuados)
    // v11: Removida tabela funcionarios (recurso descontinuado)
    // v12: Ajuste final do schema de atividades

    this.version(12).stores({
      // Tabela de clientes com campos indexados
      clientes: '++id, nome, cpf, fone, email, fotoUrl, endereco',

      // Tabela de produtos com campos essenciais indexados
      produtos: '++id, nome, preco, quantidade',

      // Tabela de serviços oferecidos
      servicos: '++id, nome, descricao, preco',

      // Tabela de associação: vincula produtos aos serviços (muitos-para-muitos)
      // Chave composta [servicoId+produtoId] garante que não haja duplicatas
      produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade',

      // Tabela de atividades com todos os campos relevantes indexados
      atividades: '++id, nome, categoria, dataInicio, dataFim, clienteId, servicoId, prioridade'
    }).upgrade(async (tx) => {
      // Migração executada ao atualizar de versões antigas para a versão 12
      // Garante que todas as atividades existentes tenham uma prioridade definida
      try {
        await tx.table('atividades').toCollection().modify((atividade: any) => {
          if (!atividade.prioridade) {
            // Define prioridade padrão como "Média" para atividades antigas
            atividade.prioridade = Prioridade.Media;
          }
        });
      } catch (erro) {
        // Ignora erros de migração para não bloquear a abertura do banco de dados
        console.error('Erro durante migração de prioridades:', erro);
      }
    });
  }
}

export const db = new DbService();
