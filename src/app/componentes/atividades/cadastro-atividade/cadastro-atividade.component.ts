import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaAtividade, PrioridadeAtividade, Atividade } from '../../../modelos/atividade.model';
import { AtividadeService } from '../../../services/atividade.service';
import { ServicoService } from '../../../services/servico.service';
import { ClienteService } from '../../../services/cliente.service';
import { FuncionarioService } from '../../../services/funcionario.service';
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
  prioridades = Object.values(PrioridadeAtividade);

  servicos: any[] = [];
  clientes: any[] = [];
  funcionarios: any[] = [];
  atividadeId?: number;

  private fb = inject(FormBuilder);

  formAtividade = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    dataInicio: ['', Validators.required],
    dataFim: [''],
    categoria: [CategoriaAtividade.Trabalho, Validators.required],
    prioridade: [PrioridadeAtividade.Media, Validators.required],
    servicoId: [null],
    clienteId: [null],
    funcionarioIds: [[] as number[]]
  });

  constructor(
    private atividadeService: AtividadeService,
    private servicoService: ServicoService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Load select options
    this.servicos = await this.servicoService.getAllServicos();
    this.clientes = await this.clienteService.getAllClientes();
    this.funcionarios = await this.funcionarioService.getAllFuncionarios();

    // Edit mode
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
            prioridade: atividade.prioridade,
            servicoId: (atividade.servicoId as any) ?? null,
            clienteId: (atividade.clienteId as any) ?? null,
            funcionarioIds: atividade.funcionarioIds
          });
        }
      }
    }
  }

  toggleFuncionario(id: number): void {
    const current = this.formAtividade.value.funcionarioIds as number[];
    if (current.includes(id)) {
      this.formAtividade.get('funcionarioIds')?.setValue(current.filter(f => f !== id));
    } else {
      this.formAtividade.get('funcionarioIds')?.setValue([...current, id]);
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
      funcionarioIds: v.funcionarioIds || []
    };

    const op = this.atividadeId ? this.atividadeService.updateAtividade(atividade) : this.atividadeService.addAtividade(atividade);
    op.then(() => {
      Swal.fire({
        icon: 'success',
        title: this.atividadeId ? 'Atividade atualizada!' : 'Atividade criada!',
        timer: 2500,
        showConfirmButton: false
      });
      this.router.navigate(['/atividades/listar-atividades']);
    });
  }
}
