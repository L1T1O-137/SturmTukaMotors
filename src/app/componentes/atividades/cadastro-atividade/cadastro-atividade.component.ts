import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaAtividade, Atividade, Prioridade } from '../../../modelos/atividade.model';
import { AtividadeService } from '../../../services/atividade.service';
import { ServicoService } from '../../../services/servico.service';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-atividade',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-atividade.component.html',
  styleUrls: ['./cadastro-atividade.component.css']
})
export class CadastroAtividadeComponent implements OnInit {
  categorias = Object.values(CategoriaAtividade);
  prioridades = Object.values(Prioridade);

  servicos: any[] = [];
  clientes: any[] = [];
  funcionarios: any[] = [];
  atividadeId?: number;
  @Input() atividadeEdit?: Atividade;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  formAtividade = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    dataInicio: ['', Validators.required],
    dataFim: [''],
    categoria: [CategoriaAtividade.Manutencao, Validators.required],
    prioridade: [Prioridade.Media, Validators.required],
    servicoId: [null],
    clienteId: [null],
  });

  constructor(
    private atividadeService: AtividadeService,
    private servicoService: ServicoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // carrega dados para selects
    this.servicos = await this.servicoService.getAllServicos();
    this.clientes = await this.clienteService.getAllClientes();

    // Edit mode via Input (hub) ou via rota direta
    if (this.atividadeEdit) {
      const atividade = this.atividadeEdit;
      this.atividadeId = atividade.id;
      this.formAtividade.patchValue({
        nome: atividade.nome,
        descricao: atividade.descricao,
        dataInicio: atividade.dataInicio,
        dataFim: atividade.dataFim || '',
        categoria: atividade.categoria,
        prioridade: atividade.prioridade || Prioridade.Media,
        servicoId: (atividade.servicoId as any) ?? null,
        clienteId: (atividade.clienteId as any) ?? null,
      });
    } else {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = Number(idParam);
        if (!isNaN(id)) {
          const atividade = await this.atividadeService.getAtividadeById(id);
          if (atividade) {
            this.atividadeId = atividade.id;
            this.formAtividade.patchValue({
              nome: atividade.nome,
              descricao: atividade.descricao,
              dataInicio: atividade.dataInicio,
              dataFim: atividade.dataFim || '',
              categoria: atividade.categoria,
              prioridade: atividade.prioridade || Prioridade.Media,
              servicoId: (atividade.servicoId as any) ?? null,
              clienteId: (atividade.clienteId as any) ?? null,
            });
          }
        }
      }
    }
  }

  submit(): void {
    if (this.formAtividade.invalid) return;
    const v = this.formAtividade.value;
    const atividade: Atividade = {
      id: this.atividadeId,
      nome: v.nome!,
      descricao: v.descricao!,
      dataInicio: v.dataInicio!,
      dataFim: v.dataFim || undefined,
      categoria: v.categoria!,
      prioridade: v.prioridade!,
      servicoId: v.servicoId || undefined,
      clienteId: v.clienteId || undefined,
    };

    const op = this.atividadeId ? this.atividadeService.updateAtividade(atividade) : this.atividadeService.addAtividade(atividade);
    op.then(() => {
      Swal.fire({
        icon: 'success',
        title: this.atividadeId ? 'Atividade atualizada!' : 'Atividade criada!',
        timer: 2500,
        showConfirmButton: false
      });
      // Se estiver dentro do hub (com outputs), apenas emite evento e deixa o pai trocar de aba
      if (this.saved.observers.length > 0) {
        this.saved.emit();
      } else {
        // fallback: navegação direta quando acessado por rota standalone
        this.router.navigate(['/atividades/listar-atividades']);
      }
    });
  }

  cancelar(): void {
    if (this.cancelEdit.observers.length > 0) {
      this.cancelEdit.emit();
    } else {
      this.router.navigate(['/atividades/listar-atividades']);
    }
  }
}
