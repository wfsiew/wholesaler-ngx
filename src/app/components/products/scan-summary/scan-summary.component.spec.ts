import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanSummaryComponent } from './scan-summary.component';

describe('ScanSummaryComponent', () => {
  let component: ScanSummaryComponent;
  let fixture: ComponentFixture<ScanSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
