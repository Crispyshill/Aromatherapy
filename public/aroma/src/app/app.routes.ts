import { EssentialoilFormComponent } from "./essentialoil-form/essentialoil-form.component";
import { EssentialoilComponent } from "./essentialoil/essentialoil.component";
import { EssentialoilsComponent } from "./essentialoils/essentialoils.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";

export const AppRoutes = [
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
  ];