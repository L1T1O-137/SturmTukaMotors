
export class Produto {
  id?: number;
  nome: string;
  preco: number;
  quantidade: number;


  constructor(nome: string, preco: number, quantidade: number) {
    this.nome = nome;
    this.preco = preco;
    this.quantidade = quantidade;
  }
}
