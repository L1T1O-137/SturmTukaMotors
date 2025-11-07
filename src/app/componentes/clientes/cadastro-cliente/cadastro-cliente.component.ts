import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../modelos/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';


@Component({
selector: 'app-cadastro-cliente',
imports: [ReactiveFormsModule],
templateUrl: './cadastro-cliente.component.html',
styleUrl: './cadastro-cliente.component.css'
})
export class CadastroClienteComponent {
clientes: Cliente[] = [];
formCliente = new FormGroup({
nome: new FormControl(''),
cpf: new FormControl(''),
fone: new FormControl('')
});

constructor(private clienteService: ClienteService) { }
addCliente() {
  if (this.formCliente.valid) {
  const novoCliente: Cliente = {
  nome: this.formCliente.value.nome!,
  cpf: this.formCliente.value.cpf!,
  fone: this.formCliente.value.fone!
  };
  this.clienteService.addCliente(novoCliente).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Cadastro realizado!',
      text: 'O cliente foi cadastrado com sucesso.',
      timer: 5000,
      showConfirmButton: true,
      draggable: true
      });
  this.formCliente.reset();
  });
  }
  }

}