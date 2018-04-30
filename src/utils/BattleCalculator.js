export default class BattleCalculator{
    
    calculateDamage(attacker, defender){
        const power = attacker.attack.power;
        const defense = defender.defense;
        return power - (power * (defense/100));
    }
    
}