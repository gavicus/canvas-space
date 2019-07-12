class Tile {
    constructor(x,y){
        this.coords = new Point(x,y);
        this.star = null;
    }

    addStar(name){
        var id = this.coords.x + "-" + this.coords.y;
        this.star = new Star(id, name);
    }

    getCoords(){
        return this.coords;
    }

    getTitle(){
        var star = this.getStar();
        if(star){ return star.getName(); }
        else { return 'open space at '+this.getCoords().toString(); }
    }

    getStar(){
        return this.star;
    }
}
