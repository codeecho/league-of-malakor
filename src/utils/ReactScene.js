import ReactDOM from 'react-dom';

function addReactElement(x, y, width, height, element){
    const id = 'react-element-' + Math.random();
    const html = `<div id="${id}" style="position:absolute; left:${x}px; top:${y}px; width:${width}px; height:${height}px;"></div>`;
    document.getElementById('dom-container').insertAdjacentHTML('beforeend', html);
    ReactDOM.render(
      element,
      document.getElementById(id)
    );
}

export default class ReactScene extends Phaser.Scene{
    constructor(config){
        super(config);
        this.react = {
            add: addReactElement
        };
    }
}