import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Empleats } from './empleats';

describe('Empleats', () => {
  let component: Empleats;
  let fixture: ComponentFixture<Empleats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Empleats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Empleats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
