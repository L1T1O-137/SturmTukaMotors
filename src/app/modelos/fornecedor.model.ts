// Modelo de dados do Fornecedor
// Obs.: `id` é gerado automaticamente pelo IndexedDB (Dexie) com auto-incremento
export interface Fornecedor {
    id?: number;   // Identificador único (auto-incremental)
    nome: string;  // Nome fantasia ou razão social do fornecedor
    cpf: string;   // Documento (neste projeto usamos CPF; poderia ser CNPJ em outro cenário)
    fone: string;  // Telefone de contato
}