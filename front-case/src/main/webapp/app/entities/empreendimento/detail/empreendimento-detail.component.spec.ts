import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmpreendimentoDetailComponent } from './empreendimento-detail.component';

describe('Empreendimento Management Detail Component', () => {
  let comp: EmpreendimentoDetailComponent;
  let fixture: ComponentFixture<EmpreendimentoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpreendimentoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ empreendimento: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmpreendimentoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmpreendimentoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load empreendimento on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.empreendimento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
