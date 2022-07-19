import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VotoComponent } from './list/voto.component';
import { VotoDetailComponent } from './detail/voto-detail.component';
import { VotoUpdateComponent } from './update/voto-update.component';
import { VotoDeleteDialogComponent } from './delete/voto-delete-dialog.component';
import { VotoRoutingModule } from './route/voto-routing.module';
import { VotoProgessComponent } from './progressbar/voto-progess.component';
@NgModule({
  imports: [SharedModule, VotoRoutingModule],
  declarations: [VotoComponent, VotoDetailComponent, VotoUpdateComponent, VotoDeleteDialogComponent, VotoProgessComponent],
  entryComponents: [VotoDeleteDialogComponent],
})
export class VotoModule {}
