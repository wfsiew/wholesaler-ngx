import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/login/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.clear();
    this.router.navigate(['/login']);
    // console.log(window.history.replaceState(null,'login','/login'));
  }

}
