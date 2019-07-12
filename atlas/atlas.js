class Atlas {
    constructor(){
        this.tiles = [];
        this.markov = new Markov();
    }

    genCircular(){
        const radius = 10;
        const center = new Point(0,0);
        for(var i=0; i<=radius; ++i){
            var ring = this.getRing(center, i);
            for(var p of ring){
                this.tiles.push(new Tile(p.x, p.y));
            }
        }
        const stars = 15;
        for(var i=0; i<stars; ++i){
            do{
                var roll = Math.floor(Math.random()*this.tiles.length);
                var tile = this.tiles[roll];
                if(!tile.getStar()){
                    var name = this.markov.generateWord();
                    tile.addStar(name);
                    break;
                }
            } while(true)
        }
    }

    getDistance(pa, pb){
        var dx = Math.abs(pa.x - pb.x);
        var dy = Math.abs(pa.y - pb.y);
        var dist = dx;
        if(dy > dx){ dist = dx + Math.floor((dy-dx)/2); }
        return dist;
    }

    getRing(c, radius){
        if(radius===0){
            return [new Point(c.x, c.y)];
        }
        var ring = [];
        for(var i = 0; i < radius; ++i){
            ring.push(new Point(c.x + i, c.y - radius*2 + i));
            ring.push(new Point(c.x + radius, c.y - radius + i*2,));
            ring.push(new Point(c.x + radius - i, c.y + radius + i,));
            ring.push(new Point(c.x - i, c.y + radius*2 - i));
            ring.push(new Point(c.x - radius, c.y + radius - i*2,));
            ring.push(new Point(c.x - radius + i, c.y - radius - i,));
        }
        return ring;
    }

    getTileAt(coord){
        for(var tile of this.tiles){
            if(tile.x===coord.x && tile.y===coord.y){
                return tile;
            }
        }
        return null;
    }

    getTiles(){
        return this.tiles;
    }
}

