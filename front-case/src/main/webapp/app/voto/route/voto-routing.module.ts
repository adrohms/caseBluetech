import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VotoUpdateComponent } from '../update/voto-update.component';
import { VotoRoutingResolveService } from './voto-routing-resolve.service';

const votoRoute: Routes = [
  {
    path: '',
    component: VotoUpdateComponent,
    resolve: {
      voto: VotoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(votoRoute)],
  exports: [RouterModule],
})
export class VotoRoutingModule {}
