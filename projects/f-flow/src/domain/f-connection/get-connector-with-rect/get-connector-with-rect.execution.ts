import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetConnectorWithRectRequest } from './get-connector-with-rect-request';
import { IRoundedRect } from '@foblex/2d';
import { IConnectorWithRect } from './i-connector-with-rect';
import { GetNormalizedElementRectRequest } from '../../get-normalized-element-rect';

@Injectable()
@FExecutionRegister(GetConnectorWithRectRequest)
export class GetConnectorWithRectExecution implements IExecution<GetConnectorWithRectRequest, IConnectorWithRect> {

  constructor(
      private fMediator: FMediator,
  ) {
  }

  public handle(request: GetConnectorWithRectRequest): IConnectorWithRect {
    return {
      fConnector: request.connector,
      fRect: this.fMediator.send<IRoundedRect>(new GetNormalizedElementRectRequest(request.connector.hostElement))
    }
  }
}
