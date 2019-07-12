class Group {
    constructor(id, faction){
        this.id = id;
        this.faction = faction;
        this.units = [];
        this.coords = new Point(0,0);
        this.moved = false;
    }

    addUnit(designId, count){
        for(var unit of this.units){
            if(unit.designId === designId){
                unit.count += count;
                return;
            }
        }
        this.units.push({designId:designId, count:count});
    }

    moveToTile(tile){
        var coords = tile.getCoords();
        this.setCoords(coords.x, coords.y);
    }

    getCoords(){ return this.coords; }

    getDisplay(){
        return 'group '+this.id+' ('+this.faction.getName() + ')';
    }

    getFaction(){ return this.faction; }

    getId(){ return this.id; }

    getMoved(){ return this.moved; }

    getMoveRange(){ return 3; }

    resetTurn(){ this.moved = false; }

    setCoords(x,y){ this.coords.set(x,y); }

    setMoved(){ this.moved = true; }
}

