
function quickTimeEvent(isPlayerOnAttack){
    
    //=======// CONFIG // START //========//
    // [following values can be changed:]
    
    this.playerDamageIncrease =  2.0; //factor
    this.enemy_DamageDecrease =  2.0; //divisor
    this.maxReactionTime      = 1500; //in ms
    this.appearProbability    =   37; //percentage
    
    // [do not change anything below here]
    //=======// CONFIG // END   //========//
    
    this.damageChange = 1;
    this.isPlayerOnAttack = isPlayerOnAttack;
    this.isRunning = false;
    var that = this;
    
    
    this.start = function(){
        
        if(Math.random()>this.appearProbability/100)return;
        
        this.isRunning = true;
        this.char = this.randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        this.showPicture();
        
        window.addEventListener('keydown', this.keyListener);
        
        this.timerId = setTimeout(function(){
            that.removePicture ();
            that.removeListener();
        },  that.maxReactionTime);
    }
    
    this.randomChar = function(possible){
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    this.showPicture = function(){
        this.sprite = new Sprite();
        this.sprite.bitmap = ImageManager.loadPicture(this.char);
        this.sprite.x = Graphics.width  / 2 - this.sprite.bitmap.width  / 2;
        this.sprite.y = Graphics.height / 2 - this.sprite.bitmap.height / 2;
        this.sprite.opacity = 255;
        SceneManager._scene.addChild(this.sprite);
    }
    
    this.removePicture = function(){
        SceneManager._scene.removeChild(this.sprite);
    }
    
    this.removeListener = function(){
        window.removeEventListener('keydown', this.keyListener);
        
        this.isRunning = false;
    }
    
    this.keyListener = function(e){try{
        clearTimeout(that.timerId);
        if((that.char.charCodeAt(0))==e.keyCode){
            that.removePicture();
            if(that.isPlayerOnAttack){
                that.damageChange = 1*this.playerDamageIncrease;
            }else{
                that.damageChange = 1/this.enemy_DamageDecrease;
            }
            that.removeListener();
        }}catch(e){alert(e.message)}
    }
            
}