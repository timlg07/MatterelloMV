
function quickTimeEvent(isPlayerOnAttack){
    
    //=======// CONFIG // START //========//
    // [following values can be changed:]
    
    this.playerDamageIncrease =  2.0; //factor
    this.enemy_DamageDecrease =  2.0; //divisor
    this.maxReactionTime      = 1500; //in ms
    this.appearProbability    =   37; //percentage
    this.showGraphicalRespond =  150; //in ms
    
    // [do not change anything below here]
    //=======// CONFIG // END   //========//
    
    this.damageChange = 1;//default, when nothing happens
    this.isPlayerOnAttack = isPlayerOnAttack;//isPlayerOnAttack ? target=player : target=enemy
    this.isRunning = false;
    var that = this;//used in Listener and Timeout
    
    /**
     * starts the Quick Time Event
     */
    this.start = function(){
        
        if(Math.random()>this.appearProbability/100)return;
        
        this.isRunning = true;
        this.char = this.randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        this.showPicture();
        
        window.addEventListener('keydown', this.keyListener);
        
        //Ends the QuickTimeEvent when time is over
        this.timerId = setTimeout(function(){
            that.removeListener();
            that.onFailure     ();
        },  that.maxReactionTime);
    }
    
    
    /**
     * chooses one random character of the String possible
     * @params possible
     * @return character
     */
    this.randomChar = function(possible){
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    /**
     * shows the picture of the choosen character 
     * this.sprite is used to draw the bitmap on
     */
    this.showPicture = function(){
        this.sprite = new Sprite();
        this.sprite.bitmap = ImageManager.loadPicture(this.char);
        this.sprite.x = Graphics.width  / 2 - this.sprite.bitmap.width  / 2;
        this.sprite.y = Graphics.height / 2 - this.sprite.bitmap.height / 2;
        this.sprite.opacity = 255;
        
        SceneManager._scene.addChild(this.sprite);
    }
    
    /**
     * Removes this.sprite from the scene
     */
    this.removePicture = function(){
        SceneManager._scene.removeChild(this.sprite);
    }
    
    /**
     * Removes the KeyListener and ends the QuickTimeEvent
     */
    this.removeListener = function(){
        window.removeEventListener('keydown', this.keyListener);
        
        this.isRunning = false;
    }
    
    /**
     * KeyListener to handle 'keydown' while QuickTimeEvent is running
     */
    this.keyListener = function(e){try{
        clearTimeout(that.timerId);
        if((that.char.charCodeAt(0))==e.keyCode){
            that.onSuccess();
            if(that.isPlayerOnAttack){
                that.damageChange = 1*this.playerDamageIncrease;
            }else{
                that.damageChange = 1/this.enemy_DamageDecrease;
            }
            that.removeListener();
        }else{
            that.onFailure();
        }}catch(e){alert(e.message)}
    }
    
    /**
     * Graphical feedback if time is over or wrong key pressed
     */
    this.onFailure = function(){try{
        this.sprite.bitmap = ImageManager.loadPicture("onFailure");
        setTimeout(function(){
            that.removePicture();
        },this.showGraphicalRespond);
        }catch(e){alert(e.message)}
    }
    
    /**
     * Graphical feedback if correct key pressed while QuickTimeEvent is running
     */
    this.onSuccess = function(){try{
        this.sprite.bitmap = ImageManager.loadPicture("onSuccess");
        setTimeout(function(){
            that.removePicture();
        },this.showGraphicalRespond);
        }catch(e){alert(e.message)}
    }
            
}