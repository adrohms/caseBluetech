import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmpreendimento, Empreendimento } from '../empreendimento.model';

import { EmpreendimentoService } from './empreendimento.service';

describe('Empreendimento Service', () => {
  let service: EmpreendimentoService;
  let httpMock: HttpTestingController;
  let elemDefault: IEmpreendimento;
  let expectedResult: IEmpreendimento | IEmpreendimento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmpreendimentoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
      endereco: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Empreendimento', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Empreendimento()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Empreendimento', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          endereco: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Empreendimento', () => {
      const patchObject = Object.assign(
        {
          endereco: 'BBBBBB',
        },
        new Empreendimento()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Empreendimento', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          endereco: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Empreendimento', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmpreendimentoToCollectionIfMissing', () => {
      it('should add a Empreendimento to an empty array', () => {
        const empreendimento: IEmpreendimento = { id: 123 };
        expectedResult = service.addEmpreendimentoToCollectionIfMissing([], empreendimento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(empreendimento);
      });

      it('should not add a Empreendimento to an array that contains it', () => {
        const empreendimento: IEmpreendimento = { id: 123 };
        const empreendimentoCollection: IEmpreendimento[] = [
          {
            ...empreendimento,
          },
          { id: 456 },
        ];
        expectedResult = service.addEmpreendimentoToCollectionIfMissing(empreendimentoCollection, empreendimento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Empreendimento to an array that doesn't contain it", () => {
        const empreendimento: IEmpreendimento = { id: 123 };
        const empreendimentoCollection: IEmpreendimento[] = [{ id: 456 }];
        expectedResult = service.addEmpreendimentoToCollectionIfMissing(empreendimentoCollection, empreendimento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(empreendimento);
      });

      it('should add only unique Empreendimento to an array', () => {
        const empreendimentoArray: IEmpreendimento[] = [{ id: 123 }, { id: 456 }, { id: 62228 }];
        const empreendimentoCollection: IEmpreendimento[] = [{ id: 123 }];
        expectedResult = service.addEmpreendimentoToCollectionIfMissing(empreendimentoCollection, ...empreendimentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const empreendimento: IEmpreendimento = { id: 123 };
        const empreendimento2: IEmpreendimento = { id: 456 };
        expectedResult = service.addEmpreendimentoToCollectionIfMissing([], empreendimento, empreendimento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(empreendimento);
        expect(expectedResult).toContain(empreendimento2);
      });

      it('should accept null and undefined values', () => {
        const empreendimento: IEmpreendimento = { id: 123 };
        expectedResult = service.addEmpreendimentoToCollectionIfMissing([], null, empreendimento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(empreendimento);
      });

      it('should return initial array if no Empreendimento is added', () => {
        const empreendimentoCollection: IEmpreendimento[] = [{ id: 123 }];
        expectedResult = service.addEmpreendimentoToCollectionIfMissing(empreendimentoCollection, undefined, null);
        expect(expectedResult).toEqual(empreendimentoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
