import { Injectable } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // modificacion que hice Ahora que RxJSse ha actualizado
// de v5.xa v6.x, necesitamos convertir a sintaxis de tubería
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Injectable()
export class SongService {
  public url: string; // aqui vamosa  guardar el url de mi api rest locaslhost/3999
  public identity;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addSong(token: any, song: Song) {
    const params = JSON.stringify(song);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.post(this.url + 'song/', params, { headers });
  }

  getSong(token, id: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    console.log(token);
    console.log(id);
    return this.http.get(this.url + 'song/' + id, { headers });
  }

  editSong(token, id: string, song: Song) {
    const params = JSON.stringify(song);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.put(this.url + 'song/' + id, params, { headers });
  }

  getSongs(token, albumId = null) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    // const options = new RequestOptions({headers});
    if (albumId == null) {
      return this.http.get(this.url + 'songs', { headers });
    } else {
      return this.http.get(this.url + 'songs/' + albumId, { headers });
    }
  }

  deleteSong(token, id: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.delete(this.url + 'song/' + id, { headers });
  }
}
