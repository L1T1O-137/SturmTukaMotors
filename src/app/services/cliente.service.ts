import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
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
}
