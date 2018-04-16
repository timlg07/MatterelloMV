function SlotMachine(){
    
    //=======// CONFIG // START //========//
    // [following values can be changed:]
    
    this.fps = 60;
    
    // [do not change anything below here]
    //=======// CONFIG // END   //========//
    
    this.create = function(){
        window.slotMachineObject = this;
        return window.slotMachineObject;
    }
    
    this.start = function(){
        this.initSprite  ();
        this.showSprite  ();
        this.askPlayer   ();
    }
    
    this.initSprite = function(){
        
        this.size = {
            width : SceneManager._screenWidth, 
            height: SceneManager._screenHeight
        };
        
        this.sprite = new Sprite();
        this.sprite.bitmap = new Bitmap(this.size.width, this.size.height);
        //this.sprite.bitmap.fillAll('white');
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.opacity = 255;
    }
    
    this.showSprite = function(){
        SceneManager._scene.addChild(this.sprite);
    }
    this.hideSprite = function(){
        SceneManager._scene.removeChild(this.sprite);
    }
    
    this.update = function(){
        this.gameObject.frames++;
        this.showGraphics();
    }
    
    this.showGraphics = function(){
        //PhotoshopTiedtzcke's Grafiken werden hier angezeigt
        //Falls es die irgendwann mal geben sollte
    }
    
    this.askPlayer = function(){
        
        this.sprite.bitmap.textColor = "#000";
        this.sprite.bitmap.outlineColor = "#fff";
        this.sprite.bitmap.outlineWidth += 3;
        this.sprite.bitmap.fontSize += 6;
        this.sprite.bitmap.drawText("pay and play?", this.size.width/2, 3*this.size.height/4, this.size.width/3, 20, "center");
        
        $gameMap._interpreter.setupChoices([['Yes', 'No'], 1]);
        $gameMessage.setChoiceCallback(function(responseIndex) {
            if (responseIndex === 0) {// Player chose "Yes"
                window.slotMachineObject.run();
            } else {// Player chose "No"
                window.slotMachineObject.cancel();
            }
        });
    }
    
    this.run = function(){
        this.sprite.bitmap.clear();
        this.gameObject = {
             frames : 0,
             left   : [],
             mid    : [],
             right  : []
        }
        this.updateID = setInterval(this.update,1000/this.fps);
    }
    
    this.cancel = function(){
        this.sprite.bitmap.clear();
        this.hideSprite();
        window.slotMachineObject = null;
    }
}