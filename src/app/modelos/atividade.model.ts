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
  dataInicio: string; // ISO data string
  dataFim?: string;   // ISO data string
  categoria: CategoriaAtividade;
  servicoId?: number;      // vínculo ao serviço (opcional)
  clienteId?: number;      // vínculo ao cliente (opcional)
}
