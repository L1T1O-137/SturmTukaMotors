import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroClienteComponent } from './components/fornecedores/cadastro-cliente/cadastro-cliente.component';
import { ListarFornecedorComponent } from './components/fornecedores/listar-fornecedor/listar-fornecedor.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'fornecedores/cadastro-cliente', component: CadastroClienteComponent },
    { path: 'fornecedores/listar-fornecedor', component: ListarFornecedorComponent },
    

];

