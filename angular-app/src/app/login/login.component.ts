import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstraintService } from '../components/constraint.service';
import { AuthService } from '../lib/services/auth-service.service';
import { CockpitService } from '../lib/services/cockpit.service';
import { Identity, loginResult } from '../lib/services/auth-objects';
import { MatDialog } from '@angular/material/dialog';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { BaseViewComponent } from '../components/base-view/base-view.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [ConstraintService],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseViewComponent {
  username = 'vanessa.rodrigues@trabalhandocomakaspper.com.br';
  password = 'Veragi@123';
  isLoading = false;
  loginError = false;
  forgotError = false;
  forgotSuccess = false;
  forgotMessage = null;
  showPassword = false;
  plataformAccountsMfa = [];
  onboarding: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private cockpit: CockpitService,
    private authService: AuthService,
    private dialog: MatDialog,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    super();
    if (this.auth.isFromForgotPassword()) {
      this.forgotMessage = this.auth.forgotStatusAndMessage().message;
      this.forgotError = !this.auth.forgotStatusAndMessage().status;
      this.forgotSuccess = this.auth.forgotStatusAndMessage().status;
    }
  }

  login() {
    this.loginError = false;
    this.isLoading = true;
    this.recaptchaV3Service.execute('login').subscribe({
      next: (token) => {
        this.auth.login(this.username, this.password, token).subscribe(
          (result) => this.gotoOverview(result),
          () =>
            this.gotoOverview({ logged: false, mfa: false, usertoken: null })
        );
      },
      error: (err) => {
        console.error('reCAPTCHA error:', err);
      },
    });
  }

  gotoOverview(login: loginResult) {
    console.log('caiu', login);
    if (!login.logged) {
      this.isLoading = false;
      this.loginError = true;
      return;
    }

    if (!login.mfa) {
      // this.saveHotJar(login.usertoken.identity);

      this.proceedToLogin();
      return;
    }

    const temporaryToken = login.usertoken.TEMPORARY_TOKEN;
    const email_required = login.usertoken.EMAIL_REQUIRED;
    const mfa_authenticated = login.usertoken.MFA_AUTHENTICATED;
    if (temporaryToken && mfa_authenticated) {
      // const d = this.dialog.open(MfaVerifyDialogComponent, {
      //   data: {
      //     user: {
      //       temporaryToken,
      //     },
      //   },
      // });
      let d;
      const dialogTimeout = setTimeout(() => {
        d.close();
        this.isLoading = false;
      }, 300000);

      d.afterClosed().subscribe((res: any) => {
        clearTimeout(dialogTimeout);
        if (res) {
          this.gotoOverview({
            usertoken: res.verifyToken,
            logged: true,
            mfa: false,
          });
          this.auth.loginWithMfa(res.verifyToken);
          this.plataformAccountsMfa =
            res.verifyToken.identity.platformAccounts.verifyToken;

          // this.saveHotJar(res.verifyToken.identity);
          this.proceedToLogin();
        }
      });
      return;
    }

    if (temporaryToken && !mfa_authenticated && !email_required) {
      // const d = this.dialog.open(MfaSetupDialogComponent, {
      //   data: {
      //     temporaryToken,
      //   },
      // });
      let d: any;

      const dialogTimeout = setTimeout(() => {
        d.close();
        this.isLoading = false;
      }, 300000);

      d.afterClosed().subscribe((res) => {
        clearTimeout(dialogTimeout);
        if (res) {
          this.gotoOverview({
            usertoken: res.verifyToken,
            logged: true,
            mfa: false,
          });
          this.auth.loginWithMfa(res.verifyToken);
          // this.saveHotJar(res.verifyToken.identity);
          this.plataformAccountsMfa =
            res.verifyToken.identity.platformAccounts.verifyToken;
          this.proceedToLogin();
        }
      });
      return;
    }

    if (email_required) {
      // const d = this.dialog.open(EmailRequiredDialogComponent, {
      //   width: '596px',
      //   height: '431px',
      //   data: {
      //     user: {
      //       temporaryToken,
      //     },
      //   },
      // });

      let d;

      const dialogTimeout = setTimeout(() => {
        d.close();
        this.isLoading = false;
      }, 300000);

      d.afterClosed().subscribe((res: any) => {
        clearTimeout(dialogTimeout);
        this.isLoading = false;
        if (res) {
          this.gotoOverview({
            usertoken: res,
            logged: true,
            mfa:
              res?.MFA_AUTHENTICATED === true
                ? true
                : res?.MFA_AUTHENTICATED === false
                ? true
                : false,
          });
          this.auth.loginWithMfa(res);
          // this.saveHotJar(res.identity);
          this.proceedToLogin();
        }
      });
      return;
    }
  }

  proceedToLogin() {
    if (
      this.auth.userInfo.platformAccounts ||
      this.plataformAccountsMfa.length
    ) {
      const accs =
        this.auth.userInfo.platformAccounts ?? this.plataformAccountsMfa;
      let features = [];
      accs
        .map((acc) => acc.features)
        .forEach((feature) => (features = features.concat(feature)));
      if (features.length > 0) {
        this.navigateToTermsOrCompanyList();
        return;
      }
    }
    this.navigateToWelcome();
  }

  navigateToTermsOrCompanyList() {
    const platformAccountsLength = this.auth.userInfo.platformAccounts.length;
    if (platformAccountsLength > 1) {
      this.navigateToCompanyList();
      return;
    }

    this.goToHome();
  }

  private navigateToTerms() {
    const terms = this.auth.userInfo.platformAccountSelected.terms;
    if (terms.length > 1) {
      const generic = terms.find((term) => term.idTerm === 9);
      if (generic && !generic.accept) {
        this.auth.userInfo.currentTerm = generic.id;
        this.router.navigate(['termo-de-uso/plataforma'], {
          relativeTo: this.route.root,
        });
        return;
      }
    } else {
      const generic = terms.find((term) => term.idTerm === 9);
      const specific = terms.find((term) => term.idTerm === 10);
      if (generic && !generic.accept) {
        this.auth.userInfo.currentTerm = generic.id;
        this.router.navigate(['termo-de-uso/plataforma'], {
          relativeTo: this.route.root,
        });
      } else if (specific && !specific.accept) {
        this.auth.userInfo.currentTerm = terms[0].id;
        this.router.navigate(['termo-de-uso/trial'], {
          relativeTo: this.route.root,
        });
      }
    }
  }

  private navigateToCompanyList() {
    console.log('🚀 Navegando para company/company-list...');
    this.router.navigate(['/company/company-list']); // 🔹 Adicione a barra inicial `/`
  }

  private navigateToWelcome() {
    this.router.navigate(['boas-vindas'], { relativeTo: this.route.root });
  }

  public async goToHome(): Promise<void> {
    const identity: Identity = this.authService.userInfo;
    await this.authService.updateUserDetails(identity);
    await this.updateOrganizationsForAccountInSession();

    const terms = this.auth.userInfo.platformAccountSelected.terms;
    if (terms.length > 0) {
      this.navigateToTerms();
      return;
    }

    this.cockpit.gotoHome();
  }

  private updateOrganizationsForAccountInSession(): Promise<any> {
    const identity: Identity = this.authService.userInfo;
    return this.accountService
      .updateOrganizationsToken(
        identity.email,
        identity.platformAccountSelected.organizations
      )
      .toPromise();
  }

  isOnboarding() {
    return this.onboarding;
  }

  gotoForgotPassword() {
    this.router.navigate(['esqueci-a-senha'], { relativeTo: this.route });
  }
  public toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  clearLogin() {
    this.cockpit.organizations = [];
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
  }

  saveHotJar(data: any) {
    const user = data;
    const userId = user.id;
    const username = user.name;
    const email = user.email;
    const accs = user.platformAccounts;
    let orgs = [];
    accs
      .map((acc) => acc.account_organizations)
      .forEach((org) => (orgs = orgs.concat(org)));
    const organizationsName = orgs.map((o) => o.name).join(';');
    const organizationsIdentification = orgs
      .map((o) => o.identification)
      .join(';');
    const w = window as any;

    w.hj('identify', userId, {
      username: username,
      email: email,
      organizationsName: organizationsName,
      organizationsIdentification: organizationsIdentification,
    });
  }
}
