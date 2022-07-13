import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmpreendimento } from '../empreendimento.model';
import { EmpreendimentoService } from '../service/empreendimento.service';

@Component({
  templateUrl: './empreendimento-delete-dialog.component.html',
})
export class EmpreendimentoDeleteDialogComponent {
  empreendimento?: IEmpreendimento;

  constructor(protected empreendimentoService: EmpreendimentoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.empreendimentoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
