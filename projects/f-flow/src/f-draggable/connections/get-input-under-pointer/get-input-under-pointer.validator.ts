import { Injectable } from '@angular/core';
import { GetInputUnderPointerRequest } from './get-input-under-pointer.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { OutputNotFound } from '../../../errors';
import { CreateConnectionDragHandler } from '../create-connection';
import { ReassignConnectionDragHandler } from '../reassign-connection';
import { FConnectorBase } from '../../../f-connectors';

@Injectable()
@FValidatorRegister(GetInputUnderPointerRequest)
export class GetInputUnderPointerValidator implements IValidator<GetInputUnderPointerRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: GetInputUnderPointerRequest): boolean {
    let output = this.getOutput(request.dragHandler) || this.getOutlet(request.dragHandler);
    if (!output) {
      throw OutputNotFound(request.dragHandler.fConnection.fOutputId);
    }
    return true;
  }

  private getOutput(dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.fId === dragHandler.fConnection.fOutputId);
  }

  private getOutlet(dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.fId === dragHandler.fConnection.fOutputId);
  }
}
