import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { GetFlowRequest } from './get-flow-request';
import { FComponentsStore } from '../../../f-storage';
import { FFlowBase } from '../../../f-flow';

@Injectable()
@FExecutionRegister(GetFlowRequest)
export class GetFlowExecution implements IExecution<GetFlowRequest, FFlowBase> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: GetFlowRequest): FFlowBase {
    const result = this._fComponentsStore.fFlow;
    if (!result) {
      throw new Error(`Flow not found in store`);
    }
    return result;
  }
}
