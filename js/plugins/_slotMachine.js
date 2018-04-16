function SlotMachine(){
    
    this.start = function(){
        this.initSprite();
        this.showSprite();
    }
    
    this.initSprite = function(){
        this.sprite = new Sprite();
        this.sprite.bitmap = new Bitmap(SceneManager._screenWidth, SceneManager._screenHeight);
        this.sprite.bitmap.fillAll('white');
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.opacity = 100;
        
        
    }
    
    this.showSprite = function(){
        SceneManager._scene.addChild(this.sprite);
    }
    this.hideSprite = function(){
        SceneManager._scene.removeChild(this.sprite);
    }
}