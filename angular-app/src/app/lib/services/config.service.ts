import { Injectable, Inject } from '@angular/core';
import { Configs } from './general-objects';

@Injectable()
export class ConfigService {
  constructor(@Inject('Configs') private propMetadata: Configs) {}

  public get config(): Configs {
    return this.propMetadata;
  }
}
