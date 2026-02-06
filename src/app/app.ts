import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Materiel } from './materiel/materiel';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'test-materiel';
}
