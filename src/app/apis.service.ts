import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class APIsService implements OnInit {
  token:any;
  headers:any;
  
  ngOnInit() {
   this.token=window.localStorage.getItem('TokenInLocal'); 
   this.headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+this.token
  })
  }
    //API_URL:string='http://caivaportalpluswebservices.azurewebsites.net';
  // API_URL: string= 'http://192.168.100.14:99';
  //API_URL: string= 'http://caivawebservicesdemo.azurewebsites.net';
  //  API_URL:string='http://cslwebservice.azurewebsites.net';
   //API_URL:string='http://localhost:60720'
   //API_URL:string='https://chartauditwebservice.azurewebsites.net'
   API_URL:string="https://bmswebservice.azurewebsites.net/"
  constructor(private http: HttpClient) { }
  //API_URL: string = 'http://192.168.100.14:83';
  //API_URL:string='http://caivaportalpluswebservices.azurewebsites.net';
  //URL: string = 'http://caivawebservicesdemo.azurewebsites.net';
  // URL:string ="http://192.168.100.14:99";
  //URL:string ="http://localhost:60720"
  //URL:string ="https://chartauditwebservice.azurewebsites.net"
  URL:string="https://bmswebservice.azurewebsites.net/"

  //  URL:string='http://cslwebservice.azurewebsites.net'
  Token: string = '/Token';
  RefreshToken: string = '/refreshToken';

  //Login,Logout,etc................
  GetRoleInfo:string='/api/User/GetRoleInfo';
  loginAPI: string = '/api/Login/SignInForAdmin';   //To-do.
  ResetPassword: string = '/api/User/ResetPassword';
  ForgotPassword: string = '/api/Login/ForgotPassword';
  //End of Login,Logout,etc................

  //Report API
  AddNewReport: string = '/api/Report/AddNewReport';
  GetAllReports: string = '/api/Report/GetAllReports';
  GetSpecificReport: string = '/api/Report/GetSpecificReport';
  UpdateReport: string = '/api/Report/UpdateReport';
  DeleteReport: string = '/api/Report/DeleteReport';
  //End of Report API

  //Groups API
  CreateNewGroup: string = '/api/User/CreateNewGroup';
  GetGroupList: string = '/api/User/GetGroupList';
  GetSpecificGroup: string = '/api/User/GetSpecificGroup';
  UpdateGroupInformation: string = '/api/User/UpdateGroupInformation';
  DeleteSpecificGroups: string = '/api/User/DeleteSpecificGroup';
  //End of Groups API

  //Users API
  GetUsers: string = '/api/User/GetUserInfo';
  DeleteUser: string = '/api/User/DeleteUser';
  AddNewUser: string = '/api/User/AddNewUser';
  GetSpecificUser: string = '/api/User/GetSpecificUser';
  UpdateUser: string = '/api/User/UpdateUser';
  //End of Users API

  //Category API
  GetSpecificCategory: string = '/api/Report/GetSpecificCategory';
  AddNewCategory: string = '/api/Report/AddNewCategory';
  GetCategoryList: string = '/api/Report/GetCategoryList';
  AddNewSubCategory: string = '/api/Report/AddNewSubCategory';
  UpdateReportCategory: string = '/api/Report/UpdateReportCategory';
  UpdateReportSubCategory: string = '/api/Report/UpdateReportSubCategory';
  DeleteCategory: string = '/api/Report/DeleteCategory';
  DeleteSubCategory: string = '/api/Report/DeleteSubCategory';
  GetSubCategory:string='/api/Report/GetSubCategory';
  //Push Notification
  PushNotification: string = '/api/User/PushNotification';
 
  

    public postService(url,body,successCallback, failureCallback) {
      const URL = this.URL + url; 
      this.token = window.localStorage.getItem('TokenInLocal');     

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })

      const option={
        headers:this.headers 
       }
     
      this.http.post(URL,body,option).subscribe((response: any) => {
        successCallback(response);
      }, (error) => {
        failureCallback(error)
      })
    }


    public putService(url,body,successCallback, failureCallback) {
      const URL = this.URL + url; 
      this.token = window.localStorage.getItem('TokenInLocal');     

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })

      const option={
        headers:this.headers 
       }
     
      this.http.put(URL,body,option).subscribe((response: any) => {
        successCallback(response);
      }, (error) => {
        failureCallback(error)
      })
    }


    public getService (url,successCallback, failureCallback)
    {
      const URL = this.URL + url; 

      this.token = window.localStorage.getItem('TokenInLocal');     

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })

      const option={
       headers:this.headers 
      }
      
 
      this.http.get(URL,option).subscribe((response: any) => {

        successCallback(response);
      }, (error) => {
   
        failureCallback(error)
      })
    }

    public getServiceWithParams (url,params,successCallback, failureCallback)
    {
      const URL = this.URL + url; 
      this.token = window.localStorage.getItem('TokenInLocal');     

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })

        const option={
        headers :this.headers,
        params:params
      }
    // this.headers.append(params);
      this.http.get(URL,option).subscribe((response: any) => {
        successCallback(response);
      }, (error) => {
        failureCallback(error)
      })
    }

    public deleteService(url,params,successCallback, failureCallback)
    {
      const URL = this.URL + url; 
      this.token = window.localStorage.getItem('TokenInLocal');     

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })

        const option={
        headers :this.headers,
        params:params
      }
    // this.headers.append(params);
      this.http.delete(URL,option).subscribe((response: any) => {
        successCallback(response);
      }, (error) => {
        failureCallback(error)
      })
    }

  //   refreshToken()
  //   {
    
  //       /*
  //           The call that goes in here will use the existing refresh token to call
  //           a method on the oAuth server (usually called refreshToken) to get a new
  //           authorization token for the API calls.
  //       */
  //        const API_URL= this.URL+this.refreshToken;
  //        var body = "grant_type=refresh_token&refresh_token=" +window.localStorage.getItem("refreshToken") + "&client_id=";  
     
  //        const httpOptions = {
  //          headers: new HttpHeaders({
  //            'Content-Type':"application/x-www-form-urlencoded; charset=utf-8"
  //          })};
  //          this.currentToken = this.refreshToken;
  //      return this.http.post(API_URL,body,httpOptions);
      
  // }
}