import { Component } from '@angular/core';
import {environment} from "../environments/environment";
import {OAuthService} from "./services/oauthservice/auth-service.service";

const TOKEN_BASE_URL = environment.tokenBaseUrl;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private oauthService: OAuthService) {
    let locationOrigin = window.location.origin;
    this.oauthService.loginUrl = `${locationOrigin}/login`;
    this.oauthService.logoutUrl = `${locationOrigin}/login`;
    this.oauthService.tokenEndpoint = `${TOKEN_BASE_URL}/api-token-auth/`; //Why does it require a / at the end? this means it's a directory not a method.
    this.oauthService.tryLogin({});
  }
}
