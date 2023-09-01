import {Component} from '@angular/core';
import {FileInfo, FileService} from "./file.service";
import {BehaviorSubject, Observable, switchMap, take} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";

interface FileForm {
  file: FormControl<File| null>;
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent {
  public fileInfos$: Observable<FileInfo[]>;
  public form: FormGroup = new FormGroup<FileForm>({
    file: new FormControl<File | null>(null, {nonNullable: true})
  });

  private fetchFiles$ = new BehaviorSubject<number>(0);

  constructor(private fileService: FileService) {
    this.fileInfos$ = this.fetchFiles$.pipe(switchMap(() => this.fileService.getAll().pipe(take(1))));
  }

  public getDownloadUri(file: FileInfo): string {
    return `/api/file/${file.name}`;
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.fileService.upload(this.form.value.file).pipe(take(1)).subscribe(() => this.fetchFiles$.next(this.fetchFiles$.value + 1));
    }
  }
}
