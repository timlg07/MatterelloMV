function Flashback(){
    
    //=======// CONFIG // START //========//
    // [following values can be changed:]
    
    this.maxOpacity = 250; //opacity between 0 and 255
    this.normalOpacity = 100; //opacity between 0 and 255
    this.animationTime = 800; //ms
    this.color = '#ffffff'; //#RRGGBB; r=maumau.getHairColor, g=grün, b=blau; 0-8,A-F => stärke (0=nichts,f=full)
    
    // [do not change anything below here]
    //=======// CONFIG // END   //========//
    
    var that = this;
        
    this.start = function(){
        this.initSprite();
        this.showSprite();
        this.blurSprite();
        
        this.animation(this.maxOpacity,function(){
            that.animation(that.normalOpacity,function(){
                that.continue();
            });
        });
    }
    
    this.continue = function(){
        
    }
    
    this.end = function(){
        this.animation(this.maxOpacity,function(){
            that.animation(0,that.hideSprite);
        });
    }
    
    this.initSprite = function(){
        this.sprite = new Sprite();
        this.sprite.bitmap = new Bitmap(SceneManager._screenWidth, SceneManager._screenHeight);
        this.sprite.bitmap.fillAll(this.color);
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.opacity = 0;
    }
    
    this.showSprite = function(){
        SceneManager._scene.addChild(this.sprite);
    }
    this.hideSprite = function(){
        SceneManager._scene.removeChild(this.sprite);
    }
    
    this.blurSprite = function(){
        this.sprite.bitmap.blur();
    }
    
    this.animation = function(finalOpacity, callback){
        var intervalId = setInterval(function(){
            if(finalOpacity<that.sprite.opacity){
                that.sprite.opacity--;
            }else if(finalOpacity>that.sprite.opacity){
                that.sprite.opacity++;
            }else{
                callback();
                clearInterval(intervalId);
            }
        }, this.animationTime/finalOpacity);
    }
}














