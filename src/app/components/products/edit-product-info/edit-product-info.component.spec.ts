import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductInfoComponent } from './edit-product-info.component';

describe('EditProductInfoComponent', () => {
  let component: EditProductInfoComponent;
  let fixture: ComponentFixture<EditProductInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
