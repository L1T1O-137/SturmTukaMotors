// Legacy interface kept temporarily for backward compatibility.
// TODO: Remove usages and delete this file. Prefer using class Cliente in cliente.model.ts.
export interface ClienteModelTs {
    id?: number;
    nome: string;
    cpf: string;
    fone: string;
    email?: string;
    endereco?: string;
    fotoUrl?: string;
}
