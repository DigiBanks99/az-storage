import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

export interface FileInfo {
  name: string;
  contentType: string;
  size: number;
}

@Injectable()
export class FileService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private  baseUrl: string) {
  }

  public getAll(): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.baseUrl}api/file`);
  }

  public upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(`${this.baseUrl}api/file`, formData, {
      headers: FileService.buildMultipartFormDataHeaders()
    });
  }

  /**
   * HTTP Multipart Form Data Headers
   * @returns HttpHeaders Return HTTP Headers
   */
  public static buildMultipartFormDataHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'multipart/form-data');
    return headers;
  }
}
