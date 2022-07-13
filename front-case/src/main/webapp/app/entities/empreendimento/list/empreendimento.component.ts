import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmpreendimento } from '../empreendimento.model';
import { EmpreendimentoService } from '../service/empreendimento.service';
import { EmpreendimentoDeleteDialogComponent } from '../delete/empreendimento-delete-dialog.component';

@Component({
  selector: 'jhi-empreendimento',
  templateUrl: './empreendimento.component.html',
})
export class EmpreendimentoComponent implements OnInit {
  empreendimentos?: IEmpreendimento[];
  isLoading = false;

  constructor(protected empreendimentoService: EmpreendimentoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

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

  trackId(_index: number, item: IEmpreendimento): number {
    return item.id!;
  }

  delete(empreendimento: IEmpreendimento): void {
    const modalRef = this.modalService.open(EmpreendimentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.empreendimento = empreendimento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
