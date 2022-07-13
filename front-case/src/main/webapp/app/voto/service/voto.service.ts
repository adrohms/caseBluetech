import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoto, getVotoIdentifier } from '../voto.model';

export type EntityResponseType = HttpResponse<IVoto>;
export type EntityArrayResponseType = HttpResponse<IVoto[]>;

@Injectable({ providedIn: 'root' })
export class VotoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/votos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(voto: IVoto): Observable<EntityResponseType> {
    return this.http.post<IVoto>(this.resourceUrl, voto, { observe: 'response' });
  }

  update(voto: IVoto): Observable<EntityResponseType> {
    return this.http.put<IVoto>(`${this.resourceUrl}/${getVotoIdentifier(voto) as number}`, voto, { observe: 'response' });
  }

  partialUpdate(voto: IVoto): Observable<EntityResponseType> {
    return this.http.patch<IVoto>(`${this.resourceUrl}/${getVotoIdentifier(voto) as number}`, voto, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVoto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVoto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVotoToCollectionIfMissing(votoCollection: IVoto[], ...votosToCheck: (IVoto | null | undefined)[]): IVoto[] {
    const votos: IVoto[] = votosToCheck.filter(isPresent);
    if (votos.length > 0) {
      const votoCollectionIdentifiers = votoCollection.map(votoItem => getVotoIdentifier(votoItem)!);
      const votosToAdd = votos.filter(votoItem => {
        const votoIdentifier = getVotoIdentifier(votoItem);
        if (votoIdentifier == null || votoCollectionIdentifiers.includes(votoIdentifier)) {
          return false;
        }
        votoCollectionIdentifiers.push(votoIdentifier);
        return true;
      });
      return [...votosToAdd, ...votoCollection];
    }
    return votoCollection;
  }
}
