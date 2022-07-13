import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoto, Voto } from '../voto.model';
import { VotoService } from '../service/voto.service';

@Injectable({ providedIn: 'root' })
export class VotoRoutingResolveService implements Resolve<IVoto> {
  constructor(protected service: VotoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voto: HttpResponse<Voto>) => {
          if (voto.body) {
            return of(voto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Voto());
  }
}
