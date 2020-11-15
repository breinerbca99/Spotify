import { Injectable } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // modificacion que hice Ahora que RxJSse ha actualizado
// de v5.xa v6.x, necesitamos convertir a sintaxis de tubería
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';


@Injectable()
export class UserService {
  public url: string; // aqui vamosa  guardar el url de mi api rest locaslhost/3999
  public identity;
  public token;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  signup(userLogin, gethash = null) {
    // si existiera el gethash nos va devolver el token twk
    if (gethash != null) {
      userLogin.gethash = gethash;
    }
    const params = JSON.stringify(userLogin);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'login', params, { headers }); // TODO mi modificacion
    // return this._http.post(this.url+'login',params,{headers:headers})
    //               .map(res=>res.json());
  }

  register(userRegister){
    const params = JSON.stringify(userRegister);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'register', params, { headers });
  }

  updateUser(userUpdate){
    console.log('BREINER:' + this.getToken())
    const params = JSON.stringify(userUpdate);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', this.getToken());
    return this.http.put(this.url + 'update-user/' + userUpdate._id, params, { headers });
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));

    if (identity !== 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }
}
