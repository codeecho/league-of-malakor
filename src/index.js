import './index.css';

import Phaser from 'phaser'

import Battle from './screens/Battle';

var config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 960,
    height: 640,
    scene: [
        Battle
    ]
};

var game = new Phaser.Game(config);

