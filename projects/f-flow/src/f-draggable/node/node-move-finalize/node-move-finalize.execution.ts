import { inject, Injectable } from '@angular/core';
import { NodeMoveFinalizeRequest } from './node-move-finalize.request';
import { IPoint, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  IsConnectionUnderNodeRequest
} from '../../domain';
import { IDraggableItem } from '../../i-draggable-item';
import { NodeDragToParentDragHandler } from '../node-drag-to-parent.drag-handler';
import { ILineAlignmentResult } from '../../../f-line-alignment';
import { NodeDragHandler } from '../node.drag-handler';
import { deepClone } from '@foblex/utils';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(NodeMoveFinalizeRequest)
export class NodeMoveFinalizeExecution implements IExecution<NodeMoveFinalizeRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  public handle(request: NodeMoveFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    const difference = this._getDifferenceWithLineAlignment(
      this._getDifferenceBetweenPreparationAndFinalize(request.event.getPosition())
    );

    const firstNodeOrGroup: NodeDragHandler = this._fDraggableDataContext.draggableItems
      .find((x) => x instanceof NodeDragHandler)!;

    const differenceWithCellSize = firstNodeOrGroup.getDifferenceWithCellSize(difference);

    this._finalizeMove(differenceWithCellSize);

    this._fDraggableDataContext.fLineAlignment?.complete();

    this._applyConnectionUnderNode();
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems.some((x) => x instanceof NodeDragHandler);
  }

  private _finalizeMove(difference: IPoint): void {
    this._getItems().forEach((x) => {
      x.onPointerMove({ ...difference });
      x.onPointerUp?.();
    });
  }

  private _getItems(): IDraggableItem[] {
    return this._fDraggableDataContext.draggableItems
      .filter((x) => !(x instanceof NodeDragToParentDragHandler));
  }

  private _getDifferenceBetweenPreparationAndFinalize(position: IPoint): Point {
    return Point.fromPoint(position).elementTransform(this._fHost)
      .div(this._fDraggableDataContext.onPointerDownScale)
      .sub(this._fDraggableDataContext.onPointerDownPosition);
  }

  private _getDifferenceWithLineAlignment(difference: IPoint): IPoint {
    return this._applyLineAlignmentDifference(
      difference,
      this._getLineAlignmentDifference(difference)
    );
  }

  private _getLineAlignmentDifference(difference: IPoint): ILineAlignmentResult | undefined {
    return this._fDraggableDataContext.fLineAlignment?.findNearestCoordinate(difference);
  }

  private _applyLineAlignmentDifference(difference: IPoint, intersection: ILineAlignmentResult | undefined): IPoint {
    if (intersection) {
      difference.x = intersection.xResult.value ? (difference.x - intersection.xResult.distance!) : difference.x;
      difference.y = intersection.yResult.value ? (difference.y - intersection.yResult.distance!) : difference.y;
    }
    return difference;
  }

  private _applyConnectionUnderNode(): void {
    const isDraggedJustOneNode = this._fDraggableDataContext.draggableItems[ 0 ] instanceof NodeDragHandler;
    if (isDraggedJustOneNode) {
      const fNode = (this._fDraggableDataContext.draggableItems[ 0 ] as NodeDragHandler).fNode;
      setTimeout(() => this._fMediator.execute(new IsConnectionUnderNodeRequest(fNode)));
    }
  }
}
