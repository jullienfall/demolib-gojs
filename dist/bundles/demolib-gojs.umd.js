(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('gojs'), require('@angular/common'), require('@angular/router'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('demolib-gojs', ['exports', '@angular/core', 'gojs', '@angular/common', '@angular/router', '@angular/forms'], factory) :
    (factory((global['demolib-gojs'] = {}),global.ng.core,global.go,global.ng.common,global.ng.router,global.ng.forms));
}(this, (function (exports,core,go,common,router,forms) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var GojsComponent = /** @class */ (function () {
        function GojsComponent() {
            var _this = this;
            this.diagram = new go.Diagram();
            /** @type {?} */
            var $ = go.GraphObject.make;
            /** @type {?} */
            var model = $(go.TreeModel);
            this.diagram = new go.Diagram();
            this.diagram.initialContentAlignment = go.Spot.Center;
            this.diagram.undoManager.isEnabled = true;
            this.diagram.layout = $(go.TreeLayout, {
                angle: 90,
                layerSpacing: 35
            });
            this.diagram.nodeTemplate = $(go.Node, 'Horizontal', { background: '#17a2b1' }, {
                doubleClick: function (e, obj) {
                    /** @type {?} */
                    var clicked = obj.part;
                    if (clicked !== null) {
                        /** @type {?} */
                        var thisemp = clicked.data;
                        _this.diagram.startTransaction('add employee');
                        /** @type {?} */
                        var newemp = {
                            key: getNextKey(),
                            name: '(new person)',
                            title: '',
                            source: 'https://www.acrpnet.org/wp-content/uploads/2016/09/User-Icon-Gray.jpg',
                            parent: thisemp.key
                        };
                        _this.diagram.model.addNodeData(newemp);
                        _this.diagram.commitTransaction('add employee');
                    }
                }
            }, {
                // handle dragging a Node onto a Node to (maybe) change the reporting relationship
                mouseDragEnter: function (e, node, prev) {
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
                mouseDragLeave: function (e, node, next) {
                    /** @type {?} */
                    var shape = node.findObject('SHAPE');
                    if (shape && shape._prevFill) {
                        shape.fill = shape._prevFill; // restore the original brush
                    }
                },
                mouseDrop: function (e, node) {
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
                click: function (e, obj) {
                    /** @type {?} */
                    var node = obj.part.adornedPart;
                    if (node !== null && node.data.key != 1) {
                        _this.diagram.startTransaction('reparent remove');
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
                        _this.diagram.commitTransaction('reparent remove');
                    }
                }
            }), $('ContextMenuButton', $(go.TextBlock, 'Remove Department'), {
                click: function (e, obj) {
                    /** @type {?} */
                    var node = obj.part.adornedPart;
                    if (node !== null) {
                        _this.diagram.startTransaction('remove dept');
                        _this.diagram.removeParts(node.findTreeParts(), true);
                        _this.diagram.commitTransaction('remove dept');
                    }
                }
            }));
            /** @type {?} */
            var mayWorkFor = function (node1, node2) {
                if (!(node1 instanceof go.Node))
                    return false; // must be a Node
                if (node1 === node2)
                    return false; // cannot work for yourself
                if (node2.isInTreeOf(node1))
                    return false; // cannot work for someone who works for you
                return true;
            };
            /** @type {?} */
            var nodeIdCounter = -1;
            /** @type {?} */
            var getNextKey = function () {
                /** @type {?} */
                var key = nodeIdCounter;
                while (_this.diagram.model.findNodeDataForKey(key) !== null) {
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
        GojsComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.diagram.div = this.diagramRef.nativeElement;
            };
        GojsComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-gojs',
                        template: "<div #diagramDiv\n     class=\"diagramDiv\"></div>\n",
                        styles: [".diagramDiv{width:100vw;min-height:80vh;margin:0}"]
                    }] }
        ];
        /** @nocollapse */
        GojsComponent.ctorParameters = function () { return []; };
        GojsComponent.propDecorators = {
            diagramRef: [{ type: core.ViewChild, args: ['diagramDiv',] }]
        };
        return GojsComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var GojsModule = /** @class */ (function () {
        function GojsModule() {
        }
        GojsModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            forms.FormsModule,
                            router.RouterModule.forChild([{ path: 'gojs', component: GojsComponent }])
                        ],
                        declarations: [GojsComponent]
                    },] }
        ];
        return GojsModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.GojsModule = GojsModule;
    exports.GojsComponent = GojsComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb2xpYi1nb2pzLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZGVtb2xpYi1nb2pzL3NyYy9nb2pzLmNvbXBvbmVudC50cyIsIm5nOi8vZGVtb2xpYi1nb2pzL3NyYy9nb2pzLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBnbyBmcm9tICdnb2pzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWdvanMnLFxuICB0ZW1wbGF0ZVVybDogJy4vZ29qcy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2dvanMuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEdvanNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBkaWFncmFtOiBnby5EaWFncmFtID0gbmV3IGdvLkRpYWdyYW0oKTtcblxuICBAVmlld0NoaWxkKCdkaWFncmFtRGl2JylcbiAgcHJpdmF0ZSBkaWFncmFtUmVmOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0ICQgPSBnby5HcmFwaE9iamVjdC5tYWtlO1xuICAgIGNvbnN0IG1vZGVsID0gJChnby5UcmVlTW9kZWwpO1xuICAgIHRoaXMuZGlhZ3JhbSA9IG5ldyBnby5EaWFncmFtKCk7XG4gICAgdGhpcy5kaWFncmFtLmluaXRpYWxDb250ZW50QWxpZ25tZW50ID0gZ28uU3BvdC5DZW50ZXI7XG4gICAgdGhpcy5kaWFncmFtLnVuZG9NYW5hZ2VyLmlzRW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5kaWFncmFtLmxheW91dCA9ICQoZ28uVHJlZUxheW91dCwge1xuICAgICAgYW5nbGU6IDkwLFxuICAgICAgbGF5ZXJTcGFjaW5nOiAzNVxuICAgIH0pO1xuXG4gICAgdGhpcy5kaWFncmFtLm5vZGVUZW1wbGF0ZSA9ICQoXG4gICAgICBnby5Ob2RlLFxuICAgICAgJ0hvcml6b250YWwnLFxuICAgICAgeyBiYWNrZ3JvdW5kOiAnIzE3YTJiMScgfSxcbiAgICAgIHtcbiAgICAgICAgZG91YmxlQ2xpY2s6IChlLCBvYmopID0+IHtcbiAgICAgICAgICB2YXIgY2xpY2tlZCA9IG9iai5wYXJ0O1xuICAgICAgICAgIGlmIChjbGlja2VkICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgdGhpc2VtcCA9IGNsaWNrZWQuZGF0YTtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5zdGFydFRyYW5zYWN0aW9uKCdhZGQgZW1wbG95ZWUnKTtcbiAgICAgICAgICAgIHZhciBuZXdlbXAgPSB7XG4gICAgICAgICAgICAgIGtleTogZ2V0TmV4dEtleSgpLFxuICAgICAgICAgICAgICBuYW1lOiAnKG5ldyBwZXJzb24pJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBzb3VyY2U6ICdodHRwczovL3d3dy5hY3JwbmV0Lm9yZy93cC1jb250ZW50L3VwbG9hZHMvMjAxNi8wOS9Vc2VyLUljb24tR3JheS5qcGcnLFxuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXNlbXAua2V5XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLm1vZGVsLmFkZE5vZGVEYXRhKG5ld2VtcCk7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0uY29tbWl0VHJhbnNhY3Rpb24oJ2FkZCBlbXBsb3llZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gaGFuZGxlIGRyYWdnaW5nIGEgTm9kZSBvbnRvIGEgTm9kZSB0byAobWF5YmUpIGNoYW5nZSB0aGUgcmVwb3J0aW5nIHJlbGF0aW9uc2hpcFxuICAgICAgICBtb3VzZURyYWdFbnRlcjogKGUsIG5vZGUsIHByZXYpID0+IHtcbiAgICAgICAgICB2YXIgZGlhZ3JhbSA9IG5vZGUuZGlhZ3JhbTtcbiAgICAgICAgICB2YXIgc2Vsbm9kZSA9IGRpYWdyYW0uc2VsZWN0aW9uLmZpcnN0KCk7XG4gICAgICAgICAgaWYgKCFtYXlXb3JrRm9yKHNlbG5vZGUsIG5vZGUpKSByZXR1cm47XG4gICAgICAgICAgdmFyIHNoYXBlID0gbm9kZS5maW5kT2JqZWN0KCdTSEFQRScpO1xuICAgICAgICAgIGlmIChzaGFwZSkge1xuICAgICAgICAgICAgc2hhcGUuX3ByZXZGaWxsID0gc2hhcGUuZmlsbDsgLy8gcmVtZW1iZXIgdGhlIG9yaWdpbmFsIGJydXNoXG4gICAgICAgICAgICBzaGFwZS5maWxsID0gJ2RhcmtyZWQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW91c2VEcmFnTGVhdmU6IChlLCBub2RlLCBuZXh0KSA9PiB7XG4gICAgICAgICAgdmFyIHNoYXBlID0gbm9kZS5maW5kT2JqZWN0KCdTSEFQRScpO1xuICAgICAgICAgIGlmIChzaGFwZSAmJiBzaGFwZS5fcHJldkZpbGwpIHtcbiAgICAgICAgICAgIHNoYXBlLmZpbGwgPSBzaGFwZS5fcHJldkZpbGw7IC8vIHJlc3RvcmUgdGhlIG9yaWdpbmFsIGJydXNoXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VzZURyb3A6IChlLCBub2RlKSA9PiB7XG4gICAgICAgICAgdmFyIGRpYWdyYW0gPSBub2RlLmRpYWdyYW07XG4gICAgICAgICAgdmFyIHNlbG5vZGUgPSBkaWFncmFtLnNlbGVjdGlvbi5maXJzdCgpOyAvLyBhc3N1bWUganVzdCBvbmUgTm9kZSBpbiBzZWxlY3Rpb25cbiAgICAgICAgICBpZiAobWF5V29ya0ZvcihzZWxub2RlLCBub2RlKSkge1xuICAgICAgICAgICAgLy8gZmluZCBhbnkgZXhpc3RpbmcgbGluayBpbnRvIHRoZSBzZWxlY3RlZCBub2RlXG4gICAgICAgICAgICB2YXIgbGluayA9IHNlbG5vZGUuZmluZFRyZWVQYXJlbnRMaW5rKCk7XG4gICAgICAgICAgICBpZiAobGluayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAvLyByZWNvbm5lY3QgYW55IGV4aXN0aW5nIGxpbmtcbiAgICAgICAgICAgICAgbGluay5mcm9tTm9kZSA9IG5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBlbHNlIGNyZWF0ZSBhIG5ldyBsaW5rXG4gICAgICAgICAgICAgIGRpYWdyYW0udG9vbE1hbmFnZXIubGlua2luZ1Rvb2wuaW5zZXJ0TGluayhub2RlLCBub2RlLnBvcnQsIHNlbG5vZGUsIHNlbG5vZGUucG9ydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJChcbiAgICAgICAgZ28uUGFuZWwsXG4gICAgICAgICdIb3Jpem9udGFsJyxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdTSEFQRScsXG4gICAgICAgICAgcG9ydElkOiAnJyxcbiAgICAgICAgICBmcm9tTGlua2FibGU6IHRydWUsXG4gICAgICAgICAgdG9MaW5rYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgICB9LFxuICAgICAgICAkKFxuICAgICAgICAgIGdvLlBpY3R1cmUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1BpY3R1cmUnLFxuICAgICAgICAgICAgZGVzaXJlZFNpemU6IG5ldyBnby5TaXplKDY1LCA1MCksXG4gICAgICAgICAgICBtYXJnaW46IG5ldyBnby5NYXJnaW4oNiwgOCwgNiwgMTApXG4gICAgICAgICAgfSxcbiAgICAgICAgICBuZXcgZ28uQmluZGluZygnc291cmNlJylcbiAgICAgICAgKSxcbiAgICAgICAgJChcbiAgICAgICAgICBnby5QYW5lbCxcbiAgICAgICAgICAnVGFibGUnLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1heFNpemU6IG5ldyBnby5TaXplKDE1MCwgOTk5KSxcbiAgICAgICAgICAgIG1hcmdpbjogbmV3IGdvLk1hcmdpbig2LCAxMCwgMCwgMyksXG4gICAgICAgICAgICBkZWZhdWx0QWxpZ25tZW50OiBnby5TcG90LkxlZnRcbiAgICAgICAgICB9LFxuICAgICAgICAgICQoZ28uUm93Q29sdW1uRGVmaW5pdGlvbiwgeyBjb2x1bW46IDIsIHdpZHRoOiA0IH0pLFxuICAgICAgICAgICQoXG4gICAgICAgICAgICBnby5UZXh0QmxvY2ssXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJvdzogMCxcbiAgICAgICAgICAgICAgY29sdW1uOiAwLFxuICAgICAgICAgICAgICBjb2x1bW5TcGFuOiA1LFxuICAgICAgICAgICAgICBmb250OiAnMTJwdCBTZWdvZSBVSSxzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlzTXVsdGlsaW5lOiBmYWxzZSxcbiAgICAgICAgICAgICAgbWluU2l6ZTogbmV3IGdvLlNpemUoMTAsIDE2KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5ldyBnby5CaW5kaW5nKCd0ZXh0JywgJ25hbWUnKS5tYWtlVHdvV2F5KClcbiAgICAgICAgICApLFxuICAgICAgICAgICQoZ28uVGV4dEJsb2NrLCAnVGl0bGU6ICcsIHsgcm93OiAxLCBjb2x1bW46IDAgfSksXG4gICAgICAgICAgJChcbiAgICAgICAgICAgIGdvLlRleHRCbG9jayxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcm93OiAxLFxuICAgICAgICAgICAgICBjb2x1bW46IDEsXG4gICAgICAgICAgICAgIGNvbHVtblNwYW46IDQsXG4gICAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpc011bHRpbGluZTogZmFsc2UsXG4gICAgICAgICAgICAgIG1pblNpemU6IG5ldyBnby5TaXplKDEwLCAxNCksXG4gICAgICAgICAgICAgIG1hcmdpbjogbmV3IGdvLk1hcmdpbigwLCAwLCAwLCAzKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5ldyBnby5CaW5kaW5nKCd0ZXh0JywgJ3RpdGxlJykubWFrZVR3b1dheSgpXG4gICAgICAgICAgKSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgZ28uVGV4dEJsb2NrLFxuICAgICAgICAgICAgeyByb3c6IDIsIGNvbHVtbjogMCB9LFxuICAgICAgICAgICAgbmV3IGdvLkJpbmRpbmcoJ3RleHQnLCAna2V5JywgZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICByZXR1cm4gJ0lEOiAnICsgdjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSxcbiAgICAgICAgICAkKFxuICAgICAgICAgICAgZ28uVGV4dEJsb2NrLFxuICAgICAgICAgICAgeyBuYW1lOiAnYm9zcycsIHJvdzogMiwgY29sdW1uOiAzIH0sXG4gICAgICAgICAgICBuZXcgZ28uQmluZGluZygndGV4dCcsICdwYXJlbnQnLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgIHJldHVybiAnQm9zczogJyArIHY7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgJChcbiAgICAgICAgICAgIGdvLlRleHRCbG9jayxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcm93OiAzLFxuICAgICAgICAgICAgICBjb2x1bW46IDAsXG4gICAgICAgICAgICAgIGNvbHVtblNwYW46IDUsXG4gICAgICAgICAgICAgIGZvbnQ6ICdpdGFsaWMgOXB0IHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICB3cmFwOiBnby5UZXh0QmxvY2suV3JhcEZpdCxcbiAgICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsIC8vIGJ5IGRlZmF1bHQgbmV3bGluZXMgYXJlIGFsbG93ZWRcbiAgICAgICAgICAgICAgbWluU2l6ZTogbmV3IGdvLlNpemUoMTAsIDE0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5ldyBnby5CaW5kaW5nKCd0ZXh0JywgJ2NvbW1lbnRzJykubWFrZVR3b1dheSgpXG4gICAgICAgICAgKVxuICAgICAgICApIC8vIGVuZCBUYWJsZSBQYW5lbFxuICAgICAgKVxuICAgICk7XG5cbiAgICB0aGlzLmRpYWdyYW0ubm9kZVRlbXBsYXRlLmNvbnRleHRNZW51ID0gJChcbiAgICAgIGdvLkFkb3JubWVudCxcbiAgICAgICdWZXJ0aWNhbCcsXG4gICAgICAkKCdDb250ZXh0TWVudUJ1dHRvbicsICQoZ28uVGV4dEJsb2NrLCAnUmVtb3ZlIFJvbGUnKSwge1xuICAgICAgICBjbGljazogKGUsIG9iaikgPT4ge1xuICAgICAgICAgIC8vIHJlcGFyZW50IHRoZSBzdWJ0cmVlIHRvIHRoaXMgbm9kZSdzIGJvc3MsIHRoZW4gcmVtb3ZlIHRoZSBub2RlXG4gICAgICAgICAgdmFyIG5vZGUgPSBvYmoucGFydC5hZG9ybmVkUGFydDtcbiAgICAgICAgICBpZiAobm9kZSAhPT0gbnVsbCAmJiBub2RlLmRhdGEua2V5ICE9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5zdGFydFRyYW5zYWN0aW9uKCdyZXBhcmVudCByZW1vdmUnKTtcbiAgICAgICAgICAgIHZhciBjaGwgPSBub2RlLmZpbmRUcmVlQ2hpbGRyZW5Ob2RlcygpO1xuICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBjaGlsZHJlbiBhbmQgc2V0IHRoZWlyIHBhcmVudCBrZXkgdG8gb3VyIHNlbGVjdGVkIG5vZGUncyBwYXJlbnQga2V5XG4gICAgICAgICAgICB3aGlsZSAoY2hsLm5leHQoKSkge1xuICAgICAgICAgICAgICB2YXIgZW1wID0gY2hsLnZhbHVlO1xuICAgICAgICAgICAgICBtb2RlbC5zZXRQYXJlbnRLZXlGb3JOb2RlRGF0YShlbXAuZGF0YSwgbm9kZS5maW5kVHJlZVBhcmVudE5vZGUoKS5kYXRhLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhbmQgbm93IHJlbW92ZSB0aGUgc2VsZWN0ZWQgbm9kZSBpdHNlbGZcbiAgICAgICAgICAgIG1vZGVsLnJlbW92ZU5vZGVEYXRhKG5vZGUuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmRpYWdyYW0uY29tbWl0VHJhbnNhY3Rpb24oJ3JlcGFyZW50IHJlbW92ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAkKCdDb250ZXh0TWVudUJ1dHRvbicsICQoZ28uVGV4dEJsb2NrLCAnUmVtb3ZlIERlcGFydG1lbnQnKSwge1xuICAgICAgICBjbGljazogKGUsIG9iaikgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSB0aGUgd2hvbGUgc3VidHJlZSwgaW5jbHVkaW5nIHRoZSBub2RlIGl0c2VsZlxuICAgICAgICAgIHZhciBub2RlID0gb2JqLnBhcnQuYWRvcm5lZFBhcnQ7XG4gICAgICAgICAgaWYgKG5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5zdGFydFRyYW5zYWN0aW9uKCdyZW1vdmUgZGVwdCcpO1xuICAgICAgICAgICAgdGhpcy5kaWFncmFtLnJlbW92ZVBhcnRzKG5vZGUuZmluZFRyZWVQYXJ0cygpLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuZGlhZ3JhbS5jb21taXRUcmFuc2FjdGlvbigncmVtb3ZlIGRlcHQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGxldCBtYXlXb3JrRm9yID0gKG5vZGUxLCBub2RlMikgPT4ge1xuICAgICAgaWYgKCEobm9kZTEgaW5zdGFuY2VvZiBnby5Ob2RlKSkgcmV0dXJuIGZhbHNlOyAvLyBtdXN0IGJlIGEgTm9kZVxuICAgICAgaWYgKG5vZGUxID09PSBub2RlMikgcmV0dXJuIGZhbHNlOyAvLyBjYW5ub3Qgd29yayBmb3IgeW91cnNlbGZcbiAgICAgIGlmIChub2RlMi5pc0luVHJlZU9mKG5vZGUxKSkgcmV0dXJuIGZhbHNlOyAvLyBjYW5ub3Qgd29yayBmb3Igc29tZW9uZSB3aG8gd29ya3MgZm9yIHlvdVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGxldCBub2RlSWRDb3VudGVyID0gLTE7XG5cbiAgICBsZXQgZ2V0TmV4dEtleSA9ICgpID0+IHtcbiAgICAgIHZhciBrZXkgPSBub2RlSWRDb3VudGVyO1xuICAgICAgd2hpbGUgKHRoaXMuZGlhZ3JhbS5tb2RlbC5maW5kTm9kZURhdGFGb3JLZXkoa2V5KSAhPT0gbnVsbCkge1xuICAgICAgICBrZXkgPSBub2RlSWRDb3VudGVyLS07XG4gICAgICB9XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICAvLyBkZWZpbmUgdGhlIExpbmsgdGVtcGxhdGVcbiAgICB0aGlzLmRpYWdyYW0ubGlua1RlbXBsYXRlID0gJChcbiAgICAgIGdvLkxpbmssXG4gICAgICBnby5MaW5rLk9ydGhvZ29uYWwsXG4gICAgICB7IGNvcm5lcjogNSwgcmVsaW5rYWJsZUZyb206IHRydWUsIHJlbGlua2FibGVUbzogdHJ1ZSB9LFxuICAgICAgJChnby5TaGFwZSwgeyBzdHJva2VXaWR0aDogNCwgc3Ryb2tlOiAnIzAwYTRhNCcgfSlcbiAgICApOyAvLyB0aGUgbGluayBzaGFwZVxuXG4gICAgbW9kZWwubm9kZURhdGFBcnJheSA9IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiAxLFxuICAgICAgICBuYW1lOiAnU3RlbGxhIFBheW5lIERpYXonLFxuICAgICAgICB0aXRsZTogJ0NFTycsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvMTIzOTI5MS9wZXhlbHMtcGhvdG8tMTIzOTI5MS5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDIsXG4gICAgICAgIG5hbWU6ICdMdWtlIFdhcm0nLFxuICAgICAgICB0aXRsZTogJ1ZQIE1hcmtldGluZy9TYWxlcycsXG4gICAgICAgIHBhcmVudDogMSxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy82MTQ4MTAvcGV4ZWxzLXBob3RvLTYxNDgxMC5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDMsXG4gICAgICAgIG5hbWU6ICdNZWcgTWVlaGFuIEhvZmZhJyxcbiAgICAgICAgdGl0bGU6ICdTYWxlcycsXG4gICAgICAgIHBhcmVudDogMixcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy8zMjQ2NTgvcGV4ZWxzLXBob3RvLTMyNDY1OC5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBrZXk6IDQsXG4gICAgICAgIG5hbWU6ICdQZWdneSBGbGFtaW5nJyxcbiAgICAgICAgdGl0bGU6ICdWUCBFbmdpbmVlcmluZycsXG4gICAgICAgIHBhcmVudDogMSxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy83NTY0NTMvcGV4ZWxzLXBob3RvLTc1NjQ1My5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImZHByPTImaD03NTAmdz0xMjYwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiA1LFxuICAgICAgICBuYW1lOiAnU2F1bCBXZWxsaW5nb29kJyxcbiAgICAgICAgdGl0bGU6ICdNYW51ZmFjdHVyaW5nJyxcbiAgICAgICAgcGFyZW50OiA0LFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzk0MTY5My9wZXhlbHMtcGhvdG8tOTQxNjkzLmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogNixcbiAgICAgICAgbmFtZTogJ0FsIExpZ29yaScsXG4gICAgICAgIHRpdGxlOiAnTWFya2V0aW5nJyxcbiAgICAgICAgcGFyZW50OiAyLFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzQwNzIzNy9wZXhlbHMtcGhvdG8tNDA3MjM3LmpwZWc/YXV0bz1jb21wcmVzcyZjcz10aW55c3JnYiZoPTM1MCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGtleTogNyxcbiAgICAgICAgbmFtZTogJ0RvdCBTdHViYWRkJyxcbiAgICAgICAgdGl0bGU6ICdTYWxlcyBSZXAnLFxuICAgICAgICBwYXJlbnQ6IDMsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvODQ2NzQxL3BleGVscy1waG90by04NDY3NDEuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiA4LFxuICAgICAgICBuYW1lOiAnTGVzIElzbW9yZScsXG4gICAgICAgIHRpdGxlOiAnUHJvamVjdCBNZ3InLFxuICAgICAgICBwYXJlbnQ6IDUsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvNzA5MTg4L3BleGVscy1waG90by03MDkxODguanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiA5LFxuICAgICAgICBuYW1lOiAnQXByaWwgTHlubiBQYXJyaXMnLFxuICAgICAgICB0aXRsZTogJ0V2ZW50cyBNZ3InLFxuICAgICAgICBwYXJlbnQ6IDYsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvMzU1MTY0L3BleGVscy1waG90by0zNTUxNjQuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAxMCxcbiAgICAgICAgbmFtZTogJ0FuaXRhIEhhbW1lcicsXG4gICAgICAgIHRpdGxlOiAnUHJvY2VzcycsXG4gICAgICAgIHBhcmVudDogNSxcbiAgICAgICAgc291cmNlOlxuICAgICAgICAgICdodHRwczovL2ltYWdlcy5wZXhlbHMuY29tL3Bob3Rvcy84MTg4MTkvcGV4ZWxzLXBob3RvLTgxODgxOS5qcGVnP2F1dG89Y29tcHJlc3MmY3M9dGlueXNyZ2ImaD0zNTAnXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIGtleTogMTEsXG4gICAgICAgIG5hbWU6ICdFdmFuIEVscHVzJyxcbiAgICAgICAgdGl0bGU6ICdRdWFsaXR5JyxcbiAgICAgICAgcGFyZW50OiA1LFxuICAgICAgICBzb3VyY2U6XG4gICAgICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnBleGVscy5jb20vcGhvdG9zLzEwMzY2MjcvcGV4ZWxzLXBob3RvLTEwMzY2MjcuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2V5OiAxMixcbiAgICAgICAgbmFtZTogJ0xvdHRhIEIuIEVzc2VuJyxcbiAgICAgICAgdGl0bGU6ICdTYWxlcyBSZXAnLFxuICAgICAgICBwYXJlbnQ6IDMsXG4gICAgICAgIHNvdXJjZTpcbiAgICAgICAgICAnaHR0cHM6Ly9pbWFnZXMucGV4ZWxzLmNvbS9waG90b3MvNDYyNjgwL3BleGVscy1waG90by00NjI2ODAuanBlZz9hdXRvPWNvbXByZXNzJmNzPXRpbnlzcmdiJmg9MzUwcydcbiAgICAgIH1cbiAgICBdO1xuICAgIHRoaXMuZGlhZ3JhbS5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kaWFncmFtLmRpdiA9IHRoaXMuZGlhZ3JhbVJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLy8gY29tcG9uZW50XG5pbXBvcnQgeyBHb2pzQ29tcG9uZW50IH0gZnJvbSAnLi9nb2pzLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgUm91dGVyTW9kdWxlLmZvckNoaWxkKFt7IHBhdGg6ICdnb2pzJywgY29tcG9uZW50OiBHb2pzQ29tcG9uZW50IH1dKVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtHb2pzQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBHb2pzTW9kdWxlIHt9XG4iXSwibmFtZXMiOlsiZ28uRGlhZ3JhbSIsImdvLkdyYXBoT2JqZWN0IiwiZ28uVHJlZU1vZGVsIiwiZ28uU3BvdCIsImdvLlRyZWVMYXlvdXQiLCJnby5Ob2RlIiwiZ28uUGFuZWwiLCJnby5QaWN0dXJlIiwiZ28uU2l6ZSIsImdvLk1hcmdpbiIsImdvLkJpbmRpbmciLCJnby5Sb3dDb2x1bW5EZWZpbml0aW9uIiwiZ28uVGV4dEJsb2NrIiwiZ28uQWRvcm5tZW50IiwiZ28uTGluayIsImdvLlNoYXBlIiwiQ29tcG9uZW50IiwiVmlld0NoaWxkIiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJGb3Jtc01vZHVsZSIsIlJvdXRlck1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBY0U7WUFBQSxpQkF1VEM7MkJBNVRxQixJQUFJQSxVQUFVLEVBQUU7O1lBTXBDLElBQU0sQ0FBQyxHQUFHQyxjQUFjLENBQUMsSUFBSSxDQUFDOztZQUM5QixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUNDLFlBQVksQ0FB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