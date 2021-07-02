import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLoggedIn:Boolean=false;
  userID:string='';
  userName:String='';
  userEmail:String='';
  userData:any;
  password:String='';
  token:any;
 
  constructor(private http:HttpClient,private router:Router) {  
  }
}


   



