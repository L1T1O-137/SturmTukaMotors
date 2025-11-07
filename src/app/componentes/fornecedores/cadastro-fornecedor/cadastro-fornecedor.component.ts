import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import Swal from 'sweetalert2';


@Component({
selector: 'app-cadastro-fornecedor',
imports: [ReactiveFormsModule],
templateUrl: './cadastro-fornecedor.component.html',
styleUrl: './cadastro-fornecedor.component.css'
})
export class CadastroFornecedorComponent {
fornecedores: Fornecedor[] = [];
formFornecedor = new FormGroup({
nome: new FormControl(''),
cnpj: new FormControl(''),
fone: new FormControl('')
});

constructor(private fornecedorService: FornecedorService) { }
addFornecedor() {
  if (this.formFornecedor.valid) {
  const novoFornecedor: Fornecedor = {
  nome: this.formFornecedor.value.nome!,
  cnpj: this.formFornecedor.value.cnpj!,
  fone: this.formFornecedor.value.fone!
  };
  this.fornecedorService.addFornecedor(novoFornecedor).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Cadastro realizado!',
      text: 'O fornecedor foi cadastrado com sucesso.',
      timer: 5000,
      showConfirmButton: true,
      draggable: true
      });
  this.formFornecedor.reset();
  });
  }
  }

}