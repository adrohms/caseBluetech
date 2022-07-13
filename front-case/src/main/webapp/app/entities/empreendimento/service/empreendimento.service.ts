import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmpreendimento, getEmpreendimentoIdentifier } from '../empreendimento.model';

export type EntityResponseType = HttpResponse<IEmpreendimento>;
export type EntityArrayResponseType = HttpResponse<IEmpreendimento[]>;

@Injectable({ providedIn: 'root' })
export class EmpreendimentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/empreendimentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(empreendimento: IEmpreendimento): Observable<EntityResponseType> {
    return this.http.post<IEmpreendimento>(this.resourceUrl, empreendimento, { observe: 'response' });
  }

  update(empreendimento: IEmpreendimento): Observable<EntityResponseType> {
    return this.http.put<IEmpreendimento>(`${this.resourceUrl}/${getEmpreendimentoIdentifier(empreendimento) as number}`, empreendimento, {
      observe: 'response',
    });
  }

  partialUpdate(empreendimento: IEmpreendimento): Observable<EntityResponseType> {
    return this.http.patch<IEmpreendimento>(
      `${this.resourceUrl}/${getEmpreendimentoIdentifier(empreendimento) as number}`,
      empreendimento,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmpreendimento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmpreendimento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmpreendimentoToCollectionIfMissing(
    empreendimentoCollection: IEmpreendimento[],
    ...empreendimentosToCheck: (IEmpreendimento | null | undefined)[]
  ): IEmpreendimento[] {
    const empreendimentos: IEmpreendimento[] = empreendimentosToCheck.filter(isPresent);
    if (empreendimentos.length > 0) {
      const empreendimentoCollectionIdentifiers = empreendimentoCollection.map(
        empreendimentoItem => getEmpreendimentoIdentifier(empreendimentoItem)!
      );
      const empreendimentosToAdd = empreendimentos.filter(empreendimentoItem => {
        const empreendimentoIdentifier = getEmpreendimentoIdentifier(empreendimentoItem);
        if (empreendimentoIdentifier == null || empreendimentoCollectionIdentifiers.includes(empreendimentoIdentifier)) {
          return false;
        }
        empreendimentoCollectionIdentifiers.push(empreendimentoIdentifier);
        return true;
      });
      return [...empreendimentosToAdd, ...empreendimentoCollection];
    }
    return empreendimentoCollection;
  }
}
