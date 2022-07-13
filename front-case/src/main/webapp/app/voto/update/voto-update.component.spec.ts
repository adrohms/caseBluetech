import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VotoService } from '../service/voto.service';
import { IVoto, Voto } from '../voto.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IEmpreendimento } from 'app/entities/empreendimento/empreendimento.model';
import { EmpreendimentoService } from 'app/entities/empreendimento/service/empreendimento.service';

import { VotoUpdateComponent } from './voto-update.component';

describe('Voto Management Update Component', () => {
  let comp: VotoUpdateComponent;
  let fixture: ComponentFixture<VotoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let votoService: VotoService;
  let userService: UserService;
  let empreendimentoService: EmpreendimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VotoUpdateComponent],
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
      .overrideTemplate(VotoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VotoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    votoService = TestBed.inject(VotoService);
    userService = TestBed.inject(UserService);
    empreendimentoService = TestBed.inject(EmpreendimentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const voto: IVoto = { id: 456 };
      const user: IUser = { id: 26734 };
      voto.user = user;

      const userCollection: IUser[] = [{ id: 49921 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voto });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Empreendimento query and add missing value', () => {
      const voto: IVoto = { id: 456 };
      const empreendimento: IEmpreendimento = { id: 64655 };
      voto.empreendimento = empreendimento;

      const empreendimentoCollection: IEmpreendimento[] = [{ id: 34805 }];
      jest.spyOn(empreendimentoService, 'query').mockReturnValue(of(new HttpResponse({ body: empreendimentoCollection })));
      const additionalEmpreendimentos = [empreendimento];
      const expectedCollection: IEmpreendimento[] = [...additionalEmpreendimentos, ...empreendimentoCollection];
      jest.spyOn(empreendimentoService, 'addEmpreendimentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ voto });
      comp.ngOnInit();

      expect(empreendimentoService.query).toHaveBeenCalled();
      expect(empreendimentoService.addEmpreendimentoToCollectionIfMissing).toHaveBeenCalledWith(
        empreendimentoCollection,
        ...additionalEmpreendimentos
      );
      expect(comp.empreendimentosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const voto: IVoto = { id: 456 };
      const user: IUser = { id: 86790 };
      voto.user = user;
      const empreendimento: IEmpreendimento = { id: 41281 };
      voto.empreendimento = empreendimento;

      activatedRoute.data = of({ voto });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(voto));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.empreendimentosSharedCollection).toContain(empreendimento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Voto>>();
      const voto = { id: 123 };
      jest.spyOn(votoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voto }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(votoService.update).toHaveBeenCalledWith(voto);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Voto>>();
      const voto = new Voto();
      jest.spyOn(votoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voto }));
      saveSubject.complete();

      // THEN
      expect(votoService.create).toHaveBeenCalledWith(voto);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Voto>>();
      const voto = { id: 123 };
      jest.spyOn(votoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(votoService.update).toHaveBeenCalledWith(voto);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEmpreendimentoById', () => {
      it('Should return tracked Empreendimento primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEmpreendimentoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
