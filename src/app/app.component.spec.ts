import { TestBed } from '@angular/core/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => { // Define a suíte de testes para o AppComponent
  beforeEach(async () => { // Executa antes de cada teste 
    await TestBed.configureTestingModule({ // Configura o módulo de teste
      imports: [AppComponent, RouterTestingModule], // Importa o componente standalone e o RouterTestingModule para prover dependências de rota
    }).compileComponents(); // Compila os componentes e templates
  });

  it('Possa criar o site', () => { // Teste: deve criar a instância do AppComponent
    const fixture = TestBed.createComponent(AppComponent); // Cria a fixture do AppComponent
    const app = fixture.componentInstance; // Obtém a instância do componente
    expect(app).toBeTruthy(); // Verifica se a instância foi criada com sucesso
  });

  it(`deve ter o título 'SturmTuka Motors'`, () => { // Teste: verifica se a propriedade title possui o valor correto
    const fixture = TestBed.createComponent(AppComponent); // Cria a fixture do AppComponent
    const app = fixture.componentInstance; // Obtém a instância do componente
    expect(app.title).toEqual('SturmTuka Motors'); // Verifica se o título é exatamente 'SturmTuka Motors'
  });

  it('deve renderizar o título do header', () => { // Teste: verifica se o título aparece no HTML renderizado
    const fixture = TestBed.createComponent(AppComponent); // Cria a fixture do AppComponent
    fixture.detectChanges(); // Dispara a detecção de mudanças para renderizar o template
    const compiled = fixture.nativeElement as HTMLElement; // Obtém o elemento DOM nativo renderizado
    expect((compiled.querySelector('h1')?.textContent || '')).toContain('Sturm&Stuka Motors'); // Verifica se o h1 contém 'Sturm&Stuka Motors' no texto
  });
});
