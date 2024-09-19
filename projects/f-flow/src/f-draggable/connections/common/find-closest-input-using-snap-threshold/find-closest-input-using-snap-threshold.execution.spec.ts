import { TestBed } from '@angular/core/testing';
import { FMediator } from '@foblex/mediator';
import {
  FConnectorBase,
  FDraggableDataContext,
  FindClosestInputUsingSnapThresholdExecution,
  FindClosestInputUsingSnapThresholdRequest, IConnectorWithRect,
} from '@foblex/flow';
import { setupTestModule } from '../../../../domain/test-setup';
import { RectExtensions, RoundedRect } from '@foblex/2d';

describe('FindClosestInputUsingSnapThresholdExecution', () => {
  let fDraggableDataContext: FDraggableDataContext;
  let fMediator: FMediator;

  beforeEach(() => {
    setupTestModule([ FindClosestInputUsingSnapThresholdExecution ]);
    fDraggableDataContext = TestBed.inject(FDraggableDataContext) as jasmine.SpyObj<FDraggableDataContext>;
    fMediator = TestBed.inject(FMediator) as jasmine.SpyObj<FMediator>;
  });

  it('should return undefined when canBeConnectedInputs is empty', () => {
    const result = fMediator.send(
      new FindClosestInputUsingSnapThresholdRequest({ x: 50, y: 50 }, [], 10)
    );
    expect(result).toBeUndefined();
  });

  it('should return the only element if its distance is less than snapThreshold', () => {

    const result = fMediator.send<IConnectorWithRect>(
      new FindClosestInputUsingSnapThresholdRequest({ x: 10, y: 10 }, [ {
        fConnector: {
          id: 'input1'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(12, 12, 10, 10)),
      }, {
        fConnector: {
          id: 'input2'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(22, 22, 10, 10)),
      }, ], 15)
    );
    expect(result).toBeDefined();
    expect(result?.fConnector.id).toBe('input1');
  });

  it('should return undefined if the only element is exactly at snapThreshold distance', () => {
    const result = fMediator.send<IConnectorWithRect>(
      new FindClosestInputUsingSnapThresholdRequest({ x: 0, y: 0 }, [ {
        fConnector: {
          id: 'input1'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(10, 0, 10, 10)),
      }, {
        fConnector: {
          id: 'input2'
        } as FConnectorBase,
        fRect: RoundedRect.fromRect(RectExtensions.initialize(22, 22, 10, 10)),
      }, ], 10)
    );
    expect(result).toBeUndefined();
  });
});


