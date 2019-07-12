import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService as PMessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mform: FormGroup;
  nextUrl: any;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private pmessageService: PMessageService,
    private translateService: TranslateService,
    private fb: FormBuilder) {
      this.mform = this.fb.group({
        username: ['istaff', Validators.required],
        password: ['password.123', Validators.required]
      });
    }

  ngOnInit() {
    var currentPath = this.route.snapshot.routeConfig.path == 'login';
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params['next']) {
        if (this.authService.hasValidToken() && currentPath) {
          this.router.navigate(['/products'])
        }

        else if (this.authService.hasValidToken() && !currentPath) {
          this.router.navigate([this.nextUrl]);
        }

        else {
          this.router.navigate(['/login']);
        }
      }
    });

    if (this.authService.hasValidToken()) {
      this.router.navigate(['/products'])
    }else{
      this.router.navigate(['/login'])
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    let fm = this.mform.value;
    this.authService.authenticate(fm.username, fm.password)
      .subscribe(
        token => this.onSuccess(token),
        error => this.onError(error)
      );
  }

  getUserDetails() {
    this.authService.queryUserDetails().subscribe(
      user => {
        if (user.id) {
          if (this.nextUrl) {
            this.router.navigateByUrl(this.nextUrl)
            .catch(() => this.router.navigate(['/products']));
          }
          else {
            this.router.navigate(['/products']);
          }
        } 
        else {
          console.log('wrong credentials');
        }
      });
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  onSuccess(res) {
    let token = res;
    console.log('token', token);
    this.getUserDetails();
  }

  // loginStateValidation(){

  // }
  onError(error) {
    if (error == 'invalid_grant') {
      this.translateService.get([
        'login.fail.title',
        'login.fail.msg'
      ])
      .subscribe(res => {
        this.pmessageService.add({ severity: 'error', summary: res['login.fail.title'], detail: res['login.fail.msg'], key: 'toast' })
      });
    }
  }
}