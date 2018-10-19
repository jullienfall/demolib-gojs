import { Component, ViewChild, NgModule } from '@angular/core';
import { Diagram, GraphObject, TreeModel, Spot, TreeLayout, Node, Panel, Picture, Size, Margin, Binding, RowColumnDefinition, TextBlock, Adornment, Link, Shape } from 'gojs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class GojsComponent {
    constructor() {
        this.diagram = new Diagram();
        /** @type {?} */
        const $ = GraphObject.make;
        /** @type {?} */
        const model = $(TreeModel);
        this.diagram = new Diagram();
        this.diagram.initialContentAlignment = Spot.Center;
        this.diagram.undoManager.isEnabled = true;
        this.diagram.layout = $(TreeLayout, {
            angle: 90,
            layerSpacing: 35
        });
        this.diagram.nodeTemplate = $(Node, 'Horizontal', { background: '#17a2b1' }, {
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
        }, $(Panel, 'Horizontal', {
            name: 'SHAPE',
            portId: '',
            fromLinkable: true,
            toLinkable: true,
            cursor: 'pointer'
        }, $(Picture, {
            name: 'Picture',
            desiredSize: new Size(65, 50),
            margin: new Margin(6, 8, 6, 10)
        }, new Binding('source')), $(Panel, 'Table', {
            maxSize: new Size(150, 999),
            margin: new Margin(6, 10, 0, 3),
            defaultAlignment: Spot.Left
        }, $(RowColumnDefinition, { column: 2, width: 4 }), $(TextBlock, {
            row: 0,
            column: 0,
            columnSpan: 5,
            font: '12pt Segoe UI,sans-serif',
            editable: true,
            isMultiline: false,
            minSize: new Size(10, 16)
        }, new Binding('text', 'name').makeTwoWay()), $(TextBlock, 'Title: ', { row: 1, column: 0 }), $(TextBlock, {
            row: 1,
            column: 1,
            columnSpan: 4,
            editable: true,
            isMultiline: false,
            minSize: new Size(10, 14),
            margin: new Margin(0, 0, 0, 3)
        }, new Binding('text', 'title').makeTwoWay()), $(TextBlock, { row: 2, column: 0 }, new Binding('text', 'key', function (v) {
            return 'ID: ' + v;
        })), $(TextBlock, { name: 'boss', row: 2, column: 3 }, new Binding('text', 'parent', function (v) {
            return 'Boss: ' + v;
        })), $(TextBlock, {
            row: 3,
            column: 0,
            columnSpan: 5,
            font: 'italic 9pt sans-serif',
            wrap: TextBlock.WrapFit,
            editable: true,
            // by default newlines are allowed
            minSize: new Size(10, 14)
        }, new Binding('text', 'comments').makeTwoWay())) // end Table Panel
        ));
        this.diagram.nodeTemplate.contextMenu = $(Adornment, 'Vertical', $('ContextMenuButton', $(TextBlock, 'Remove Role'), {
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
        }), $('ContextMenuButton', $(TextBlock, 'Remove Department'), {
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
            if (!(node1 instanceof Node))
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
        this.diagram.linkTemplate = $(Link, Link.Orthogonal, { corner: 5, relinkableFrom: true, relinkableTo: true }, $(Shape, { strokeWidth: 4, stroke: '#00a4a4' })); // the link shape
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
                template: "<div #diagramDiv\n     class=\"diagramDiv\">GoJS</div>",
                styles: [".diagramDiv{width:100vw;min-height:80vh;margin:0}"]
            }] }
];
/** @nocollapse */
GojsComponent.ctorParameters = () => [];
GojsComponent.propDecorators = {
    diagramRef: [{ type: ViewChild, args: ['diagramDiv',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class GojsModule {
}
GojsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    RouterModule.forChild([{ path: 'gojs', component: GojsComponent }])
                ],
                declarations: [GojsComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { GojsModule, GojsComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb2xpYi1nb2pzLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9kZW1vbGliLWdvanMvc3JjL2dvanMuY29tcG9uZW50LnRzIiwibmc6Ly9kZW1vbGliLWdvanMvc3JjL2dvanMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIGdvIGZyb20gJ2dvanMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtZ29qcycsXG4gIHRlbXBsYXRlVXJsOiAnLi9nb2pzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZ29qcy5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgR29qc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGRpYWdyYW06IGdvLkRpYWdyYW0gPSBuZXcgZ28uRGlhZ3JhbSgpO1xuXG4gIEBWaWV3Q2hpbGQoJ2RpYWdyYW1EaXYnKVxuICBwcml2YXRlIGRpYWdyYW1SZWY6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgJCA9IGdvLkdyYXBoT2JqZWN0Lm1ha2U7XG4gICAgY29uc3QgbW9kZWwgPSAkKGdvLlRyZWVNb2RlbCk7XG4gICAgdGhpcy5kaWFncmFtID0gbmV3IGdvLkRpYWdyYW0oKTtcbiAgICB0aGlzLmRpYWdyYW0uaW5pdGlhbENvbnRlbnRBbGlnbm1lbnQgPSBnby5TcG90LkNlbnRlcjtcbiAgICB0aGlzLmRpYWdyYW0udW5kb01hbmFnZXIuaXNFbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmRpYWdyYW0ubGF5b3V0ID0gJChnby5UcmVlTGF5b3V0LCB7XG4gICAgICBhbmdsZTogOTAsXG4gICAgICBsYXllclNwYWNpbmc6IDM1XG4gICAgfSk7XG5cbiAgICB0aGlzLmRpYWdyYW0ubm9kZVRlbXBsYXRlID0gJChcbiAgICAgIGdvLk5vZGUsXG4gICAgICAnSG9yaXpvbnRhbCcsXG4gICAgICB7IGJhY2tncm91bmQ6ICcjMTdhMmIxJyB9LFxuICAgICAge1xuICAgICAgICBkb3VibGVDbGljazogKGUsIG9iaikgPT4ge1xuICAgICAgICAgIHZhciBjbGlja2VkID0gb2JqLnBhcnQ7XG4gICAgICAgICAgaWYgKGNsaWNrZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciB0aGlzZW1wID0gY2xpY2tlZC5kYXRhO1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLnN0YXJ0VHJhbnNhY3Rpb24oJ2FkZCBlbXBsb3llZScpO1xuICAgICAgICAgICAgdmFyIG5ld2VtcCA9IHtcbiAgICAgICAgICAgICAga2V5OiBnZXROZXh0S2V5KCksXG4gICAgICAgICAgICAgIG5hbWU6ICcobmV3IHBlcnNvbiknLFxuICAgICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICAgIHNvdXJjZTogJ2h0dHBzOi8vd3d3LmFjcnBuZXQub3JnL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE2LzA5L1VzZXItSWNvbi1HcmF5LmpwZycsXG4gICAgICAgICAgICAgIHBhcmVudDogdGhpc2VtcC5rZXlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0ubW9kZWwuYWRkTm9kZURhdGEobmV3ZW1wKTtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5jb21taXRUcmFuc2FjdGlvbignYWRkIGVtcGxveWVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBoYW5kbGUgZHJhZ2dpbmcgYSBOb2RlIG9udG8gYSBOb2RlIHRvIChtYXliZSkgY2hhbmdlIHRoZSByZXBvcnRpbmcgcmVsYXRpb25zaGlwXG4gICAgICAgIG1vdXNlRHJhZ0VudGVyOiAoZSwgbm9kZSwgcHJldikgPT4ge1xuICAgICAgICAgIHZhciBkaWFncmFtID0gbm9kZS5kaWFncmFtO1xuICAgICAgICAgIHZhciBzZWxub2RlID0gZGlhZ3JhbS5zZWxlY3Rpb24uZmlyc3QoKTtcbiAgICAgICAgICBpZiAoIW1heVdvcmtGb3Ioc2Vsbm9kZSwgbm9kZSkpIHJldHVybjtcbiAgICAgICAgICB2YXIgc2hhcGUgPSBub2RlLmZpbmRPYmplY3QoJ1NIQVBFJyk7XG4gICAgICAgICAgaWYgKHNoYXBlKSB7XG4gICAgICAgICAgICBzaGFwZS5fcHJldkZpbGwgPSBzaGFwZS5maWxsOyAvLyByZW1lbWJlciB0aGUgb3JpZ2luYWwgYnJ1c2hcbiAgICAgICAgICAgIHNoYXBlLmZpbGwgPSAnZGFya3JlZCc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VzZURyYWdMZWF2ZTogKGUsIG5vZGUsIG5leHQpID0+IHtcbiAgICAgICAgICB2YXIgc2hhcGUgPSBub2RlLmZpbmRPYmplY3QoJ1NIQVBFJyk7XG4gICAgICAgICAgaWYgKHNoYXBlICYmIHNoYXBlLl9wcmV2RmlsbCkge1xuICAgICAgICAgICAgc2hhcGUuZmlsbCA9IHNoYXBlLl9wcmV2RmlsbDsgLy8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgYnJ1c2hcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRHJvcDogKGUsIG5vZGUpID0+IHtcbiAgICAgICAgICB2YXIgZGlhZ3JhbSA9IG5vZGUuZGlhZ3JhbTtcbiAgICAgICAgICB2YXIgc2Vsbm9kZSA9IGRpYWdyYW0uc2VsZWN0aW9uLmZpcnN0KCk7IC8vIGFzc3VtZSBqdXN0IG9uZSBOb2RlIGluIHNlbGVjdGlvblxuICAgICAgICAgIGlmIChtYXlXb3JrRm9yKHNlbG5vZGUsIG5vZGUpKSB7XG4gICAgICAgICAgICAvLyBmaW5kIGFueSBleGlzdGluZyBsaW5rIGludG8gdGhlIHNlbGVjdGVkIG5vZGVcbiAgICAgICAgICAgIHZhciBsaW5rID0gc2Vsbm9kZS5maW5kVHJlZVBhcmVudExpbmsoKTtcbiAgICAgICAgICAgIGlmIChsaW5rICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIC8vIHJlY29ubmVjdCBhbnkgZXhpc3RpbmcgbGlua1xuICAgICAgICAgICAgICBsaW5rLmZyb21Ob2RlID0gbm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGVsc2UgY3JlYXRlIGEgbmV3IGxpbmtcbiAgICAgICAgICAgICAgZGlhZ3JhbS50b29sTWFuYWdlci5saW5raW5nVG9vbC5pbnNlcnRMaW5rKG5vZGUsIG5vZGUucG9ydCwgc2Vsbm9kZSwgc2Vsbm9kZS5wb3J0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAkKFxuICAgICAgICBnby5QYW5lbCxcbiAgICAgICAgJ0hvcml6b250YWwnLFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1NIQVBFJyxcbiAgICAgICAgICBwb3J0SWQ6ICcnLFxuICAgICAgICAgIGZyb21MaW5rYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0b0xpbmthYmxlOiB0cnVlLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH0sXG4gICAgICAgICQoXG4gICAgICAgICAgZ28uUGljdHVyZSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUGljdHVyZScsXG4gICAgICAgICAgICBkZXNpcmVkU2l6ZTogbmV3IGdvLlNpemUoNjUsIDUwKSxcbiAgICAgICAgICAgIG1hcmdpbjogbmV3IGdvLk1hcmdpbig2LCA4LCA2LCAxMClcbiAgICAgICAgICB9LFxuICAgICAgICAgIG5ldyBnby5CaW5kaW5nKCdzb3VyY2UnKVxuICAgICAgICApLFxuICAgICAgICAkKFxuICAgICAgICAgIGdvLlBhbmVsLFxuICAgICAgICAgICdUYWJsZScsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWF4U2l6ZTogbmV3IGdvLlNpemUoMTUwLCA5OTkpLFxuICAgICAgICAgICAgbWFyZ2luOiBuZXcgZ28uTWFyZ2luKDYsIDEwLCAwLCAzKSxcbiAgICAgICAgICAgIGRlZmF1bHRBbGlnbm1lbnQ6IGdvLlNwb3QuTGVmdFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJChnby5Sb3dDb2x1bW5EZWZpbml0aW9uLCB7IGNvbHVtbjogMiwgd2lkdGg6IDQgfSksXG4gICAgICAgICAgJChcbiAgICAgICAgICAgIGdvLlRleHRCbG9jayxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcm93OiAwLFxuICAgICAgICAgICAgICBjb2x1bW46IDAsXG4gICAgICAgICAgICAgIGNvbHVtblNwYW46IDUsXG4gICAgICAgICAgICAgIGZvbnQ6ICcxMnB0IFNlZ29lIFVJLHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICBlZGl0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaXNNdWx0aWxpbmU6IGZhbHNlLFxuICAgICAgICAgICAgICBtaW5TaXplOiBuZXcgZ28uU2l6ZSgxMCwgMTYpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV3IGdvLkJpbmRpbmcoJ3RleHQnLCAnbmFtZScpLm1ha2VUd29XYXkoKVxuICAgICAgICAgICksXG4gICAgICAgICAgJChnby5UZXh0QmxvY2ssICdUaXRsZTogJywgeyByb3c6IDEsIGNvbHVtbjogMCB9KSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgZ28uVGV4dEJsb2NrLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByb3c6IDEsXG4gICAgICAgICAgICAgIGNvbHVtbjogMSxcbiAgICAgICAgICAgICAgY29sdW1uU3BhbjogNCxcbiAgICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlzTXVsdGlsaW5lOiBmYWxzZSxcbiAgICAgICAgICAgICAgbWluU2l6ZTogbmV3IGdvLlNpemUoMTAsIDE0KSxcbiAgICAgICAgICAgICAgbWFyZ2luOiBuZXcgZ28uTWFyZ2luKDAsIDAsIDAsIDMpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV3IGdvLkJpbmRpbmcoJ3RleHQnLCAndGl0bGUnKS5tYWtlVHdvV2F5KClcbiAgICAgICAgICApLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBnby5UZXh0QmxvY2ssXG4gICAgICAgICAgICB7IHJvdzogMiwgY29sdW1uOiAwIH0sXG4gICAgICAgICAgICBuZXcgZ28uQmluZGluZygndGV4dCcsICdrZXknLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgIHJldHVybiAnSUQ6ICcgKyB2O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBnby5UZXh0QmxvY2ssXG4gICAgICAgICAgICB7IG5hbWU6ICdib3NzJywgcm93OiAyLCBjb2x1bW46IDMgfSxcbiAgICAgICAgICAgIG5ldyBnby5CaW5kaW5nKCd0ZXh0JywgJ3BhcmVudCcsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdCb3NzOiAnICsgdjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgZ28uVGV4dEJsb2NrLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByb3c6IDMsXG4gICAgICAgICAgICAgIGNvbHVtbjogMCxcbiAgICAgICAgICAgICAgY29sdW1uU3BhbjogNSxcbiAgICAgICAgICAgICAgZm9udDogJ2l0YWxpYyA5cHQgc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgIHdyYXA6IGdvLlRleHRCbG9jay5XcmFwRml0LFxuICAgICAgICAgICAgICBlZGl0YWJsZTogdHJ1ZSwgLy8gYnkgZGVmYXVsdCBuZXdsaW5lcyBhcmUgYWxsb3dlZFxuICAgICAgICAgICAgICBtaW5TaXplOiBuZXcgZ28uU2l6ZSgxMCwgMTQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV3IGdvLkJpbmRpbmcoJ3RleHQnLCAnY29tbWVudHMnKS5tYWtlVHdvV2F5KClcbiAgICAgICAgICApXG4gICAgICAgICkgLy8gZW5kIFRhYmxlIFBhbmVsXG4gICAgICApXG4gICAgKTtcblxuICAgIHRoaXMuZGlhZ3JhbS5ub2RlVGVtcGxhdGUuY29udGV4dE1lbnUgPSAkKFxuICAgICAgZ28uQWRvcm5tZW50LFxuICAgICAgJ1ZlcnRpY2FsJyxcbiAgICAgICQoJ0NvbnRleHRNZW51QnV0dG9uJywgJChnby5UZXh0QmxvY2ssICdSZW1vdmUgUm9sZScpLCB7XG4gICAgICAgIGNsaWNrOiAoZSwgb2JqKSA9PiB7XG4gICAgICAgICAgLy8gcmVwYXJlbnQgdGhlIHN1YnRyZWUgdG8gdGhpcyBub2RlJ3MgYm9zcywgdGhlbiByZW1vdmUgdGhlIG5vZGVcbiAgICAgICAgICB2YXIgbm9kZSA9IG9iai5wYXJ0LmFkb3JuZWRQYXJ0O1xuICAgICAgICAgIGlmIChub2RlICE9PSBudWxsICYmIG5vZGUuZGF0YS5rZXkgIT0gMSkge1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLnN0YXJ0VHJhbnNhY3Rpb24oJ3JlcGFyZW50IHJlbW92ZScpO1xuICAgICAgICAgICAgdmFyIGNobCA9IG5vZGUuZmluZFRyZWVDaGlsZHJlbk5vZGVzKCk7XG4gICAgICAgICAgICAvLyBpdGVyYXRlIHRocm91Z2ggdGhlIGNoaWxkcmVuIGFuZCBzZXQgdGhlaXIgcGFyZW50IGtleSB0byBvdXIgc2VsZWN0ZWQgbm9kZSdzIHBhcmVudCBrZXlcbiAgICAgICAgICAgIHdoaWxlIChjaGwubmV4dCgpKSB7XG4gICAgICAgICAgICAgIHZhciBlbXAgPSBjaGwudmFsdWU7XG4gICAgICAgICAgICAgIG1vZGVsLnNldFBhcmVudEtleUZvck5vZGVEYXRhKGVtcC5kYXRhLCBub2RlLmZpbmRUcmVlUGFyZW50Tm9kZSgpLmRhdGEua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFuZCBub3cgcmVtb3ZlIHRoZSBzZWxlY3RlZCBub2RlIGl0c2VsZlxuICAgICAgICAgICAgbW9kZWwucmVtb3ZlTm9kZURhdGEobm9kZS5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5jb21taXRUcmFuc2FjdGlvbigncmVwYXJlbnQgcmVtb3ZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgICQoJ0NvbnRleHRNZW51QnV0dG9uJywgJChnby5UZXh0QmxvY2ssICdSZW1vdmUgRGVwYXJ0bWVudCcpLCB7XG4gICAgICAgIGNsaWNrOiAoZSwgb2JqKSA9PiB7XG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSB3aG9sZSBzdWJ0cmVlLCBpbmNsdWRpbmcgdGhlIG5vZGUgaXRzZWxmXG4gICAgICAgICAgdmFyIG5vZGUgPSBvYmoucGFydC5hZG9ybmVkUGFydDtcbiAgICAgICAgICBpZiAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLnN0YXJ0VHJhbnNhY3Rpb24oJ3JlbW92ZSBkZXB0Jyk7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0ucmVtb3ZlUGFydHMobm9kZS5maW5kVHJlZVBhcnRzKCksIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLmNvbW1pdFRyYW5zYWN0aW9uKCdyZW1vdmUgZGVwdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgbGV0IG1heVdvcmtGb3IgPSAobm9kZTEsIG5vZGUyKSA9PiB7XG4gICAgICBpZiAoIShub2RlMSBpbnN0YW5jZW9mIGdvLk5vZGUpKSByZXR1cm4gZmFsc2U7IC8vIG11c3QgYmUgYSBOb2RlXG4gICAgICBpZiAobm9kZTEgPT09IG5vZGUyKSByZXR1cm4gZmFsc2U7IC8vIGNhbm5vdCB3b3JrIGZvciB5b3Vyc2VsZlxuICAgICAgaWYgKG5vZGUyLmlzSW5UcmVlT2Yobm9kZTEpKSByZXR1cm4gZmFsc2U7IC8vIGNhbm5vdCB3b3JrIGZvciBzb21lb25lIHdobyB3b3JrcyBmb3IgeW91XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgbGV0IG5vZGVJZENvdW50ZXIgPSAtMTtcblxuICAgIGxldCBnZXROZXh0S2V5ID0gKCkgPT4ge1xuICAgICAgdmFyIGtleSA9IG5vZGVJZENvdW50ZXI7XG4gICAgICB3aGlsZSAodGhpcy5kaWFncmFtLm1vZGVsLmZpbmROb2RlRGF0YUZvcktleShrZXkpICE9PSBudWxsKSB7XG4gICAgICAgIGtleSA9IG5vZGVJZENvdW50ZXItLTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBrZXk7XG4gICAgfTtcblxuICAgIC8vIGRlZmluZSB0aGUgTGluayB0ZW1wbGF0ZVxuICAgIHRoaXMuZGlhZ3JhbS5saW5rVGVtcGxhdGUgPSAkKFxuICAgICAgZ28uTGluayxcbiAgICAgIGdvLkxpbmsuT3J0aG9nb25hbCxcbiAgICAgIHsgY29ybmVyOiA1LCByZWxpbmthYmxlRnJvbTogdHJ1ZSwgcmVsaW5rYWJsZVRvOiB0cnVlIH0sXG4gICAgICAkKGdvLlNoYXBlLCB7IHN0cm9rZVdpZHRoOiA0LCBzdHJva2U6ICcjMDBhNGE0JyB9KVxuICAgICk7IC8vIHRoZSBsaW5rIHNoYXBlXG5cbiAgICBtb2RlbC5ub2RlRGF0YUFycmF5ID0gW1xuICAgICAge1xuICAgICAgICBrZXk6IDEsXG4gICAgICAgIG5hbWU6ICdTdGVsbGEgUGF5bmUgRGlheicsXG4gICAgICAgIHRpdGxlOiAnQ0VPJyxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy8xMjM5MjkxL3BleGVscy1waG90by0xMjM5MjkxLmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogMixcbiAgICAgICAgbmFtZTogJ0x1a2UgV2FybScsXG4gICAgICAgIHRpdGxlOiAnVlAgTWFya2V0aW5nL1NhbGVzJyxcbiAgICAgICAgcGFyZW50OiAxLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzYxNDgxMC9wZXhlbHMtcGhvdG8tNjE0ODEwLmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogMyxcbiAgICAgICAgbmFtZTogJ01lZyBNZWVoYW4gSG9mZmEnLFxuICAgICAgICB0aXRsZTogJ1NhbGVzJyxcbiAgICAgICAgcGFyZW50OiAyLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzMyNDY1OC9wZXhlbHMtcGhvdG8tMzI0NjU4LmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogNCxcbiAgICAgICAgbmFtZTogJ1BlZ2d5IEZsYW1pbmcnLFxuICAgICAgICB0aXRsZTogJ1ZQIEVuZ2luZWVyaW5nJyxcbiAgICAgICAgcGFyZW50OiAxLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzc1NjQ1My9wZXhlbHMtcGhvdG8tNzU2NDUzLmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZkcHI9MiZoPTc1MCZ3PTEyNjAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDUsXG4gICAgICAgIG5hbWU6ICdTYXVsIFdlbGxpbmdvb2QnLFxuICAgICAgICB0aXRsZTogJ01hbnVmYWN0dXJpbmcnLFxuICAgICAgICBwYXJlbnQ6IDQsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvOTQxNjkzL3BleGVscy1waG90by05NDE2OTMuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiA2LFxuICAgICAgICBuYW1lOiAnQWwgTGlnb3JpJyxcbiAgICAgICAgdGl0bGU6ICdNYXJrZXRpbmcnLFxuICAgICAgICBwYXJlbnQ6IDIsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvNDA3MjM3L3BleGVscy1waG90by00MDcyMzcuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiA3LFxuICAgICAgICBuYW1lOiAnRG90IFN0dWJhZGQnLFxuICAgICAgICB0aXRsZTogJ1NhbGVzIFJlcCcsXG4gICAgICAgIHBhcmVudDogMyxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy84NDY3NDEvcGV4ZWxzLXBob3RvLTg0Njc0MS5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDgsXG4gICAgICAgIG5hbWU6ICdMZXMgSXNtb3JlJyxcbiAgICAgICAgdGl0bGU6ICdQcm9qZWN0IE1ncicsXG4gICAgICAgIHBhcmVudDogNSxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy83MDkxODgvcGV4ZWxzLXBob3RvLTcwOTE4OC5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDksXG4gICAgICAgIG5hbWU6ICdBcHJpbCBMeW5uIFBhcnJpcycsXG4gICAgICAgIHRpdGxlOiAnRXZlbnRzIE1ncicsXG4gICAgICAgIHBhcmVudDogNixcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy8zNTUxNjQvcGV4ZWxzLXBob3RvLTM1NTE2NC5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDEwLFxuICAgICAgICBuYW1lOiAnQW5pdGEgSGFtbWVyJyxcbiAgICAgICAgdGl0bGU6ICdQcm9jZXNzJyxcbiAgICAgICAgcGFyZW50OiA1LFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzgxODgxOS9wZXhlbHMtcGhvdG8tODE4ODE5LmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAga2V5OiAxMSxcbiAgICAgICAgbmFtZTogJ0V2YW4gRWxwdXMnLFxuICAgICAgICB0aXRsZTogJ1F1YWxpdHknLFxuICAgICAgICBwYXJlbnQ6IDUsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvMTAzNjYyNy9wZXhlbHMtcGhvdG8tMTAzNjYyNy5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDEyLFxuICAgICAgICBuYW1lOiAnTG90dGEgQi4gRXNzZW4nLFxuICAgICAgICB0aXRsZTogJ1NhbGVzIFJlcCcsXG4gICAgICAgIHBhcmVudDogMyxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy80NjI2ODAvcGV4ZWxzLXBob3RvLTQ2MjY4MC5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTBzJ1xuICAgICAgfVxuICAgIF07XG4gICAgdGhpcy5kaWFncmFtLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRpYWdyYW0uZGl2ID0gdGhpcy5kaWFncmFtUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG4vLyBjb21wb25lbnRcbmltcG9ydCB7IEdvanNDb21wb25lbnQgfSBmcm9tICcuL2dvanMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgIFJvdXRlck1vZHVsZS5mb3JDaGlsZChbeyBwYXRoOiAnZ29qcycsIGNvbXBvbmVudDogR29qc0NvbXBvbmVudCB9XSlcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW0dvanNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEdvanNNb2R1bGUge31cbiJdLCJuYW1lcyI6WyJnby5EaWFncmFtIiwiZ28uR3JhcGhPYmplY3QiLCJnby5UcmVlTW9kZWwiLCJnby5TcG90IiwiZ28uVHJlZUxheW91dCIsImdvLk5vZGUiLCJnby5QYW5lbCIsImdvLlBpY3R1cmUiLCJnby5TaXplIiwiZ28uTWFyZ2luIiwiZ28uQmluZGluZyIsImdvLlJvd0NvbHVtbkRlZmluaXRpb24iLCJnby5UZXh0QmxvY2siLCJnby5BZG9ybm1lbnQiLCJnby5MaW5rIiwiZ28uU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtJQWNFO3VCQUxzQixJQUFJQSxPQUFVLEVBQUU7O1FBTXBDLE1BQU0sQ0FBQyxHQUFHQyxXQUFjLENBQUMsSUFBSSxDQUFDOztRQUM5QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUNDLFNBQVksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSUYsT0FBVSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FB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