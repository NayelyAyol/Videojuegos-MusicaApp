import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideojuegosFormPage } from './videojuegos-form.page';

describe('VideojuegosFormPage', () => {
  let component: VideojuegosFormPage;
  let fixture: ComponentFixture<VideojuegosFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideojuegosFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
