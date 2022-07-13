import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoto } from '../voto.model';
import { IEmpreendimento } from 'app/entities/empreendimento/empreendimento.model';
import { VotoService } from '../service/voto.service';
import { EmpreendimentoService } from 'app/entities/empreendimento/service/empreendimento.service';

import { VotoDeleteDialogComponent } from '../delete/voto-delete-dialog.component';

@Component({
  selector: 'jhi-voto',
  templateUrl: './voto.component.html',
})
export class VotoComponent implements OnInit {
  votos?: IVoto[];
  empreendimentos?: IEmpreendimento[];
  isLoading = false;

  constructor(protected votoService: VotoService,
              protected modalService: NgbModal,
              protected empreendimentoService: EmpreendimentoService) {}

  loadAll(): void {
    this.isLoading = true;

    this.votoService.query().subscribe({
      next: (res: HttpResponse<IVoto[]>) => {
        this.isLoading = false;
        this.votos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.empreendimentoService.query().subscribe({
      next: (res: HttpResponse<IEmpreendimento[]>) => {
        this.isLoading = false;
        this.empreendimentos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IVoto): number {
    return item.id!;
  }

  trackIdEmpreendimento(_index: number, item: IEmpreendimento): number {
    return item.id!;
  }

  delete(voto: IVoto): void {
    const modalRef = this.modalService.open(VotoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.voto = voto;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
