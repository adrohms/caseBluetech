import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmpreendimento } from '../empreendimento.model';

@Component({
  selector: 'jhi-empreendimento-detail',
  templateUrl: './empreendimento-detail.component.html',
})
export class EmpreendimentoDetailComponent implements OnInit {
  empreendimento: IEmpreendimento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empreendimento }) => {
      this.empreendimento = empreendimento;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
