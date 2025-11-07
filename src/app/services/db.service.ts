import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Cliente } from '../modelos/cliente.model';
@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  clientes!: Table<Cliente, number>;
  constructor() {
    super('LavaCarDB');
    this.version(1).stores({
      clientes: '++id, nome, cpf, fone',
    });
  }
}
export const db = new DbService();
