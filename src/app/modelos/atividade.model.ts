export enum CategoriaAtividade {
  Estudo = 'Estudo',
  Trabalho = 'Trabalho',
  Lazer = 'Lazer',
  Pesquisa = 'Pesquisa'
}

export enum PrioridadeAtividade {
  Baixa = 'Baixa',
  Media = 'Média',
  Alta = 'Alta',
  Urgente = 'Urgente'
}

export interface Atividade {
  id?: number;
  nome: string;
  descricao: string;
  dataInicio: string; // ISO date string
  dataFim?: string;   // ISO date string
  categoria: CategoriaAtividade;
  prioridade: PrioridadeAtividade;
  servicoId?: number;      // vínculo ao serviço (opcional)
  clienteId?: number;      // vínculo ao cliente (opcional)
  funcionarioIds: number[]; // multi usuários (funcionários)
}
