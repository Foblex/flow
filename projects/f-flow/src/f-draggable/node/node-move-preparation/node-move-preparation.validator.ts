import { Injectable } from '@angular/core';
import { NodeMovePreparationRequest } from './node-move-preparation.request';
import { FValidatorRegister, IValidator } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';
import { isClosestElementHasClass } from '@foblex/utils';

@Injectable()
@FValidatorRegister(NodeMovePreparationRequest)
export class NodeMovePreparationValidator implements IValidator<NodeMovePreparationRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: NodeMovePreparationRequest): boolean {
    return this.isDragHandlesEmpty()
      && this.isDragHandleElement(request.event.targetElement)
      && this.isNodeCanBeDragged(this.getNode(request.event.targetElement));
  }

  private isDragHandlesEmpty(): boolean {
    return !this.fDraggableDataContext.draggableItems.length;
  }

  private getNode(targetElement: HTMLElement): FNodeBase | undefined {
    return this.fComponentsStore.findNode(targetElement);
  }

  private isNodeCanBeDragged(node: FNodeBase | undefined): boolean {
    return !!node && !node.fDraggingDisabled;
  }

  private isDragHandleElement(targetElement: HTMLElement): boolean {
    return isClosestElementHasClass(targetElement, '.f-drag-handle');
  }
}
