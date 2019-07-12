import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'ws-router',
  templateUrl: './ws-router.component.html',
  styleUrls: ['./ws-router.component.css']
})
export class WSRouter implements OnInit {
  constructor(private authService: AuthService) { }
  ngOnInit() {}
}
