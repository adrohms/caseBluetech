import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVoto, Voto } from '../voto.model';

import { VotoService } from './voto.service';

describe('Voto Service', () => {
  let service: VotoService;
  let httpMock: HttpTestingController;
  let elemDefault: IVoto;
  let expectedResult: IVoto | IVoto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VotoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a Voto', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Voto()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Voto', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Voto', () => {
      const patchObject = Object.assign({}, new Voto());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Voto', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a Voto', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVotoToCollectionIfMissing', () => {
      it('should add a Voto to an empty array', () => {
        const voto: IVoto = { id: 123 };
        expectedResult = service.addVotoToCollectionIfMissing([], voto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voto);
      });

      it('should not add a Voto to an array that contains it', () => {
        const voto: IVoto = { id: 123 };
        const votoCollection: IVoto[] = [
          {
            ...voto,
          },
          { id: 456 },
        ];
        expectedResult = service.addVotoToCollectionIfMissing(votoCollection, voto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Voto to an array that doesn't contain it", () => {
        const voto: IVoto = { id: 123 };
        const votoCollection: IVoto[] = [{ id: 456 }];
        expectedResult = service.addVotoToCollectionIfMissing(votoCollection, voto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voto);
      });

      it('should add only unique Voto to an array', () => {
        const votoArray: IVoto[] = [{ id: 123 }, { id: 456 }, { id: 48521 }];
        const votoCollection: IVoto[] = [{ id: 123 }];
        expectedResult = service.addVotoToCollectionIfMissing(votoCollection, ...votoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voto: IVoto = { id: 123 };
        const voto2: IVoto = { id: 456 };
        expectedResult = service.addVotoToCollectionIfMissing([], voto, voto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voto);
        expect(expectedResult).toContain(voto2);
      });

      it('should accept null and undefined values', () => {
        const voto: IVoto = { id: 123 };
        expectedResult = service.addVotoToCollectionIfMissing([], null, voto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voto);
      });

      it('should return initial array if no Voto is added', () => {
        const votoCollection: IVoto[] = [{ id: 123 }];
        expectedResult = service.addVotoToCollectionIfMissing(votoCollection, undefined, null);
        expect(expectedResult).toEqual(votoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
