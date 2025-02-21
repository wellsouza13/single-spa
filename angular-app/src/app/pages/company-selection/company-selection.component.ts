import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ConstraintService } from 'src/app/components/constraint.service';
import { BaseViewComponent } from 'src/app/components/base-view/base-view.component';
import { AuthService } from 'src/app/lib/services/auth-service.service';
import { CockpitService } from 'src/app/lib/services/cockpit.service';
import { sessionIds } from 'src/app/constants';
import { Identity, PlatformAccount } from 'src/app/lib/services/auth-objects';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-company-selection',
  templateUrl: './company-selection.component.html',
  styleUrls: ['./company-selection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConstraintService],
})
export class CompanySelectionComponent
  extends BaseViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  accounts: any[];
  selectedAccount: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private cockpitService: CockpitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  public sessionIds = sessionIds;

  ngAfterViewInit() {
    this.sessionIds.forEach((sessionId) => localStorage.removeItem(sessionId));
  }

  ngOnInit(): void {
    const selectedOrganization = localStorage.getItem('organization');

    if (selectedOrganization) {
      const account = this.authService.userInfo.platformAccounts.find((acc) =>
        acc.organizations.includes(parseInt(selectedOrganization, 10))
      );

      if (account) {
        this.onSelectUrl(account);
        return;
      }
    }

    this.accounts = this.authService.userInfo.platformAccounts.map(
      (platformAccount: PlatformAccount) => ({
        ...platformAccount,
        hovered: false,
      })
    );
  }

  public async onSelectUrl(account: any): Promise<void> {
    const identity: Identity = this.authService.userInfo;
    identity.platformAccountSelected = account;

    await this.authService.updateUserDetails(identity);
    await this.updateOrganizationsForAccountInSession();

    const terms = this.authService.userInfo.platformAccountSelected.terms;

    if (terms.length > 0) {
      this.navigateToTerms();
      return;
    }

    const organization = localStorage.getItem('organization');
    const hash = localStorage.getItem('hash');

    this.router.navigate(['/configuracoes'], {
      queryParams: { organization, hash },
    });
  }

  public async onSelect(account: any): Promise<void> {
    const identity: Identity = this.authService.userInfo;
    identity.platformAccountSelected = account;
    await this.authService.updateUserDetails(identity);
    await this.updateOrganizationsForAccountInSession();
    const terms = this.authService.userInfo.platformAccountSelected.terms;
    if (terms.length > 0) {
      this.navigateToTerms();
      return;
    }
    this.cockpitService.gotoHome();
  }

  public navigateToTerms() {
    const terms = this.authService.userInfo.platformAccountSelected.terms;
    if (terms.length > 1) {
      const generic = terms.find((term) => term.idTerm === 9);
      if (generic && !generic.accept) {
        this.authService.userInfo.currentTerm = generic.id;
        this.router.navigate(['termo-de-uso/plataforma'], {
          relativeTo: this.route.root,
        });
        return;
      }
    } else {
      const generic = terms.find((term) => term.idTerm === 9);
      const specific = terms.find((term) => term.idTerm === 10);
      if (generic && !generic.accept) {
        this.authService.userInfo.currentTerm = generic.id;
        this.router.navigate(['termo-de-uso/plataforma'], {
          relativeTo: this.route.root,
        });
      } else if (specific && !specific.accept) {
        this.authService.userInfo.currentTerm = terms[0].id;
        this.router.navigate(['termo-de-uso/trial'], {
          relativeTo: this.route.root,
        });
      }
    }
  }

  public onHover(account: any, hovered: boolean): void {
    account.hovered = hovered;
    this.selectedAccount = hovered ? account : null;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
