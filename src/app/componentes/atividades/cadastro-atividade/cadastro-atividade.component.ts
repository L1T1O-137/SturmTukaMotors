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
    this.servicos = await this.servicoService.getAllServicos();
    this.clientes = await this.clienteService.getAllClientes();

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

  async submit(): Promise<void> {
    if (this.formAtividade.invalid) {
      await Swal.fire({
        icon: 'error',
        title: 'Formulário inválido!',
        text: 'Preencha todos os campos obrigatórios corretamente.'
      });
      return;
    }

    const v = this.formAtividade.value;

    if (!v.nome || v.nome.trim() === '') {
      await Swal.fire({
        icon: 'error',
        title: 'Nome obrigatório!',
        text: 'O nome da atividade não pode estar vazio.'
      });
      return;
    }

    if (v.nome.trim().length < 3) {
      await Swal.fire({
        icon: 'error',
        title: 'Nome muito curto!',
        text: 'O nome deve ter pelo menos 3 caracteres.'
      });
      return;
    }

    if (!v.descricao || v.descricao.trim() === '') {
      await Swal.fire({
        icon: 'error',
        title: 'Descrição obrigatória!',
        text: 'A descrição da atividade não pode estar vazia.'
      });
      return;
    }

    if (!v.dataInicio) {
      await Swal.fire({
        icon: 'error',
        title: 'Data de início obrigatória!',
        text: 'Informe a data de início da atividade.'
      });
      return;
    }

    const dataInicio = new Date(v.dataInicio);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataInicio < hoje && !this.atividadeId) {
      const resultado = await Swal.fire({
        icon: 'warning',
        title: 'Data no passado!',
        text: 'A data de início está no passado. Deseja continuar?',
        showCancelButton: true,
        confirmButtonText: 'Sim, continuar',
        cancelButtonText: 'Cancelar'
      });
      
      if (!resultado.isConfirmed) {
        return;
      }
    }

    if (v.dataFim) {
      const dataFim = new Date(v.dataFim);
      if (dataFim < dataInicio) {
        await Swal.fire({
          icon: 'error',
          title: 'Data inválida!',
          text: 'A data de término não pode ser anterior à data de início.'
        });
        return;
      }
    }

    if (!v.categoria) {
      await Swal.fire({
        icon: 'error',
        title: 'Categoria obrigatória!',
        text: 'Selecione uma categoria para a atividade.'
      });
      return;
    }

    if (!v.prioridade) {
      await Swal.fire({
        icon: 'error',
        title: 'Prioridade obrigatória!',
        text: 'Selecione uma prioridade para a atividade.'
      });
      return;
    }

    if (v.clienteId) {
      const clienteExiste = await this.clienteService.getClienteById(Number(v.clienteId));
      if (!clienteExiste) {
        await Swal.fire({
          icon: 'error',
          title: 'Cliente inválido!',
          text: 'O cliente selecionado não existe.'
        });
        return;
      }
    }

    if (v.servicoId) {
      const servicoExiste = await this.servicoService.getServicoById(Number(v.servicoId));
      if (!servicoExiste) {
        await Swal.fire({
          icon: 'error',
          title: 'Serviço inválido!',
          text: 'O serviço selecionado não existe.'
        });
        return;
      }
    }

    const atividadesExistentes = await this.atividadeService.getAllAtividades();
    const nomeJaExiste = atividadesExistentes.some(
      a => a.nome.toLowerCase().trim() === v.nome!.toLowerCase().trim() && a.id !== this.atividadeId
    );
    
    if (nomeJaExiste) {
      const resultado = await Swal.fire({
        icon: 'warning',
        title: 'Nome duplicado!',
        text: 'Já existe uma atividade com este nome. Deseja continuar mesmo assim?',
        showCancelButton: true,
        confirmButtonText: 'Sim, continuar',
        cancelButtonText: 'Cancelar'
      });
      
      if (!resultado.isConfirmed) {
        return;
      }
    }

    const atividade: Atividade = {
      id: this.atividadeId,
      nome: v.nome.trim(),
      descricao: v.descricao.trim(),
      dataInicio: v.dataInicio,
      dataFim: v.dataFim || undefined,
      categoria: v.categoria,
      prioridade: v.prioridade,
      servicoId: v.servicoId ? Number(v.servicoId) : undefined,
      clienteId: v.clienteId ? Number(v.clienteId) : undefined,
    };

    console.log('Salvando atividade:', atividade);

    try {
      const op = this.atividadeId 
        ? this.atividadeService.updateAtividade(atividade) 
        : this.atividadeService.addAtividade(atividade);
      
      await op;

      await Swal.fire({
        icon: 'success',
        title: this.atividadeId ? 'Atividade atualizada!' : 'Atividade criada!',
        timer: 2500,
        showConfirmButton: false
      });

      if (this.saved.observers.length > 0) {
        this.saved.emit();
      } else {
        this.router.navigate(['/atividades/listar-atividades']);
      }
    } catch (erro) {
      console.error('Erro ao salvar atividade:', erro);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar!',
        text: 'Ocorreu um erro ao salvar a atividade. Tente novamente.'
      });
    }
  }
  cancelar(): void {
    if (this.cancelEdit.observers.length > 0) {
      this.cancelEdit.emit();
    } else {
      this.router.navigate(['/atividades/listar-atividades']);
    }
  }
}
