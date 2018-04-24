import {ATTACK_TYPE} from '../constants/constants';

const {LINE_OF_SIGHT} = ATTACK_TYPE;

const unit = {
    alive: true,
    health: 100,
    maxHealth: 100,
    selected: false,
    hasActed: false,
    hasMoved: false,
    hasAttacked: false,
    wait: 0,
    cell: undefined
}

export function Soldier(){
    return Object.assign({}, unit, {
        type: 'Soldier',
        defense: 80,
        recovery: 1,
        movement: 3,
        attack: {
            type: LINE_OF_SIGHT,
            power: 100,
            range: 1
        }
    });
}

function Archer(){
    
}

function Healer(){
    
}

function Paladin(){
    
}

function Warlock(){
    
}

function Samurai(){
    
}

function Siren(){
    
}