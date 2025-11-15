import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { EstoqueComponent } from './componentes/estoque/estoque.component';
import { ServicosComponent } from './componentes/servicos/servicos.component';
import { AssociacaoProdutosServicoComponent } from './componentes/servicos/associacao-produtos-servico/associacao-produtos-servico.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { CadastroAtividadeComponent } from './componentes/atividades/cadastro-atividade/cadastro-atividade.component';
import { ListarAtividadesComponent } from './componentes/atividades/listar-atividades/listar-atividades.component';
import { AtividadesComponent } from './componentes/atividades/atividades.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'servicos', component: ServicosComponent },
    { path: 'servicos/editar-servico/:id', component: ServicosComponent },
    { path: 'servico/:id/produtos', component: AssociacaoProdutosServicoComponent },
    { path: 'estoque', component: EstoqueComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'atividades', component: AtividadesComponent },
    { path: 'atividades/cadastro-atividade', component: CadastroAtividadeComponent },
    { path: 'atividades/editar-atividade/:id', component: CadastroAtividadeComponent },
    { path: 'atividades/listar-atividades', component: ListarAtividadesComponent },
];
