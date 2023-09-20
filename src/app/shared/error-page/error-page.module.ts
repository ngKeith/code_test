import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorPageComponent } from './error-page.component';
import { ErrorPageRoutingModule } from './error-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ErrorPageComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ErrorPageModule {}
