export const DEFAULT_PAGE_SIZE = 25;
export const DEFAULT_INFINITE_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

export class PageFilter<F> {
  filter: F;
  page?: {
    sort?: {
      order?: "asc" | "desc" | "";
      field?: string;
    };
    pageNumber?: number;
    pageSize?: number;
  } = {
    sort: { order: "asc", field: "id" },
    pageNumber: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export class Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export class Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export class Page<T> {
  content: T[] = [];
  pageable: Pageable;
  last = true;
  totalElements = 0;
  totalPages = 0;
  size = 0;
  number = 0;
  sort: Sort = { sorted: false, unsorted: true, empty: true };
  numberOfElements = 0;
  first = true;
  empty = true;
}

export interface PathVariable {
  key: string;
  value: string | number | boolean;
}

export class ActionFloatMenuButton {
  text?: string;
  icon?: string;
  itens?: { label: string; action: () => void }[];
  iconSrc?: string;
  hasCsv?: boolean;

  constructor(
    text?: string,
    icon?: string,
    itens?: { label: string; action: () => void }[],
    iconSrc?: string,
    hasCsv = false
  ) {
    this.text = text;
    this.icon = icon;
    this.iconSrc = iconSrc;
    this.itens = itens;
    this.hasCsv = hasCsv;
  }
}
