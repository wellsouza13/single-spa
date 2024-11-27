import { Entity } from "src/app/base/entity";

export class Configs {
  commonsUrl?: string;
  [prop: string]: any;
}

export class OrganizationDto extends Entity<number> {
  name: string;
  identification: string;
  businessActivity: string;
  businessActivityDenomination: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  complement: string;
  postalCode: string;
  city: CityDto = new CityDto();
  cityName: string;
  stateName: string;
  cityDenomination: string;
  state: StateDto = new StateDto();
  status: string;
}

export class CityDto extends Entity<number> {
  name: string;
  state: number;
}

export class StateDto extends Entity<number> {
  id: number;
  name: string;
  initials: string;
}

export interface PowerBiMenu {
  id: number;
  name: string;
  active?: any;
  reports?: any;
  lastUpdateDate?: any;
  lastUpdateUser?: any;
}
