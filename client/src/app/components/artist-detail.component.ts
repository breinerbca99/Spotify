import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers: [UserService, AlbumService, ArtistService],
})
export class ArtistDetailComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public albums: Album[];
  public identity;
  public token;
  public url: string;

  public alertMessage;
  public confirmado;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private artistService: ArtistService,
    private albumService: AlbumService
  ) {
    this.titulo = 'Editar artista';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
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

            // Sacar los albums de los artistas
            this.albumService.getAlbums(this.token, res.artist._id).subscribe(
              (response: any) => {
                  if(!response.albums){
                    this.alertMessage = 'Este artista no tiene albums';
                  }else{
                    this.albums = response.albums;
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

  onDeleteAlbum(id){
    this.albumService.deleteAlbum(this.token, id).subscribe(
      (res: any) => {
        if(!res.album){
          alert('Error en el servidor');
        }else{
          this.getArtist();
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
  onDeleteConfirm(id){
    this.confirmado = id;
  }
  onCancelAlbum(){
    this.confirmado = null;
  }
}
