class MainPage extends HTMLElement {
    constructor() {
        super();
    }

    createdCallback():  void {

    }

    attachedCallback(): void {
        var board = document.createElement('svg-board');
        this.appendChild(board);

        var toolbox = document.createElement('board-toolbox');
        this.appendChild(toolbox);
    }
}

document.registerElement('main-page', MainPage);
