import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../../modelos/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css']
})
export class ListarClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  @Output() editar = new EventEmitter<Cliente>();
  @Output() removed = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();

  constructor(private clienteService: ClienteService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.loadClientes();
  }

  async loadClientes(): Promise<void> {
    this.clientes = await this.clienteService.getAllClientes();
  }

  addCliente(): void { this.novo.emit(); }

  editCliente(id: number): void {
    const cliente = this.clientes.find(c => c.id === id);
    if (cliente) {
      this.editar.emit(cliente);
      this.router.navigate(['/clientes/editar-cliente', id]);
    }
  }

  deleteCliente(id: number): void {
    Swal.fire({
      title: 'Remover cliente?',
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then(async result => {
      if (result.isConfirmed) {
        await this.clienteService.deleteCliente(id);
        await this.loadClientes();
        this.removed.emit();
        Swal.fire({ icon: 'success', title: 'Removido!', timer: 2500, showConfirmButton: false });
      }
    });
  }

  abrirModalImagem(cliente: Cliente): void {
    const foto = (cliente as any).fotoUrl;
    if (!foto) return;
    Swal.fire({ imageUrl: foto, imageAlt: cliente.nome });
  }
}
