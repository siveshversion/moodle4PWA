import { FixUrlPipe } from './fix-url.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FixUrlPipe],
  imports: [CommonModule],
  exports: [FixUrlPipe],
})
export class FixUrlPipeModule {}
