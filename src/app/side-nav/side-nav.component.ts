import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  currentUrl: string;

  report:boolean=false;
  group:boolean=false;
  user:boolean=false;

  constructor(private auth:AuthService) { }

  ngOnInit() {

    
  }
  logout(){
    this.auth.logout()
  }
}
