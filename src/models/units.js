import {ATTACK_TYPE} from '../constants/constants';

const {LINE_OF_SIGHT, HEAL, MULTI_DIRECTION, AOE, FREEZE} = ATTACK_TYPE;

import {RIGHT} from '../constants/directions';

const unit = {
    alive: true,
    health: 50,
    maxHealth: 50,
    selected: false,
    hasActed: false,
    hasMoved: false,
    hasAttacked: false,
    wait: 0,
    cell: undefined,
    facing: RIGHT
}

export function Soldier(){
    return Object.assign({}, unit, {
        type: 'Soldier',
        defense: 50,
        recovery: 1,
        movement: 3,
        attack: {
            type: LINE_OF_SIGHT,
            power: 40,
            range: 1,
            animation: 'slash'
        }
    });
}

export function Archer(){
    return Object.assign({}, unit, {
        type: 'Archer',
        defense: 40,
        recovery: 2,
        movement: 3,
        attack: {
            type: LINE_OF_SIGHT,
            power: 40,
            range: 4,
            animation: 'slash'
        }
    });
}

export function Healer(){
    return Object.assign({}, unit, {
        type: 'Healer',
        defense: 0,
        recovery: 5,
        movement: 3,
        attack: {
            type: HEAL,
            power: 25,
            range: 1,
            animation: 'heal'
        }
    });
}

export function Paladin(){
    return Object.assign({}, unit, {
        type: 'Paladin',
        defense: 30,
        recovery: 2,
        movement: 4,
        attack: {
            type: MULTI_DIRECTION,
            power: 60,
            range: 1,
            animation: 'thunder'
        }
    });
}

export function Warlock(){
    return Object.assign({}, unit, {
        type: 'Warlock',
        defense: 20,
        recovery: 3,
        movement: 3,
        attack: {
            type: AOE,
            power: 60,
            range: 4,
            animation: 'magic'
        }
    });
}

export function Demon(){
    return Object.assign({}, unit, {
        type: 'Demon',
        defense: 50,
        recovery: 3,
        movement: 2,
        attack: {
            type: LINE_OF_SIGHT,
            power: 60,
            range: 4,
            animation: 'fire',
            aoe: true
        }
    });
}

export function Siren(){
    return Object.assign({}, unit, {
        type: 'Siren',
        defense: 20,
        recovery: 3,
        movement: 3,
        attack: {
            type: FREEZE,
            power: 5,
            range: 4,
            animation: 'freeze'
        }
    });
}