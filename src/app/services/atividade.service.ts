import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Atividade, CategoriaAtividade, PrioridadeAtividade } from '../modelos/atividade.model';

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  constructor(private db: DbService) {}

  addAtividade(atividade: Atividade): Promise<number> {
    return this.db.atividades.add(atividade);
  }

  getAllAtividades(): Promise<Atividade[]> {
    return this.db.atividades.toArray();
  }

  getAtividadeById(id: number): Promise<Atividade | undefined> {
    return this.db.atividades.get(id);
  }

  updateAtividade(atividade: Atividade): Promise<number> {
    return this.db.atividades.put(atividade);
  }

  deleteAtividade(id: number): Promise<void> {
    return this.db.atividades.delete(id);
  }

  async getAtividadesByCategoria(categoria: CategoriaAtividade): Promise<Atividade[]> {
    return this.db.atividades.where('categoria').equals(categoria).toArray();
  }

  async getAtividadesByFuncionario(funcionarioId: number): Promise<Atividade[]> {
    return this.db.atividades.where('funcionarioIds').equals(funcionarioId).toArray();
  }

  async getAtividadesByPrioridade(prioridade: PrioridadeAtividade): Promise<Atividade[]> {
    return this.db.atividades.where('prioridade').equals(prioridade).toArray();
  }
}
