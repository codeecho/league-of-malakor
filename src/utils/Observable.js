export default class Observable{
    
    constructor(value){
        this.value = value;
        this.observers = [];
    }
    
    get(){
        return this.value;
    }
    
    set(value){
        const oldValue = this.value;
        this.value = value;
        this.observers.forEach(observer => observer(value, oldValue));
    }
    
    subscribe(observer, emitCurrentValue){
        this.observers.push(observer);
        if(emitCurrentValue) observer(this.value);
    }
    
}