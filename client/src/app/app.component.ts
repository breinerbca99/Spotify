import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService],
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User; // Este va estar vinculado con el formulario de login
  public userRegister: User; // Este va estar vinculado con el formulario de registro

  public identity: any = false; // este identity va revisar el localStorage
  // (si esta aplicacion esta llena significa que vamos a estar logueados)
  public token: any;
  public errorMessage;

  public alertRegister;
  public url: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity(); // Recuperamos del LocalStorage
    this.token = this.userService.getToken();

    console.log(this.identity); // ya que identity esta en true si esta logueado
    console.log(this.token);
  }

  public onSubmit() {
    console.log(this.user);
    // Conseguir los datos del usuario identificado
    this.userService.signup(this.user).subscribe(
      (response: any) => {
        console.log(response);
        console.log(response.user);
        console.log(response.user._id);
        const identity: any = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert('El usuario no esta correctamente identificado');
        } else {
          // TODO Crear elemento en el localstorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(identity)); // Guardamos al user
          // TODO conseguir el token para enviarselo a cada
          this.userService.signup(this.user, 'true').subscribe(
            (res: any) => {
              const token: any = res.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert('El token no se ha generado');
              } else {
                // TODO Crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                console.log(token);
                console.log(identity);
              }
            },
            (error: any) => {
              const errorMessage = error;
              if (errorMessage != null) {
                // tenemos que parsear el error para que no nos muestre un object
                const body = JSON.parse(error.error);

                this.errorMessage = body.message;
                // this.errorMessage=error;
                console.log(error);
              }
            }
          );
        }
      },
      (error: any) => {
        const errorMessage = error;
        if (errorMessage != null) {
          // tenemos que parsear el error para que no nos muestre un object
          const body = error.error;
          this.errorMessage = body.message;
          // this.errorMessage=error;
          console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear(); // Elimina todo lo que hay en el localStorage
    this.identity = null;
    this.token = null;
    this.router.navigate(['/']);
  }

  onSubmitRegister() {
    console.log(this.userRegister);
    this.userService.register(this.userRegister).subscribe(
      (response: any) => {
        const user = response.user;
        this.userRegister = user;

        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister =
            'El registro se ha realizado correctamente,identificate con ' +
            this.userRegister.email;
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      (error: any) => {
        const errorMessage = error;
        if (errorMessage !== null) {
          const body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
}
