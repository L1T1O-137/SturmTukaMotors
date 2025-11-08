import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Servico } from '../../../modelos/servico.model';
import { ServicoService } from '../../../services/servico.service';

@Component({
  selector: 'app-cadastro-servico',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-servico.component.html',
  styleUrls: ['./cadastro-servico.component.css']
})
export class CadastroServicoComponent implements OnChanges {
  private fb = new FormBuilder();
  constructor(private servicoService: ServicoService) {}

  @Input() servicoEdit?: Servico;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  servicoId?: number;

  formServico = this.fb.group({
    nome: ['', Validators.required],
    descricao: [''],
    preco: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicoEdit']) {
      const s: Servico | undefined = changes['servicoEdit'].currentValue;
      if (s && s.id != null) {
        this.servicoId = s.id;
        this.formServico.setValue({
          nome: s.nome,
          descricao: s.descricao,
          preco: s.preco,
        });
      } else {
        this.servicoId = undefined;
        this.formServico.reset();
      }
    }
  }

  async addServico() {
    if (this.formServico.invalid) return;

    const payload: Servico = {
      ...(this.servicoId != null ? { id: this.servicoId } : {}),
      nome: this.formServico.value.nome!,
      descricao: this.formServico.value.descricao || '',
      preco: this.formServico.value.preco!,
    };

    if (this.servicoId) {
      await this.servicoService.updateServico(payload);
      Swal.fire('Atualizado!', 'O serviço foi atualizado com sucesso.', 'success');
    } else {
      await this.servicoService.addServico(payload);
      Swal.fire({ icon: 'success', title: 'Cadastro realizado!', text: 'O serviço foi cadastrado com sucesso.', timer: 3000, showConfirmButton: false });
    }
    this.formServico.reset();
    this.saved.emit();
  }

  limpar() {
    this.formServico.reset();
  }
}
