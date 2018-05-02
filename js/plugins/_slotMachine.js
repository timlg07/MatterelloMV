function SlotMachine(){
    
    //=======// CONFIG // START //========//
    // [following values can be changed:]
    
    this.fps = 60;
    
    // [do not change anything below here]
    //=======// CONFIG // END   //========//
    
    var that = this;
    
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
    
    this.initUpdate = function(){
        this.updateID = setInterval(function(){
            window.slotMachineObject.update();
        },1000/this.fps);
    }
    
    this.update = function(){
        this.gameObject.frames++;
        this.showGraphics();
    }
    
    this.initGraphics = function(){
        this.loadCount= 8;
        this.graphics = {
            symbols : [
                this.newImage("sym_1.png"),
                this.newImage("sym_2.png"),
                this.newImage("sym_3.png"),
                this.newImage("sym_4.png"),
                this.newImage("sym_5.png"),
            ],
            frame   : 
                this.newImage("Frame.png"),
            main_BG : 
                this.newImage("mainB.png"),
            main_FG :
                this.newImage("mainF.png"),
        }
    }
    
    this.newImage = function(fname){
        var img = new Image();
        img.addEventListener('load',function(){
            if(--window.slotMachineObject.loadCount<1)window.slotMachineObject.initUpdate();
        },false);
        img.src = 'img/pictures/slotMachine/' + fname;
        return img;
    }
    
    this.showGraphics = function(){
        this.sprite.bitmap.drawImage(
            this.graphics.main_BG, 
            this.size.width  / 2 - this.graphics.main_BG.width ,
            this.size.height / 2 - this.graphics.main_BG.height,
            this.graphics.main_BG.width  * 2,
            this.graphics.main_BG.height * 2
        );
        
        //REST
        
        this.sprite.bitmap.drawImage(
            this.graphics.main_FG, 
            this.size.width  / 2 - this.graphics.main_FG.width ,
            this.size.height / 2 - this.graphics.main_FG.height,
            this.graphics.main_FG.width  * 2,
            this.graphics.main_FG.height * 2
        );
            
    }
    //ACCESS TO THE CANVAS 2D CONTEXT:
    Bitmap.prototype.getContext = function(){
        return this._context;
    }
    //DRAW IMAGE TO THE CANVAS 2D CONTEXT:
    Bitmap.prototype.drawImage = function(image,x,y,w,h){
        var ctx = this._context;
        ctx.save();
        ctx.drawImage(image,x,y,w,h);
        ctx.restore();
        this._setDirty();
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
        this.initGraphics();
    }
    
    this.cancel = function(){
        clearInterval(this.updateID);
        this.sprite.bitmap.clear();
        this.hideSprite();
        window.slotMachineObject = null;
    }
}