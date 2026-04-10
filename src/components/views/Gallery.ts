import { Component } from "../base/Component";

interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }

  render(data?: Partial<IGalleryData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
