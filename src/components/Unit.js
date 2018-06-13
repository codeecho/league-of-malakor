import {autorun} from 'mobx';

import {IDLE_LEFT, IDLE_RIGHT, IDLE_UP, IDLE_DOWN} from '../constants/animations';

import {LEFT, RIGHT, UP, DOWN} from '../constants/directions';

export default class Unit extends Phaser.GameObjects.Sprite{
    
    constructor(scene, state){
        super(scene, 0, 0, state.unit.type.toLowerCase());
        
        this.scene = scene;
        this.state = state;
        
        scene.unitsLayer.add(this, true);
        
        this.spriteKey = state.unit.type.toLowerCase();
        
        this.healthLabel = new Phaser.GameObjects.Text(scene, 0, 0, '', {fontSize: '14px', fill: '#fff', align: 'center'})
        this.healthLabel.setOrigin(0.5, 1);
        
        scene.unitsLayer.add(this.healthLabel, true);
        
        this.waitLabel = new Phaser.GameObjects.Text(scene, 0, 0, '0', {fontSize: '14px', fill: '#fff', align: 'right'})
        this.waitLabel.setOrigin(1, 0);
        
        scene.unitsLayer.add(this.waitLabel, true);        
        
        this.identifier = new Phaser.GameObjects.Sprite(scene, 0, 0, 'identifier-' + this.state.color);
        this.identifier.setOrigin(0, 0);
        
        scene.unitsLayer.add(this.identifier, true);
        
        autorun(() => {
            if(!state.unit.cell) return;
            const {x, y} = state.unit.cell.getCenter();
            this.setPosition(x, y);
            this.healthLabel.setPosition(x, y + (state.unit.cell.size/2));
            this.waitLabel.setPosition(x + (state.unit.cell.size/2), y - (state.unit.cell.size/2));
            this.identifier.setPosition(x - (state.unit.cell.size/2) + 2, y - (state.unit.cell.size/2) + 2);
        });
        
        autorun(() => {
            this.healthLabel.setText(this.state.unit.health + '/' + this.state.unit.maxHealth);
        });
        
        autorun(() => {
//            this.state.unit.selected ? this.setTint(0xff0000) : this.setTint(this.state.color);
            //this.state.unit.selected ? this.setTint(0xff0000) : this.clearTint();
            this.state.unit.selected ? this.healthLabel.setColor('red') : this.healthLabel.setColor('white');
            this.state.unit.selected ? this.waitLabel.setColor('red') : this.waitLabel.setColor('white');            
        });
        
        autorun(() => {
            this.waitLabel.setText(this.state.unit.wait);
        });
        
        autorun(() => {
            if(!state.unit.alive){
                this.active = false;
                this.visible = false;
                this.healthLabel.visible = false;
                this.waitLabel.visible = false;
                this.identifier.visible = false;
            }
        });
        
        autorun(() => {
            this.anims.play(this.spriteKey + '-' + getIdleAnimationKey(state.unit.facing));
        });
        
        this.setScale(0.8);
    }
    
}

const directionToIdleAnimationMap = [{
    direction: LEFT,
    animation: IDLE_LEFT
},{
    direction: RIGHT,
    animation: IDLE_RIGHT
},{
    direction: UP,
    animation: IDLE_UP
},{
    direction: DOWN,
    animation: IDLE_DOWN
}];

function getIdleAnimationKey(facing){
    return directionToIdleAnimationMap.find(mapping => mapping.direction === facing).animation;
}