import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'player',
  template: `
    <div class="album-image">
      <span *ngIf="song.album">
        <!--    -->
        <img
          id="play-image-album"
          src="{{ url + 'get-image-album/' + song.album.image }}"
        />
      </span>

      <span *ngIf="!song.album">
        <i class="fab fa-spotify"></i>
        <img id="play-image-album" src="assets/images/default.jpg" />
      </span>
    </div>
    <div class="audio-file">
      <p style="color:red">Reproduciendo: {{ song.name + ' del album ' + song.album.title }}</p>
      <span id="play-song-title">
        {{ song.name }}
      </span>
      <span id="play-song-artist">
        <span *ngIf="song.artist">
          {{ song.album.artist.name }}
        </span>
      </span>
      <audio controls id="player">
        <source
          id="mp3-source"
          src="http://localhost:3977/api/get-song-file/Owwp6pjjnZnrNjShzIgg00rg.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  `,
})
export class PlayerComponent implements OnInit {
  public url: string;
  public song;

  constructor() {
    this.url = GLOBAL.url;
    this.song = new Song('1', '', '', '', '');
  }

  ngOnInit() {
    console.log('player cargado');
    const song = JSON.parse(localStorage.getItem('soundSong'));
    if (song) {
      this.song = song;
    } else {
      this.song = new Song('1', '', '', '', '');
    }
  }
}
