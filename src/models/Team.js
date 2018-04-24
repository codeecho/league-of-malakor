import {Soldier} from './units';

export default function Team(name, active){
    return {
        name,
        active,
        hasActed: false,
        units: [
            new Soldier(),
            new Soldier(),
            new Soldier()            
        ]
    };
}