import { Constraint } from '../inputs/input-objects';
import { PageFilter, Page } from '../../base/page';
import { Observable } from 'rxjs';
import { isNumber, isString } from 'src/app/base/helper';

export enum MaskTypesEnum {
  TEXT,
  CPF,
  HOUR,
  CNPJ,
  CPF_OR_CNPJ,
  RG,
  FIELD,
  TELEPHONE,
  CELLPHONE,
  CEP,
  INTEGER_NUMBER,
  FLOAT_NUMBER,
  FINANCY_NUMBER,
  DATE,
  EMAIL, // FIXME não usar esse campo pois precisa ser aprimorado
  AGENCY,
  AGENCY_SHORT,
  ACCOUNT,
  ACCOUNT_SHORT,
  TOKEN_MFA,
  ONLY_NUMBERS,
  BAR_CODE,
  PHONE_OR_TELEPHONE,
  ROOT_CNPJ,
  ISPB,
  COMPE,
}



export class BaseViewComponent {
  createLookupTableData(
    lookupTableData: (pageWithFilter: PageFilter<any>) => Observable<Page<any>>
  ):any {
    return { lookupTableData };
  }

  get maskTypes() {
    return MaskTypesEnum;
  }

  protected actualDate(): Date {
    return new Date();
  }

  protected isNullOrUndefined(value: any) {
    return value === undefined || value === null;
  }

  protected applyValidator(
    type: MaskTypesEnum,
    value: string,
    minLength?: number,
    maxLength?: number
  ): boolean {
    if (this.isNullOrUndefined(value)) {
      return true;
    }
    switch (type) {
      case MaskTypesEnum.CPF:
        return this.isValidCPF(value);
      case MaskTypesEnum.CNPJ:
        return this.isValidCNPJ(value);
      case MaskTypesEnum.RG:
        return this.isValidRG(value);
      case MaskTypesEnum.CPF_OR_CNPJ:
        return this.isValidCNPJ(value) || this.isValidCPF(value);
      case MaskTypesEnum.INTEGER_NUMBER:
      case MaskTypesEnum.FLOAT_NUMBER:
        return this.isValidNumber(value);
      case MaskTypesEnum.TELEPHONE:
      case MaskTypesEnum.CELLPHONE:
      case MaskTypesEnum.CEP:
        return this.isValidStringNumberByLength(value, minLength, maxLength);
      case MaskTypesEnum.EMAIL:
        return this.isValidEmail(value);
      default:
        return true;
    }
  }

  protected isValidEmail(value: string): boolean {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      value
    );
  }

  protected isEmpty(value: string) {
    return (
      this.isNullOrUndefined(value) ||
      (isString(value) && value.trim().length === 0) ||
      false
    );
  }

  protected hasNumber(value: number) {
    return isNumber(value);
  }

  protected isValidStringNumberByLength(
    value: string,
    minLength: number,
    maxLength: number
  ) {
    value = value.replace(/[^\d]+/g, '');
    return minLength <= value.length && value.length <= maxLength;
  }

  private validateNumberDigitsEquals(value: string): boolean {
    let equals = true;

    for (let i = 0; i < value.length - 1; i++) {
      if (value.charAt(i) !== value.charAt(i + 1)) {
        equals = false;
        break;
      }
    }
    return equals;
  }

  protected isValidCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || this.validateNumberDigitsEquals(cpf)) {
      return false;
    }

    let numbers = cpf.substring(0, 9);
    const digits = cpf.substring(9);
    let i = 0;
    let sum = 0;
    let result = 0;

    for (i = 10; i > 1; i--) {
      sum += Number.parseInt(numbers.charAt(10 - i), 10) * i;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number.parseInt(digits.charAt(0), 10)) {
      return false;
    }

    numbers = cpf.substring(0, 10);
    sum = 0;

    for (i = 11; i > 1; i--) {
      sum += Number.parseInt(numbers.charAt(11 - i), 10) * i;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return result === Number.parseInt(digits.charAt(1), 10);
  }

  protected isValidCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || this.validateNumberDigitsEquals(cnpj)) {
      return false;
    }

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * position--;
      if (position < 2) {
        position = 9;
      }
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number.parseInt(digits.charAt(0), 10)) {
      return false;
    }

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * position--;
      if (position < 2) {
        position = 9;
      }
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === Number.parseInt(digits.charAt(1), 10);
  }

  protected isValidRG(rg: string) {
    rg = rg.replace(/[^\dxX]+/g, '');
    if (rg.length !== 9) {
      return false;
    }

    const numbers = rg.substring(0, 8);
    const digits = rg.substring(8);

    if (this.validateNumberDigitsEquals(numbers)) {
      return false;
    }

    let sum = 0;
    let result = 0;

    for (let i = 9; i > 1; i--) {
      sum += Number.parseInt(numbers.charAt(i - 2), 10) * i;
    }

    sum +=
      digits.toUpperCase() === 'X' ? 1000 : Number.parseInt(digits, 10) * 100;
    result = sum % 11;

    return result === 0;
  }

  protected isValidNumber(value: any) {
    return isNumber(value) || !isNaN(Number(value));
  }

  protected requiredConstraint(
    message: string = 'Campo Obrigatório'
  ): Constraint {
    return {
      type: 'required',
      message,
      apply: (value) => !this.isEmpty(value),
    };
  }

  protected maskConstraint(
    message: string = 'Campo inválido',
    type: MaskTypesEnum = MaskTypesEnum.TEXT
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) => this.isEmpty(value) || this.applyValidator(type, value),
    };
  }

  protected customConstraint(
    message: string,
    apply: (model: any) => boolean
  ): Constraint {
    return {
      type: 'custom',
      message,
      apply,
    };
  }

  protected requiredCpfConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) => this.applyValidator(MaskTypesEnum.CPF, value),
      },
    ];
  }

  protected notRequiredCpfConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) || this.applyValidator(MaskTypesEnum.CPF, value),
    };
  }

  protected requiredCnpjConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) => this.applyValidator(MaskTypesEnum.CNPJ, value),
      },
    ];
  }

  protected notRequiredCnpjConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) || this.applyValidator(MaskTypesEnum.CNPJ, value),
    };
  }

  protected requiredCpfCnpjConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) => this.applyValidator(MaskTypesEnum.CPF_OR_CNPJ, value),
      },
    ];
  }

  protected notRequiredCpfCnpjConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) ||
        this.applyValidator(MaskTypesEnum.CPF_OR_CNPJ, value),
    };
  }

  protected requiredRGConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) => this.applyValidator(MaskTypesEnum.RG, value),
      },
    ];
  }

  protected notRequiredRGConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) || this.applyValidator(MaskTypesEnum.RG, value),
    };
  }

  protected requiredIntegerConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) =>
          this.applyValidator(MaskTypesEnum.INTEGER_NUMBER, value),
      },
    ];
  }

  protected notRequiredIntegerConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        !this.hasNumber(value) ||
        this.applyValidator(MaskTypesEnum.INTEGER_NUMBER, value),
    };
  }

  protected requiredFloatConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) =>
          this.applyValidator(MaskTypesEnum.FLOAT_NUMBER, value),
      },
    ];
  }

  protected notRequiredFloatConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        !this.hasNumber(value) ||
        this.applyValidator(MaskTypesEnum.FLOAT_NUMBER, value),
    };
  }

  protected requiredTelephoneConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) =>
          this.applyValidator(MaskTypesEnum.TELEPHONE, value, 10, 10),
      },
    ];
  }

  protected notRequiredTelephoneConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) ||
        this.applyValidator(MaskTypesEnum.TELEPHONE, value, 10, 10),
    };
  }

  protected requiredCellphoneConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) =>
          this.applyValidator(MaskTypesEnum.CELLPHONE, value, 11, 11),
      },
    ];
  }

  protected notRequiredCellphoneConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) ||
        this.applyValidator(MaskTypesEnum.CELLPHONE, value, 11, 11),
    };
  }

  protected requiredCEPConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) => this.applyValidator(MaskTypesEnum.CEP, value, 8, 8),
      },
    ];
  }

  protected requiredPhoneConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) =>
          this.applyValidator(MaskTypesEnum.TELEPHONE, value, 10, 10) ||
          this.applyValidator(MaskTypesEnum.CELLPHONE, value, 11, 11),
      },
    ];
  }

  protected notRequiredPhoneConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) ||
        this.applyValidator(MaskTypesEnum.TELEPHONE, value, 10, 10) ||
        this.applyValidator(MaskTypesEnum.CELLPHONE, value, 11, 11),
    };
  }

  protected notRequiredCEPConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) ||
        this.applyValidator(MaskTypesEnum.CEP, value, 8, 8),
    };
  }

  protected requiredEmailConstraint(
    requiredMessage: string = 'Campo Obrigatório',
    message: string = 'Campo inválido'
  ): Constraint[] {
    return [
      this.requiredConstraint(requiredMessage),
      {
        type: 'mask',
        message,
        apply: (value) => this.applyValidator(MaskTypesEnum.EMAIL, value),
      },
    ];
  }

  protected notRequiredEmailConstraint(
    message: string = 'Campo inválido'
  ): Constraint {
    return {
      type: 'mask',
      message,
      apply: (value) =>
        this.isEmpty(value) || this.applyValidator(MaskTypesEnum.EMAIL, value),
    };
  }
}
