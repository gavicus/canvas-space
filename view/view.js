class View {
    constructor(canvasId, callback){
        this.canvasId = canvasId;
        this.callback = callback;
        this.canvas = $('#' + this.canvasId);

        const golden = 1.618;
        const height = 200;
        const width = height * golden;
        this.canvas.attr("height", height);
        this.canvas.attr("width", width);

        this.context = this.canvas[0].getContext('2d');
        this.color = {
            background: '#161616',
            tile: '#000',
            tileHilight: '#777',
        };
    }

    draw(){
        var c = this.context;
        var w = this.canvas.attr('width');
        var h = this.canvas.attr('height');
        c.fillStyle = this.color.background;
        c.fillRect(0,0,w,h);
    }

    getCanvas(){
        return this.canvas;
    }

    getViewHeight(){
        return parseInt(this.canvas.attr('height'));
    }

    getViewWidth(){
        return parseInt(this.canvas.attr('width'));
    }
}
