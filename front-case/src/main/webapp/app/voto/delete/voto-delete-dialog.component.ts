import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoto } from '../voto.model';
import { VotoService } from '../service/voto.service';

@Component({
  templateUrl: './voto-delete-dialog.component.html',
})
export class VotoDeleteDialogComponent {
  voto?: IVoto;

  constructor(protected votoService: VotoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.votoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
