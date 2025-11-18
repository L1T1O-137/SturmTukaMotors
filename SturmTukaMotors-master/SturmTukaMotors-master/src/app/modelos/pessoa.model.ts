export abstract class Pessoa {
  id?: number;
  nome: string;
  fone: string;
  email?: string;
  fotoUrl?: string;

  constructor(nome: string, fone: string, email?: string, fotoUrl?: string) {
    this.nome = nome;
    this.fone = fone;
    this.email = email;
    this.fotoUrl = fotoUrl;
  }
}
