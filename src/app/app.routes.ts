import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroFornecedorComponent } from './components/fornecedores/cadastro-fornecedor/cadastro-fornecedor.component';
import { ListarFornecedorComponent } from './components/fornecedores/listar-fornecedor/listar-fornecedor.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'fornecedores/cadastro-fornecedor', component: CadastroFornecedorComponent },
    { path: 'fornecedores/listar-fornecedores', component: ListarFornecedorComponent },

];
