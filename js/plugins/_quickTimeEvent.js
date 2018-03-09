function quickTimeEvent(){
    
    this.damageChange = 1;
    
    this.start = function(isPlayerOnAttack){
        
        if(Math.random()<0.50)return;
        
        alert("qte called")
        
        this.char = this.randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        this.showPicture(this.char);
        
        this.timer = new Timer();
        this.timer.setFrames(90);
        
        SceneManager._scene._waitCount += 90; 
        
        window.addEventListener('keydown', this.KeyListener);
        
        this.timer.onExpire = function(){
            this.removePicture();
            window.removeEventListener('keydown', this.KeyListener);
        }
    }
    
    this.randomChar = function(possible){
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    this.showPicture = function(){
        alert("showPicture called")
        this.picture_xPos = Graphics.width  / 2;
        this.picture_yPos = Graphics.height / 2;
        $gameScreen.showPicture(0,this.char,"\\qte\\"+this.char+".png", 1, this.picture_xPos, this.picture_yPos, 50, 50, 255, 0);
    }
    
    this.removePicture = function(){
        $gameScreen.eraseBattlePictures();
    }
    
    this.KeyListener = function(e){
        if(String.charCodeAt(this.char)==e.keyCode){
                this.removePicture();
                if(this.isPlayerOnAttack){
                    //increasePlayerDamage
                    this.damageChange = 2.0;
                }else{
                    //decreaseEnemyDamage
                    this.damageChange = 0.5;
                }
            }
    }
            
}