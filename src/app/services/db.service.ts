import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Fornecedor } from '../models/fornecedor.model';
@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  fornecedores!: Table<Fornecedor, number>;
  constructor() {
    super('LavaCarDB');
    this.version(1).stores({
      fornecedores: '++id, nome, cnpj, fone',
    });
  }
}
export const db = new DbService();
