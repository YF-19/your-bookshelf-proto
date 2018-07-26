import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignXComponent } from './sign-x.component';

describe('SignXComponent', () => {
  let component: SignXComponent;
  let fixture: ComponentFixture<SignXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
