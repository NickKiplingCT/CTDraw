class SvgBoard extends HTMLElement {
    svg: any;
    elements: Array<any>;
    shapeClicked: boolean;
    pointClicked: boolean;

    currentPath: any;
    pathStartX: number;
    pathStartY: number;

    hoverPaths: Array<any>;
    savedPaths: Array<any>;

    constructor() {
        super();
    }

    createdCallback(): void {
        this.elements = [];
        this.shapeClicked = false;
        this.pointClicked = false;
        this.hoverPaths = [];
        this.savedPaths = [];
    }

    attachedCallback(): void {
        var svg = document.createElement('svg');
        svg.id = 'board';
        //svg.onclick = (e => this.boardClick(e));
        this.appendChild(svg);

        this.svg = Snap('#board');
        this.svg.click((e => this.boardClick(e)));
    }

    boardClick(e: any): void {
        var currentTool = localStorage.getItem('currentTool');

        if(currentTool !== null) {
            var shape;

            switch(currentTool) {
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

        if(!this.shapeClicked)
            this.shapeUnclick(null)
        else
            this.shapeClicked = false;
    }

    createShape(x: number, y: number, height: number, width: number) {
        var shape = this.svg.rect(x, y, width, height);
        shape.attr({
            fill: '#aaa'
        });
        shape.click((e => this.shapeClick(e)));

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

        lc.click((e => this.pointClick(e)));
        rc.click((e => this.pointClick(e)));

        return shape;
    }

    shapeClick(e: any): void {
        this.shapeClicked = true;
        var shape: any = Snap(e.currentTarget);

        shape.attr({
            stroke: 'blue',
            strokeWidth: 3
        });

        for(var s of this.elements) {
            if(shape.id !== s.id) {
                s.attr({
                    stroke: null,
                    strokeWidth: 0
                });
            }
        }
    }

    shapeUnclick(e: any): void {
        for(var s of this.elements) {
            s.attr({
                stroke: null,
                strokeWidth: 0
            });
        }
    }

    pointClick(e: any): void {
        if(this.pointClicked) {
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
            this.svg.unhover((e => this.hoverDraw(e)));
        }
        else {
            this.pointClicked = true;

            this.pathStartX = e.pageX;
            this.pathStartY = e.pageY;

            this.svg.hover((e => this.hoverDraw(e)));
        }
    }

    hoverDraw(e): void {
        if(this.pointClicked) {
            for(var p of this.hoverPaths) {
                p.remove();
            }

            var pathEndX = e.pageX;
            var pathEndY = e.pageY;

            var pathString = 'M' + this.pathStartX + ' ' + this.pathStartY;
            //var curveString = 'C' + (this.pathStartX + 10) + ' ' + (this.pathStartY + 10) + ' ' + (this.pathStartX + 30) + ' ' + (this.pathStartY + 10) + ' ' + (this.pathStartX + 40) + ' ' + (this.pathStartY + 10);
            var lineString = 'L' + pathEndX + ' ' + pathEndY;

            this.currentPath = this.svg.path(pathString + lineString).attr({
                fill: 'none',
                stroke: 'black',
                strokeWidth: 2
            });

            this.hoverPaths.push(this.currentPath);
        }
    }
}

document.registerElement('svg-board', SvgBoard);
