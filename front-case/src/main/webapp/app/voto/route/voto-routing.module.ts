import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VotoComponent } from '../list/voto.component';
import { VotoDetailComponent } from '../detail/voto-detail.component';
import { VotoUpdateComponent } from '../update/voto-update.component';
import { VotoRoutingResolveService } from './voto-routing-resolve.service';

const votoRoute: Routes = [
  {
    path: '',
    component: VotoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VotoDetailComponent,
    resolve: {
      voto: VotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VotoUpdateComponent,
    resolve: {
      voto: VotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VotoUpdateComponent,
    resolve: {
      voto: VotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(votoRoute)],
  exports: [RouterModule],
})
export class VotoRoutingModule {}
