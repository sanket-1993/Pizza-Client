import { BrowserModule } from '@angular/platform-browser';
import { Title }  from '@angular/platform-browser'
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddNewReportComponent } from './add-new-report/add-new-report.component';
import { AddNewGroupComponent } from './add-new-group/add-new-group.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { CategoryComponent } from './category/category.component';
import { PushNotificationComponent } from './push-notification/push-notification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTableComponent } from './data-table/data-table.component';
import { AuthGuard }from './auth.guard';
import { AuthService }from './auth.service';
import { GlobalService } from './global.service';
import { RecaptchaModule } from 'ng-recaptcha';
//import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { 
  MatTableModule, 
  MatPaginatorModule, 
  MatSortModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import {MatCardModule } from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { UpdateReportComponent } from './update-report/update-report.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UpdateGroupComponent } from './update-group/update-group.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
//import { BotDetectCaptchaModule } from 'angular-captcha';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideNavComponent,
    DashBoardComponent,
    ReportListComponent,
    AddNewReportComponent,
    AddNewGroupComponent,
    AddNewUserComponent,
    UserListComponent,
    GroupListComponent,
    CategoryComponent,
    PushNotificationComponent,
    DataTableComponent,
    AddSubCategoryComponent,
    UpdateReportComponent,
    UpdateUserComponent,
    UpdateGroupComponent,
    ResetpasswordComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule, 
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
    }), // ToastrModule
    RecaptchaModule.forRoot()
    // BotDetectCaptchaModule.forRoot({
    //   //captchaEndpoint: 'BotDetectCaptcha.ashx',
    //   captchaEndpoint: 'C:\Users\shraddha\PharmaACE.ChartAudit.Reporting\packages\Captcha.4.4.0\lib\netstandard1.6BotDetectCaptcha.ashx',
     
    // })
  ],
  providers: [
   
     AuthGuard,
    AuthService,
    GlobalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
