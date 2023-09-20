import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ErrorPageComponent,
        children: [
          {
            path: 'error-page',
            loadChildren: () =>
              import('./error-page.module').then((m) => m.ErrorPageModule), //Lazy load public module
            data: { preload: true },
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ErrorPageRoutingModule {}
