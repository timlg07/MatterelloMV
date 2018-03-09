function quickTimeEvent(isPlayerOnAttack){
    
    this.damageChange = 1;
    this.isPlayerOnAttack = isPlayerOnAttack;
    
    this.start = function(){
        
        if(Math.random()<0.50)return;
        
        this.char = this.randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        this.showPicture(this.char);
        
        window.addEventListener('keydown', this.KeyListener);
        
        SceneManager._scene._waitCount += 90; 
    }
    
    this.randomChar = function(possible){
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    this.showPicture = function(){
        /*this.picture_xPos = Graphics.width  / 2;
        this.picture_yPos = Graphics.height / 2;
        $gameScreen.showPicture(0,this.char,"\\qte\\"+this.char+".png", 1, this.picture_xPos, this.picture_yPos, 50, 50, 255, 0);*/
    }
    
    this.removePicture = function(){
        //$gameScreen.eraseBattlePictures();
    }
    
    this.KeyListener = function(e){
        alert("KeyListener called")
        if(String.charCodeAt(this.char)==e.keyCode){
            alert("Key is correct")/*
            this.removePicture();
            if(this.isPlayerOnAttack){
                //increasePlayerDamage
                this.damageChange = 2.0;
            }else{
                //decreaseEnemyDamage
                this.damageChange = 0.5;
            }*/
            this.removeListener();
        }
    }
    
    this.removeListener = function(){
        window.removeEventListener('keydown', this.KeyListener);
    }
            
}