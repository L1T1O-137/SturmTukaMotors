import { TestBed } from '@angular/core/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => { 
  beforeEach(async () => { 
    await TestBed.configureTestingModule({ 
      imports: [AppComponent, RouterTestingModule], 
    }).compileComponents();
  });

  it('Possa criar o site', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance; 
    expect(app).toBeTruthy();
  });

  it(`deve ter o título 'SturmTuka Motors'`, () => { 
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance; 
    expect(app.title).toEqual('SturmTuka Motors'); 
  });

  it('deve renderizar o título do header', () => { 
    const fixture = TestBed.createComponent(AppComponent); 
    fixture.detectChanges(); 
    const compiled = fixture.nativeElement as HTMLElement; 
    expect((compiled.querySelector('h1')?.textContent || '')).toContain('Sturm&Stuka Motors'); 
});
