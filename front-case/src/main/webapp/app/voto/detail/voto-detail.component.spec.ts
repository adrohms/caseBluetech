import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VotoDetailComponent } from './voto-detail.component';

describe('Voto Management Detail Component', () => {
  let comp: VotoDetailComponent;
  let fixture: ComponentFixture<VotoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ voto: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VotoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VotoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load voto on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.voto).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
