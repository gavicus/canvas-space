class Rect extends Point {
    constructor(x,y,w,h){
        super(x,y);
        this.w = w;
        this.h = h;
    }

    contains(p){
        if(p.x < this.x){ return false; }
        if(p.y < this.y){ return false; }
        if(p.x > this.x + this.w){ return false; }
        if(p.y > this.y + this.h){ return false; }
        return true;
    }

    copy(){
        return new Rect(this.x, this.y, this.w, this.h);
    }
}

