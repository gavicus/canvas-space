class Markov {
    constructor(source){
        this.lookup = {};
        var source = nameData;
        this.initLookup(source);
    }
    initLookup(source){
        var srcAry = source.split(/[ \n]/);
        for(var word of srcAry){
            if(!word){continue;}
            word = word.trim().toLowerCase();
            var key;
            for(var index in word){
                if(index == 0){ key = '--'; }
                else if(index == 1){ key = '-'+word[0]; }
                else{ key = word.substr(index-2,2); }
                var value = word[index];
                this.addToLookup(key,value);
            }
            var lastKey = word.substring(word.length-2);
            this.addToLookup(lastKey,'-');
        }
    }
    addToLookup(key,value){
        if(!key || !value){ return; }
        if(!this.lookup[key]){ this.lookup[key]=''; }
        this.lookup[key] += value;
    }
    randomIndex(length){
        return Math.floor(Math.random()*length);
    }
    getLetter(key){
        var choices = this.lookup[key];
        var index = this.randomIndex(choices.length);
        return choices[index];
    }
    generateWord(){
        var word = '';
        var first = this.getLetter('--');
        word += first;
        word += this.getLetter('-'+first);
        while(true){
            var key = word.substring(word.length-2);
            var letter = this.getLetter(key);
            if(letter == '-'){ break; }
            word += letter;
        }
        return word;
    }
}
