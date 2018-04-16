import {SCREENS} from '../constants';

import Grid from '../components/Grid';

import {GRID_CELL_DOWN} from '../events';

class Marker extends Phaser.GameObjects.Sprite{
    
    constructor(scene, cell){
        super(scene, 0, 0, 'marker');
        
        this.setVisible(false);
        
        scene.add.existing(this);
        
        if(cell) this.placeOnGrid(cell);
    }
    
    placeOnGrid(cell){
        this.setVisible(true);
        const {x, y} = cell.getCenter();
        this.setPosition(x, y);
    }
    
    moveToCell(cell){
        const {x, y} = cell.getCenter();
        this.setPosition(x, y);
    }
    
}

export default class Battle extends Phaser.Scene{
    
    constructor(){
        super({
            key: SCREENS.BATTLE
        });
    }
    
    preload(){
        this.load.image('marker', 'assets/star.png');
    }
    
    create(){
        const grid = new Grid(this, 0, 0, 100, 5, 5);
        
        grid.on(GRID_CELL_DOWN, function(square){
            console.log(square.row, square.col);
        });
        
        this.markers = [];
        
        this.markers.push(new Marker(this, grid.getCell(0, 1)));
        this.markers.push(new Marker(this, grid.getCell(0, 2)));
        this.markers.push(new Marker(this, grid.getCell(0, 3)));
        
        this.markers.push(new Marker(this, grid.getCell(4, 1)));
        this.markers.push(new Marker(this, grid.getCell(4, 2)));
        this.markers.push(new Marker(this, grid.getCell(4, 3)));        

    }
    
    update(){
        
    }
    
}