import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService],
})
export class ArtistAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;

  public alertMessage;

  public is_edit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private artistService: ArtistService
  ) {
    this.titulo = 'Crear Nuevo artista';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '', '');
  }

  ngOnInit() {
    console.log('aderir artist- cargado');
    // this.artistService.addArtist();
    // Conseguiremos el listado de artistas
  }

  onSubmit() {
    console.log(this.artist);
    this.artistService.addArtist(this.token, this.artist).subscribe(
      (res: any) => {
        if (!res.artist) {
          this.alertMessage = 'Error en el servidor';
        } else {
          this.alertMessage = 'El artista se ha creado correctamente';
          this.artist = res.artist;
          this.router.navigate(['/editar-artista', res.artist._id]);
        }
      },
      (error: any) => {
        const errorMessage = error;
        if (errorMessage != null) {
          // tenemos que parsear el error para que no nos muestre un object
          console.log(error);
          const body = JSON.parse(error._body);
          this.alertMessage = body.message;
          // this.errorMessage=error;
        }
      }
    );
  }

  fileChangeEvent(event) { }
}
