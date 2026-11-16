import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-client-page',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './client.page.html',
  styleUrl: './client.page.scss',
})
export class ClientPage {}