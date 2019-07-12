class FormView extends View {
    constructor(canvasId, callback, rect){
        super(canvasId, callback);
        this.rect = rect.copy();
        this.fields = [];
        this.gutter = 5;
        this.lineHeight = 0;
        this.cursor = new Point(
            this.rect.x + this.gutter,
            this.rect.y + this.gutter
        );
        this.color.buttonBackground = '#333';
        this.color.hilitBackground = '#555';
        this.color.text = '#bbb';
        this.fontHeight = 12;
        this.font = this.fontHeight + "px Arial";
        this.mouse = null;
        this.hovered = null;
    }

    close(){
    }

    draw(){
        var c = this.context;
        c.fillStyle = this.color.background;
        var r = this.rect;
        c.fillRect(r.x, r.y, r.w, r.h);

        for(var field of this.fields){
            var backColor = field.callback
                ? this.color.buttonBackground
                : this.color.background;
            if(
                field.callback
                && this.mouse
                && field.contains(this.mouse)
            ){
                backColor = this.color.hilitBackground;
                this.hovered = field;
            }
            field.draw();
        }
    }

    newField(text,callback){
        var field = new FormField(this.context, text, this.cursor, callback);
        this.fields.push(field);
        var rect = field.getRect();
        this.cursor.x += rect.w + this.gutter;
        if(rect.h > this.lineHeight){ this.lineHeight = rect.h; }
    }

    newLine(){
        this.cursor.set(
            this.rect.x + this.gutter,
            this.cursor.y + this.lineHeight + this.gutter
        );
        this.lineHeight = 0;
    }

    onMouseMove = event => {
        for(var field of this.fields){
            field.onMouseMove(event);
        }
    };

    onMouseUp = event => {
        for(var field of this.fields){
            field.onMouseUp(event);
        }
    };
}

