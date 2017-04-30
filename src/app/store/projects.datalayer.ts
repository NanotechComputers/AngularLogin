import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {RequestOptions, Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {OAuthService} from "../services/oauthservice/auth-service.service";
const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class ProjectsDataLayer {
  private options: RequestOptions = new RequestOptions();

  constructor(private http: Http, private oauthService: OAuthService) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Token " + this.oauthService.getAccessToken());
    this.options = new RequestOptions({
      headers: headers
    });
  }

  get() {
    return this.http.get(`${BASE_URL}/projects/`, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}
