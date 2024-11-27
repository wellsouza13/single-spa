import { Injectable } from "@angular/core";
import { BaseStorageService } from "../base-storage/base-storage.service";
import { PlatformAccount } from "../../services/auth-objects";

@Injectable({
  providedIn: "root",
})
export class StorageUserDetailsService {
  private readonly USER_DETAILS_KEY = "user_details";

  constructor(private baseStorageService: BaseStorageService) {}

  setUserDetails(userDetails: PlatformAccount): void {
    this.baseStorageService.setItem(this.USER_DETAILS_KEY, userDetails);
  }

  getUserDetails(): PlatformAccount {
    return this.baseStorageService.getItem(this.USER_DETAILS_KEY);
  }

  removeUserDetails(): void {
    this.baseStorageService.removeItem(this.USER_DETAILS_KEY);
  }
}
