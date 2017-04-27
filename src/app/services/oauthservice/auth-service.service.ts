//Courtesy of https://github.com/manfredsteyer/angular-oauth2-oidc with some slight changes
//TODO: Do some more cleanup in below code. and remove unused methods
import {Base64} from 'js-base64';
import {fromByteArray} from 'base64-js';
import * as _sha256 from 'sha256';
import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';

let sha256: any = _sha256;

@Injectable()
export class OAuthService {

  public clientId = "";
  public redirectUri = "";
  public loginUrl = "";
  public scope = "";
  public resource = "";
  public rngUrl = "";
  public options: any;
  public state = "";
  public issuer = "";
  public validationHandler: any;
  public logoutUrl = "";
  public clearHashAfterLogin: boolean = true;
  public tokenEndpoint: string;
  public userinfoEndpoint: string;

  public discoveryDocumentLoaded: boolean = false;
  public discoveryDocumentLoaded$: Observable<any>;
  private discoveryDocumentLoadedSender: Observer<any>;

  private grantTypesSupported: Array<string> = [];

  public setStorage(storage: Storage) {
    this._storage = storage;
  }

  private _storage: Storage = localStorage;

  constructor(private http: Http) {
    this.discoveryDocumentLoaded$ = Observable.create(sender => {
      this.discoveryDocumentLoadedSender = sender;
    }).publish().connect();
  }

  fetchTokenUsingPasswordFlow(userName: string, password: string) {
    return new Promise((resolve, reject) => {
      let params = {
        "username": userName,
        "password": password,
        "scope": this.scope,
      };

      let headers = new Headers();
      headers.set('Content-Type', 'application/json');

      this.http.post(this.tokenEndpoint, params, {headers}).map(r => r.json()).subscribe(
        (tokenResponse) => {
          console.debug('tokenResponse', tokenResponse);
          this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);

          resolve(tokenResponse);
        },
        (err) => {
          console.error('Error performing password flow', err);
          reject(err);
        }
      );
    });
  }

  callEventIfExists(options: any) {
    let that = this;
    if (options.onTokenReceived) {
      let tokenParams = {
        idClaims: that.getIdentityClaims(),
        idToken: that.getIdToken(),
        accessToken: that.getAccessToken(),
        state: that.state
      };
      options.onTokenReceived(tokenParams);
    }
  }

  private storeAccessTokenResponse(accessToken: string, refreshToken: string, expiresIn: number) {
    this._storage.setItem("access_token", accessToken);

    if (expiresIn) {
      let expiresInMilliSeconds = expiresIn * 1000;
      let now = new Date();
      let expiresAt = now.getTime() + expiresInMilliSeconds;
      this._storage.setItem("expires_at", "" + expiresAt);
    }

    if (refreshToken) {
      this._storage.setItem("refresh_token", refreshToken);
    }
  }

  tryLogin(options) {

    options = options || {};


    let parts = this.getFragment();

    let accessToken = parts["access_token"];
    let idToken = parts["id_token"];
    let state = parts["state"];

    let oauthSuccess = false;

    if (!accessToken || !state) return false;

    let savedNonce = this._storage.getItem("nonce");

    let stateParts = state.split(';');
    let nonceInState = stateParts[0];
    if (savedNonce === nonceInState) {
      this.storeAccessTokenResponse(accessToken, null, parts['expires_in']);
      if (stateParts.length > 1) {
        this.state = stateParts[1];
      }
      oauthSuccess = true;
    }

    if (!oauthSuccess) return false;

    if (options.validationHandler) {

      let validationParams = {accessToken: accessToken, idToken: idToken};

      options
        .validationHandler(validationParams)
        .then(() => {
          this.callEventIfExists(options);
        })
        .catch(function (reason) {
          console.error('Error validating tokens');
          console.error(reason);
        })
    }
    else {
      this.callEventIfExists(options);
    }

    if (this.clearHashAfterLogin) location.hash = '';

    return true;
  };

  getIdentityClaims() {
    let claims = this._storage.getItem("id_token_claims_obj");
    if (!claims) return null;
    return JSON.parse(claims);
  }

  getIdToken() {
    return this._storage.getItem("id_token");
  }

  getAccessToken() {
    return this._storage.getItem("access_token");
  };

  hasValidAccessToken() {
    if (this.getAccessToken()) {
      let expiresAt = this._storage.getItem("expires_at");
      let now = new Date();
      return !(expiresAt && parseInt(expiresAt) < now.getTime());
    }
    return false;
  };

  authorizationHeader() {
    return "Bearer " + this.getAccessToken();
  }

  logOut(noRedirectToLogoutUrl: boolean = false) {
    let id_token = this.getIdToken();
    this._storage.removeItem("access_token");
    this._storage.removeItem("id_token");
    this._storage.removeItem("refresh_token");
    this._storage.removeItem("nonce");
    this._storage.removeItem("expires_at");
    this._storage.removeItem("id_token_claims_obj");
    this._storage.removeItem("id_token_expires_at");

    if (!this.logoutUrl) return;
    if (noRedirectToLogoutUrl) return;

    let logoutUrl: string;

    // For backward compatibility
    if (this.logoutUrl.indexOf('{{') > -1) {
      logoutUrl = this.logoutUrl.replace(/\{\{id_token\}\}/, id_token);
    }
    else {
      logoutUrl = this.logoutUrl + "?id_token_hint="
        + encodeURIComponent(id_token)
        + "&post_logout_redirect_uri="
        + encodeURIComponent(this.redirectUri);
    }
    location.href = logoutUrl;
  };

  createAndSaveNonce() {
    let that = this;
    return this.createNonce().then(function (nonce: any) {
      that._storage.setItem("nonce", nonce);
      return nonce;
    })
  };

  createNonce() {
    return new Promise((resolve, reject) => {
      if (this.rngUrl) {
        throw new Error("createNonce with rng-web-api has not been implemented so far");
      }
      else {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 40; i++)
        {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        resolve(text);
      }
    });
  };

  getFragment() {
    if (window.location.hash.indexOf("#") === 0) {
      return this.parseQueryString(window.location.hash.substr(1));
    } else {
      return {};
    }
  };

  parseQueryString(queryString) {
    let data = {}, pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

    if (queryString === null) {
      return data;
    }

    pairs = queryString.split("&");

    for (let i = 0; i < pairs.length; i++) {
      pair = pairs[i];
      separatorIndex = pair.indexOf("=");

      if (separatorIndex === -1) {
        escapedKey = pair;
        escapedValue = null;
      } else {
        escapedKey = pair.substr(0, separatorIndex);
        escapedValue = pair.substr(separatorIndex + 1);
      }

      key = decodeURIComponent(escapedKey);
      value = decodeURIComponent(escapedValue);

      if (key.substr(0, 1) === '/')
        key = key.substr(1);

      data[key] = value;
    }

    return data;
  };


  checkAtHash(accessToken, idClaims) {
    if (!accessToken || !idClaims || !idClaims.at_hash) return true;
    let tokenHash: Array<any> = sha256(accessToken, {asBytes: true});
    let leftMostHalf = tokenHash.slice(0, (tokenHash.length / 2));
    let tokenHashBase64 = fromByteArray(leftMostHalf);
    let claimsAtHash = idClaims.at_hash.replace(/=/g, "");

    let atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

    if (atHash != claimsAtHash) {
      console.warn("exptected at_hash: " + atHash);
      console.warn("actual at_hash: " + claimsAtHash);
    }
    return (atHash == claimsAtHash);
  }
}
