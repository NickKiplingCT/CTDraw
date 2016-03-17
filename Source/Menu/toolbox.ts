class Toolbox extends HTMLElement {
    opened: boolean;
    toggle: HTMLSpanElement;
    container: HTMLElement;

    constructor() {
        super();
    }

    createdCallback(): void {
        this.opened = false;
    }

    attachedCallback(): void {
        this.toggle = document.createElement('span');
        this.toggle.className = 'toggle';
        this.toggle.onclick = (e => this.toggleToolbox(e));

        if(this.opened) {
            this.container = document.createElement('div');
            this.container.className = 'container';

            var rect = document.createElement('p');
            rect.textContent = 'Rectangle';
            rect.onclick = (e => this.selectTool(e));

            this.container.appendChild(rect);
            this.appendChild(this.container);

            this.toggle.className += ' open';
            this.toggle.textContent = 'Close';
        }
        else {
            this.toggle.textContent = 'Open';
        }

        this.appendChild(this.toggle);
    }

    toggleToolbox(e: any): void {
        if(this.opened) {
            this.opened = false;
            this.container.remove();
        }
        else
            this.opened = true;

        this.toggle.remove();
        this.attachedCallback();
    }

    selectTool(e: any): void {
        var tool = e.currentTarget.textContent;
        localStorage.setItem('currentTool', tool);

        this.opened = false;
        this.container.remove();
        this.toggle.remove();
        this.attachedCallback();
    }
}

document.registerElement('board-toolbox', Toolbox);
