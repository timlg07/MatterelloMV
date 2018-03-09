function quickTimeEvent(isPlayerOnAttack){
    
    this.damageChange = 1;
    this.isPlayerOnAttack = isPlayerOnAttack;
    
    this.start = function(){
        
        if(Math.random()<0.27)return;
        
        this.char = this.randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        this.showPicture(this.char);
        
        window.addEventListener('keydown', this.KeyListener);
        
        SceneManager._scene._waitCount += 90; 
    }
    
    this.randomChar = function(possible){
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    this.showPicture = function(){
        window.sprite = new Sprite();
        window.sprite.bitmap = ImageManager.loadPicture(this.char);
        window.sprite.x = Graphics.width  / 2;
        window.sprite.y = Graphics.height / 2;
        window.sprite.opacity = 255;
        SceneManager._scene.addChild(window.sprite);
    }
    
    this.removePicture = function(){
        SceneManager._scene.removeChild(window.sprite);
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