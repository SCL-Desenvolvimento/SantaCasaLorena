import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConveniosListComponent } from './convenios.component';

describe('ConveniosListComponent', () => {
  let component: ConveniosListComponent;
  let fixture: ComponentFixture<ConveniosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConveniosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConveniosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
