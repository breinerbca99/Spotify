import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: '../views/home.html',
  providers: [],
})
export class HomeComponent implements OnInit {
  public titulo: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.titulo = 'Artistas';
  }

  ngOnInit() {
    console.log('home cargado');
  }
}
