import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmpreendimentoComponent } from './list/empreendimento.component';
import { EmpreendimentoDetailComponent } from './detail/empreendimento-detail.component';
import { EmpreendimentoUpdateComponent } from './update/empreendimento-update.component';
import { EmpreendimentoDeleteDialogComponent } from './delete/empreendimento-delete-dialog.component';
import { EmpreendimentoRoutingModule } from './route/empreendimento-routing.module';

@NgModule({
  imports: [SharedModule, EmpreendimentoRoutingModule],
  declarations: [
    EmpreendimentoComponent,
    EmpreendimentoDetailComponent,
    EmpreendimentoUpdateComponent,
    EmpreendimentoDeleteDialogComponent,
  ],
  entryComponents: [EmpreendimentoDeleteDialogComponent],
})
export class EmpreendimentoModule {}
