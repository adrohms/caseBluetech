import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmpreendimentoComponent } from '../list/empreendimento.component';
import { EmpreendimentoDetailComponent } from '../detail/empreendimento-detail.component';
import { EmpreendimentoUpdateComponent } from '../update/empreendimento-update.component';
import { EmpreendimentoRoutingResolveService } from './empreendimento-routing-resolve.service';

const empreendimentoRoute: Routes = [
  {
    path: '',
    component: EmpreendimentoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmpreendimentoDetailComponent,
    resolve: {
      empreendimento: EmpreendimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmpreendimentoUpdateComponent,
    resolve: {
      empreendimento: EmpreendimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmpreendimentoUpdateComponent,
    resolve: {
      empreendimento: EmpreendimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(empreendimentoRoute)],
  exports: [RouterModule],
})
export class EmpreendimentoRoutingModule {}
