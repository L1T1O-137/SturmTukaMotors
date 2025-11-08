import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fornecedor } from '../../../modelos/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cadastro-fornecedor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrl: './cadastro-fornecedor.component.css'
})
export class CadastroFornecedorComponent implements OnInit {
  @Input() fornecedorEdit?: Fornecedor;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  fornecedores: Fornecedor[] = [];
  fornecedorId?: number;
  formFornecedor = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    fone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)])
  });

  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    // Se a rota vier com parâmetro :id, entramos em "modo edição"
    // e pré-carregamos os dados do fornecedor no formulário reativo.
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.fornecedorId = Number(paramId);
      if (!isNaN(this.fornecedorId)) {
        // Operação assíncrona (IndexedDB via Dexie) para buscar o registro
        const fornecedor = await this.fornecedorService.getFornecedorById(this.fornecedorId);
        if (fornecedor) {
          // Preenchemos os controles do formulário com os valores atuais
          this.formFornecedor.setValue({
            nome: fornecedor.nome,
            cpf: fornecedor.cpf,
            fone: fornecedor.fone
          });
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fornecedorEdit']) {
      const f: Fornecedor | undefined = changes['fornecedorEdit'].currentValue;
      if (f && f.id != null) {
        this.fornecedorId = f.id;
        this.formFornecedor.setValue({
          nome: f.nome,
          cpf: f.cpf,
          fone: f.fone
        });
      } else {
        this.fornecedorId = undefined;
        this.formFornecedor.reset();
      }
    }
  }

  async addFornecedor() {
    if (this.formFornecedor.invalid) return;

  if (this.fornecedorId) {
      // Modo edição: mantém o id e atualiza os campos alterados
      const fornecedorEditado: Fornecedor = {
        id: this.fornecedorId,
        nome: this.formFornecedor.value.nome!,
        cpf: this.formFornecedor.value.cpf!,
        fone: this.formFornecedor.value.fone!
      };
      await this.fornecedorService.updateFornecedor(fornecedorEditado);
  // Feedback de sucesso
  Swal.fire('Atualizado!', 'O fornecedor foi atualizado com sucesso.', 'success');
  this.saved.emit();
    } else {
      // Modo cadastro: cria um novo registro sem id (auto-incremento pelo IndexedDB)
      const novoFornecedor: Fornecedor = {
        nome: this.formFornecedor.value.nome!,
        cpf: this.formFornecedor.value.cpf!,
        fone: this.formFornecedor.value.fone!
      };
  await this.fornecedorService.addFornecedor(novoFornecedor);
      // Toast com timeout curto para experiência fluida
      Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado!',
        text: 'O fornecedor foi cadastrado com sucesso.',
        timer: 4000,
        showConfirmButton: false
      });
      this.formFornecedor.reset();
      this.saved.emit();
    }
  }

  limpar() {
    this.formFornecedor.reset();
  }
}