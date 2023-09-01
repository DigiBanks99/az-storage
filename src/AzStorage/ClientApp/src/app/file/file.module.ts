import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file/file.component';
import {FileService} from "./file/file.service";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {FileSizePipeModule} from "../filesize.pipe";

@NgModule({
  declarations: [
    FileComponent
  ],
  imports: [
    CommonModule,
    FileSizePipeModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: FileComponent,
        pathMatch: 'full'
      }
    ]),
  ],
  providers: [ FileService ]
})
export class FileModule { }
