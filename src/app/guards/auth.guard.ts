import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {OAuthService} from "../services/oauthservice/auth-service.service";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected router: Router, private oauthService: OAuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var hasAccessToken = this.oauthService.hasValidAccessToken();
    if (!hasAccessToken) {
      //noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['/login']);
    }
    return hasAccessToken;
  }
}
