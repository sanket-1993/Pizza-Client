import { Component, OnInit } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatFormField, MatSelect, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GlobalService } from '../global.service';
import {RequestOptions} from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { MessageProviderService } from '../message-provider.service';
import { APIsService } from '../apis.service';


@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  Message:any;
  overlays:boolean=false;
  constructor(private http:HttpClient,private messageProvider:MessageProviderService,private apiService:APIsService,private formBuilder:FormBuilder,private router: Router,private globalService:GlobalService,private toastr:ToastrService) { }

  ngOnInit() {
  }

  sendNotification(){
    this.overlays=true;
    //const API_URL="http://caivaportalpluswebservices.azurewebsites.net/api/User/PushNotification";
  //   const API_URL=this.apiService.API_URL+this.apiService.PushNotification;

  //   const options= {
  //     headers: new HttpHeaders({
  //       'Authorization':'Bearer '+window.localStorage.getItem('TokenInLocal'),
  //     }),
     var params= new HttpParams()
          .set('message', this.Message)
  

  this.apiService.getServiceWithParams(this.apiService.PushNotification,params,(response)=>{
   // this.http.get(API_URL,options).subscribe((Response:any)=>{
      if(response.Status.Number==0)
      {
        this.toastr.success("Sent Successfully");
        this.overlays=false;
      }
       else
       {
         this.toastr.warning(this.messageProvider.showMessage(response.Status.Number));
         this.overlays=false;
       }
    },(error)=>{
      this.overlays=false; 
      this.toastr.error("Something went wrong");
    })
  }
}
