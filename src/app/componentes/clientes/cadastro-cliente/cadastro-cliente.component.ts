import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../modelos/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  fotoPreviewUrl: string | ArrayBuffer | null = null;
  private clienteId?: number;

  private fb = inject(FormBuilder);

  formCliente = this.fb.group({
    nome: ['', Validators.required],
    fone: ['', Validators.required],
    email: ['', Validators.required],
    fotoUrl: [''],
    endereco: ['', Validators.required],
    cpf: ['']
  });

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        const cliente = await this.clienteService.getClienteById(id);
        if (cliente) {
          this.clienteId = cliente.id;
          this.formCliente.patchValue({
            nome: cliente.nome,
            fone: cliente.fone,
            email: cliente.email ?? '',
            fotoUrl: (cliente as any).fotoUrl ?? '',
            endereco: (cliente as any).endereco ?? '',
            cpf: (cliente as any).cpf ?? ''
          });
          this.fotoPreviewUrl = (cliente as any).fotoUrl ?? null;
        }
      }
    }
  }

  addCliente() {
    if (this.formCliente.invalid) return;

    const novoCliente = new Cliente(
      this.formCliente.value.nome!,
      this.formCliente.value.fone!,
      this.formCliente.value.cpf || '',
      this.formCliente.value.email!,
      this.formCliente.value.endereco!,
      this.formCliente.value.fotoUrl || undefined
    );

    const op = this.clienteId
      ? this.clienteService.updateCliente(Object.assign(novoCliente, { id: this.clienteId }))
      : this.clienteService.addCliente(novoCliente);

    op.then(() => {
      Swal.fire({
        icon: 'success',
        title: this.clienteId ? 'Atualização realizada!' : 'Cadastro realizado!',
        text: this.clienteId ? 'O cliente foi atualizado com sucesso.' : 'O cliente foi cadastrado com sucesso.',
        timer: 4000,
        showConfirmButton: true
      });
      this.formCliente.reset();
      this.fotoPreviewUrl = null;
      if (this.clienteId) {
        // Após atualizar, voltar para a listagem
        this.router.navigate(['/clientes/listar-clientes']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.type.match(/image\/*/) == null) {
        Swal.fire({
          icon: 'error',
          title: 'Arquivo inválido!',
          text: 'Somente arquivos de imagem são permitidos.',
          timer: 5000
        });
        this.formCliente.get('fotoUrl')?.setValue('');
        this.fotoPreviewUrl = null;
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fotoPreviewUrl = reader.result;
        this.formCliente.get('fotoUrl')?.setValue(reader.result as string);
      };
      reader.onerror = () => {
        Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao ler o arquivo!' });
        this.formCliente.get('fotoUrl')?.setValue('');
        this.fotoPreviewUrl = null;
      };
    } else {
      this.formCliente.get('fotoUrl')?.setValue('');
      this.fotoPreviewUrl = null;
    }
  }
}