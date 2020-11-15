import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService, UploadService],
})
export class ArtistEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;

  public alertMessage;
  public is_edit;
  public filesToUpload: Array<File>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private artistService: ArtistService,
    private uploadService: UploadService
  ) {
    this.titulo = 'Editar artista';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('', '', '', '');
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('artist-list cargado');
    // this.artistService.addArtist();
    // Llamar al metodo del api parasacar un artista en base a su id getArtist
    this.getArtist();
  }

  getArtist() {
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      this.artistService.getArtist(this.token, id).subscribe(
        (res: any) => {
          if (!res.artist) {
            this.router.navigate(['/']);
          } else {
            this.artist = res.artist;
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
    console.log(this.artist);
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      this.artistService.editArtist(this.token, id, this.artist).subscribe(
        (res: any) => {
          if (!res.artist) {
            this.alertMessage = 'Error en el servidor';
          } else {
            this.alertMessage = 'El artista se ha creado correctamente';
            // Subir la imagen del artista

            if (!this.filesToUpload) {
              this.router.navigate(['/artista', res.artist._id]);
            } else {
              this.uploadService
                .makeFileRequest(
                  this.url + 'upload-image-artist/' + id,
                  [],
                  this.filesToUpload,
                  this.token,
                  'image'
                )
                .then(
                  (result) => {
                    this.router.navigate(['/artista', res.artist._id]);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }

            this.artist = res.artist;
            //this.is_edit = '2';
            //console.log('/editar-artista', res.artist._id);
            //console.log('Pinpanparu');
            //this.router.navigate(['/editar-artista', res.artist._id]);
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

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files as Array<File>;
  }
}
