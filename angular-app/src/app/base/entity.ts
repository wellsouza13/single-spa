export class Entity<T extends any> {
  id?: T = null;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class ListEntity<T extends any> extends Entity<T> {
  created = true;
  removed = false;
}
