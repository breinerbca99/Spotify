import { Injectable } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // modificacion que hice Ahora que RxJSse ha actualizado
// de v5.xa v6.x, necesitamos convertir a sintaxis de tubería
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class UploadService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  makeFileRequest(
    url: string,
    params: Array<string>,
    files: Array<File>,
    token: string,
    name: string
  ) {
    // const token1 = this.token;

    return new Promise((res, rej) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      /* formData.append(name, value);
            formData.append(name, value, filename); */

      for (let file of files) {
        formData.append(name, file, file.name);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          if (xhr.status === 200) {
            res(JSON.parse(xhr.response));
            console.log('breiner2');
          } else {
            rej(xhr.response);
            console.log('breiner1');
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
