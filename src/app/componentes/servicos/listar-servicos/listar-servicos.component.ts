import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Servico } from '../../../modelos/servico.model';
import { ServicoService } from '../../../services/servico.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-servicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-servicos.component.html',
  styleUrls: ['./listar-servicos.component.css']
})
export class ListarServicosComponent implements OnInit {
  servicos: Servico[] = [];
  @Output() editar = new EventEmitter<Servico>();
  @Output() removed = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();
  @Output() associar = new EventEmitter<Servico>();
  @Input() navigateOnAssociate = true;

  constructor(private servicoService: ServicoService, private router: Router) {}

  async ngOnInit() {
    await this.getAllServicos();
  }

  async getAllServicos() {
    this.servicos = await this.servicoService.getAllServicos();
  }

  onEditar(servico: Servico) {
    this.editar.emit(servico);
    if (servico.id != null) {
      this.router.navigate(['/servicos/editar-servico', servico.id]);
    }
  }

  async onDelete(servico: Servico) {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed && servico.id != null) {
      await this.servicoService.deleteServico(servico.id);
      await this.getAllServicos();
      this.removed.emit();
      Swal.fire('Excluído!', 'O serviço foi excluído com sucesso.', 'success');
    }
  }

  novoServico() { this.novo.emit(); }

  associarProdutos(id: number) {
    const servico = this.servicos.find(s => s.id === id);
    if (servico) {
      this.associar.emit(servico);
    }
    if (this.navigateOnAssociate) {
      this.router.navigate(['/servico', id, 'produtos']);
    }
  }
}
