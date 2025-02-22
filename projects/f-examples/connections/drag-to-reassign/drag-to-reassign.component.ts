import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, inject,
  ViewChild
} from '@angular/core';
import { FCanvasComponent, FFlowModule, FReassignConnectionEvent } from '@foblex/flow';

@Component({
  selector: 'drag-to-reassign',
  styleUrls: [ './drag-to-reassign.component.scss' ],
  templateUrl: './drag-to-reassign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class DragToReassignComponent {

  private _elementReference = inject(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public connections: { outputId: string, inputId: string }[] = [
    { outputId: '1', inputId: 'input-1' },
  ];

  public reassignConnection(event: FReassignConnectionEvent): void {
    if (!event.newFInputId) {
      return;
    }
    this.connections = [ { outputId: event.fOutputId, inputId: event.newFInputId } ];
    this._changeDetectorRef.detectChanges();
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
