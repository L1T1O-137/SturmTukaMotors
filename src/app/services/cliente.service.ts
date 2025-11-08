import { Injectable } from '@angular/core';
import { Cliente } from '../modelos/cliente.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private dbService: DbService) {}

  addCliente(cliente: Cliente): Promise<number> {
    return this.dbService.clientes.add(cliente);
  }

  getAllClientes(): Promise<Cliente[]> {
    return this.dbService.clientes.toArray();
  }

  getClienteById(id: number): Promise<Cliente | undefined> {
    return this.dbService.clientes.get(id);
  }

  updateCliente(cliente: Cliente): Promise<number> {
    return this.dbService.clientes.put(cliente);
  }

  deleteCliente(id: number): Promise<void> {
    return this.dbService.clientes.delete(id);
  }
}
