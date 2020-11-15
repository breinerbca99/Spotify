import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService, SongService],
})
export class AlbumDetailComponent implements OnInit {
  public titulo: string;
  public album: Album;
  public NombreArtista;
  // public songs: Song[];
  public songs;
  public identity;
  public token;
  public url: string;

  public alertMessage;
  public confirmado;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private albumService: AlbumService,
    private songService: SongService
  ) {
    this.titulo = 'Album detail';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('artist-list cargado');
    // Sacar el album de la db
    this.getAlbum();
  }

  getAlbum() {
    console.log('El metodo funciona');
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      this.albumService.getAlbum(this.token, id).subscribe(
        (res: any) => {
          if (!res.album) {
            this.router.navigate(['/']);
          } else {
            console.log('re' + this.album);
            console.log('de' + res.album._id);
            this.NombreArtista = res.album.artist.name;
            this.album = res.album;

            // Sacar las canciones
            this.songService.getSongs(this.token, res.album._id).subscribe(
              (response: any) => {
                if (!response.songs) {
                  this.alertMessage = 'Este album no tiene canciones';
                } else {
                  this.songs = response.songs;
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
            //
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

  onDeleteAlbum(id) {
    this.albumService.deleteAlbum(this.token, id).subscribe(
      (res: any) => {
        if (!res.album) {
          alert('Error en el servidor');
        } else {
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
  onDeleteConfirm(id) {
    this.confirmado = id;
  }
  onDeleteSong(id) {
    this.songService.deleteSong(this.token, id).subscribe(
      (res: any) => {
        console.log('fa' + res);
        if (!res.album) {
          alert('Error en el servidor');
        } else {
          this.getAlbum();
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

  onCancelSong() {
    this.confirmado = null;
  }

  startPlayer(song) {
    console.log('song:' + song);
    const songPlayer = JSON.stringify(song);
    console.log('canciones' + song.file);
    const filePath = this.url + 'get-song-file/' + song.file;
    const imagePath = this.url + 'get-image-album/' + song.album.image;
    /* console.log('songPlayer:' + songPlayer);
    console.log('filePath:' + filePath);
    console.log('imagePath:' + imagePath);
    */
    localStorage.setItem('soundSong', songPlayer);
    document.getElementById('mp3-source').setAttribute('src', filePath);
    (document.getElementById('player') as any).load();
    (document.getElementById('player') as any).play();
    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML =
      song.album.artist.name;
    document.getElementById('play-image-album').setAttribute('src', imagePath);
  }
}
