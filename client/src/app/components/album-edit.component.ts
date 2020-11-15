import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [UserService, ArtistService, AlbumService, UploadService],
})
export class AlbumEditComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public album: Album;
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
    private artistService: ArtistService,
    private albumService: AlbumService,
    private uploadService: UploadService
  ) {
    this.titulo = 'Editar nuevo album';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', '', '2020', '', '');
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('album add cargado');
    this.getAlbum();
  }

  getAlbum() {
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      console.log('gaaa1');
      console.log(id);
      console.log(this.token);
      this.albumService.getAlbum(this.token, id).subscribe(
        (res: any) => {
          console.log('gaaa2');
          if (!res.album) {
            this.router.navigate(['/']);
          } else {
            this.album = res.album;
            console.log(res.album);
          }
        },
        (error: any) => {
          const errorMessage = error;
          if (errorMessage != null) {
            // tenemos que parsear el error para que no nos muestre un object
            // console.log(error.error.album);
            console.log(error);
            // this.album = error.error.album;
            const body = JSON.parse(error._body);
            this.alertMessage = body.message;
            // this.errorMessage=error;
          }
        }
      );
    });
  }

  onSubmit() {
    this.route.params.forEach((params: Params) => {
      const id = params['id'];

      this.albumService.editAlbum(this.token, id, this.album).subscribe(
        (res: any) => {
          if (!res.album) {
            this.alertMessage = 'Error en el servidor';
          } else {
            this.alertMessage = 'El album se ha actualizado correctamente';
            this.album = res.album;
            // this.router.navigate(['/editar-artista', res.artist._id]);
            // Subir la imagen

            if (!this.filesToUpload) { // Si no se modifico la foto 
              this.router.navigate(['/artista', res.album.artist]);
            } else {  // Si se modifico la foto
              this.uploadService
                .makeFileRequest(
                  this.url + 'upload-image-album/' + id,
                  [],
                  this.filesToUpload,
                  this.token,
                  'image'
                )
                .then(
                  (result) => {
                    console.log(res.album.artist);
                    this.router.navigate(['/artista', res.album.artist]);
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
