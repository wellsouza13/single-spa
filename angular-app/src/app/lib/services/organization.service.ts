import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationDto } from './general-objects';
import { ConfigService } from './config.service';
import { BaseCrudService } from 'src/app/base/crud-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends BaseCrudService<number, OrganizationDto, OrganizationDto, OrganizationDto> {
  constructor(
    private httpClient: HttpClient,
    private configs: ConfigService
  ) {
    super('/organizacao/v3', httpClient);
  }

  protected getBackendUrl(): string {
    return this.configs.config.commonsUrl;
  }

}
