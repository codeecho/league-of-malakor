import {autorun} from 'mobx';

export default class Unit extends Phaser.GameObjects.Sprite{
    
    constructor(scene, state){
        super(scene, 0, 0, 'unit');
        
        this.scene = scene;
        this.state = state;
        
        scene.add.existing(this);
        
        this.healthLabel = new Phaser.GameObjects.Text(scene, 0, 0, '', {fontSize: '16px', fill: '#fff', align: 'center'})
        this.healthLabel.setOrigin(0.5, 1);
        
        scene.add.existing(this.healthLabel);
        
        this.waitLabel = new Phaser.GameObjects.Text(scene, 0, 0, '0', {fontSize: '16px', fill: '#fff', align: 'right'})
        this.waitLabel.setOrigin(1, 0);
        
        scene.add.existing(this.waitLabel);        
        
        autorun(() => {
            if(!state.cell) return;
            const {x, y} = state.cell.getCenter();
            this.setPosition(x, y);
            this.healthLabel.setPosition(x, y + (state.cell.size/2));
            this.waitLabel.setPosition(x + (state.cell.size/2), y - (state.cell.size/2));
        });
        
        autorun(() => {
            this.state.selected ? this.setTint(0xff0000) : this.clearTint();
            this.healthLabel.setText(this.state.health + '/' + this.state.maxHealth);
        });
        
        autorun(() => {
            this.waitLabel.setText(this.state.wait);
        });
        
        autorun(() => {
            if(!state.alive){
                this.active = false;
                this.visible = false;
                this.healthLabel.visible = false;
                this.waitLabel.visible = false;
            }
        })
    }
    
}