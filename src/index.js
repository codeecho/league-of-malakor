import './index.css';

import Phaser from 'phaser'

import Battle from './screens/Battle';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
        Battle
    ]
};

var game = new Phaser.Game(config);

