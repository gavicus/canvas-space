class FactionManager {
    constructor(){
        this.lastId = 0;
        this.factions = [];
        this.factionUp = null;
        this.selectedGroup = null;
        this.colors=['#f55','#08f','#0e0','#ff4','#a6f','#f80'];
        this.markov = new Markov();
    }

    createFaction(){
        const id = this.lastId++;
        var name = this.markov.generateWord();
        if(name.length > 10){ name = name.substr(0,10); }
        const fac = new Faction(id, name, this.colors[id]);
        this.factions.push(fac);
        if(!this.factionUp){ this.factionUp = fac; }
        return fac;
    }

    getFaction(id){
        return this.factions.find(
            f => parseInt(f.getId()) === parseInt(id)
        );
    }

    getFactionsAt(coords){
        var factions = [];
        for(var faction of this.factions){
            if(faction.getGroupsAt(coords).length > 0){
                factions.push(faction);
            }
        }
        return factions;
    }

    getFactionUp(){
        return this.factionUp;
    }

    getGroupsAt(coords){
        var groups = [];
        for(var faction of this.factions){
            groups = groups.concat(faction.getGroupsAt(coords));
        }
        return groups;
    }

    getSelectedGroup(){
        return this.selectedGroup;
    }

    nextFaction(){
        var index = this.factions.indexOf(this.factionUp);
        index += 1;
        if(index >= this.factions.length){ index = 0; }
        this.factionUp = this.factions[index];
        this.factionUp.initTurn();
        return this.factionUp;
    }

    setSelectedGroup(g){
        return this.selectedGroup = g;
    }

    testSetup(){
        for(var i=0; i<this.colors.length; ++i){
            var fac = this.createFaction();
            fac.createGroup().setCoords(0,0);
        }
    }
}
