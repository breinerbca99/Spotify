import { Injectable } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // modificacion que hice Ahora que RxJSse ha actualizado
// de v5.xa v6.x, necesitamos convertir a sintaxis de tubería
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
  public url: string; // aqui vamosa  guardar el url de mi api rest locaslhost/3999
  public identity;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addAlbum(token: any, album: Album) {
    const params = JSON.stringify(album);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.post(this.url + 'album/', params, { headers });
  }

  getAlbum(token, id: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    console.log(token);
    console.log(id);

    // const options = new RequestOptions({headers});

    // return this.http.get('http://localhost:3977/api/album/5ec08d8b070d6904949c143e', { headers });
    return this.http.get(this.url + 'album/' + id, { headers });
  }

  getAlbums(token, artistId = null) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    // const options = new RequestOptions({headers});
    if (artistId == null) {
      return this.http.get(this.url + 'albums', { headers });
    } else {
      return this.http.get(this.url + 'albums/' + artistId, { headers });
    }
  }

  editAlbum(token, id: string, album: Album) {
    const params = JSON.stringify(album);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.put(this.url + 'album/' + id, params, { headers });
  }

  deleteAlbum(token, id: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    // const options = new RequestOptions({headers});
    return this.http.delete(this.url + 'album/' + id, { headers });
  }
}
