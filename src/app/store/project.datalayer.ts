import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {RequestOptions, Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {OAuthService} from "../services/oauthservice/auth-service.service";
import {ProjectModel} from "app/models/project.model";
const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class ProjectDataLayer {
  private options: RequestOptions = new RequestOptions();

  constructor(private http: Http, private oauthService: OAuthService) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', "Token " + this.oauthService.getAccessToken());
    this.options = new RequestOptions({
      headers: headers
    });
  }

  create(payload:ProjectModel){
    return this.http.post(`${BASE_URL}/projects/`, payload, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  get(id:number) {
    return this.http.get(`${BASE_URL}/projects/${id}/`, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  update(payload:ProjectModel){
    return this.http.patch(`${BASE_URL}/projects/${payload.pk}/`, payload, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  delete(id:number){
    return this.http.delete(`${BASE_URL}/projects/${id}/`, this.options)
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
