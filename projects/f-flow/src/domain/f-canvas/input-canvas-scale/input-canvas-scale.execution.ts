import { Injectable } from '@angular/core';
import { InputCanvasScaleRequest } from './input-canvas-scale-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(InputCanvasScaleRequest)
export class InputCanvasScaleExecution implements IExecution<InputCanvasScaleRequest, void> {


  constructor(
    private fComponentsStore: FComponentsStore
  ) {
  }

  public handle(request: InputCanvasScaleRequest): void {
    if (!request.scale) {
      return;
    }
    request.transform.scale = request.scale;
    this.fComponentsStore.fCanvas?.redraw();
  }
}