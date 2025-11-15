import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { EstoqueComponent } from './componentes/estoque/estoque.component';
import { ServicosComponent } from './componentes/servicos/servicos.component';
import { AssociacaoProdutosServicoComponent } from './componentes/servicos/associacao-produtos-servico/associacao-produtos-servico.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { AtividadesComponent } from './componentes/atividades/atividades.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'servicos', component: ServicosComponent },
    { path: 'servicos/editar-servico/:id', component: ServicosComponent },
    { path: 'servico/:id/produtos', component: AssociacaoProdutosServicoComponent },
    { path: 'estoque', component: EstoqueComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'atividades', component: AtividadesComponent },
];
