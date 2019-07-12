class Star {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.randomizeColor();
        this.randomizeSize();
    }

    getColor(){ return this.color; }

    getName(){
        return `${this.name} (${this.id})`;
    }

    getSize(){ return this.size; }

    randomizeColor(){
        const max = 192;
        const colorIndex = Math.floor(Math.random() * max/2) + max/2;
        this.color = 'rgba('+colorIndex+','+colorIndex+','+colorIndex+')';
    }

    randomizeSize(){
        this.size = Math.random() + 1;
        if(Math.random() < 0.1){ this.size += Math.random(); }
    }
}

