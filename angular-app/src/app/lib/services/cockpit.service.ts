import { Injectable } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from "@angular/router";
import * as moment_ from "moment";
import { Moment } from "moment";
import "moment-timezone";
import { BehaviorSubject, Observable, timer } from "rxjs";
import { filter } from "rxjs/operators";
import { AuthService } from "./auth-service.service";
import { ConfigService } from "./config.service";
import { OrganizationDto } from "./general-objects";
import { OrganizationService } from "./organization.service";
const moment = moment_;

@Injectable({
  providedIn: "root",
})
export class CockpitService {
  private $organizations: BehaviorSubject<number[]> = new BehaviorSubject([]);
  private $organization: BehaviorSubject<OrganizationDto> = new BehaviorSubject(
    new OrganizationDto()
  );
  private $date: BehaviorSubject<Moment>;
  private timer: Observable<Moment>;
  private $lastViewUrl = "";
  private $navigateViewUrl = "";
  private $activeViewUrl = "";

  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private auth: AuthService,
    private configs: ConfigService
  ) {
    this.$date = new BehaviorSubject(moment());
    this.timer = this.$date
      .asObservable()
      .pipe(filter((date) => date !== undefined));
    timer(1000, 1000).subscribe(() => this.updateTime());
    this.router.events.subscribe((event) =>
      this.routerEvents(event as RouterEvent)
    );
    this.auth.onUserDetail().subscribe(() => {
      if (
        auth.userInfo &&
        auth.userInfo.platformAccountSelected &&
        auth.userInfo.platformAccountSelected.organizations &&
        auth.userInfo.platformAccountSelected.organizations.length > 0
      ) {
        this.loadOrganization(
          auth.userInfo.platformAccountSelected.organizations[0]
        );
      }
    });
  }

  private routerEvents(event: RouterEvent) {
    if (event instanceof NavigationStart) {
      this.$lastViewUrl = this.$activeViewUrl;
      this.$navigateViewUrl = event.url;
    }
    if (event instanceof NavigationEnd) {
      this.$activeViewUrl = event.urlAfterRedirects || event.url;
      if (this.$activeViewUrl === "/" || this.$activeViewUrl === "") {
        if (this.auth.isAuthenticated()) {
          setTimeout(() => this.gotoHome(), 100);
        } else {
          this.router.navigateByUrl(this.configs.config.loginUrl);
        }
      }
    }
    if (event instanceof NavigationCancel) {
    }
    if (event instanceof NavigationError) {
    }
  }

  public get lastViewUrl(): string {
    return this.$lastViewUrl;
  }

  public get navigateViewUrl(): string {
    return this.$navigateViewUrl;
  }

  public get activeViewUrl(): string {
    return this.$activeViewUrl;
  }

  private updateTime() {
    this.$date.next(moment());
  }

  get now(): Moment {
    return this.$date.getValue().clone();
  }

  get formattedNow(): string {
    return this.$date.getValue().format(this.configs.config.dateFormat);
  }

  formatDate(date: Moment, format?: string): string {
    return date.format(format || this.configs.config.dateFormat);
  }

  parseDate(date: string, format?: string): Moment {
    return moment(date, format || this.configs.config.dateFormat);
  }

  onTimer(): Observable<Moment> {
    return this.timer;
  }

  get organizations(): number[] {
    return this.$organizations.getValue();
  }

  set organizations(orgs: number[]) {
    this.$organizations.next(orgs);
  }

  get organization(): OrganizationDto {
    return this.$organization.getValue();
  }

  set organization(org: OrganizationDto) {
    this.$organization.next(org);
  }

  changedOrganizationValue(): Observable<OrganizationDto> {
    return this.$organization.asObservable();
  }

  changedOrganizationArrayValue(): Observable<number[]> {
    return this.$organizations.asObservable();
  }

  loadOrganization(id: number) {
    this.organizationService.get(id).subscribe((organization) => {
      this.$organization.next(organization);
    });
  }

  loadOrganizations(ids: number[]) {
    this.$organizations.next(ids);
  }

  gotoHome() {
    if (this.auth.hasFeature(32)) {
      this.router.navigateByUrl("/risco-sacado/financiador/home");
      return;
    }
    const home = this.configs.config.home;
    for (const role in home) {
      if (this.auth.hasRole(role)) {
        this.router.navigateByUrl(home[role]);
        return;
      }
    }
    this.router.navigateByUrl(this.configs.config.homeNotFound);
  }

  public gotoUserInfo() {
    this.router.navigateByUrl(this.configs.config.userInfoUrl);
  }

  public gotoResetPassword() {
    this.router.navigateByUrl(this.configs.config.resetPasswordUrl);
  }
}
