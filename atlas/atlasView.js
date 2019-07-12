class AtlasView extends View {
    constructor(canvasId, callback, atlas, factionManager){
        super(canvasId, callback);
        this.atlas = atlas;
        this.factionManager = factionManager;
        this.rect = new Rect(
            0, 0,
            this.getMapWidth(), this.getViewHeight()
        );
        this.focus = new Point(0,0);
        this.tileRadius = 12;
        this.setTileRadius(12);
        this.color.star = '#fff';
        this.mouseDown = false;
        this.mouseLast = null;
        this.mouseDownPoint = null;
        this.mouseDragged = false;
        this.mouseWheelTally = 0;
        this.hoveredTile = null;
    }

    close(){
        this.mouseDownPoint = null;
    }

    draw(options){
        super.draw();
        for(var tile of this.atlas.getTiles()){
            this.drawTile(tile);
        }
        if(this.hoveredTile){
            this.drawHex(this.hoveredTile.screen, 1.0);
            const c = this.context;
            c.strokeStyle = this.color.tileHilight;
            c.stroke();
            if(options['moving']){
                var group = options.moving;
                var source = this.coordsToScreen(group.getCoords());
                var target = this.coordsToScreen(
                    this.hoveredTile.getCoords()
                );
                var distance = this.atlas.getDistance(
                    group.getCoords(),
                    this.hoveredTile.getCoords()
                );
                if(group.getMoveRange() >= distance){
                    c.beginPath();
                    c.strokeStyle = '#ff0';
                    c.moveTo(source.x, source.y);
                    c.lineTo(target.x, target.y);
                    c.stroke();
                }
            }
        }
    }

    drawHex(center, shrink){
        const c = this.context;
        const r = this.tileRadius * shrink;
        const h = this.tileHeight * shrink;
        c.beginPath();
        c.moveTo(center.x + r, center.y);
        c.lineTo(center.x + r / 2, center.y + h);
        c.lineTo(center.x - r / 2, center.y + h);
        c.lineTo(center.x - r, center.y);
        c.lineTo(center.x - r / 2, center.y - h);
        c.lineTo(center.x + r / 2, center.y - h);
        c.lineTo(center.x + r, center.y);
    }

    drawTile(tile){
        const c = this.context;
        const center = this.coordsToScreen(tile.getCoords());
        tile.screen = center;
        const shrink = 0.85;

        this.drawHex(center,shrink);

        c.fillStyle = this.color.tile;
        c.fill();
        const star = tile.getStar();
        if(star){
            c.fillStyle = star.getColor();
            c.beginPath();
            c.arc(center.x, center.y, star.getSize(), 0, Math.PI*2);
            c.fill();
        }
        const factions = this.factionManager.getFactionsAt(tile.getCoords());
        var lineLen = 3;
        const r = this.tileRadius * shrink;
        const dist = r * 0.7;
        //const dotSize = this.tileRadius * 0.175;
        const dotSize = this.tileRadius * 0.14;
        for(var index in factions){
            var faction = factions[index];
            var cursor = new Point(
                center.x + dist * Math.cos(Math.PI/3 * index),
                center.y + dist * Math.sin(Math.PI/3 * index)
            );
            c.fillStyle = faction.getColor();
            c.beginPath();
            c.arc(cursor.x, cursor.y, dotSize, 0, Math.PI*2);
            c.fill();
            cursor.y += 3;
        }
    }

    changeFocus(delta){ this.focus = this.focus.add(delta); }

    coordsToScreen(c){
        var width = this.getViewWidth();
        var height = this.getViewHeight();
        return new Point(
            width / 2 + c.x * this.tileRadius * 1.5 - this.focus.x,
            height / 2 + c.y * this.tileHeight - this.focus.y
        );
    }

    getHoveredTile(){ return this.hoveredTile; }

    getMapWidth(){
        return parseInt(this.canvas.attr('height'));
    }

    getRect(){ return this.rect; }

    getTileAt(screen){
        var tile = null;
        var dist = 0;
        for(var t of this.atlas.getTiles()){
            var d = screen.distSquared(t.screen);
            if(!tile || d<dist){
                tile = t;
                dist = d;
            }
        }
        return tile;
    }

    onMouseDown = event => {
        this.mouseDown = true;
        this.mouseDownPoint = new Point(event.offsetX, event.offsetY);
        this.mouseLast = this.mouseDownPoint;
        this.mouseDragged = false;
    };

    onMouseMove = event => {
        const current = new Point(event.offsetX, event.offsetY);
        var width = this.getViewWidth();
        var height = this.getViewHeight();
        if(this.mouseDown){
            if(current.x < 0
                || current.y < 0
                || current.x > width
                || current.y > height
            ){
                this.mouseDown = false;
            }
            else {
                this.mouseDragged = true;
                const delta = current.subtract(this.mouseLast);
                this.focus = this.focus.subtract(delta);
                this.mouseLast = current;
            }
        }
        else {
            this.hoveredTile = this.getTileAt(current);
        }
        this.callback('draw');
    };

    onMouseUp = event => {
        const current = new Point(
            event.offsetX, event.offsetY
        );
        this.mouseDown = false;
        var maxMove = 3;
        const dragged = this.mouseDownPoint
            ? this.mouseDownPoint.distSquared(current) > maxMove
            : false;
        if(!dragged){
            const tile = this.hoveredTile;
            const groups = this.factionManager.getGroupsAt(
                tile.getCoords()
            );
            this.callback('formView',tile);
        }
    };

    onMouseWheel = event => {
        event.preventDefault();
        this.mouseWheelTally += event.originalEvent.wheelDelta;
        const threshold = 20;
        if(this.mouseWheelTally > threshold){
            this.mouseWheelTally -= threshold;
            this.setTileRadius(this.tileRadius + 1);
            this.callback('draw');
        }
        else if(this.mouseWheelTally < 0){
            this.mouseWheelTally += threshold;
            this.setTileRadius(this.tileRadius - 1);
            this.callback('draw');
        }
    };

    setTileRadius(r){
        if(r < 8){ return; }
        const lastRadius = this.tileRadius;
        this.tileRadius = r;
        this.tileHeight = r * Math.sin(Math.PI/3);
        const ratio = this.tileRadius / lastRadius;
        this.focus = this.focus.multiply(this.tileRadius / lastRadius);
    }

    handleTurnCallback = () => {
        var fac = this.factionManager.nextFaction();
        this.callback('draw');
    }
}

