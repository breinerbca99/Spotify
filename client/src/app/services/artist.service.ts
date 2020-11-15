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
export class ArtistService {
  public url: string; // aqui vamosa  guardar el url de mi api rest locaslhost/3999
  public identity;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getArtists(token, page) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    // const options = new RequestOptions({headers});
    return this.http.get(this.url + 'artists/' + page, { headers });
  }

  getArtist(token, id: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    // const options = new RequestOptions({headers});
    return this.http.get(this.url + 'artist/' + id, { headers });
  }

  addArtist(token, artist: Artist) {
    const params = JSON.stringify(artist);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.post(this.url + 'artist/', params, { headers });
  }

  editArtist(token, id: string, artist: Artist) {
    const params = JSON.stringify(artist);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.put(this.url + 'artist/' + id, params, { headers });
  }

  deleteArtist(token, id: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    // const options = new RequestOptions({headers});
    return this.http.delete(this.url + 'artist/' + id, { headers });
  }
}
