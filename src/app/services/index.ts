import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import {OAuthService} from "./oauthservice/auth-service.service";

export * from './oauthservice/auth-service.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class OAuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OAuthModule,
      providers: [OAuthService]
    };
  }
}
