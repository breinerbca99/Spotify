import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, UploadService],
})
export class SongEditComponent implements OnInit {
  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;

  public alertMessage;
  public is_edit;
  public filesToUpload: Array<File>;
  // nuevo = new Artist('', ' ', '', '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private songService: SongService,
    private uploadService: UploadService
  ) {
    this.titulo = 'Editar cancion';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('1', '', '', '', '');
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('song edit cargado');
    // Sacar la cancion a editar
    this.getSong();
  }

  getSong() {
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      console.log('gaaaa');
      console.log(id);
      this.songService.getSong(this.token, id).subscribe(
        (res: any) => {
          if (!res.song) {
            this.router.navigate(['/']);
          } else {
            const numero = res.song.number;
            this.song = res.song;
            console.log(this.song);
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
    });
  }

  onSubmit() {
    console.log('CTMR');
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      console.log('CANCION:'+ this.song);
      this.songService.editSong(this.token, id, this.song).subscribe(
        (res: any) => {
          console.log('1)');
          console.log(res.album);
          console.log('2)');
          if (!res.album) {
            this.alertMessage = 'Error en el servidor';
          } else {
            const response = res.album;
            console.log('Pingon' + response);
            this.alertMessage = 'La cancion se ha actualizado correctamente';
            this.song = response;
            console.log('BREINER:' + this.song);
            // Subir el fichero de audio

            if (!this.filesToUpload) {
              this.router.navigate(['/album', response.album]);
            } else {
              this.uploadService
                .makeFileRequest(
                  this.url + 'upload-file-song/' + id,
                  [],
                  this.filesToUpload,
                  this.token,
                  'file'
                )
                .then(
                  (result) => {
                    this.router.navigate(['/album', response.album]);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
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
    });
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files as Array<File>;
  }
}
