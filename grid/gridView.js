class GridView extends View{
    constructor(canvasId, callback, data, headers, stops, getLine){
        super(canvasId, callback);
        this.data = data; // array of objects
        this.headers = headers; // [{name:position},...]
        this.stops = stops;
        this.getLine = getLine; // (datum)=>return{key0:val0,key1:val1,...}
        this.scroll = 0;
        this.setupLines();
        this.mouse = null;
        this.hovered = null;
    }

    close(){
    }

    draw(){
        super.draw();
        if(this.data.length===0){ return; }

        const c = this.context;
        c.fillStyle = '#ccc';
        c.font = "bold 12px Arial";
        const lineHeight = 16;
        var y = lineHeight;

        this.drawLine(this.headers, y);
        y += lineHeight - this.scroll;
        var lineColor = '#aaa';
        c.font = "12px Arial";
        this.hovered = null;
        for(var datum of this.data){
            var lineData = Object.values(this.getLine(datum));
            c.fillStyle = lineColor;
            if(this.mouse){
                if(
                    this.mouse.y > y - lineHeight * 0.5
                    && this.mouse.y < y + lineHeight * 0.5
                ){
                    c.fillStyle = '#fff';
                    this.hovered = datum;
                }
            }
            this.drawLine(lineData, y);
            y += lineHeight;
        }
    }

    drawLine(line, y){
        const c = this.context;
        const leftPad = 10;
        for(var index in line){
            c.fillText(line[index], this.stops[index] + leftPad, y);
        }
    }

    onMouseMove = event => {
        this.mouse = new Point(event.offsetX, event.offsetY);
        this.draw();
    };

    onMouseDown = event => {};

    onMouseUp = event => {
        if(this.hovered){
            this.callback('formView',this.hovered);
        }
        else {
            this.callback('atlasView');
        }
    };

    onMouseWheel = event => {
        event.preventDefault();
        this.scroll -= event.originalEvent.wheelDelta * 0.2;
        if(this.scroll < 0){ this.scroll = 0; }
        this.draw();
    };

    setupLines(){
        this.lines = [];
        for(var datum of this.data){
            this.lines.push({
                values: Object.values( this.getLine(datum) ),
            });
        }
    }
}

