import { Injectable } from '@angular/core';
import { Funcionario } from '../modelos/funcionario.model';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  constructor(private dbService: DbService) {}

  addFuncionario(funcionario: Funcionario): Promise<number> {
    return this.dbService.funcionarios.add(funcionario);
  }

  getAllFuncionarios(): Promise<Funcionario[]> {
    return this.dbService.funcionarios.toArray();
  }

  getFuncionarioById(id: number): Promise<Funcionario | undefined> {
    return this.dbService.funcionarios.get(id);
  }

  updateFuncionario(funcionario: Funcionario): Promise<number> {
    return this.dbService.funcionarios.put(funcionario);
  }

  deleteFuncionario(id: number): Promise<void> {
    return this.dbService.funcionarios.delete(id);
  }
}
