export class ProdutoServico {
  servicoId: number;
  produtoId: number;
  quantidade: number;

  constructor(servicoId: number, produtoId: number, quantidade: number) {
    this.servicoId = servicoId;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
  }
}
