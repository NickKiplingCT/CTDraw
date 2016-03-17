var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SvgBoard = (function (_super) {
    __extends(SvgBoard, _super);
    function SvgBoard() {
        _super.call(this);
    }
    SvgBoard.prototype.createdCallback = function () {
        this.elements = [];
        this.shapeClicked = false;
        this.pointClicked = false;
        this.hoverPaths = [];
        this.savedPaths = [];
    };
    SvgBoard.prototype.attachedCallback = function () {
        var _this = this;
        var svg = document.createElement('svg');
        svg.id = 'board';
        this.appendChild(svg);
        this.svg = Snap('#board');
        this.svg.click((function (e) { return _this.boardClick(e); }));
    };
    SvgBoard.prototype.boardClick = function (e) {
        var currentTool = localStorage.getItem('currentTool');
        if (currentTool !== null) {
            var shape;
            switch (currentTool) {
                case 'Rectangle':
                    shape = this.createShape(e.pageX, e.pageY, 100, 150);
                    break;
            }
            this.elements.push(shape);
            delete localStorage['currentTool'];
        }
        else {
            console.log('No tool selected');
        }
        if (!this.shapeClicked)
            this.shapeUnclick(null);
        else
            this.shapeClicked = false;
    };
    SvgBoard.prototype.createShape = function (x, y, height, width) {
        var _this = this;
        var shape = this.svg.rect(x, y, width, height);
        shape.attr({
            fill: '#aaa'
        });
        shape.click((function (e) { return _this.shapeClick(e); }));
        var lc = this.svg.circle(x, y + (height / 2), 5);
        lc.attr({
            fill: '#fff',
            stroke: 'black',
            strokeWidth: 1
        });
        var rc = this.svg.circle(x + width, y + (height / 2), 5);
        rc.attr({
            fill: '#fff',
            stroke: 'black',
            strokeWidth: 1
        });
        lc.click((function (e) { return _this.pointClick(e); }));
        rc.click((function (e) { return _this.pointClick(e); }));
        return shape;
    };
    SvgBoard.prototype.shapeClick = function (e) {
        this.shapeClicked = true;
        var shape = Snap(e.currentTarget);
        shape.attr({
            stroke: 'blue',
            strokeWidth: 3
        });
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var s = _a[_i];
            if (shape.id !== s.id) {
                s.attr({
                    stroke: null,
                    strokeWidth: 0
                });
            }
        }
    };
    SvgBoard.prototype.shapeUnclick = function (e) {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var s = _a[_i];
            s.attr({
                stroke: null,
                strokeWidth: 0
            });
        }
    };
    SvgBoard.prototype.pointClick = function (e) {
        var _this = this;
        if (this.pointClicked) {
            this.currentPath.remove();
            var pathEndX = e.pageX;
            var pathEndY = e.pageY;
            var pathString = 'M' + this.pathStartX + ' ' + this.pathStartY;
            var curveString = 'C' + (this.pathStartX + 10) + ' ' + (this.pathStartY + 10) + ' ' + (this.pathStartX + 30) + ' ' + (this.pathStartY + 10) + ' ' + (this.pathStartX + 40) + ' ' + (this.pathStartY + 10);
            var lineString = 'L' + pathEndX + ' ' + pathEndY;
            var path = this.svg.path(pathString + curveString + lineString).attr({
                fill: 'none',
                stroke: 'black',
                strokeWidth: 2
            });
            this.savedPaths.push(path);
            this.pointClicked = false;
            this.pathStartX = null;
            this.pathStartY = null;
            this.svg.unhover((function (e) { return _this.hoverDraw(e); }));
        }
        else {
            this.pointClicked = true;
            this.pathStartX = e.pageX;
            this.pathStartY = e.pageY;
            this.svg.hover((function (e) { return _this.hoverDraw(e); }));
        }
    };
    SvgBoard.prototype.hoverDraw = function (e) {
        if (this.pointClicked) {
            for (var _i = 0, _a = this.hoverPaths; _i < _a.length; _i++) {
                var p = _a[_i];
                p.remove();
            }
            var pathEndX = e.pageX;
            var pathEndY = e.pageY;
            var pathString = 'M' + this.pathStartX + ' ' + this.pathStartY;
            var lineString = 'L' + pathEndX + ' ' + pathEndY;
            this.currentPath = this.svg.path(pathString + lineString).attr({
                fill: 'none',
                stroke: 'black',
                strokeWidth: 2
            });
            this.hoverPaths.push(this.currentPath);
        }
    };
    return SvgBoard;
}(HTMLElement));
document.registerElement('svg-board', SvgBoard);
var Toolbox = (function (_super) {
    __extends(Toolbox, _super);
    function Toolbox() {
        _super.call(this);
    }
    Toolbox.prototype.createdCallback = function () {
        this.opened = false;
    };
    Toolbox.prototype.attachedCallback = function () {
        var _this = this;
        this.toggle = document.createElement('span');
        this.toggle.className = 'toggle';
        this.toggle.onclick = (function (e) { return _this.toggleToolbox(e); });
        if (this.opened) {
            this.container = document.createElement('div');
            this.container.className = 'container';
            var rect = document.createElement('p');
            rect.textContent = 'Rectangle';
            rect.onclick = (function (e) { return _this.selectTool(e); });
            this.container.appendChild(rect);
            this.appendChild(this.container);
            this.toggle.className += ' open';
            this.toggle.textContent = 'Close';
        }
        else {
            this.toggle.textContent = 'Open';
        }
        this.appendChild(this.toggle);
    };
    Toolbox.prototype.toggleToolbox = function (e) {
        if (this.opened) {
            this.opened = false;
            this.container.remove();
        }
        else
            this.opened = true;
        this.toggle.remove();
        this.attachedCallback();
    };
    Toolbox.prototype.selectTool = function (e) {
        var tool = e.currentTarget.textContent;
        localStorage.setItem('currentTool', tool);
        this.opened = false;
        this.container.remove();
        this.toggle.remove();
        this.attachedCallback();
    };
    return Toolbox;
}(HTMLElement));
document.registerElement('board-toolbox', Toolbox);
var MainPage = (function (_super) {
    __extends(MainPage, _super);
    function MainPage() {
        _super.call(this);
    }
    MainPage.prototype.createdCallback = function () {
    };
    MainPage.prototype.attachedCallback = function () {
        var board = document.createElement('svg-board');
        this.appendChild(board);
        var toolbox = document.createElement('board-toolbox');
        this.appendChild(toolbox);
    };
    return MainPage;
}(HTMLElement));
document.registerElement('main-page', MainPage);
