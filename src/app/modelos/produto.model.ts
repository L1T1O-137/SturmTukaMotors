/**
 * Modelo de domínio para Produto.
 * Use uma classe quando quiser encapsular lógica/comportamento
 * (ex.: getters, métodos utilitários) além de apenas tipagem.
 */
export class Produto {
  /** Identificador autoincremental gerado pelo IndexedDB (opcional na criação) */
  id?: number;
  /** Nome do produto (ex.: Shampoo Automotivo) */
  nome: string;
  /** Preço unitário do produto em reais (use number para cálculos) */
  preco: number;
  /** Quantidade disponível em estoque */
  quantidade: number;
  /** Chave de referência ao fornecedor (tabela fornecedores) */
  fornecedorId: number;
  /** Nome do fornecedor (resolvido em tempo de exibição, não persistido no DB) */
  nomeFornecedor?: string;

  constructor(nome: string, preco: number, quantidade: number, fornecedorId: number) {
    this.nome = nome;
    this.preco = preco;
    this.quantidade = quantidade;
    this.fornecedorId = fornecedorId;
  }
}
