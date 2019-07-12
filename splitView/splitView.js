const Page = {mainMenu:1, formView:2};

class SplitView extends View {
    constructor(canvasId, callback, atlas, factionManager){
        super(canvasId, callback);
        this.factionManager = factionManager;
        this.leftData = null;
        this.rightData = null;
        this.rightState = 'main';
        this.atlasView = new AtlasView(
            canvasId, this.handleCallback, atlas, factionManager,
        );
        this.rightView = null;
    }

    draw(){
        this.atlasView.draw();
        if(this.rightView){
            this.rightView.draw();
        }
    }

    getLeftRect(){
        return new Rect(
            0, 0, this.getViewHeight(), this.getViewHeight()
        );
    }

    getRightRect(){
        const left = this.getLeftRect();
        return new Rect(
            left.w, 0,
            this.getViewWidth() - left.w, left.h
        );
    }

    handleCallback = (command, data) => {
        switch(command){
            case 'draw': this.draw(); break;
            case 'formView': this.init(Page.formView, data); break;
            case 'beginMove': this.handleBeginMove(data); break;
            default: this.callback(command, data); break;
        }
    };

    handleBeginMove(group) {
        this.factionManager.setSelectedGroup(group);
    }

    handleTurnCallback = event => {
        this.atlasView.handleTurnCallback(event);
        this.init(Page.mainMenu);
    }

    init(pageId, data){
        
        this.callback(pageId, data);

        switch(pageId){
            case Page.mainMenu: this.initMainMenu(data); break;
            case Page.formView: this.initFormView(data); break;
            default: break;
        }
        this.draw();
    }

    initFormView(data){
        var v;
        if(data instanceof Tile){ v = this.initTileForm(data); }
        else if(data instanceof Group){ v = this.initGroupForm(data); }
        this.rightView = v
    }

    initTileForm(tile){
        var v = new FormView(
            "canvas", this.handleCallback, this.getRightRect()
        );
        var star = tile.getStar();
        if(star){ v.newField(star.getName()); }
        else { v.newField('open space at '+tile.getCoords().toString()); }
        v.newLine();
        var groups = this.factionManager.getGroupsAt(tile.getCoords());
        if(groups.length > 0){
            v.newField(
                groups.length + ' groups',
                ()=>this.handleShowTileGroups(tile)
            );
            v.newLine();
        }
        v.newField('main',()=>this.init(Page.mainMenu));
        return v;
    }

    initGroupForm(group){
        var v = new FormView("canvas", this.handleCallback, this.getRightRect());
        v.newField(group.getDisplay());
        v.newLine();
        v.newField('move',()=>this.handleCallback('beginMove', group));
        v.newLine();
        v.newField('main',this.init(Page.mainMenu));
        return v;
    }

    initMainMenu(){
        var v = new FormView(
            "canvas", this.handleCallback, this.getRightRect()
        );
        var fac = this.factionManager.getFactionUp();
        v.newField(fac.getName().toUpperCase());
        v.newLine();
        v.newField('turn', this.handleTurnCallback);
        this.rightView = v
    }

    onMouseDown = event => {
        if(event.offsetX < this.atlasView.getMapWidth()){
            return this.atlasView.onMouseDown(event);
        }
    }
    onMouseMove = event => {
        if(event.offsetX < this.atlasView.getMapWidth()){
            return this.atlasView.onMouseMove(event);
        }
        return this.rightView.onMouseMove(event);
    }
    onMouseUp = event => {
        if(event.offsetX < this.atlasView.getMapWidth()){
            return this.atlasView.onMouseUp(event);
        }
        return this.rightView.onMouseUp(event);
    }
    onMouseWheel = event => {
        if(event.offsetX < this.atlasView.getMapWidth()){
            return this.atlasView.onMouseWheel(event);
        }
    }
}

