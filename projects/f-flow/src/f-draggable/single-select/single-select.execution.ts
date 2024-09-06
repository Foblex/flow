import { Injectable } from '@angular/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { SingleSelectRequest } from './single-select.request';
import { UpdateItemLayerRequest } from '../../domain';
import { IPointerEvent, MouseEventExtensions, PlatformService } from '@foblex/core';
import { FConnectionBase, ISelectable } from '../../f-connection';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext } from '../f-draggable-data-context';

@Injectable()
@FExecutionRegister(SingleSelectRequest)
export class SingleSelectExecution implements IExecution<SingleSelectRequest, void> {

  constructor(
    private platform: PlatformService,
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: SingleSelectRequest): void {
    const { event } = request;

    const item = this.getSelectableItem(event);
    if (item) {
      this.fMediator.send<void>(new UpdateItemLayerRequest(item, item.hostElement.parentElement!));
    }

    this.isMultiselectEnabled(event) ? this.multiSelect(item) : this.singleSelect(item);
  }

  private getSelectableItem(event: IPointerEvent): ISelectable | undefined {
    return this.fComponentsStore.findNode(event.targetElement) || this.getConnectionHandler(event.targetElement);
  }

  private getConnectionHandler(element: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this.fComponentsStore.fConnections.find(c => c.isContains(element) || c.fConnectionCenter?.nativeElement?.contains(element));
  }

  private isMultiselectEnabled(event: IPointerEvent): boolean {
    return MouseEventExtensions.isCommandButton(this.platform.getOS()!, event.originalEvent) ||
      MouseEventExtensions.isShiftPressed(event.originalEvent);
  }

  private singleSelect(item: ISelectable | undefined): void {
    if (item) {
      if (!item.isSelected() && !item.fSelectionDisabled) {
        this.clearSelection();
        this.selectItem(item);
      }
    } else {
      this.clearSelection();
    }
  }

  private multiSelect(item: ISelectable | undefined): void {
    if (item && !item.fSelectionDisabled) {
      item.isSelected() ? this.deselectItem(item) : this.selectItem(item);
    }
  }

  private deselectItem(item: ISelectable): void {
    const index = this.fDraggableDataContext.selectedItems.indexOf(item);
    if (index > -1) {
      this.fDraggableDataContext.selectedItems.splice(index, 1);
    }
    item.deselect();
    this.fDraggableDataContext.markSelectionAsChanged();
  }

  private selectItem(item: ISelectable): void {
    this.fDraggableDataContext.selectedItems.push(item);
    item.select();
    this.fDraggableDataContext.markSelectionAsChanged();
  }

  private clearSelection(): void {
    this.fDraggableDataContext.selectedItems.forEach((x) => {
      x.deselect();
      this.fDraggableDataContext.markSelectionAsChanged();
    });
    this.fDraggableDataContext.selectedItems = [];
  }
}
