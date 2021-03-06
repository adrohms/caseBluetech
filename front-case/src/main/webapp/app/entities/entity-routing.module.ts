import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'empreendimento',
        data: { pageTitle: 'Empreendimentos' },
        loadChildren: () => import('./empreendimento/empreendimento.module').then(m => m.EmpreendimentoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
