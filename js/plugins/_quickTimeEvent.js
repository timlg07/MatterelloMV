/*
 * @class quickTimeEvent
 */
function quickTimeEvent() {
    this.initialize.apply(this, arguments);
}

quickTimeEvent.prototype.initialize = function(arg) {
    this.initBasic(arg);
    this.initSprite();
};

//==============GETTER===========================//
quickTimeEvent.prototype.damageChange = function() {
    return this._damageChange;
};

quickTimeEvent.prototype.isPlayerOnAttack = function() {
    return this._isPlayerOnAttack;
};

quickTimeEvent.prototype.char = function() {
    return this._char;
};

quickTimeEvent.prototype.onKey = function() {
    return this._onKey;
};

quickTimeEvent.prototype.sprite = function() {
    return this._sprite;
};

//=============INITIALIZE===========================//
quickTimeEvent.prototype.initBasic = function(arg) {
    this._damageChange = 1;
    this._isPlayerOnAttack = arg;
    this._char = this.randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    this._onKey= new qte_KeyListener(this);
}

quickTimeEvent.prototype.initSprite = function(){
    this._sprite = new Sprite();
    this._sprite.bitmap = ImageManager.loadPicture(this.char);
    this._sprite.x = Graphics.width  / 2;
    this._sprite.y = Graphics.height / 2;
    this._sprite.opacity = 255;
}


//=======================================================//
quickTimeEvent.prototype.randomChar = function(possible){
    return possible.charAt(Math.floor(Math.random()*possible.length));
}

quickTimeEvent.prototype.start = function(){
    if(Math.random()<0.4)return;
    this.showPicture();
    window.addEventListener('keydown', this._onKey.handle);
}

//-------------------------------------------------------//

quickTimeEvent.prototype.showPicture = function(){
    SceneManager._scene.addChild(this._sprite);
}

quickTimeEvent.prototype.removePicture = function(){
    SceneManager._scene.removeChild(this._sprite);
}

quickTimeEvent.prototype.removeListener = function(){
    window.removeEventListener('keydown', this._onKey.handle);
}

    
function qte_KeyListener(q){
    
    this.char = q.char;
    this.qtev = q;
    
    this.handle = function(e){
        alert(e.keyCode);
        if((char.charCodeAt(0)-32)==e.keyCode){
            alert("Key is correct")
            q.removePicture();
            /*if(this.isPlayerOnAttack){
                //increasePlayerDamage
                this.damageChange = 2.0;
            }else{
                //decreaseEnemyDamage
                this.damageChange = 0.5;
            }*/
            q.removeListener();
        }
    }
}