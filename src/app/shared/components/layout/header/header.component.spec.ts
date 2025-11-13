import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => { // Define o agrupamento de testes do HeaderComponent
  let component: HeaderComponent; // Referência à instância do componente sob teste
  let fixture: ComponentFixture<HeaderComponent>; // Fixture: encapsula o componente e o template para testes

  beforeEach(async () => { // Executa antes de cada teste
    await TestBed.configureTestingModule({ // Configura o módulo de teste
      imports: [HeaderComponent, RouterTestingModule] // Inclui o RouterTestingModule para providers de rota
    })
    .compileComponents(); // Compila os componentes declarados no módulo de teste

    fixture = TestBed.createComponent(HeaderComponent); // Cria a fixture para o HeaderComponent
    component = fixture.componentInstance; // Obtém a instância do componente criada pela fixture
    fixture.detectChanges(); // Dispara a detecção de mudanças inicial (renderiza o template)
  });

  it('Possa criar', () => { // Caso de teste: deve criar o componente
    expect(component).toBeTruthy(); // Verifica se a instância do componente foi criada com sucesso
  });
});
