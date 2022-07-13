import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEmpreendimento, Empreendimento } from '../empreendimento.model';
import { EmpreendimentoService } from '../service/empreendimento.service';

import { EmpreendimentoRoutingResolveService } from './empreendimento-routing-resolve.service';

describe('Empreendimento routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EmpreendimentoRoutingResolveService;
  let service: EmpreendimentoService;
  let resultEmpreendimento: IEmpreendimento | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EmpreendimentoRoutingResolveService);
    service = TestBed.inject(EmpreendimentoService);
    resultEmpreendimento = undefined;
  });

  describe('resolve', () => {
    it('should return IEmpreendimento returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmpreendimento = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmpreendimento).toEqual({ id: 123 });
    });

    it('should return new IEmpreendimento if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmpreendimento = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEmpreendimento).toEqual(new Empreendimento());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Empreendimento })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmpreendimento = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmpreendimento).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
