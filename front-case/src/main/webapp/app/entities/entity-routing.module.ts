import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path:'login',
        data: { pageTitle: 'Login'},
        loadChildren: () => import('../login/login.module').then(m => m.LoginModule),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
