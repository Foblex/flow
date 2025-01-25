import { SelectRequest } from './select.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable';

@Injectable()
@FExecutionRegister(SelectRequest)
export class SelectExecution implements IExecution<SelectRequest, void> {

  private _fDraggableDataContext = inject(FDraggableDataContext);
  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: SelectRequest): void {
    this._fDraggableDataContext.selectedItems.forEach((x) => {
      x.deselect();
    });
    this._fDraggableDataContext.selectedItems = [];

    request.nodes.forEach((key) => {
      const node = this._fComponentsStore.fNodes.find((x) => x.fId === key);
      if(node) {
        node.select();
        this._fDraggableDataContext.selectedItems.push(node);
      }
    });

    request.connections.forEach((key) => {
      const connection = this._fComponentsStore.fConnections.find((x) => x.fId === key);
      if(connection) {
        connection.select();
        this._fDraggableDataContext.selectedItems.push(connection);
      }
    });

    this._fDraggableDataContext.isSelectedChanged = true;
  }
}
