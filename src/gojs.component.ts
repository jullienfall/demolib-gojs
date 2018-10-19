import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-gojs',
  templateUrl: './gojs.component.html',
  styleUrls: ['./gojs.component.css']
})
export class GojsComponent implements OnInit {
  diagram: go.Diagram = new go.Diagram();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  constructor() {
    const $ = go.GraphObject.make;
    const model = $(go.TreeModel);
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.undoManager.isEnabled = true;
    this.diagram.layout = $(go.TreeLayout, {
      angle: 90,
      layerSpacing: 35
    });

    this.diagram.nodeTemplate = $(
      go.Node,
      'Horizontal',
      { background: '#17a2b1' },
      {
        doubleClick: (e, obj) => {
          var clicked = obj.part;
          if (clicked !== null) {
            var thisemp = clicked.data;
            this.diagram.startTransaction('add employee');
            var newemp = {
              key: getNextKey(),
              name: '(new person)',
              title: '',
              source: 'https://www.acrpnet.org/wp-content/uploads/2016/09/User-Icon-Gray.jpg',
              parent: thisemp.key
            };
            this.diagram.model.addNodeData(newemp);
            this.diagram.commitTransaction('add employee');
          }
        }
      },
      {
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          var diagram = node.diagram;
          var selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          var shape = node.findObject('SHAPE');
          if (shape) {
            shape._prevFill = shape.fill; // remember the original brush
            shape.fill = 'darkred';
          }
        },
        mouseDragLeave: (e, node, next) => {
          var shape = node.findObject('SHAPE');
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill; // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          var diagram = node.diagram;
          var selnode = diagram.selection.first(); // assume just one Node in selection
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            var link = selnode.findTreeParentLink();
            if (link !== null) {
              // reconnect any existing link
              link.fromNode = node;
            } else {
              // else create a new link
              diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
            }
          }
        }
      },
      $(
        go.Panel,
        'Horizontal',
        {
          name: 'SHAPE',
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          cursor: 'pointer'
        },
        $(
          go.Picture,
          {
            name: 'Picture',
            desiredSize: new go.Size(65, 50),
            margin: new go.Margin(6, 8, 6, 10)
          },
          new go.Binding('source')
        ),
        $(
          go.Panel,
          'Table',
          {
            maxSize: new go.Size(150, 999),
            margin: new go.Margin(6, 10, 0, 3),
            defaultAlignment: go.Spot.Left
          },
          $(go.RowColumnDefinition, { column: 2, width: 4 }),
          $(
            go.TextBlock,
            {
              row: 0,
              column: 0,
              columnSpan: 5,
              font: '12pt Segoe UI,sans-serif',
              editable: true,
              isMultiline: false,
              minSize: new go.Size(10, 16)
            },
            new go.Binding('text', 'name').makeTwoWay()
          ),
          $(go.TextBlock, 'Title: ', { row: 1, column: 0 }),
          $(
            go.TextBlock,
            {
              row: 1,
              column: 1,
              columnSpan: 4,
              editable: true,
              isMultiline: false,
              minSize: new go.Size(10, 14),
              margin: new go.Margin(0, 0, 0, 3)
            },
            new go.Binding('text', 'title').makeTwoWay()
          ),
          $(
            go.TextBlock,
            { row: 2, column: 0 },
            new go.Binding('text', 'key', function(v) {
              return 'ID: ' + v;
            })
          ),
          $(
            go.TextBlock,
            { name: 'boss', row: 2, column: 3 },
            new go.Binding('text', 'parent', function(v) {
              return 'Boss: ' + v;
            })
          ),
          $(
            go.TextBlock,
            {
              row: 3,
              column: 0,
              columnSpan: 5,
              font: 'italic 9pt sans-serif',
              wrap: go.TextBlock.WrapFit,
              editable: true, // by default newlines are allowed
              minSize: new go.Size(10, 14)
            },
            new go.Binding('text', 'comments').makeTwoWay()
          )
        ) // end Table Panel
      )
    );

    this.diagram.nodeTemplate.contextMenu = $(
      go.Adornment,
      'Vertical',
      $('ContextMenuButton', $(go.TextBlock, 'Remove Role'), {
        click: (e, obj) => {
          // reparent the subtree to this node's boss, then remove the node
          var node = obj.part.adornedPart;
          if (node !== null && node.data.key != 1) {
            this.diagram.startTransaction('reparent remove');
            var chl = node.findTreeChildrenNodes();
            // iterate through the children and set their parent key to our selected node's parent key
            while (chl.next()) {
              var emp = chl.value;
              model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
            }
            // and now remove the selected node itself
            model.removeNodeData(node.data);
            this.diagram.commitTransaction('reparent remove');
          }
        }
      }),
      $('ContextMenuButton', $(go.TextBlock, 'Remove Department'), {
        click: (e, obj) => {
          // remove the whole subtree, including the node itself
          var node = obj.part.adornedPart;
          if (node !== null) {
            this.diagram.startTransaction('remove dept');
            this.diagram.removeParts(node.findTreeParts(), true);
            this.diagram.commitTransaction('remove dept');
          }
        }
      })
    );

    let mayWorkFor = (node1, node2) => {
      if (!(node1 instanceof go.Node)) return false; // must be a Node
      if (node1 === node2) return false; // cannot work for yourself
      if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
      return true;
    };

    let nodeIdCounter = -1;

    let getNextKey = () => {
      var key = nodeIdCounter;
      while (this.diagram.model.findNodeDataForKey(key) !== null) {
        key = nodeIdCounter--;
      }
      return key;
    };

    // define the Link template
    this.diagram.linkTemplate = $(
      go.Link,
      go.Link.Orthogonal,
      { corner: 5, relinkableFrom: true, relinkableTo: true },
      $(go.Shape, { strokeWidth: 4, stroke: '#00a4a4' })
    ); // the link shape

    model.nodeDataArray = [
      {
        key: 1,
        name: 'Stella Payne Diaz',
        title: 'CEO',
        source:
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 2,
        name: 'Luke Warm',
        title: 'VP Marketing/Sales',
        parent: 1,
        source:
          'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 3,
        name: 'Meg Meehan Hoffa',
        title: 'Sales',
        parent: 2,
        source:
          'https://images.pexels.com/photos/324658/pexels-photo-324658.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 4,
        name: 'Peggy Flaming',
        title: 'VP Engineering',
        parent: 1,
        source:
          'https://images.pexels.com/photos/756453/pexels-photo-756453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        key: 5,
        name: 'Saul Wellingood',
        title: 'Manufacturing',
        parent: 4,
        source:
          'https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 6,
        name: 'Al Ligori',
        title: 'Marketing',
        parent: 2,
        source:
          'https://images.pexels.com/photos/407237/pexels-photo-407237.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 7,
        name: 'Dot Stubadd',
        title: 'Sales Rep',
        parent: 3,
        source:
          'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 8,
        name: 'Les Ismore',
        title: 'Project Mgr',
        parent: 5,
        source:
          'https://images.pexels.com/photos/709188/pexels-photo-709188.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 9,
        name: 'April Lynn Parris',
        title: 'Events Mgr',
        parent: 6,
        source:
          'https://images.pexels.com/photos/355164/pexels-photo-355164.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 10,
        name: 'Anita Hammer',
        title: 'Process',
        parent: 5,
        source:
          'https://images.pexels.com/photos/818819/pexels-photo-818819.jpeg?auto=compress&cs=tinysrgb&h=350'
      },

      {
        key: 11,
        name: 'Evan Elpus',
        title: 'Quality',
        parent: 5,
        source:
          'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      {
        key: 12,
        name: 'Lotta B. Essen',
        title: 'Sales Rep',
        parent: 3,
        source:
          'https://images.pexels.com/photos/462680/pexels-photo-462680.jpeg?auto=compress&cs=tinysrgb&h=350s'
      }
    ];
    this.diagram.model = model;
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
  }
}
