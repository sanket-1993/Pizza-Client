import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { CategoryComponent } from './category/category.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { ReportListComponent } from './report/report-list/report-list.component';
import { AddNewUserComponent } from './user/add-new-user/add-new-user.component';
import { AddNewGroupComponent } from './group/add-new-group/add-new-group.component';
import { AddNewReportComponent  } from './report/add-new-report/add-new-report.component';
import { PushNotificationComponent  } from './push-notification/push-notification.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import {UpdateReportComponent}from './report/update-report/update-report.component';
import {UpdateUserComponent}from './user/update-user/update-user.component';
import {UpdateGroupComponent}from './group/update-group/update-group.component';
import { LoginComponent } from './user/login/login.component';
import { ResetpasswordComponent } from './user/resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { AuthGuard } from './guard/auth.guard';
//import { BotDetectCaptchaModule } from 'angular-captcha';

const routes: Routes = [{ 
    path: '', 
    component: AddNewReportComponent,
    canActivate:[AuthGuard]
  },{
    path:'category',
    component: CategoryComponent,
    canActivate:[AuthGuard] 
  },{
    path: 'userList',
    component: UserListComponent,
    canActivate:[AuthGuard] 
  },{
    path:'groupList',
    component: GroupListComponent,
    canActivate:[AuthGuard] 
  },{
    path:'reportList',
    component: ReportListComponent,
    canActivate:[AuthGuard]   
  },{
    path:'addNewUser',
    component: AddNewUserComponent,
    canActivate:[AuthGuard] 
  },{
    path:'addNewGroup',
    component: AddNewGroupComponent,
    canActivate:[AuthGuard] 
  },{
    path:'addNewReport',
    component: AddNewReportComponent,
    canActivate:[AuthGuard] 
  },{
    path:'resetpassword',
    component: ResetpasswordComponent,
    canActivate:[AuthGuard] 
  },
  {
    path:'forgotPassword',
    component: ForgotPasswordComponent,
    pathMatch: 'full'
    //canActivate:[AuthGuard] 
  },
  {
    path:'notification',
    component: PushNotificationComponent,
    canActivate:[AuthGuard] 
  },{
    path:'category-edit/:id',
    component: AddSubCategoryComponent,
    canActivate:[AuthGuard] 
  },{
    path:'report-edit/:id',
    component: UpdateReportComponent,
    canActivate:[AuthGuard] 
  },{
    path:'user-edit/:id',
    component:UpdateUserComponent,
    canActivate:[AuthGuard] 
  },{
    path:'group-edit/:id',
    component:UpdateGroupComponent,
    canActivate:[AuthGuard] 
  },{
    path:'login',
    component:LoginComponent
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
      //  [BotDetectCaptchaModule.forRoot({
      //  captchaEndpoint: '/BotDetectCaptcha.ashx'
      //  })]],
  exports: [RouterModule]

})
export class AppRoutingModule { }
