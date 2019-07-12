export interface Quantity {
  id: number;
  qty: number;
}

export class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
