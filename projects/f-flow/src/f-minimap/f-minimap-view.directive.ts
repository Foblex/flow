import { Directive, ElementRef } from "@angular/core";
import { FComponentsStore } from '../f-storage';
import { IRect, RectExtensions } from '@foblex/2d';
import { checkRectIsFinite } from './domain';

@Directive({
  selector: 'rect[fMinimapView]',
  host: {
    'class': 'f-component f-minimap-view',
  }
})
export class FMinimapViewDirective {

  public get hostElement(): SVGRectElement {
    return this.elementReference.nativeElement;
  }

  private get flowScale(): number {
    return this.fComponentsStore!.fCanvas!.transform.scale!;
  }

  constructor(
    private elementReference: ElementRef<SVGRectElement>,
    private fComponentsStore: FComponentsStore
  ) {
  }

  public update(): void {
    this._setAttributes(this._calculateViewBox());
  }

  private _calculateViewBox(): IRect {
    return RectExtensions.div(RectExtensions.fromElement(this.fComponentsStore.flowHost), this.flowScale);
  }

  private _setAttributes(viewBox: IRect): void {
    viewBox = checkRectIsFinite(viewBox);
    this.hostElement.setAttribute('x', '0');
    this.hostElement.setAttribute('y', '0');
    this.hostElement.setAttribute('width', viewBox.width.toString());
    this.hostElement.setAttribute('height', viewBox.height.toString());
  }
}
