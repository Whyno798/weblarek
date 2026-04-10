import { Component } from "../base/Component";

interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  protected _list: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._list = container;
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }

  render(data?: Partial<IGalleryData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
