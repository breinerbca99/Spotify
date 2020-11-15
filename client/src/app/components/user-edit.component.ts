import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService],
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;

  public alertUpdate;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this.userService.getIdentity(); // Recuperamos del LocalStorage
    this.token = this.userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('user-edit cargado');
  }

  onSubmit() {
    console.log(this.user);
    this.userService.updateUser(this.user).subscribe(
      (response: any) => {
        if (!response.user) {
          this.alertUpdate = 'El usuario no se actualizado';
        } else {
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById('identity_name').innerHTML = this.user.name;
          this.alertUpdate = 'Datos Actualizados correctamente';
          if (!this.filesToUpload) {
            // Redireccion
          } else {
            this.makeFileRequest(
              this.url + 'upload-image-user/' + this.user._id,
              [],
              this.filesToUpload
            ).then((result: any) => {
              this.user.image = result.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
              const imagePath = this.url + 'get-image-user/' + this.user.image;
              console.log(this.user);
              document
                .getElementById('image-logged')
                .setAttribute('src', imagePath);
            });
          }
        }
      },
      (error: any) => {
        const errorMessage = error;
        if (errorMessage != null) {
          // tenemos que parsear el error para que no nos muestre un object
          console.log(error);
          const body = JSON.parse(error._body);
          this.alertUpdate = body.message;
          // this.errorMessage=error;
        }
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    // this.filesToUpload = <Array<File>>fileInput.target.files;
    // this.filesToUpload = (fileInput.target.files as File) as Array;
    // this.filesToUpload = <Array>(fileInput.target.files as File);
    this.filesToUpload = fileInput.target.files as Array<File>;
    console.log(this.filesToUpload);
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    const token = this.token;

    return new Promise((res, rej) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      /* formData.append(name, value);
        formData.append(name, value, filename); */

      for (let file of files) {
        formData.append('image', file, file.name);
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
