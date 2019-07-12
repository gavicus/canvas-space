class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(p){
        return new Point(this.x + p.x, this.y + p.y);
    }

    copy(){
        return new Point(this.x, this.y);
    }

    distSquared(p){
        return Math.pow(this.x-p.x, 2) + Math.pow(this.y-p.y, 2);
    }

    equals(p){
        return this.x === p.x && this.y === p.y;
    }

    multiply(m){
        return new Point(this.x * m, this.y * m);
    }

    negative(){
        return new Point(-this.x, -this.y);
    }

    set(x,y){
        this.x = x;
        this.y = y;
    }

    subtract(p){
        const neg = p.negative();
        return this.add(neg);
    }

    toString(){
        return `(${this.x}, ${this.y})`;
    }
}

