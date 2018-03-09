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
        /*$gameScreen.showPicture(
            0,this.char,
            this.char+".png",
            1,
            Graphics.width  / 2,
            Graphics.height / 2,
            50, 50, 255, 0
        );*/
        var sprite = new Sprite();
        sprite.bitmap = ImageManager.loadPicture(this.char);
        sprite.x = Graphics.width  / 2;
        sprite.y = Graphics.height / 2;
        sprite.opacity = 255;
        SceneManager._scene.addChild(sprite);
    }
    
    this.removePicture = function(){
        //$gameScreen.eraseBattlePictures();
    }
    
    this.KeyListener = function(e){
        alert("KeyListener called")
        /*if(String.charCodeAt(this.char)==e.keyCode){
            alert("Key is correct")
            this.removePicture();
            if(this.isPlayerOnAttack){
                //increasePlayerDamage
                this.damageChange = 2.0;
            }else{
                //decreaseEnemyDamage
                this.damageChange = 0.5;
            }
            this.removeListener();
        }*/
    }
    
    this.removeListener = function(){
        window.removeEventListener('keydown', this.KeyListener);
    }
            
}