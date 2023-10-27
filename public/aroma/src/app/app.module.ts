import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

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
import { AppRoutes } from './app.routes';
import { AuthenticationInterceptor } from './authentication.interceptor';

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
    JwtModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
