import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { CadastroClienteComponent } from './componentes/clientes/cadastro-cliente/cadastro-cliente.component';
import { ListarFornecedorComponent } from './componentes/fornecedores/listar-fornecedor/listar-fornecedor.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'fornecedores/cadastro-cliente', component: CadastroClienteComponent },
    { path: 'fornecedores/listar-fornecedor', component: ListarFornecedorComponent },
    
    

];

