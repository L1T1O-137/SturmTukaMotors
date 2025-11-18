export enum CategoriaAtividade {
  Manutencao = 'Manutenção',
  Limpeza = 'Limpeza',
  Eletrica = 'Elétrica',
  Upgrade = 'Upgrade',
  Rebaixar = 'Rebaixar'
}


export interface Atividade {
  id?: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim?: string;   
  categoria: CategoriaAtividade;
  prioridade?: Prioridade;
  servicoId?: number;      
  clienteId?: number;      
}

export enum Prioridade {
  Baixa = 'Baixa',
  Media = 'Média',
  Alta = 'Alta',
  Urgente = 'Urgente'
}
