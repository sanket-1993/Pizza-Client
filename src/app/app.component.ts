import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';
  isloggedIn:Boolean;
  constructor(public Auth:AuthService,private titleService: Title) {
    this.isloggedIn=this.Auth.IsLoggedIn; 
   }
   resolved(captchaResponse: string) {
    //console.log(`Resolved captcha with response ${captchaResponse}:`);
  
}
}