import { Pessoa } from './pessoa.model';

export class Cliente extends Pessoa {
    cpf: string;
    endereco?: string;

    constructor(
        nome: string,
        fone: string,
        cpf: string,
        email?: string,
        endereco?: string,
        fotoUrl?: string
    ) {
        super(nome, fone, email, fotoUrl);
        this.cpf = cpf;
        this.endereco = endereco;
    }
}

