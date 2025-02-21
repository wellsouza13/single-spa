export const ACCOUNTS_PAYABLE = 1;
export const ACCOUNTS_RECEIVABLE = 2;
export const FINANCIER_CREDIT = 3;
export const TRADER = 4;
export const PAYMENT_MANAGEMENT = 6;
export const RECEIVABLES_MANAGEMENT = 9;
export const TREASURY = 11;
export const PAYMENT_AUTHORIZATION = 7;
export const FINANCIER_CARD = 12;
export const PAYMENT_GUEST = 13;
export const FAVORED_GUEST = 14;
export const INFO_TRACK = 21;
export const CARD_RECURRENCY = 28;
export const ORCHESTRATOR_PAYMENT = 31;
export const OPEN_FINANCE = 33;
export const CASH_POOLING = 36;

export enum Auths {
  PAYABLE = 'VER_CP_module',
  RECEIVABLE = 'VER_CR_module',
  CREDIT_PAYER = 'VER_AD_payer_module',
  CREDIT_SUPPLIER = 'VER_AD_supplier_module',
  TREASURY = 'VER_TS_module',
  CARD_FINANCIER = 'VER_FN_card_module',
  CREDIT_FINANCIER = 'VER_AD_financier_module',
  CREDIT_TRADER = 'VER_AD_trader_module',
  PAYABLE_GUEST = 'VER_CP_guest',
  RECEIVABLE_GUEST = 'VER_CR_guest',
  VER_DG_module = 'VER_DG_module',
  VER_DG_access_digital_edit = 'VER_DG_access_digital_edit',
  VER_TS_cash_pooling_configuration = 'VER_TS_cash_pooling_configuration',
}

export const VER_DG_ACCESS_DIGITAL_EDIT = 38;
export const VER_DG_MODULE = 37;

export const sessionIds = [
  'drawee-risk-operation-financier-in-progress-filter@operationStatus',
  'drawee-risk-operation-financier-in-progress-filter@operationId',
  'drawee-risk-operation-financier-in-progress-filter@payerName',
  'drawee-risk-operation-financier-in-progress-filter@payerIdentification',
  'drawee-risk-operation-financier-in-progress-filter@supplierName',
  'drawee-risk-operation-financier-in-progress-filter@supplierIdentification',
  'drawee-risk-operation-financier-in-progress-filter@operationMinimumValue',
  'drawee-risk-operation-financier-in-progress-filter@operationMaximumValue',
  'drawee-risk-operation-financier-finished-filter@status',
  'drawee-risk-operation-financier-finished-filter@operationId',
  'drawee-risk-operation-financier-finished-filter@payerName',
  'drawee-risk-operation-financier-finished-filter@payerIdentification',
  'drawee-risk-operation-financier-finished-filter@supplierName',
  'drawee-risk-operation-financier-finished-filter@supplierIdentification',
  'drawee-risk-operation-financier-finished-filter@alterDate',
  'drawee-risk-operation-financier-finished-filter@operationDate',
  'drawee-risk-financier-view-finished-history-filter@status',
  'drawee-risk-financier-view-finished-history-filter@operationId',
  'drawee-risk-financier-view-finished-history-filter@payerName',
  'drawee-risk-financier-view-finished-history-filter@payerIdentification',
  'drawee-risk-financier-view-finished-history-filter@supplierName',
  'drawee-risk-financier-view-finished-history-filter@supplierIdentification',
  'drawee-risk-financier-view-finished-history-filter@alterDate',
  'drawee-risk-financier-view-finished-history-filter@operationDate',
  'drawee-risk-operation-payer-in-progress-filter@status',
  'drawee-risk-operation-payer-in-progress-filter@operationId',
  'drawee-risk-operation-payer-in-progress-filter@payerIdentification',
  'drawee-risk-operation-payer-in-progress-filter@supplierName',
  'drawee-risk-operation-payer-finished-filter@status',
  'drawee-risk-operation-payer-finished-filter@operationId',
  'drawee-risk-operation-payer-finished-filter@payerIdentification',
  'drawee-risk-operation-payer-finished-filter@supplierName',
  'drawee-risk-operation-payer-finished-filter@financierName',
  'drawee-risk-operation-payer-finished-filter@operationDate',
  'drawee-risk-payer-view-finished-history-filter@status',
  'drawee-risk-payer-view-finished-history-filter@operationId',
  'drawee-risk-payer-view-finished-history-filter@payerIdentification',
  'drawee-risk-payer-view-finished-history-filter@supplierName',
  'drawee-risk-payer-view-finished-history-filter@financierName',
  'drawee-risk-payer-view-finished-history-filter@operationDate',
  'drawee-risk-operation-supplier-in-progress-filter@status',
  'drawee-risk-operation-supplier-in-progress-filter@operationId',
  'drawee-risk-operation-supplier-in-progress-filter@supplierIdentification',
  'drawee-risk-operation-supplier-in-progress-filter@payerName',
  'drawee-risk-operation-supplier-finished-filter@status',
  'drawee-risk-operation-supplier-finished-filter@operationId',
  'drawee-risk-operation-supplier-finished-filter@supplierIdentification',
  'drawee-risk-operation-supplier-finished-filter@payerName',
  'drawee-risk-operation-supplier-finished-filter@financierName',
  'drawee-risk-operation-supplier-finished-filter@operationDate',
  'drawee-risk-supplier-view-finished-history-filter@status',
  'drawee-risk-supplier-view-finished-history-filter@operationId',
  'drawee-risk-supplier-view-finished-history-filter@supplierIdentification',
  'drawee-risk-supplier-view-finished-history-filter@payerName',
  'drawee-risk-supplier-view-finished-history-filter@financierName',
  'drawee-risk-supplier-view-finished-history-filter@operationDate',
];
