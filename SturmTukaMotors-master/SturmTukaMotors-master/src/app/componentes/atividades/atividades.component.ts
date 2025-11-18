import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListarAtividadesComponent } from './listar-atividades/listar-atividades.component';
import { CadastroAtividadeComponent } from './cadastro-atividade/cadastro-atividade.component';
import { Atividade } from '../../modelos/atividade.model';
import { AtividadeService } from '../../services/atividade.service';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [CommonModule, ListarAtividadesComponent, CadastroAtividadeComponent],
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.css']
})
export class AtividadesComponent implements OnInit {
  abaAtiva: 'listagem' | 'cadastro';
  @ViewChild(ListarAtividadesComponent) listarComp?: ListarAtividadesComponent;
  atividadeSelecionada: Atividade | undefined;
  private atividadeService = inject(AtividadeService);
  
  constructor(private route: ActivatedRoute) {
    this.abaAtiva = 'listagem';
  }

  onEditar(atividade: Atividade) {
    this.atividadeSelecionada = atividade;
    this.selecionarAba('cadastro');
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      const atividade = await this.atividadeService.getAtividadeById(id);
      if (atividade) {
        this.onEditar(atividade);
      }
    }
  }

  selecionarAba(aba: 'listagem' | 'cadastro') { this.abaAtiva = aba; }

  novaAtividade() { this.atividadeSelecionada = undefined; this.selecionarAba('cadastro'); }
  onSaved() { this.atividadeSelecionada = undefined; this.selecionarAba('listagem'); this.listarComp?.carregarAtividades(); }
  onRemoved() { this.listarComp?.carregarAtividades(); }
}
