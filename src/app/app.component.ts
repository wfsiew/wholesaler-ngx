import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './components/login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wsapp';
  isLogin:boolean = false;
  constructor(
    private auth: AuthService,
    public translate: TranslateService) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    this.isLogin = this.auth.hasValidToken();
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}
