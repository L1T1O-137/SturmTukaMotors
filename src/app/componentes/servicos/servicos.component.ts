import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CadastroServicoComponent } from './cadastro-servico/cadastro-servico.component';
import { ListarServicosComponent } from './listar-servicos/listar-servicos.component';
import { AssociacaoProdutosServicoComponent } from './associacao-produtos-servico/associacao-produtos-servico.component';
import { Servico } from '../../modelos/servico.model';
import { ServicoService } from '../../services/servico.service';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, CadastroServicoComponent, ListarServicosComponent, AssociacaoProdutosServicoComponent],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {
  abaAtiva: 'listagem' | 'cadastro' | 'associacao' = 'listagem';
  @ViewChild(ListarServicosComponent) listarComp?: ListarServicosComponent;
  servicoSelecionado: Servico | undefined;
  constructor(private route: ActivatedRoute, private servicoService: ServicoService) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      const servico = await this.servicoService.getServicoById(id);
      if (servico) {
        this.onEditar(servico);
      }
    }
  }

  selecionarAba(aba: 'listagem' | 'cadastro') { this.abaAtiva = aba; }

  novoServico() { this.servicoSelecionado = undefined; this.selecionarAba('cadastro'); }
  onEditar(servico: Servico) { this.servicoSelecionado = servico; this.selecionarAba('cadastro'); }
  onSaved() { this.servicoSelecionado = undefined; this.selecionarAba('listagem'); this.listarComp?.getAllServicos(); }
  onRemoved() { this.listarComp?.getAllServicos(); }
  onAssociar(servico: Servico) { this.servicoSelecionado = servico; this.abaAtiva = 'associacao'; }
}
