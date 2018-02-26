function Savepoints(){
    alert("error_STATIC_CLASS");
}

//The names of all Savepoints:
Savepoints.names = [
    "Autosave",
    "Kapitel1",
    "Kapitel2",
    "Kapitel3",
    "Kapitel4",
];

Savepoints.getName = function(savefileId){
    realID = savefileId - 1;
    return Savepoints.names[realID]
}


//SAVE
Savepoints.doAutosave = function(){
    alert("didAutosave")
    try{
        return DataManager.saveGameWithoutRescue(1);
    }catch(e){
        console.error(e);
        try{StorageManager.remove(1);}catch(e2){doNothing()}
        return false;
    }
}

Savepoints.saveGame = function(savefileId) {
    if(savefileId==1){
        return false;
    }//NEW@TIM#SAVE
    try {
        return DataManager.saveGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
        }catch(e2){doNothing()}
        return false;
    }
};

//...
function doNothing(){}