export interface loginResult {
  usertoken: UserToken;
  logged: boolean;
  mfa: boolean;
  [key: string]: any
}

export interface UserToken {
  token: AccessToken;
  identity: Identity;
  TEMPORARY_TOKEN: string;
  MFA_AUTHENTICATED: boolean;
}

export class AccessToken {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  timestamp?: Date;
  status?: number;
  error?: string;
  error_description?: string;
  message?: string;
  path?: string;
}

export interface Identity {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  nickname?: string;
  password?: string;
  enabled?: boolean;
  preRegister?: boolean;
  mfaAuthenticated?: boolean;
  mfaEnabled?: boolean;
  idPlatformAccount: number;
  platformAccounts?: PlatformAccount[];
  platformAccountSelected?: PlatformAccount;
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
  accountNonLocked?: boolean;
  sessionKey?: string;
  currentTerm?: number;
}

export interface PlatformAccount {
  id: number;
  name: string;
  code: string;
  features: number[];
  authorities: Authority[];
  organizations: number[];
  account_organizations: AccountOrganization[];
  terms: UseTerms[];
  organizationsMultiple?: number[];
}

export interface Authority {
  authority: string;
}

export class AccountOrganization {
  createdBy?: any;
  createdDate?: any;
  lastModifiedBy?: any;
  lastModifiedDate?: any;
  id: number;
  identification: string = ''
  name: string = ''
  selectedName?:string = ''
  checked: boolean = false
}

export class UseTerms {
  id: number;
  idOrganization: number;
  idTerm: number;
  accept: boolean;
}


