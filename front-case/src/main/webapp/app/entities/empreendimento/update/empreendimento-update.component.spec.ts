import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmpreendimentoService } from '../service/empreendimento.service';
import { IEmpreendimento, Empreendimento } from '../empreendimento.model';

import { EmpreendimentoUpdateComponent } from './empreendimento-update.component';

describe('Empreendimento Management Update Component', () => {
  let comp: EmpreendimentoUpdateComponent;
  let fixture: ComponentFixture<EmpreendimentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let empreendimentoService: EmpreendimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmpreendimentoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmpreendimentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmpreendimentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    empreendimentoService = TestBed.inject(EmpreendimentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const empreendimento: IEmpreendimento = { id: 456 };

      activatedRoute.data = of({ empreendimento });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(empreendimento));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Empreendimento>>();
      const empreendimento = { id: 123 };
      jest.spyOn(empreendimentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empreendimento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: empreendimento }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(empreendimentoService.update).toHaveBeenCalledWith(empreendimento);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Empreendimento>>();
      const empreendimento = new Empreendimento();
      jest.spyOn(empreendimentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empreendimento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: empreendimento }));
      saveSubject.complete();

      // THEN
      expect(empreendimentoService.create).toHaveBeenCalledWith(empreendimento);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Empreendimento>>();
      const empreendimento = { id: 123 };
      jest.spyOn(empreendimentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empreendimento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(empreendimentoService.update).toHaveBeenCalledWith(empreendimento);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
