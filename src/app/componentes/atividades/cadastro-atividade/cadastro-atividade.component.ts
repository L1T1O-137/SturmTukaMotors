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
  // Opções para os campos select de categoria e prioridade
  categorias = Object.values(CategoriaAtividade);
  prioridades = Object.values(Prioridade);

  // Listas carregadas do banco para os campos select
  servicos: any[] = [];
  clientes: any[] = [];

  // ID da atividade em modo de edição
  atividadeId?: number;
  
  // Recebe atividade para edição do componente pai (hub)
  @Input() atividadeEdit?: Atividade;
  
  // Eventos emitidos para o componente pai
  @Output() saved = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  // Formulário reativo com validações integradas
  formAtividade = this.fb.group({
    nome: ['', Validators.required], // Campo obrigatório
    descricao: ['', Validators.required], // Campo obrigatório
    dataInicio: ['', Validators.required], // Campo obrigatório
    dataFim: [''], // Campo opcional
    categoria: [CategoriaAtividade.Manutencao, Validators.required], // Valor padrão: Manutenção
    prioridade: [Prioridade.Media, Validators.required], // Valor padrão: Média
    servicoId: [null], // Opcional: vincula a um serviço
    clienteId: [null], // Opcional: vincula a um cliente
  });

  constructor(
    private atividadeService: AtividadeService,
    private servicoService: ServicoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Carrega dados do banco para popular os campos select (serviços e clientes)
    this.servicos = await this.servicoService.getAllServicos();
    this.clientes = await this.clienteService.getAllClientes();

    // Modo de edição: carrega dados da atividade existente
    // Pode receber via @Input (quando usado no hub) ou via rota direta
    if (this.atividadeEdit) {
      // Recebeu atividade via @Input do componente pai (hub)
      const atividade = this.atividadeEdit;
      this.atividadeId = atividade.id;
      // Preenche o formulário com os dados da atividade
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
      // Fallback: tenta carregar via parâmetro de rota (acesso direto)
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = Number(idParam);
        if (!isNaN(id)) {
          // Busca a atividade no banco pelo ID da rota
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
    // Validação 1: Verifica se o formulário é válido
    if (this.formAtividade.invalid) {
      await Swal.fire({
        icon: 'error',
        title: 'Formulário inválido!',
        text: 'Preencha todos os campos obrigatórios corretamente.'
      });
      return;
    }

    const v = this.formAtividade.value;

    // Validação 2: Verifica se o nome não está vazio (após trim)
    if (!v.nome || v.nome.trim() === '') {
      await Swal.fire({
        icon: 'error',
        title: 'Nome obrigatório!',
        text: 'O nome da atividade não pode estar vazio.'
      });
      return;
    }

    // Validação 3: Verifica tamanho mínimo do nome
    if (v.nome.trim().length < 3) {
      await Swal.fire({
        icon: 'error',
        title: 'Nome muito curto!',
        text: 'O nome deve ter pelo menos 3 caracteres.'
      });
      return;
    }

    // Validação 4: Verifica se a descrição não está vazia
    if (!v.descricao || v.descricao.trim() === '') {
      await Swal.fire({
        icon: 'error',
        title: 'Descrição obrigatória!',
        text: 'A descrição da atividade não pode estar vazia.'
      });
      return;
    }

    // Validação 5: Verifica se a data de início foi informada
    if (!v.dataInicio) {
      await Swal.fire({
        icon: 'error',
        title: 'Data de início obrigatória!',
        text: 'Informe a data de início da atividade.'
      });
      return;
    }

    // Validação 6: Verifica se a data de início não é no passado
    const dataInicio = new Date(v.dataInicio);
    const hoje = new Date(); // Pega data/hora atual do sistema operacional (relógio do Windows)
    hoje.setHours(0, 0, 0, 0); // Zera horas/minutos/segundos para comparar apenas a data
    
    // Apenas para novas atividades (não em edições)
    if (dataInicio < hoje && !this.atividadeId) {
      // Alerta ao usuário mas permite continuar se confirmar
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

    // Validação 7: Se data fim foi informada, verifica se é posterior à data de início
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

    // Validação 8: Verifica se categoria foi selecionada
    if (!v.categoria) {
      await Swal.fire({
        icon: 'error',
        title: 'Categoria obrigatória!',
        text: 'Selecione uma categoria para a atividade.'
      });
      return;
    }

    // Validação 9: Verifica se prioridade foi selecionada
    if (!v.prioridade) {
      await Swal.fire({
        icon: 'error',
        title: 'Prioridade obrigatória!',
        text: 'Selecione uma prioridade para a atividade.'
      });
      return;
    }

    // Validação 10: Verifica se o cliente existe (se foi selecionado)
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

    // Validação 11: Verifica se o serviço existe (se foi selecionado)
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

    // Validação 12: Verifica se já existe uma atividade com o mesmo nome (exceto na edição)
    const atividadesExistentes = await this.atividadeService.getAllAtividades();
    // Compara nomes ignorando maiúsculas/minúsculas e espaços extras
    // Exclui a própria atividade da comparação (em modo de edição)
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

    // Se passou por todas as validações, cria o objeto atividade
    const atividade: Atividade = {
      id: this.atividadeId, // undefined para nova, número para edição
      nome: v.nome.trim(), // Remove espaços extras do início/fim
      descricao: v.descricao.trim(),
      dataInicio: v.dataInicio,
      dataFim: v.dataFim || undefined, // Opcional
      categoria: v.categoria,
      prioridade: v.prioridade,
      servicoId: v.servicoId ? Number(v.servicoId) : undefined, // Converte para número
      clienteId: v.clienteId ? Number(v.clienteId) : undefined, // Converte para número
    };

    console.log('Salvando atividade:', atividade);

    try {
      // Salva ou atualiza a atividade no banco de dados
      // Se tem ID: atualiza existente | Se não tem ID: cria nova
      const op = this.atividadeId 
        ? this.atividadeService.updateAtividade(atividade) 
        : this.atividadeService.addAtividade(atividade);
      
      await op; // Aguarda conclusão da operação

      await Swal.fire({
        icon: 'success',
        title: this.atividadeId ? 'Atividade atualizada!' : 'Atividade criada!',
        timer: 2500,
        showConfirmButton: false
      });

      // Após salvar com sucesso, retorna para a listagem
      if (this.saved.observers.length > 0) {
        // Se está no hub (tem observers): emite evento para o pai trocar de aba
        this.saved.emit();
      } else {
        // Se foi acessado por rota direta: navega para a listagem
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
  // Método chamado ao clicar no botão Cancelar
  cancelar(): void {
    if (this.cancelEdit.observers.length > 0) {
      // Se está no hub: emite evento para o pai voltar à aba de listagem
      this.cancelEdit.emit();
    } else {
      // Se foi acessado por rota direta: navega de volta para a listagem
      this.router.navigate(['/atividades/listar-atividades']);
    }
  }
}
