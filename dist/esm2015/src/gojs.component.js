/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as go from 'gojs';
export class GojsComponent {
    constructor() {
        this.diagram = new go.Diagram();
        /** @type {?} */
        const $ = go.GraphObject.make;
        /** @type {?} */
        const model = $(go.TreeModel);
        this.diagram = new go.Diagram();
        this.diagram.initialContentAlignment = go.Spot.Center;
        this.diagram.undoManager.isEnabled = true;
        this.diagram.layout = $(go.TreeLayout, {
            angle: 90,
            layerSpacing: 35
        });
        this.diagram.nodeTemplate = $(go.Node, 'Horizontal', { background: '#17a2b1' }, {
            doubleClick: (e, obj) => {
                /** @type {?} */
                var clicked = obj.part;
                if (clicked !== null) {
                    /** @type {?} */
                    var thisemp = clicked.data;
                    this.diagram.startTransaction('add employee');
                    /** @type {?} */
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
        }, {
            // handle dragging a Node onto a Node to (maybe) change the reporting relationship
            mouseDragEnter: (e, node, prev) => {
                /** @type {?} */
                var diagram = node.diagram;
                /** @type {?} */
                var selnode = diagram.selection.first();
                if (!mayWorkFor(selnode, node))
                    return;
                /** @type {?} */
                var shape = node.findObject('SHAPE');
                if (shape) {
                    shape._prevFill = shape.fill; // remember the original brush
                    shape.fill = 'darkred';
                }
            },
            mouseDragLeave: (e, node, next) => {
                /** @type {?} */
                var shape = node.findObject('SHAPE');
                if (shape && shape._prevFill) {
                    shape.fill = shape._prevFill; // restore the original brush
                }
            },
            mouseDrop: (e, node) => {
                /** @type {?} */
                var diagram = node.diagram;
                /** @type {?} */
                var selnode = diagram.selection.first(); // assume just one Node in selection
                if (mayWorkFor(selnode, node)) {
                    /** @type {?} */
                    var link = selnode.findTreeParentLink();
                    if (link !== null) {
                        // reconnect any existing link
                        link.fromNode = node;
                    }
                    else {
                        // else create a new link
                        diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
                    }
                }
            }
        }, $(go.Panel, 'Horizontal', {
            name: 'SHAPE',
            portId: '',
            fromLinkable: true,
            toLinkable: true,
            cursor: 'pointer'
        }, $(go.Picture, {
            name: 'Picture',
            desiredSize: new go.Size(65, 50),
            margin: new go.Margin(6, 8, 6, 10)
        }, new go.Binding('source')), $(go.Panel, 'Table', {
            maxSize: new go.Size(150, 999),
            margin: new go.Margin(6, 10, 0, 3),
            defaultAlignment: go.Spot.Left
        }, $(go.RowColumnDefinition, { column: 2, width: 4 }), $(go.TextBlock, {
            row: 0,
            column: 0,
            columnSpan: 5,
            font: '12pt Segoe UI,sans-serif',
            editable: true,
            isMultiline: false,
            minSize: new go.Size(10, 16)
        }, new go.Binding('text', 'name').makeTwoWay()), $(go.TextBlock, 'Title: ', { row: 1, column: 0 }), $(go.TextBlock, {
            row: 1,
            column: 1,
            columnSpan: 4,
            editable: true,
            isMultiline: false,
            minSize: new go.Size(10, 14),
            margin: new go.Margin(0, 0, 0, 3)
        }, new go.Binding('text', 'title').makeTwoWay()), $(go.TextBlock, { row: 2, column: 0 }, new go.Binding('text', 'key', function (v) {
            return 'ID: ' + v;
        })), $(go.TextBlock, { name: 'boss', row: 2, column: 3 }, new go.Binding('text', 'parent', function (v) {
            return 'Boss: ' + v;
        })), $(go.TextBlock, {
            row: 3,
            column: 0,
            columnSpan: 5,
            font: 'italic 9pt sans-serif',
            wrap: go.TextBlock.WrapFit,
            editable: true,
            // by default newlines are allowed
            minSize: new go.Size(10, 14)
        }, new go.Binding('text', 'comments').makeTwoWay())) // end Table Panel
        ));
        this.diagram.nodeTemplate.contextMenu = $(go.Adornment, 'Vertical', $('ContextMenuButton', $(go.TextBlock, 'Remove Role'), {
            click: (e, obj) => {
                /** @type {?} */
                var node = obj.part.adornedPart;
                if (node !== null && node.data.key != 1) {
                    this.diagram.startTransaction('reparent remove');
                    /** @type {?} */
                    var chl = node.findTreeChildrenNodes();
                    // iterate through the children and set their parent key to our selected node's parent key
                    while (chl.next()) {
                        /** @type {?} */
                        var emp = chl.value;
                        model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
                    }
                    // and now remove the selected node itself
                    model.removeNodeData(node.data);
                    this.diagram.commitTransaction('reparent remove');
                }
            }
        }), $('ContextMenuButton', $(go.TextBlock, 'Remove Department'), {
            click: (e, obj) => {
                /** @type {?} */
                var node = obj.part.adornedPart;
                if (node !== null) {
                    this.diagram.startTransaction('remove dept');
                    this.diagram.removeParts(node.findTreeParts(), true);
                    this.diagram.commitTransaction('remove dept');
                }
            }
        }));
        /** @type {?} */
        let mayWorkFor = (node1, node2) => {
            if (!(node1 instanceof go.Node))
                return false; // must be a Node
            if (node1 === node2)
                return false; // cannot work for yourself
            if (node2.isInTreeOf(node1))
                return false; // cannot work for someone who works for you
            return true;
        };
        /** @type {?} */
        let nodeIdCounter = -1;
        /** @type {?} */
        let getNextKey = () => {
            /** @type {?} */
            var key = nodeIdCounter;
            while (this.diagram.model.findNodeDataForKey(key) !== null) {
                key = nodeIdCounter--;
            }
            return key;
        };
        // define the Link template
        this.diagram.linkTemplate = $(go.Link, go.Link.Orthogonal, { corner: 5, relinkableFrom: true, relinkableTo: true }, $(go.Shape, { strokeWidth: 4, stroke: '#00a4a4' })); // the link shape
        model.nodeDataArray = [
            {
                key: 1,
                name: 'Stella Payne Diaz',
                title: 'CEO',
                source: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 2,
                name: 'Luke Warm',
                title: 'VP Marketing/Sales',
                parent: 1,
                source: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 3,
                name: 'Meg Meehan Hoffa',
                title: 'Sales',
                parent: 2,
                source: 'https://images.pexels.com/photos/324658/pexels-photo-324658.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 4,
                name: 'Peggy Flaming',
                title: 'VP Engineering',
                parent: 1,
                source: 'https://images.pexels.com/photos/756453/pexels-photo-756453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
                key: 5,
                name: 'Saul Wellingood',
                title: 'Manufacturing',
                parent: 4,
                source: 'https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 6,
                name: 'Al Ligori',
                title: 'Marketing',
                parent: 2,
                source: 'https://images.pexels.com/photos/407237/pexels-photo-407237.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 7,
                name: 'Dot Stubadd',
                title: 'Sales Rep',
                parent: 3,
                source: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 8,
                name: 'Les Ismore',
                title: 'Project Mgr',
                parent: 5,
                source: 'https://images.pexels.com/photos/709188/pexels-photo-709188.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 9,
                name: 'April Lynn Parris',
                title: 'Events Mgr',
                parent: 6,
                source: 'https://images.pexels.com/photos/355164/pexels-photo-355164.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 10,
                name: 'Anita Hammer',
                title: 'Process',
                parent: 5,
                source: 'https://images.pexels.com/photos/818819/pexels-photo-818819.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 11,
                name: 'Evan Elpus',
                title: 'Quality',
                parent: 5,
                source: 'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&h=350'
            },
            {
                key: 12,
                name: 'Lotta B. Essen',
                title: 'Sales Rep',
                parent: 3,
                source: 'https://images.pexels.com/photos/462680/pexels-photo-462680.jpeg?auto=compress&cs=tinysrgb&h=350s'
            }
        ];
        this.diagram.model = model;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.diagram.div = this.diagramRef.nativeElement;
    }
}
GojsComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-gojs',
                template: "<div #diagramDiv\n     class=\"diagramDiv\"></div>\n",
                styles: [".diagramDiv{width:100vw;min-height:80vh;margin:0}"]
            }] }
];
/** @nocollapse */
GojsComponent.ctorParameters = () => [];
GojsComponent.propDecorators = {
    diagramRef: [{ type: ViewChild, args: ['diagramDiv',] }]
};
if (false) {
    /** @type {?} */
    GojsComponent.prototype.diagram;
    /** @type {?} */
    GojsComponent.prototype.diagramRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29qcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9kZW1vbGliLWdvanMvIiwic291cmNlcyI6WyJzcmMvZ29qcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RSxPQUFPLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQU8zQixNQUFNO0lBTUo7dUJBTHNCLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTs7UUFNcEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7O1FBQzlCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7WUFDckMsS0FBSyxFQUFFLEVBQUU7WUFDVCxZQUFZLEVBQUUsRUFBRTtTQUNqQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQzNCLEVBQUUsQ0FBQyxJQUFJLEVBQ1AsWUFBWSxFQUNaLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUN6QjtZQUNFLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTs7Z0JBQ3RCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUks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QVUsQ0FBQyxhQUFhLENBQUM7S0FDbEQ7OztZQXRVRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLGdFQUFvQzs7YUFFckM7Ozs7O3lCQUlFLFNBQVMsU0FBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgZ28gZnJvbSAnZ29qcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1nb2pzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2dvanMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9nb2pzLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBHb2pzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZGlhZ3JhbTogZ28uRGlhZ3JhbSA9IG5ldyBnby5EaWFncmFtKCk7XG5cbiAgQFZpZXdDaGlsZCgnZGlhZ3JhbURpdicpXG4gIHByaXZhdGUgZGlhZ3JhbVJlZjogRWxlbWVudFJlZjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCAkID0gZ28uR3JhcGhPYmplY3QubWFrZTtcbiAgICBjb25zdCBtb2RlbCA9ICQoZ28uVHJlZU1vZGVsKTtcbiAgICB0aGlzLmRpYWdyYW0gPSBuZXcgZ28uRGlhZ3JhbSgpO1xuICAgIHRoaXMuZGlhZ3JhbS5pbml0aWFsQ29udGVudEFsaWdubWVudCA9IGdvLlNwb3QuQ2VudGVyO1xuICAgIHRoaXMuZGlhZ3JhbS51bmRvTWFuYWdlci5pc0VuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZGlhZ3JhbS5sYXlvdXQgPSAkKGdvLlRyZWVMYXlvdXQsIHtcbiAgICAgIGFuZ2xlOiA5MCxcbiAgICAgIGxheWVyU3BhY2luZzogMzVcbiAgICB9KTtcblxuICAgIHRoaXMuZGlhZ3JhbS5ub2RlVGVtcGxhdGUgPSAkKFxuICAgICAgZ28uTm9kZSxcbiAgICAgICdIb3Jpem9udGFsJyxcbiAgICAgIHsgYmFja2dyb3VuZDogJyMxN2EyYjEnIH0sXG4gICAgICB7XG4gICAgICAgIGRvdWJsZUNsaWNrOiAoZSwgb2JqKSA9PiB7XG4gICAgICAgICAgdmFyIGNsaWNrZWQgPSBvYmoucGFydDtcbiAgICAgICAgICBpZiAoY2xpY2tlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHRoaXNlbXAgPSBjbGlja2VkLmRhdGE7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0uc3RhcnRUcmFuc2FjdGlvbignYWRkIGVtcGxveWVlJyk7XG4gICAgICAgICAgICB2YXIgbmV3ZW1wID0ge1xuICAgICAgICAgICAgICBrZXk6IGdldE5leHRLZXkoKSxcbiAgICAgICAgICAgICAgbmFtZTogJyhuZXcgcGVyc29uKScsXG4gICAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgICAgc291cmNlOiAnaHR0cHM6Ly93d3cuYWNycG5ldC5vcmcvd3AtY29udGVudC91cGxvYWRzLzIwMTYvMDkvVXNlci1JY29uLUdyYXkuanBnJyxcbiAgICAgICAgICAgICAgcGFyZW50OiB0aGlzZW1wLmtleVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5tb2RlbC5hZGROb2RlRGF0YShuZXdlbXApO1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLmNvbW1pdFRyYW5zYWN0aW9uKCdhZGQgZW1wbG95ZWUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIGhhbmRsZSBkcmFnZ2luZyBhIE5vZGUgb250byBhIE5vZGUgdG8gKG1heWJlKSBjaGFuZ2UgdGhlIHJlcG9ydGluZyByZWxhdGlvbnNoaXBcbiAgICAgICAgbW91c2VEcmFnRW50ZXI6IChlLCBub2RlLCBwcmV2KSA9PiB7XG4gICAgICAgICAgdmFyIGRpYWdyYW0gPSBub2RlLmRpYWdyYW07XG4gICAgICAgICAgdmFyIHNlbG5vZGUgPSBkaWFncmFtLnNlbGVjdGlvbi5maXJzdCgpO1xuICAgICAgICAgIGlmICghbWF5V29ya0ZvcihzZWxub2RlLCBub2RlKSkgcmV0dXJuO1xuICAgICAgICAgIHZhciBzaGFwZSA9IG5vZGUuZmluZE9iamVjdCgnU0hBUEUnKTtcbiAgICAgICAgICBpZiAoc2hhcGUpIHtcbiAgICAgICAgICAgIHNoYXBlLl9wcmV2RmlsbCA9IHNoYXBlLmZpbGw7IC8vIHJlbWVtYmVyIHRoZSBvcmlnaW5hbCBicnVzaFxuICAgICAgICAgICAgc2hhcGUuZmlsbCA9ICdkYXJrcmVkJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRHJhZ0xlYXZlOiAoZSwgbm9kZSwgbmV4dCkgPT4ge1xuICAgICAgICAgIHZhciBzaGFwZSA9IG5vZGUuZmluZE9iamVjdCgnU0hBUEUnKTtcbiAgICAgICAgICBpZiAoc2hhcGUgJiYgc2hhcGUuX3ByZXZGaWxsKSB7XG4gICAgICAgICAgICBzaGFwZS5maWxsID0gc2hhcGUuX3ByZXZGaWxsOyAvLyByZXN0b3JlIHRoZSBvcmlnaW5hbCBicnVzaFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VEcm9wOiAoZSwgbm9kZSkgPT4ge1xuICAgICAgICAgIHZhciBkaWFncmFtID0gbm9kZS5kaWFncmFtO1xuICAgICAgICAgIHZhciBzZWxub2RlID0gZGlhZ3JhbS5zZWxlY3Rpb24uZmlyc3QoKTsgLy8gYXNzdW1lIGp1c3Qgb25lIE5vZGUgaW4gc2VsZWN0aW9uXG4gICAgICAgICAgaWYgKG1heVdvcmtGb3Ioc2Vsbm9kZSwgbm9kZSkpIHtcbiAgICAgICAgICAgIC8vIGZpbmQgYW55IGV4aXN0aW5nIGxpbmsgaW50byB0aGUgc2VsZWN0ZWQgbm9kZVxuICAgICAgICAgICAgdmFyIGxpbmsgPSBzZWxub2RlLmZpbmRUcmVlUGFyZW50TGluaygpO1xuICAgICAgICAgICAgaWYgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgLy8gcmVjb25uZWN0IGFueSBleGlzdGluZyBsaW5rXG4gICAgICAgICAgICAgIGxpbmsuZnJvbU5vZGUgPSBub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZWxzZSBjcmVhdGUgYSBuZXcgbGlua1xuICAgICAgICAgICAgICBkaWFncmFtLnRvb2xNYW5hZ2VyLmxpbmtpbmdUb29sLmluc2VydExpbmsobm9kZSwgbm9kZS5wb3J0LCBzZWxub2RlLCBzZWxub2RlLnBvcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICQoXG4gICAgICAgIGdvLlBhbmVsLFxuICAgICAgICAnSG9yaXpvbnRhbCcsXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnU0hBUEUnLFxuICAgICAgICAgIHBvcnRJZDogJycsXG4gICAgICAgICAgZnJvbUxpbmthYmxlOiB0cnVlLFxuICAgICAgICAgIHRvTGlua2FibGU6IHRydWUsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfSxcbiAgICAgICAgJChcbiAgICAgICAgICBnby5QaWN0dXJlLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQaWN0dXJlJyxcbiAgICAgICAgICAgIGRlc2lyZWRTaXplOiBuZXcgZ28uU2l6ZSg2NSwgNTApLFxuICAgICAgICAgICAgbWFyZ2luOiBuZXcgZ28uTWFyZ2luKDYsIDgsIDYsIDEwKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmV3IGdvLkJpbmRpbmcoJ3NvdXJjZScpXG4gICAgICAgICksXG4gICAgICAgICQoXG4gICAgICAgICAgZ28uUGFuZWwsXG4gICAgICAgICAgJ1RhYmxlJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXhTaXplOiBuZXcgZ28uU2l6ZSgxNTAsIDk5OSksXG4gICAgICAgICAgICBtYXJnaW46IG5ldyBnby5NYXJnaW4oNiwgMTAsIDAsIDMpLFxuICAgICAgICAgICAgZGVmYXVsdEFsaWdubWVudDogZ28uU3BvdC5MZWZ0XG4gICAgICAgICAgfSxcbiAgICAgICAgICAkKGdvLlJvd0NvbHVtbkRlZmluaXRpb24sIHsgY29sdW1uOiAyLCB3aWR0aDogNCB9KSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgZ28uVGV4dEJsb2NrLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByb3c6IDAsXG4gICAgICAgICAgICAgIGNvbHVtbjogMCxcbiAgICAgICAgICAgICAgY29sdW1uU3BhbjogNSxcbiAgICAgICAgICAgICAgZm9udDogJzEycHQgU2Vnb2UgVUksc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpc011bHRpbGluZTogZmFsc2UsXG4gICAgICAgICAgICAgIG1pblNpemU6IG5ldyBnby5TaXplKDEwLCAxNilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXcgZ28uQmluZGluZygndGV4dCcsICduYW1lJykubWFrZVR3b1dheSgpXG4gICAgICAgICAgKSxcbiAgICAgICAgICAkKGdvLlRleHRCbG9jaywgJ1RpdGxlOiAnLCB7IHJvdzogMSwgY29sdW1uOiAwIH0pLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBnby5UZXh0QmxvY2ssXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJvdzogMSxcbiAgICAgICAgICAgICAgY29sdW1uOiAxLFxuICAgICAgICAgICAgICBjb2x1bW5TcGFuOiA0LFxuICAgICAgICAgICAgICBlZGl0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaXNNdWx0aWxpbmU6IGZhbHNlLFxuICAgICAgICAgICAgICBtaW5TaXplOiBuZXcgZ28uU2l6ZSgxMCwgMTQpLFxuICAgICAgICAgICAgICBtYXJnaW46IG5ldyBnby5NYXJnaW4oMCwgMCwgMCwgMylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXcgZ28uQmluZGluZygndGV4dCcsICd0aXRsZScpLm1ha2VUd29XYXkoKVxuICAgICAgICAgICksXG4gICAgICAgICAgJChcbiAgICAgICAgICAgIGdvLlRleHRCbG9jayxcbiAgICAgICAgICAgIHsgcm93OiAyLCBjb2x1bW46IDAgfSxcbiAgICAgICAgICAgIG5ldyBnby5CaW5kaW5nKCd0ZXh0JywgJ2tleScsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdJRDogJyArIHY7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgJChcbiAgICAgICAgICAgIGdvLlRleHRCbG9jayxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Jvc3MnLCByb3c6IDIsIGNvbHVtbjogMyB9LFxuICAgICAgICAgICAgbmV3IGdvLkJpbmRpbmcoJ3RleHQnLCAncGFyZW50JywgZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICByZXR1cm4gJ0Jvc3M6ICcgKyB2O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBnby5UZXh0QmxvY2ssXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJvdzogMyxcbiAgICAgICAgICAgICAgY29sdW1uOiAwLFxuICAgICAgICAgICAgICBjb2x1bW5TcGFuOiA1LFxuICAgICAgICAgICAgICBmb250OiAnaXRhbGljIDlwdCBzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgICAgd3JhcDogZ28uVGV4dEJsb2NrLldyYXBGaXQsXG4gICAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLCAvLyBieSBkZWZhdWx0IG5ld2xpbmVzIGFyZSBhbGxvd2VkXG4gICAgICAgICAgICAgIG1pblNpemU6IG5ldyBnby5TaXplKDEwLCAxNClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXcgZ28uQmluZGluZygndGV4dCcsICdjb21tZW50cycpLm1ha2VUd29XYXkoKVxuICAgICAgICAgIClcbiAgICAgICAgKSAvLyBlbmQgVGFibGUgUGFuZWxcbiAgICAgIClcbiAgICApO1xuXG4gICAgdGhpcy5kaWFncmFtLm5vZGVUZW1wbGF0ZS5jb250ZXh0TWVudSA9ICQoXG4gICAgICBnby5BZG9ybm1lbnQsXG4gICAgICAnVmVydGljYWwnLFxuICAgICAgJCgnQ29udGV4dE1lbnVCdXR0b24nLCAkKGdvLlRleHRCbG9jaywgJ1JlbW92ZSBSb2xlJyksIHtcbiAgICAgICAgY2xpY2s6IChlLCBvYmopID0+IHtcbiAgICAgICAgICAvLyByZXBhcmVudCB0aGUgc3VidHJlZSB0byB0aGlzIG5vZGUncyBib3NzLCB0aGVuIHJlbW92ZSB0aGUgbm9kZVxuICAgICAgICAgIHZhciBub2RlID0gb2JqLnBhcnQuYWRvcm5lZFBhcnQ7XG4gICAgICAgICAgaWYgKG5vZGUgIT09IG51bGwgJiYgbm9kZS5kYXRhLmtleSAhPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0uc3RhcnRUcmFuc2FjdGlvbigncmVwYXJlbnQgcmVtb3ZlJyk7XG4gICAgICAgICAgICB2YXIgY2hsID0gbm9kZS5maW5kVHJlZUNoaWxkcmVuTm9kZXMoKTtcbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCB0aGUgY2hpbGRyZW4gYW5kIHNldCB0aGVpciBwYXJlbnQga2V5IHRvIG91ciBzZWxlY3RlZCBub2RlJ3MgcGFyZW50IGtleVxuICAgICAgICAgICAgd2hpbGUgKGNobC5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgdmFyIGVtcCA9IGNobC52YWx1ZTtcbiAgICAgICAgICAgICAgbW9kZWwuc2V0UGFyZW50S2V5Rm9yTm9kZURhdGEoZW1wLmRhdGEsIG5vZGUuZmluZFRyZWVQYXJlbnROb2RlKCkuZGF0YS5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYW5kIG5vdyByZW1vdmUgdGhlIHNlbGVjdGVkIG5vZGUgaXRzZWxmXG4gICAgICAgICAgICBtb2RlbC5yZW1vdmVOb2RlRGF0YShub2RlLmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLmNvbW1pdFRyYW5zYWN0aW9uKCdyZXBhcmVudCByZW1vdmUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgJCgnQ29udGV4dE1lbnVCdXR0b24nLCAkKGdvLlRleHRCbG9jaywgJ1JlbW92ZSBEZXBhcnRtZW50JyksIHtcbiAgICAgICAgY2xpY2s6IChlLCBvYmopID0+IHtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIHdob2xlIHN1YnRyZWUsIGluY2x1ZGluZyB0aGUgbm9kZSBpdHNlbGZcbiAgICAgICAgICB2YXIgbm9kZSA9IG9iai5wYXJ0LmFkb3JuZWRQYXJ0O1xuICAgICAgICAgIGlmIChub2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0uc3RhcnRUcmFuc2FjdGlvbigncmVtb3ZlIGRlcHQnKTtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5yZW1vdmVQYXJ0cyhub2RlLmZpbmRUcmVlUGFydHMoKSwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0uY29tbWl0VHJhbnNhY3Rpb24oJ3JlbW92ZSBkZXB0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBsZXQgbWF5V29ya0ZvciA9IChub2RlMSwgbm9kZTIpID0+IHtcbiAgICAgIGlmICghKG5vZGUxIGluc3RhbmNlb2YgZ28uTm9kZSkpIHJldHVybiBmYWxzZTsgLy8gbXVzdCBiZSBhIE5vZGVcbiAgICAgIGlmIChub2RlMSA9PT0gbm9kZTIpIHJldHVybiBmYWxzZTsgLy8gY2Fubm90IHdvcmsgZm9yIHlvdXJzZWxmXG4gICAgICBpZiAobm9kZTIuaXNJblRyZWVPZihub2RlMSkpIHJldHVybiBmYWxzZTsgLy8gY2Fubm90IHdvcmsgZm9yIHNvbWVvbmUgd2hvIHdvcmtzIGZvciB5b3VcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBsZXQgbm9kZUlkQ291bnRlciA9IC0xO1xuXG4gICAgbGV0IGdldE5leHRLZXkgPSAoKSA9PiB7XG4gICAgICB2YXIga2V5ID0gbm9kZUlkQ291bnRlcjtcbiAgICAgIHdoaWxlICh0aGlzLmRpYWdyYW0ubW9kZWwuZmluZE5vZGVEYXRhRm9yS2V5KGtleSkgIT09IG51bGwpIHtcbiAgICAgICAga2V5ID0gbm9kZUlkQ291bnRlci0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGtleTtcbiAgICB9O1xuXG4gICAgLy8gZGVmaW5lIHRoZSBMaW5rIHRlbXBsYXRlXG4gICAgdGhpcy5kaWFncmFtLmxpbmtUZW1wbGF0ZSA9ICQoXG4gICAgICBnby5MaW5rLFxuICAgICAgZ28uTGluay5PcnRob2dvbmFsLFxuICAgICAgeyBjb3JuZXI6IDUsIHJlbGlua2FibGVGcm9tOiB0cnVlLCByZWxpbmthYmxlVG86IHRydWUgfSxcbiAgICAgICQoZ28uU2hhcGUsIHsgc3Ryb2tlV2lkdGg6IDQsIHN0cm9rZTogJyMwMGE0YTQnIH0pXG4gICAgKTsgLy8gdGhlIGxpbmsgc2hhcGVcblxuICAgIG1vZGVsLm5vZGVEYXRhQXJyYXkgPSBbXG4gICAgICB7XG4gICAgICAgIGtleTogMSxcbiAgICAgICAgbmFtZTogJ1N0ZWxsYSBQYXluZSBEaWF6JyxcbiAgICAgICAgdGl0bGU6ICdDRU8nLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzEyMzkyOTEvcGV4ZWxzLXBob3RvLTEyMzkyOTEuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAyLFxuICAgICAgICBuYW1lOiAnTHVrZSBXYXJtJyxcbiAgICAgICAgdGl0bGU6ICdWUCBNYXJrZXRpbmcvU2FsZXMnLFxuICAgICAgICBwYXJlbnQ6IDEsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvNjE0ODEwL3BleGVscy1waG90by02MTQ4MTAuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAzLFxuICAgICAgICBuYW1lOiAnTWVnIE1lZWhhbiBIb2ZmYScsXG4gICAgICAgIHRpdGxlOiAnU2FsZXMnLFxuICAgICAgICBwYXJlbnQ6IDIsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvMzI0NjU4L3BleGVscy1waG90by0zMjQ2NTguanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiA0LFxuICAgICAgICBuYW1lOiAnUGVnZ3kgRmxhbWluZycsXG4gICAgICAgIHRpdGxlOiAnVlAgRW5naW5lZXJpbmcnLFxuICAgICAgICBwYXJlbnQ6IDEsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvNzU2NDUzL3BleGVscy1waG90by03NTY0NTMuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmRwcj0yJmg9NzUwJnc9MTI2MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogNSxcbiAgICAgICAgbmFtZTogJ1NhdWwgV2VsbGluZ29vZCcsXG4gICAgICAgIHRpdGxlOiAnTWFudWZhY3R1cmluZycsXG4gICAgICAgIHBhcmVudDogNCxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy85NDE2OTMvcGV4ZWxzLXBob3RvLTk0MTY5My5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDYsXG4gICAgICAgIG5hbWU6ICdBbCBMaWdvcmknLFxuICAgICAgICB0aXRsZTogJ01hcmtldGluZycsXG4gICAgICAgIHBhcmVudDogMixcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy80MDcyMzcvcGV4ZWxzLXBob3RvLTQwNzIzNy5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDcsXG4gICAgICAgIG5hbWU6ICdEb3QgU3R1YmFkZCcsXG4gICAgICAgIHRpdGxlOiAnU2FsZXMgUmVwJyxcbiAgICAgICAgcGFyZW50OiAzLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzg0Njc0MS9wZXhlbHMtcGhvdG8tODQ2NzQxLmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogOCxcbiAgICAgICAgbmFtZTogJ0xlcyBJc21vcmUnLFxuICAgICAgICB0aXRsZTogJ1Byb2plY3QgTWdyJyxcbiAgICAgICAgcGFyZW50OiA1LFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzcwOTE4OC9wZXhlbHMtcGhvdG8tNzA5MTg4LmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogOSxcbiAgICAgICAgbmFtZTogJ0FwcmlsIEx5bm4gUGFycmlzJyxcbiAgICAgICAgdGl0bGU6ICdFdmVudHMgTWdyJyxcbiAgICAgICAgcGFyZW50OiA2LFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzM1NTE2NC9wZXhlbHMtcGhvdG8tMzU1MTY0LmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogMTAsXG4gICAgICAgIG5hbWU6ICdBbml0YSBIYW1tZXInLFxuICAgICAgICB0aXRsZTogJ1Byb2Nlc3MnLFxuICAgICAgICBwYXJlbnQ6IDUsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvODE4ODE5L3BleGVscy1waG90by04MTg4MTkuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBrZXk6IDExLFxuICAgICAgICBuYW1lOiAnRXZhbiBFbHB1cycsXG4gICAgICAgIHRpdGxlOiAnUXVhbGl0eScsXG4gICAgICAgIHBhcmVudDogNSxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy8xMDM2NjI3L3BleGVscy1waG90by0xMDM2NjI3LmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogMTIsXG4gICAgICAgIG5hbWU6ICdMb3R0YSBCLiBFc3NlbicsXG4gICAgICAgIHRpdGxlOiAnU2FsZXMgUmVwJyxcbiAgICAgICAgcGFyZW50OiAzLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzQ2MjY4MC9wZXhlbHMtcGhvdG8tNDYyNjgwLmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MHMnXG4gICAgICB9XG4gICAgXTtcbiAgICB0aGlzLmRpYWdyYW0ubW9kZWwgPSBtb2RlbDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZGlhZ3JhbS5kaXYgPSB0aGlzLmRpYWdyYW1SZWYubmF0aXZlRWxlbWVudDtcbiAgfVxufVxuIl19