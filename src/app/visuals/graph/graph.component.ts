import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, AfterViewInit, OnInit } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="options.width" [attr.height]="options.height">
      <g [zoomableOf]="svg">
        <g [linkVisual]='link' *ngFor='let link of links'></g>
        <g [nodeVisual]='node' *ngFor='let node of nodes'
            [draggableNode]='node' [draggableInGraph]='graph'></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit, OnInit {
  @Input('nodes') nodes;
  @Input('links') links;
  graph: ForceDirectedGraph;
  private _options: { width, height } = { width: 800, height: 600 };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }


  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
