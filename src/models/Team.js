import {Soldier, Archer, Paladin, Warlock, Healer, Demon, Siren} from './units';

export default function Team(name, active, color){
    return {
        name,
        active,
        color,
        hasActed: false,
        units: [
            new Paladin(),
            new Warlock(),
            new Healer(),
            new Demon(),
            new Siren(),
            new Archer(),        
            new Soldier(),
            new Soldier(),
            new Soldier(),
            new Archer()
        ]
    };
}