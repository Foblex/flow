import { IPointerEvent } from '@foblex/drag-toolkit';
import { InjectionToken } from '@angular/core';

export const F_BEFORE_MAIN_PLUGIN = new InjectionToken<IFDragAndDropPlugin>('F_BEFORE_MAIN_PLUGIN');
export const F_AFTER_MAIN_PLUGIN = new InjectionToken<IFDragAndDropPlugin>('F_AFTER_MAIN_PLUGIN');

export interface IFDragAndDropPlugin {

  onSelect?(event: Event): void;

  onPointerDown?(event: IPointerEvent): void;

  prepareDragSequence?(event: IPointerEvent): void;

  onPointerUp?(event: IPointerEvent): void;
}
