function Savepoints(){
    alert("error_STATIC_CLASS");
}

//The names of all Savepoints:
Savepoints.names = [
    "Autosave",
    "Killer",
    "My family wants me dead?",
    "Flashback 1",
    "Investigation",
    "Flashback 2",
    "Boss Fight"
];

Savepoints.getName = function(savefileId){
    realID = savefileId - 1;
    return Savepoints.names[realID]
}

Savepoints.maxSavefiles = function() {
    return this.names.length + 1;
}

//SAVE
Savepoints.doAutosave = function(){
    try{
        if( DataManager.saveGameWithoutRescue( 1 )) SoundManager.playSave();
    }catch(e){
        alert(e);
        try{StorageManager.remove(1);}catch(e2){}
    }
}

Savepoints.saveGame = function(savefileId) {
    if(savefileId==1){
        return false;
    }//NEW@TIM#SAVE
    try {
        return DataManager.saveGameWithoutRescue(savefileId);
    } catch (e) {
        alert(e);
        try {
            StorageManager.remove(savefileId);
        }catch(e2){doNothing()}
        return false;
    }
};

//...
function doNothing(){}