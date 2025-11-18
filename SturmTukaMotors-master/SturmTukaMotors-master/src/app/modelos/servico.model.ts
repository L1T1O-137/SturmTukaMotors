export class Servico {
  id?: number;
  nome!: string;
  descricao!: string;
  preco!: number;

  constructor(nome: string, descricao: string, preco: number) {
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
  }
}
