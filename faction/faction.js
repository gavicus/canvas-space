class Faction {
    constructor(id, name, color){
        this.id = id;
        this.name = name;
        this.color = color;
        this.groups = [];
        this.designs = [];
        this.lastId = 0;
    }

    createGroup(){
        const group = new Group(++this.lastId, this);
        this.groups.push(group);
        return group;
    }

    createUnit(group, designId, count){
        group.addUnit(designId, count);
    }

    getColor(){ return this.color; }

    getDisplay(){
        return 'faction '+this.id;
    }

    getGroupsAt(coords){
        var groups = [];
        for(var group of this.groups){
            if(group.getCoords().equals(coords)){
                groups.push(group);
            }
        }
        return groups;
    }

    getGroups(){ return this.groups; }

    getGroup(id){
        return this.groups.find(
            g => parseInt(g.getId()) === parseInt(id)
        );
    }

    getId(){ return this.id; }

    getName(){ return this.name; }

    initTurn(){
        for(var group of this.groups){
            group.resetTurn();
        }
    }
}

