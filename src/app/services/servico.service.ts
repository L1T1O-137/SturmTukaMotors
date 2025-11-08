import { Injectable } from '@angular/core';
import { db } from './db.service';
import { Servico } from '../modelos/servico.model';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  addServico(servico: Servico) {
    return db.servicos.add(servico);
  }

  getAllServicos(): Promise<Servico[]> {
    return db.servicos.toArray();
  }

  getServicoById(id: number) {
    return db.servicos.get(id);
  }

  updateServico(servico: Servico) {
    return db.servicos.put(servico);
  }

  deleteServico(id: number) {
    return db.servicos.delete(id);
  }
}
