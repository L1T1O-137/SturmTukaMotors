import { Pessoa } from './pessoa.model';

export class Funcionario extends Pessoa {
  funcao: string;
  dataAdmissao: Date;

  constructor(
    nome: string,
    fone: string,
    funcao: string,
    dataAdmissao: Date,
    email?: string,
    fotoUrl?: string
  ) {
    super(nome, fone, email, fotoUrl);
    this.funcao = funcao;
    this.dataAdmissao = dataAdmissao;
  }
}
