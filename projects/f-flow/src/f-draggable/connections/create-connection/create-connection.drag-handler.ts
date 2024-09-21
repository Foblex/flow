import { IDraggableItem } from '../../i-draggable-item';
import {
  FindClosestInputUsingSnapThresholdRequest,
  GetAllCanBeConnectedInputPositionsRequest,
  GetConnectionLineRequest,
  GetConnectorWithRectRequest,
  IConnectorWithRect
} from '../../../domain';
import { FConnectionBase, FSnapConnectionComponent } from '../../../f-connection';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { FMediator } from '@foblex/mediator';
import { RoundedRect, ILine, IPoint, PointExtensions, RectExtensions, Point, } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';

export class CreateConnectionDragHandler implements IDraggableItem {

  private toConnectorRect: RoundedRect = new RoundedRect();

  public get fConnection(): FConnectionBase {
    return this.fComponentsStore.fTempConnection!;
  }

  private get fSnapConnection(): FSnapConnectionComponent | undefined {
    return this.fComponentsStore.fSnapConnection as FSnapConnectionComponent;
  }

  private fOutputWithRect!: IConnectorWithRect;

  private canBeConnectedInputs: IConnectorWithRect[] = [];

  constructor(
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
    private fOutput: FConnectorBase,
    private onPointerDownPosition: IPoint,
  ) {
  }

  public initialize(): void {
    if (this.fSnapConnection) {
      this.fSnapConnection.fOutputId = this.fOutput.id;
      this.fSnapConnection.initialize();
      this.canBeConnectedInputs = this.fMediator.send<IConnectorWithRect[]>(
        new GetAllCanBeConnectedInputPositionsRequest(this.fOutput.id)
      );
    }
    this.fConnection.fOutputId = this.fOutput.id;
    this.fConnection.initialize();


    this.fOutputWithRect = this.fMediator.send<IConnectorWithRect>(new GetConnectorWithRectRequest(this.fOutput));

    this.toConnectorRect = RoundedRect.fromRect(
      RectExtensions.initialize(this.onPointerDownPosition.x, this.onPointerDownPosition.y)
    );

    this.fConnection.show();
    this.move(PointExtensions.initialize());
  }

  public move(difference: IPoint): void {
    this.drawTempConnection(this.toConnectorRect.addPoint(difference));
    this.drawSnapConnection(this.getClosetInput(difference));
  }

  private drawTempConnection(fInputRect: RoundedRect): void {
    const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
        this.fOutputWithRect.fRect,
        fInputRect,
        this.fConnection.fBehavior,
        this.fOutputWithRect.fConnector.fConnectableSide,
        EFConnectableSide.TOP,
      )
    );

    this.fConnection.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, EFConnectableSide.TOP);
    this.fConnection.redraw();
  }

  private drawSnapConnection(fInputWithRect: IConnectorWithRect | undefined): void {
    if (fInputWithRect) {
      const line = this.fMediator.send<ILine>(new GetConnectionLineRequest(
          this.fOutputWithRect.fRect,
          fInputWithRect.fRect,
          this.fSnapConnection!.fBehavior,
          this.fOutputWithRect.fConnector.fConnectableSide,
          fInputWithRect.fConnector.fConnectableSide
        )
      );
      this.fSnapConnection!.show();
      this.fSnapConnection!.setLine(line.point1, this.fOutputWithRect.fConnector.fConnectableSide, line.point2, fInputWithRect.fConnector.fConnectableSide);
      this.fSnapConnection!.redraw();
    } else {
      this.fSnapConnection?.hide();
    }
  }

  public getClosetInput(difference: IPoint): IConnectorWithRect | undefined {
    return this.fMediator.send<IConnectorWithRect | undefined>(
      new FindClosestInputUsingSnapThresholdRequest(
        Point.fromPoint(this.toConnectorRect).add(difference),
        this.canBeConnectedInputs,
        this.fSnapConnection!.fSnapThreshold
      )
    );
  }

  public complete(): void {
    this.fConnection.redraw();
    this.fConnection.hide();
    this.fSnapConnection?.hide();
  }
}
