import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmpreendimento, Empreendimento } from '../empreendimento.model';
import { EmpreendimentoService } from '../service/empreendimento.service';

@Injectable({ providedIn: 'root' })
export class EmpreendimentoRoutingResolveService implements Resolve<IEmpreendimento> {
  constructor(protected service: EmpreendimentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmpreendimento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((empreendimento: HttpResponse<Empreendimento>) => {
          if (empreendimento.body) {
            return of(empreendimento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Empreendimento());
  }
}
