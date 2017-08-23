import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CameraListPage } from './camera-list';

@NgModule({
  declarations: [
    CameraListPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraListPage),
  ],
})
export class CameraListPageModule {}
