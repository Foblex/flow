import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowModule } from '@foblex/flow';
import * as dagre from "dagre";
import { IPoint, PointExtensions } from '@foblex/core';
import { graphlib } from 'dagre';
import Graph = graphlib.Graph;

interface INodeViewModel {
  id: string;
  position: IPoint;
}

interface IConnectionViewModel {
  from: string;
  to: string;
}

@Component({
  selector: 'dagre-layout-example',
  styleUrls: [ './dagre-layout-example.component.scss' ],
  templateUrl: './dagre-layout-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class DagreLayoutExampleComponent implements OnInit {

  public nodes: INodeViewModel[] = [];
  public connections: IConnectionViewModel[] = [];

  public configuration = CONFIGURATION[ Direction.LEFT_TO_RIGHT ];

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  public ngOnInit(): void {
    this.getData(new dagre.graphlib.Graph(), Direction.LEFT_TO_RIGHT);
  }

  private getData(graph: Graph, direction: Direction): void {
    this.setGraph(graph, direction);
    this.nodes = this.getNodes(graph);
    this.connections = this.getConnections(graph);
  }

  private setGraph(graph: Graph, direction: Direction): void {
    this.configuration = CONFIGURATION[ direction ];
    graph.setGraph({ rankdir: direction });
    GRAPH_DATA.forEach(node => {
      graph.setNode(node.id, { width: 100, height: 48 });
      if (node.parentId != null) {
        graph.setEdge(node.parentId, node.id, {});
      }
    });
    dagre.layout(graph);
  }

  private getNodes(graph: Graph): INodeViewModel[] {
    return graph.nodes().map((x) => {
      let node = graph.node(x);
      return {
        id: x, position: { x: node.x, y: node.y }
      }
    });
  }

  private getConnections(graph: Graph): IConnectionViewModel[] {
    return graph.edges().map((x) => ({ from: x.v, to: x.w }));
  }

  public horizontal(): void {
    this.getData(new dagre.graphlib.Graph(), Direction.LEFT_TO_RIGHT);
  }

  public vertical(): void {
    this.getData(new dagre.graphlib.Graph(), Direction.TOP_TO_BOTTOM);
  }

  public fitToScreen(): void {
    this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 50),true);
  }
}

enum Direction {
  LEFT_TO_RIGHT = 'LR',
  TOP_TO_BOTTOM = 'TB'
}

const CONFIGURATION = {
  [ Direction.LEFT_TO_RIGHT ]: {
    outputSide: EFConnectableSide.RIGHT,
    inputSide: EFConnectableSide.LEFT
  },
  [ Direction.TOP_TO_BOTTOM ]: {
    outputSide: EFConnectableSide.BOTTOM,
    inputSide: EFConnectableSide.TOP
  }
};

const GRAPH_DATA = [
  { id: 'Node1', parentId: null },
  { id: 'Node2', parentId: 'Node1' },
  { id: 'Node3', parentId: 'Node1' },
  { id: 'Node4', parentId: 'Node3' },
  { id: 'Node5', parentId: 'Node3' },
  { id: 'Node6', parentId: 'Node3' },
  { id: 'Node7', parentId: 'Node3' },
  { id: 'Node8', parentId: 'Node2' }
];
