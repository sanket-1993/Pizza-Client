import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { CategoryComponent } from './category/category.component';
import { GroupListComponent } from './group-list/group-list.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { AddNewGroupComponent } from './add-new-group/add-new-group.component';
import { AddNewReportComponent  } from './add-new-report/add-new-report.component';
import { PushNotificationComponent  } from './push-notification/push-notification.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import {UpdateReportComponent}from './update-report/update-report.component';
import {UpdateUserComponent}from './update-user/update-user.component';
import {UpdateGroupComponent}from './update-group/update-group.component';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './auth.guard';
//import { BotDetectCaptchaModule } from 'angular-captcha';

const routes: Routes = [{ 
    path: '', 
    component: AddNewReportComponent,
    canActivate:[AuthGuard]
  },{
    path:'dashboard',
    component: DashBoardComponent,
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
