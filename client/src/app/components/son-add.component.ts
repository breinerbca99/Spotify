import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService],
})
export class SongAddComponent implements OnInit {
  public titulo: string;
  public song: Song;
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
    private songService: SongService
  ) {
    this.titulo = 'Crear nuevo cancion';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    // this.song = new Song('', '1', '', '', '', '');
    this.song = new Song('1', '', '', '', '');
  }

  ngOnInit() {
    console.log('song add cargado');
  }

  onSubmit() {
    this.route.params.forEach((params: Params) => {
      const album_id = params['album'];
      this.song.album = album_id;
    });
    this.songService.addSong(this.token, this.song).subscribe(
      (res: any) => {
        if (!res.song) {
          this.alertMessage = 'Error en el servidor';
        } else {
          this.alertMessage = 'La cancion se ha creado correctamente';
          this.song = res.song;
          this.router.navigate(['/editar-tema', res.song._id]);
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

  fileChangeEvent($e) {}
}
