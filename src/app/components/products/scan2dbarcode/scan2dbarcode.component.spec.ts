import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Scan2dbarcodeComponent } from './scan2dbarcode.component';

describe('Scan2dbarcodeComponent', () => {
  let component: Scan2dbarcodeComponent;
  let fixture: ComponentFixture<Scan2dbarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Scan2dbarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Scan2dbarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
