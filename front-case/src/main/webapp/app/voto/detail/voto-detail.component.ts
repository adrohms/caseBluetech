import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoto } from '../voto.model';

@Component({
  selector: 'jhi-voto-detail',
  templateUrl: './voto-detail.component.html',
})
export class VotoDetailComponent implements OnInit {
  voto: IVoto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voto }) => {
      this.voto = voto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
