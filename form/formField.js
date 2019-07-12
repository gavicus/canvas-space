class FormField {
    constructor(context, text, point, callback){
        this.context = context;
        this.text = text;
        this.point = point;
        this.callback = callback;

        this.fontHeight = 12;
        this.fontName = "Arial";
        this.gutter = 5;
        this.textColor = '#bbb';
        this.backgroundColor = '#1c1c1c';
        this.buttonColor = '#333';
        this.hoverBackColor = '#555';
        this.hovered = false;

        this.setupRect(this.point);
    }

    getFont(){ return this.fontHeight + "px " + this.fontName; }

    setFontHeight(h){
        this.fontHeight = h;
        this.setupRect(this.point);
    }

    setFontName(n){
        this.fontName = n;
        this.setupRect(this.point);
    }

    setTextColor(c){
        this.textColor = c;
    }

    setText(t){
        this.text = t;
        this.setupRect(this.point);
    }

    contains(p){ return this.rect.contains(p); }

    draw(){
        const c = this.context;
        c.font = this.getFont();
        c.textBaseline = "middle";
        c.fillStyle = this.callback
            ? this.hovered
                ? this.hoverBackColor
                : this.buttonColor
            : this.backgroundColor;
        var r = this.getRect();
        c.fillRect(r.x, r.y, r.w, r.h);
        c.fillStyle = this.textColor;
        c.fillText(this.getText(), r.x + this.gutter, r.y + r.h/2);
    }

    getCallback(){ return this.callback; }
    getRect(){ return this.rect; }
    getHeight(){ return this.rect.h; }
    getText(){ return this.text; }

    onMouseUp = event => {
        if(!this.callback){ return; }
        if(this.hovered){
            this.callback();
            return true;
        }
        return false;
    }

    onMouseMove = event => {
        if(!this.callback){ return; }
        var spot = new Point(event.offsetX, event.offsetY);
        this.hovered = this.contains(spot);
        this.draw();
        return this.hovered;
    }

    setupRect(cursor){
        const c = this.context;
        c.font = this.getFont();
        var textWidth = c.measureText(this.text).width;
        this.rect = new Rect(
            cursor.x, cursor.y,
            textWidth + this.gutter * 2,
            this.fontHeight + this.gutter * 2,
        );
    }
}

