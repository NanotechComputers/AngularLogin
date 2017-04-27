import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {OAuthService} from "../../services/oauthservice/auth-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    .btn-login, input {
      height: 40px;
    }
  `]
})
export class LoginComponent {

  userName: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(protected router: Router, private oAuthService: OAuthService) {
  }

  public login() {
    this.oAuthService.redirectUri = window.location.origin + "/app";
    this
      .oAuthService
      .fetchTokenUsingPasswordFlow(this.userName, this.password)
      .then(() => {
        var hasAccessToken = this.oAuthService.hasValidAccessToken();

        if (hasAccessToken) {
          //noinspection JSIgnoredPromiseFromCall
          this.router.navigate(['/app']);
        }
        this.loginFailed = false;
      })
      .catch((err) => {
        console.error('error logging in', err);
        this.loginFailed = true;
      })
  }
}
