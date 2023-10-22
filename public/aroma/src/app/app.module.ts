import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { EssentialoilsComponent } from './essentialoils/essentialoils.component';
import { EssentialoilComponent } from './essentialoil/essentialoil.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EssentialoilFormComponent } from './essentialoil-form/essentialoil-form.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    EssentialoilsComponent,
    EssentialoilComponent,
    LoginComponent,
    RegisterComponent,
    EssentialoilFormComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "essentialoils",
        component: EssentialoilsComponent
      },
      {
        path: "essentialoil/:essentialoilId",
        component: EssentialoilComponent
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: "essentialoilform",
        component: EssentialoilFormComponent
      },
      {
        path: "essentialoilform/:essentialoilId",
        component: EssentialoilFormComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      }
    ]),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
