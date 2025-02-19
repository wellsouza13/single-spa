import * as moment_ from 'moment';

import {
  AccessToken,
  AccountOrganization,
  Identity,
  PlatformAccount,
  UserToken,
  loginResult,
} from './auth-objects';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Data, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageUserDetailsService } from '../storage/storage-user-details/storage-user-details.service';
import { ConfigService } from './config.service';
import { MatDialog } from '@angular/material/dialog';

const moment = moment_;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private options: {
    headers?: HttpHeaders;
    observe?: 'body';
    params?: HttpParams;
    reportProgress?: boolean;
    responseType?: any;
    withCredentials?: boolean;
  } = {};

  private ACCESS_TOKEN_KEY = 'request_config';
  private USER_TOKEN_KEY = '_s';
  private REFRESH_AT_KEY = 'next_request';

  private accessToken: AccessToken;
  private userDetail: Identity;

  private userSubject: BehaviorSubject<Identity> = new BehaviorSubject(
    undefined
  );
  private userDetailEvent: Observable<Identity> =
    this.userSubject.asObservable();

  private refreshTimer: any = null;

  private fromForgotPassword = false;
  private forgotPasswordStatus = false;
  private forgotPasswordMessage: string = null;
  private updateIdentityEvent: Subject<boolean> = new Subject();
  private updateIdentityHandler: Observable<boolean> =
    this.updateIdentityEvent.asObservable();

  public whenIdentityUpdate(): Observable<boolean> {
    return this.updateIdentityHandler;
  }

  constructor(
    private http: HttpClient,
    private configs: ConfigService,
    private storageUserDetail: StorageUserDetailsService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.options.headers = new HttpHeaders()
      .set('no-error', 'true')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    this.options.responseType = 'json';
    this.retrieve();
  }

  protected getBackendUrl(): string {
    return this.configs.config.publicUrl + this.configs.config.tokenUrl;
  }

  public onUserDetail(): Observable<Identity> {
    return this.userDetailEvent;
  }

  public onReadyState(): Observable<boolean> {
    return of(this.accessToken !== undefined);
  }

  public login(
    username: string,
    password: string,
    recaptchaToken: string
  ): Observable<loginResult> {
    const urlEncoded = new HttpParams()
      .append('user', username)
      .append('password', password);

    this.options.headers = new HttpHeaders()
      .set('no-error', 'true')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('recaptcha', recaptchaToken ?? '-');

    const request = this.http
      .post<UserToken>(
        this.configs.config.publicUrl + this.configs.config.tokenUrl,
        urlEncoded.toString(),
        this.options
      )
      .pipe(
        map((userToken: any) => {
          if (userToken.TEMPORARY_TOKEN) {
            return {
              usertoken: userToken,
              logged: true,
              mfa: true,
            };
          }
          return {
            usertoken: userToken,
            logged: this.cacheAuthentication(userToken),
            mfa: false,
          };
        })
      );
    return request;
  }

  public loginWithMfa(token: UserToken) {
    this.cacheAuthentication(token);
  }

  private selectPlatformAccount(userDetail: Identity) {
    if (!userDetail.platformAccountSelected) {
      var platformAccountSelected = this.getAccountSelectedInStorage();
      if (!platformAccountSelected) {
        if (
          userDetail &&
          userDetail.platformAccounts &&
          userDetail.platformAccounts.length < 2
        ) {
          platformAccountSelected = userDetail.platformAccounts[0];
        }
      }
      userDetail.platformAccountSelected =
        platformAccountSelected || userDetail.platformAccounts[0];
      this.updateUserDetails(userDetail);
    }
  }

  public async updateUserDetails(userDetail: Identity): Promise<void> {
    return new Promise<void>((resolve) => {
      this.storageUserDetail.setUserDetails(userDetail.platformAccountSelected);
      this.userSubject.next(userDetail);
      resolve();
    });
  }

  private retrieve() {
    const now = moment();
    const expireIn = sessionStorage.getItem(this.REFRESH_AT_KEY);
    const userToken = sessionStorage.getItem(this.USER_TOKEN_KEY);
    if (!userToken || !expireIn) {
      return;
    }

    const expireMoment = moment(Number.parseInt(expireIn, 10));
    if (!expireMoment.isAfter(now)) {
      return;
    }

    this.accessToken = JSON.parse(userToken).token;
    this.userDetail = JSON.parse(userToken).identity;
    if (this.getAccountSelectedInStorage()) {
      this.userDetail.platformAccountSelected =
        this.getAccountSelectedInStorage();
    }
    this.refreshTimer = setTimeout(
      () => this.refreshToken(),
      expireMoment.diff(now, 'milliseconds')
    );

    this.updateUserDetails(this.userDetail);
  }

  public refreshToken(): void {
    const updatedOptions = {
      headers: this.options.headers.set('Content-Type', 'application/json'),
      responseType: this.options.responseType,
    };

    const body = this.userDetail.platformAccountSelected.organizations || [];
    this.http
      .post<UserToken>(
        `${this.configs.config.publicUrl}${this.configs.config.refreshTokenUrl}?token=${this.accessToken.refresh_token}`,
        body,
        updatedOptions
      )
      .subscribe(
        (userToken) => this.cacheAuthentication(userToken),
        () => this.cleanAuthentication()
      );
  }

  public updateIdentity() {
    let updatedOptions = this.options;
    updatedOptions = {
      headers: this.options.headers.set('Content-Type', 'application/json'),
      responseType: this.options.responseType,
      params: new HttpParams().append(
        'accessToken',
        this.accessToken.access_token
      ),
    };
    this.http
      .post<Identity>(
        this.getBackendUrl() + '/atualiza-identidade',
        this.userDetail.platformAccountSelected.organizations || [],
        updatedOptions
      )
      .subscribe(
        (identity) => {
          this.updateCacheAuthentication(identity);
          this.updateIdentityEvent.next(true);
        },
        () => {
          this.cleanAuthentication();
          this.updateIdentityEvent.next(false);
        }
      );
  }

  public logout() {
    const urlEncoded = new HttpParams().append(
      'token',
      this.accessToken.access_token
    );
    this.http
      .post<void>(
        this.configs.config.publicUrl + this.configs.config.invalidateTokenUrl,
        urlEncoded.toString(),
        this.options
      )
      .subscribe(
        () => this.cleanAuthentication(),
        () => this.cleanAuthentication()
      );
  }

  private getAccountSelectedInStorage(): PlatformAccount {
    return this.storageUserDetail.getUserDetails();
  }

  private cacheAuthentication(token: UserToken): boolean {
    this.selectPlatformAccount(token.identity);
    this.userDetail = token.identity || this.getUserTokenStorage().identity;
    this.accessToken = token.token;
    const now = moment();
    const timeout = this.calculateTimeout(this.accessToken.expires_in);
    const expiredDate = now.add(timeout, 'seconds');
    sessionStorage.setItem(this.REFRESH_AT_KEY, '' + expiredDate.valueOf());
    sessionStorage.setItem(this.USER_TOKEN_KEY, JSON.stringify(token));
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, this.accessToken.id_token);
    this.refreshAuthentication();
    return true;
  }

  private getUserTokenStorage(): UserToken {
    const token = sessionStorage.getItem(this.USER_TOKEN_KEY);
    return JSON.parse(token) as UserToken;
  }

  private updateCacheAuthentication(newIdentity: Identity): boolean {
    let userToken = JSON.parse(sessionStorage.getItem(this.USER_TOKEN_KEY));
    userToken.identity = newIdentity;
    return this.cacheAuthentication(userToken);
  }

  private refreshAuthentication() {
    this.clearRefreshTimer();
    const timeout = this.calculateTimeout(this.accessToken.expires_in);
    this.refreshTimer = setTimeout(() => this.refreshToken(), timeout * 1000);
  }

  private cleanAuthentication() {
    this.clearRefreshTimer();
    this.accessToken = undefined;
    this.userDetail = undefined;
    sessionStorage.clear();
    this.dialog.closeAll();
    this.router.navigateByUrl(this.configs.config.loginUrl);
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }

  private calculateTimeout(timeout: number): number {
    timeout = timeout - 60;
    if (timeout > 0) {
      return timeout;
    }
    return 0;
  }

  public forgot(email: string): Observable<any> {
    return this.http.post(
      this.configs.config.publicUrl + this.configs.config.resetPassword,
      { email }
    );
  }

  public isFromForgotPassword(): boolean {
    const fromForgotPassword = this.fromForgotPassword;
    this.fromForgotPassword = false;
    return fromForgotPassword;
  }

  public forgotStatusAndMessage(): { status: boolean; message: string } {
    return {
      status: this.forgotPasswordStatus,
      message: this.forgotPasswordMessage,
    };
  }

  public updateForgotStatus(status: boolean, message?: string): void {
    this.fromForgotPassword = true;
    this.forgotPasswordStatus = status;
    this.forgotPasswordMessage = message;
  }

  public validateAccess(roles: Data): boolean {
    const authority = roles.authority;

    return authority === 'none'
      ? true
      : !authority
      ? false
      : typeof authority === 'string'
      ? this.hasRole(authority)
      : Array.isArray(authority)
      ? this.hasRoles(authority)
      : false;
  }

  public hasRole(authority: string): boolean {
    if (
      !this.userDetail ||
      !this.userDetail.platformAccountSelected.authorities
    ) {
      return false;
    }
    return (
      this.userDetail.platformAccountSelected.authorities.find(
        (auth) => auth.authority === authority
      ) !== undefined
    );
  }

  public hasRoles(authorities: string[]) {
    if (
      !this.userDetail ||
      !this.userDetail.platformAccountSelected.authorities
    ) {
      return false;
    }
    for (let platformAuthority of this.userDetail.platformAccountSelected
      .authorities) {
      for (let authority of authorities) {
        if (platformAuthority.authority === authority) {
          return true;
        }
      }
    }

    return false;
  }

  public hasFeature(feature: number): boolean {
    if (!this.userDetail || !this.userDetail.platformAccountSelected.features) {
      return false;
    }
    return (
      this.userDetail.platformAccountSelected.features.find(
        (featureId) => featureId === feature
      ) !== undefined
    );
  }

  public isAuthenticated(): boolean {
    return this.accessToken !== undefined;
  }

  public updateActiveOrganizations(organizations: Array<number>) {
    const userToken: UserToken = JSON.parse(
      sessionStorage.getItem(this.USER_TOKEN_KEY)
    );

    if (!userToken) {
      return;
    }
    this.userDetail.platformAccountSelected.organizations = organizations;
    if (!userToken.identity.platformAccountSelected)
      userToken.identity.platformAccountSelected =
        this.userDetail.platformAccountSelected;
    else
      userToken.identity.platformAccountSelected.organizations = organizations;

    sessionStorage.removeItem(this.USER_TOKEN_KEY);
    sessionStorage.setItem(this.USER_TOKEN_KEY, JSON.stringify(userToken));
    this.updateUserDetails(this.userDetail);
  }

  public updateActiveOrganizationMultiple(organizations: Array<number>) {
    const userToken: UserToken = JSON.parse(
      sessionStorage.getItem(this.USER_TOKEN_KEY)
    );

    if (!userToken) {
      return;
    }
    this.userDetail.platformAccountSelected.organizationsMultiple =
      organizations;
    userToken.identity.platformAccountSelected.organizationsMultiple =
      organizations;

    sessionStorage.removeItem(this.USER_TOKEN_KEY);
    sessionStorage.setItem(this.USER_TOKEN_KEY, JSON.stringify(userToken));
    this.updateUserDetails(this.userDetail);
  }

  get isReady(): boolean {
    return this.userDetail !== undefined;
  }

  get userID(): number {
    return this.userDetail && this.userDetail.id;
  }

  get userInfo(): Identity {
    return this.userDetail || { idPlatformAccount: 0 };
  }

  get organizations(): number[] {
    return (
      this.userDetail.platformAccountSelected &&
      this.userDetail.platformAccountSelected.organizations
    );
  }

  get accessDetail(): AccessToken {
    return this.accessToken;
  }

  get accountOrganizations(): AccountOrganization[] {
    return (
      this.userDetail &&
      this.userDetail.platformAccountSelected.account_organizations
    );
  }

  get organizationsMultiple(): number[] {
    return (
      this.userDetail &&
      this.userDetail.platformAccountSelected.organizationsMultiple
    );
  }
}
