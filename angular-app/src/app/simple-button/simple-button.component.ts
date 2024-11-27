import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-button',
  templateUrl: './simple-button.component.html',
  styleUrls: ['./simple-button.component.css']
})
export class SimpleButtonComponent implements OnInit {
  label: string = 'Clique no botão abaixo';

  constructor() { }

  changeLabel(): void {
    this.label = 'O botão foi clicado!';
  }

  ngOnInit(): void {
  }

}
