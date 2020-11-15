import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
  selector: 'album-add',
  templateUrl: '../views/album-add.html',
  providers: [UserService, ArtistService, AlbumService],
})
export class AlbumAddComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;

  public alertMessage;
  public is_edit;
  // nuevo = new Artist('', ' ', '', '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private artistService: ArtistService,
    private albumService: AlbumService
  ) {
    this.titulo = 'Crear nuevo album';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', '', '2020', '', '');
  }

  ngOnInit() {
    console.log('album add cargado');
  }

  onSubmit() {
    this.route.params.forEach((params: Params) => {
      const artis_id = params['artista'];
      this.album.artist = artis_id;
    });
    this.albumService.addAlbum(this.token, this.album).subscribe(
      (res: any) => {
        if (!res.album) {
          this.alertMessage = 'Error en el servidor';
        } else {
          this.alertMessage = 'El album se ha creado correctamente';
          this.artist = res.album;
          this.router.navigate(['/editar-album', res.album._id]);
        }
      },
      (error: any) => {
        const errorMessage = error;
        if (errorMessage != null) {
          // tenemos que parsear el error para que no nos muestre un object
          console.log(error);
          const body = JSON.parse(error._body);
          this.alertMessage = body.message;
        }
      }
    );
  }

  fileChangeEvent($e){}
}
