# O Básico do Angular

Este guia explica os conceitos fundamentais do Angular usando exemplos práticos do projeto LavaCar.

## Índice
1. [O que é Angular?](#o-que-é-angular)
2. [Componentes](#componentes)
3. [Templates](#templates)
4. [Data Binding](#data-binding)
5. [Diretivas](#diretivas)
6. [Serviços e Injeção de Dependência](#serviços-e-injeção-de-dependência)
7. [Roteamento](#roteamento)
8. [Standalone Components](#standalone-components)
9. [Estrutura do Projeto](#estrutura-do-projeto)

---

## O que é Angular?

Angular é um framework de desenvolvimento web criado e mantido pelo Google. Ele permite criar aplicações web dinâmicas e modernas usando TypeScript (um superset de JavaScript com tipagem estática).

### Principais Características:
- **Component-based**: A aplicação é construída usando componentes reutilizáveis
- **TypeScript**: Linguagem com tipagem forte que compila para JavaScript
- **Two-way Data Binding**: Sincronização automática entre modelo e visualização
- **Dependency Injection**: Sistema para gerenciar dependências de forma eficiente
- **Routing**: Sistema de navegação entre diferentes páginas/views
- **Modular**: Código organizado em módulos lógicos

---

## Componentes

Componentes são os blocos de construção fundamentais de uma aplicação Angular. Cada componente consiste em:

1. **Classe TypeScript**: Contém a lógica e dados
2. **Template HTML**: Define a estrutura visual
3. **Estilos CSS**: Define a aparência

### Exemplo do Projeto: AppComponent

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';

@Component({
  selector: 'app-root',                    // Como usar o componente no HTML
  imports: [RouterOutlet, HeaderComponent, FooterComponent], // Dependências
  templateUrl: './app.component.html',     // Localização do template
  styleUrl: './app.component.css'          // Localização dos estilos
})
export class AppComponent {
  title = 'Projeto LavaCar';                // Propriedade do componente
}
```

### Estrutura de um Componente:

- **@Component**: Decorator que marca uma classe como componente
- **selector**: Nome da tag HTML para usar o componente (ex: `<app-root></app-root>`)
- **templateUrl**: Caminho para o arquivo HTML do template
- **styleUrl**: Caminho para o arquivo CSS de estilos
- **imports**: Lista de componentes e módulos que este componente usa

---

## Templates

Templates definem a estrutura HTML do componente. Eles podem incluir:
- HTML padrão
- Sintaxe especial do Angular (interpolação, diretivas, etc.)
- Referências a propriedades e métodos do componente

### Exemplo do Projeto: AppComponent Template

```html
<!-- src/app/app.component.html -->
<div class="vh-100 d-flex flex-column">
  <app-header></app-header>              <!-- Componente filho -->
  <main class="flex-grow-1 p-3">
    <router-outlet />                     <!-- Área para rotas -->
  </main>
  <app-footer></app-footer>              <!-- Componente filho -->
</div>
```

### Elementos Importantes:
- `<app-header>`: Usa o componente HeaderComponent
- `<router-outlet>`: Placeholder onde o Angular renderiza componentes baseado na rota atual
- `<app-footer>`: Usa o componente FooterComponent

---

## Data Binding

Data Binding conecta o componente (TypeScript) com o template (HTML). Existem quatro tipos principais:

### 1. Interpolação `{{ }}`
Exibe valores de propriedades do componente no template.

```typescript
// No componente
export class AppComponent {
  title = 'Projeto LavaCar';
}
```

```html
<!-- No template -->
<h1>{{ title }}</h1>
<!-- Resultado: <h1>Projeto LavaCar</h1> -->
```

### 2. Property Binding `[propriedade]="valor"`
Define propriedades de elementos HTML ou componentes.

```html
<img [src]="imagemUrl" [alt]="descricao">
<button [disabled]="isDisabled">Clique</button>
```

### 3. Event Binding `(evento)="método()"`
Responde a eventos do usuário.

```html
<button (click)="salvar()">Salvar</button>
<input (keyup)="onKeyUp($event)">
```

### 4. Two-Way Binding `[(ngModel)]="propriedade"`
Sincronização bidirecional (requer FormsModule).

```html
<input [(ngModel)]="nome">
<!-- Mudanças no input atualizam 'nome' e vice-versa -->
```

---

## Diretivas

Diretivas são instruções que modificam o DOM. Existem três tipos:

### 1. Diretivas Estruturais
Modificam a estrutura do DOM (adicionam/removem elementos).

#### *ngIf - Renderização Condicional
```html
<div *ngIf="isLoggedIn">
  Bem-vindo, usuário!
</div>

<div *ngIf="isLoggedIn; else loginTemplate">
  Conteúdo para usuário logado
</div>
<ng-template #loginTemplate>
  <div>Por favor, faça login</div>
</ng-template>
```

#### *ngFor - Loop/Iteração
```html
<ul>
  <li *ngFor="let carro of carros; let i = index">
    {{ i + 1 }}. {{ carro.modelo }} - {{ carro.placa }}
  </li>
</ul>
```

#### *ngSwitch - Múltiplas Condições
```html
<div [ngSwitch]="statusAgendamento">
  <p *ngSwitchCase="'pendente'">Aguardando confirmação</p>
  <p *ngSwitchCase="'confirmado'">Agendamento confirmado</p>
  <p *ngSwitchCase="'cancelado'">Agendamento cancelado</p>
  <p *ngSwitchDefault>Status desconhecido</p>
</div>
```

### 2. Diretivas de Atributo
Modificam a aparência ou comportamento de elementos.

#### ngClass - Classes CSS Dinâmicas
```html
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">
  Conteúdo
</div>
```

#### ngStyle - Estilos Dinâmicos
```html
<div [ngStyle]="{'color': corTexto, 'font-size': tamanhoFonte + 'px'}">
  Texto estilizado
</div>
```

---

## Serviços e Injeção de Dependência

Serviços são classes que contêm lógica de negócio, acesso a dados ou funcionalidades compartilhadas. A Injeção de Dependência (DI) é o sistema do Angular para fornecer instâncias de serviços aos componentes.

### Criando um Serviço

```typescript
// src/app/services/agendamento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Disponível em toda a aplicação
})
export class AgendamentoService {
  private apiUrl = 'https://api.exemplo.com/agendamentos';

  constructor(private http: HttpClient) { }

  listarAgendamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarAgendamento(dados: any): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }
}
```

### Usando um Serviço em um Componente

```typescript
import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../services/agendamento.service';

@Component({
  selector: 'app-lista-agendamentos',
  template: `...`
})
export class ListaAgendamentosComponent implements OnInit {
  agendamentos: any[] = [];

  // Injeta o serviço através do construtor
  constructor(private agendamentoService: AgendamentoService) { }

  ngOnInit() {
    // Usa o serviço para buscar dados
    this.agendamentoService.listarAgendamentos().subscribe(
      dados => this.agendamentos = dados
    );
  }
}
```

### Benefícios dos Serviços:
- **Reutilização**: Lógica compartilhada entre múltiplos componentes
- **Separação de Responsabilidades**: Componentes focam na UI, serviços na lógica
- **Testabilidade**: Serviços podem ser facilmente mockados em testes
- **Singleton**: Com `providedIn: 'root'`, uma única instância é compartilhada

---

## Roteamento

O Router do Angular permite navegação entre diferentes views/componentes sem recarregar a página.

### Configurando Rotas

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { ServicosComponent } from './pages/servicos/servicos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },                    // Rota raiz
  { path: 'agendamento', component: AgendamentoComponent },  // /agendamento
  { path: 'servicos', component: ServicosComponent },        // /servicos
  { path: '**', redirectTo: '' }                             // Rota padrão (não encontrada)
];
```

### Navegação no Template

```html
<!-- Usando routerLink -->
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/agendamento">Agendar</a>
  <a routerLink="/servicos">Serviços</a>
</nav>

<!-- routerLinkActive adiciona classe quando a rota está ativa -->
<a routerLink="/agendamento" routerLinkActive="active">Agendar</a>
```

### Navegação Programática

```typescript
import { Router } from '@angular/router';

export class MeuComponente {
  constructor(private router: Router) { }

  irParaAgendamento() {
    this.router.navigate(['/agendamento']);
  }

  irComParametros() {
    this.router.navigate(['/servicos', { id: 123 }]);
  }
}
```

### Router Outlet
O `<router-outlet>` é onde o Angular renderiza o componente da rota atual.

```html
<div class="container">
  <app-header></app-header>
  <router-outlet />  <!-- Componente da rota atual aparece aqui -->
  <app-footer></app-footer>
</div>
```

---

## Standalone Components

A partir do Angular 14+, componentes standalone não precisam ser declarados em módulos NgModule. Este projeto usa standalone components (Angular 19).

### Características:
- Não requerem NgModule
- Importam suas próprias dependências diretamente
- Configuração mais simples e moderna

### Exemplo:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exemplo',
  standalone: true,  // Marca como standalone
  imports: [         // Importa dependências diretamente
    CommonModule,
    RouterModule
  ],
  template: `<div>Componente Standalone</div>`
})
export class ExemploComponent { }
```

### Bootstrap da Aplicação

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

---

## Estrutura do Projeto

```
lavacar-project/
├── src/
│   ├── app/                          # Código da aplicação
│   │   ├── app.component.ts          # Componente raiz
│   │   ├── app.component.html        # Template do componente raiz
│   │   ├── app.component.css         # Estilos do componente raiz
│   │   ├── app.config.ts             # Configuração da aplicação
│   │   ├── app.routes.ts             # Configuração de rotas
│   │   └── shared/                   # Componentes compartilhados
│   │       └── components/
│   │           └── layout/
│   │               ├── header/       # Componente de cabeçalho
│   │               └── footer/       # Componente de rodapé
│   ├── index.html                    # HTML principal
│   ├── main.ts                       # Ponto de entrada da aplicação
│   └── styles.css                    # Estilos globais
├── public/                           # Arquivos públicos (imagens, etc.)
├── angular.json                      # Configuração do Angular CLI
├── package.json                      # Dependências do projeto
├── tsconfig.json                     # Configuração do TypeScript
└── README.md                         # Documentação do projeto
```

### Arquivos Importantes:

- **main.ts**: Bootstrap da aplicação (ponto de entrada)
- **app.component.ts**: Componente raiz que contém toda a aplicação
- **app.routes.ts**: Define todas as rotas da aplicação
- **app.config.ts**: Configurações gerais (providers, etc.)
- **angular.json**: Configuração do build, serve, test, etc.
- **package.json**: Lista de dependências npm

---

## Comandos Úteis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
ng serve
# ou
npm start

# Acesse: http://localhost:4200
```

### Build
```bash
# Build de produção
ng build

# Build de desenvolvimento
ng build --configuration development
```

### Gerar Componentes
```bash
# Criar novo componente
ng generate component nome-do-componente
# ou
ng g c nome-do-componente

# Criar novo serviço
ng generate service nome-do-servico
# ou
ng g s nome-do-servico
```

### Testes
```bash
# Executar testes unitários
ng test
# ou
npm test
```

---

## Ciclo de Vida dos Componentes

Angular fornece hooks para executar código em momentos específicos do ciclo de vida de um componente:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

export class ExemploComponent implements OnInit, OnDestroy {
  
  constructor() {
    // Chamado quando o componente é criado
    console.log('Constructor');
  }

  ngOnInit() {
    // Chamado após a inicialização do componente
    // Ideal para buscar dados, inicializar variáveis
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    // Chamado antes do componente ser destruído
    // Ideal para limpar recursos, cancelar subscriptions
    console.log('ngOnDestroy');
  }
}
```

### Principais Hooks:
- **constructor()**: Inicialização básica
- **ngOnInit()**: Inicialização do componente (buscar dados, etc.)
- **ngOnChanges()**: Quando inputs do componente mudam
- **ngOnDestroy()**: Limpeza antes da destruição

---

## Observables e RxJS

Angular usa extensivamente Observables (da biblioteca RxJS) para programação assíncrona:

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class ExemploComponent implements OnInit {
  dados$: Observable<any[]>;

  ngOnInit() {
    // Subscribe para receber dados
    this.servicoService.getDados().subscribe(
      dados => console.log('Dados recebidos:', dados),
      erro => console.error('Erro:', erro),
      () => console.log('Completo')
    );

    // Usando operadores RxJS
    this.dados$ = this.servicoService.getDados().pipe(
      filter(item => item.ativo),
      map(item => ({ ...item, novaPropriedade: true }))
    );
  }
}
```

### No Template (Async Pipe):
```html
<div *ngFor="let item of dados$ | async">
  {{ item.nome }}
</div>
```

O `async` pipe automaticamente:
- Faz subscribe no Observable
- Atualiza o template quando novos dados chegam
- Faz unsubscribe quando o componente é destruído

---

## Formulários

Angular oferece duas abordagens para formulários:

### 1. Template-Driven Forms (Simples)

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-simples',
  imports: [FormsModule],
  template: `
    <form #formRef="ngForm" (ngSubmit)="onSubmit(formRef)">
      <input name="nome" [(ngModel)]="usuario.nome" required>
      <input name="email" [(ngModel)]="usuario.email" type="email" required>
      <button type="submit" [disabled]="!formRef.valid">Enviar</button>
    </form>
  `
})
export class FormSimplesComponent {
  usuario = { nome: '', email: '' };

  onSubmit(form: any) {
    console.log('Dados:', this.usuario);
  }
}
```

### 2. Reactive Forms (Avançado)

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-reativo',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formulario" (ngSubmit)="onSubmit()">
      <input formControlName="nome">
      <div *ngIf="formulario.get('nome')?.errors?.['required']">
        Nome é obrigatório
      </div>
      
      <input formControlName="email" type="email">
      <button type="submit" [disabled]="!formulario.valid">Enviar</button>
    </form>
  `
})
export class FormReativoComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log('Dados:', this.formulario.value);
    }
  }
}
```

---

## Boas Práticas

1. **Use Standalone Components**: Arquitetura mais moderna e simples
2. **Separe Responsabilidades**: Componentes para UI, Serviços para lógica
3. **OnPush Change Detection**: Melhora performance em componentes grandes
4. **Unsubscribe de Observables**: Use `takeUntil()` ou async pipe
5. **Lazy Loading**: Carregue módulos/componentes sob demanda
6. **Type Safety**: Use TypeScript apropriadamente (evite `any`)
7. **Organize por Feature**: Agrupe arquivos relacionados
8. **Use o Angular CLI**: Para gerar componentes, serviços, etc.

---

## Recursos Adicionais

- **Documentação Oficial**: https://angular.dev
- **Angular CLI**: https://angular.dev/tools/cli
- **RxJS**: https://rxjs.dev
- **TypeScript**: https://www.typescriptlang.org

---

## Conclusão

Este guia cobre os conceitos fundamentais do Angular. Para aprender mais:

1. Experimente criar novos componentes
2. Adicione rotas e navegação
3. Crie serviços para compartilhar dados
4. Implemente formulários
5. Trabalhe com HTTP e APIs
6. Explore a documentação oficial

**Lembre-se**: A prática é essencial. Comece com projetos pequenos e vá aumentando a complexidade gradualmente!
