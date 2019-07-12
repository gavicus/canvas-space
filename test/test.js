const State = {none:0, move:1};

class Test {
    constructor(){
        this.factionManager = new FactionManager();
        this.factionManager.testSetup();
        this.atlas = new Atlas();
        this.atlas.genCircular();
        this.atlasView = new AtlasView(
            "canvas", this.callback,
            this.atlas, this.factionManager
        );
        this.draw();
        this.setupEvents();
        this.initMainControl();
        this.setState(State.none);
        this.selectedTile = null;
        this.selectedGroup = null;
    }

    callback = (command,data) => {
        switch(command){
            case 'beginMove': this.beginMove(data); break;
            case 'formView': this.initControl(command,data); break;
            case 'draw': this.draw(); break;
            default: break;
        }
    };

    draw(){
        var options = {};
        if(this.state === State.move){
            options['moving'] = this.selectedGroup;
        }
        this.atlasView.draw(options);
    }

    getSideRect(){
        const mapWidth = this.atlasView.getMapWidth();
        const viewWidth = this.atlasView.getViewWidth();
        const viewHeight = this.atlasView.getViewHeight();
        return new Rect(
            mapWidth, 0,
            viewWidth - mapWidth,
            viewHeight
        );
    }

    getView(){
        return this.view;
    }

    openAtlasView(){
        this.view = this.atlasView;
    }

    onBeginMove = () => {
        $('#controls #group .cancel-move').removeClass('hidden');
        $('#controls #group .move-group').addClass('hidden');
        var group = this.selectedGroup;
        this.factionManager.setSelectedGroup(group);
        this.setState(State.move);
        this.draw();
    }

    onCancelMove = () => {
        $('#controls #group .cancel-move').addClass('hidden');
        $('#controls #group .move-group').removeClass('hidden');
        this.setState(State.none);
        this.draw();
    }

    handleControlsClick = event => {
        var target = event.target;
        var type = target.getAttribute('data-type');
        if(type === 'group'){
            var facId = target.getAttribute('data-faction');
            var groupId = target.getAttribute('data-group');

            var fac = this.factionManager.getFaction(facId);
            var group = fac.getGroup(groupId);
            this.initControl('formView',group);
        }
    }

    handleTurnCallback = event => {
        this.atlasView.handleTurnCallback();
        this.initMainControl();
    };

    openGridView(data){
        var headers=['name','id','faction'];
        var stops=[0,50,90];
        this.view = new GridView(
            "canvas", this.callback, data, headers, stops,
            (datum)=>{ return {
                name:'group',
                id:datum.getId(),
                faction:datum.getFaction().getName(),
            }; },
        );
    }

    setState(s){ this.state = s; }

    setupEvents(){
        const canvas = this.atlasView.getCanvas();
        canvas.on(
            'mousedown',
            (event)=>{ this.onMouseDown(event); }
        );
        canvas.on(
            'mousemove',
            (event)=>{ this.atlasView.onMouseMove(event); }
        );
        canvas.on( 'mouseup', this.onMouseUp);
        canvas.on(
            'mousewheel',
            (event)=>{ this.atlasView.onMouseWheel(event); }
        );

        $('.show-main').on('click', event=>this.initControl('main'));
        $('.show-selected-tile').on(
            'click', event=>this.initControl('formView', this.selectedTile)
        );
        $('#controls').on('click', this.handleControlsClick);
        $('#controls #group .move-group').on('click', this.onBeginMove);
        $('#controls #group .cancel-move').on('click', this.onCancelMove);
        $('#next-turn').on('click', this.handleTurnCallback);
    }

    onMouseDown = event => {
        if(this.state === State.move){}
        else{
            this.atlasView.onMouseDown(event);
        }
    }

    onMouseUp = event => {
        if(this.state === State.move){
            var tile = this.atlasView.getHoveredTile();
            if(tile){
                var group = this.selectedGroup;
                var distance = this.atlas.getDistance(
                    group.getCoords(), tile.getCoords()
                );
                if(group.getMoveRange() >= distance){
                    group.moveToTile(tile);
                    group.setMoved(true);
                    this.setState(State.none);
                    this.draw();
                }
                else {
                    this.onCancelMove();
                }
            }
        }
        else{
            this.atlasView.onMouseUp(event);
        }
    }

    initControl(name, data){
        if(name === "main"){ this.initMainControl(); }
        else if(name === "formView"){
            if(data.constructor.name === "Tile"){
                this.initTileControl(data);
            }
            else if(data.constructor.name === "Group"){
                this.initGroupControl(data);
            }
        }
        else{ throw('missing control ' + name); }
    }

    initGroupControl(group){
        this.selectedGroup = group;
        var faction = this.selectedGroup.getFaction();
        var factionUp = this.factionManager.getFactionUp();
        $('#controls #group .header').html(group.getDisplay());
        $('#controls #group .show-selected-tile').html(
            this.selectedTile.getTitle()
        );
        $('#controls #group .cancel-move').addClass('hidden');
        $('#controls #group .move-group').addClass('hidden');
        if(faction === factionUp && !group.getMoved()){
            $('#controls #group .move-group').removeClass('hidden');
        }

        var rightMarkup = '';
        if(faction === factionUp){
            var moved = group.getMoved() ? 'moved' : 'can move';
            rightMarkup = '<ul>';
            rightMarkup += `<li>${moved}</li>`;
            rightMarkup += '</ul>';
        }
        $('#controls #group .right').html(rightMarkup);
        this.showControl('group');
    }

    initMainControl(){
        var fac = this.factionManager.getFactionUp();
        $('#controls #main .header').html(fac.getName());
        this.showControl('main');
    }

    initTileControl(tile){
        this.selectedTile = tile;
        var fac = this.factionManager.getFactionUp();
        var getLi = g => {
            var classes = 'list-item';
            if(g.getFaction() === fac){ classes += ' mine'; }
            var li = `<li class="${classes}"`;
            li += ` data-type="group"`;
            li += ` data-faction="${g.getFaction().getId()}"`;
            li += ` data-group="${g.getId()}"`;
            li += `>${g.getDisplay()}</li>`;
            return li;
        }
        $('#controls #tile .header').html(tile.getTitle());
        var groupList = '';
        var groups = this.factionManager.getGroupsAt(tile.getCoords());
        if(groups.length > 0){
            groupList = '<ul>';
            groupList += groups
                .map(group => getLi(group))
                .join('');
            groupList += '</ul>';
        }
        $('#controls #tile .right').html(groupList);
        this.showControl("tile");
    }

    showControl(name){
        var controls = $("#controls .form");
        for(var form of controls){
            if(form.id === name){ $(form).addClass('active'); }
            else{ $(form).removeClass('active'); }
        }
    }
}

var t = new Test();

