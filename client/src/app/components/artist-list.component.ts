import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
  selector: 'artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [UserService, ArtistService],
})
export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;

  public nextPage;
  public prevPage;

  public confirmado;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private artistService: ArtistService
  ) {
    this.titulo = 'Artistas';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.nextPage = 1;
    this.prevPage = 1;
  }

  ngOnInit() {
    console.log('artist-list cargado');

    // Conseguiremos el listado de artistas
    this.getArtists();
  }

  getArtists() {
    this.route.params.forEach((params: Params) => {
      let page = +params['page'];
      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;

        if (this.prevPage === 0) {
          this.prevPage = 1;
        }
      }

      this.artistService.getArtists(this.token, page).subscribe(
        (res: any) => {
          console.log(res);
          if (!res.artist) {
            this.router.navigate(['/']);
          } else {
            this.artists = res.artist;
            console.log('breiner');
          }
        },
        (error: any) => {
          const errorMessage = error;
          if (errorMessage != null) {
            // tenemos que parsear el error para que no nos muestre un object
            console.log(error);
            const body = JSON.parse(error._body);
            // this.alertMessage = body.message;
            // this.errorMessage=error;
          }
        }
      );
    });
  }

  onDeleteConfirm(id) {
    this.confirmado = id;
  }
  onCancelArtist() {
    this.confirmado = null;
  }

  onDeleteArtist(id) {
    this.artistService.deleteArtist(this.token, id).subscribe(
      (res: any) => {
        console.log(res);
        if (!res.artist) {
          // this.router.navigate(['/']);
          alert('Error en el servidor');
        }
        this.getArtists();
      },
      (error: any) => {
        const errorMessage = error;
        if (errorMessage != null) {
          // tenemos que parsear el error para que no nos muestre un object
          console.log(error);
          const body = JSON.parse(error._body);
          // this.alertMessage = body.message;
          // this.errorMessage=error;
        }
      }
    );
  }
}
