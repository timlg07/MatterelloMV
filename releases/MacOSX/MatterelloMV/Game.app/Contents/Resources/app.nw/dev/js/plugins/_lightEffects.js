function lightEffects(){}

lightEffects.clear = function(){
    if(window.lightEffects_intervalId)clearInterval(window.lightEffects_intervalId);
    window.lightEffects_sprite.bitmap.clear();
    window.lightEffects_sprite.opacity = 0;
}



lightEffects.dark = function(){
    if(!window.lightEffects_sprite)this.init();
    window.lightEffects_sprite.opacity = 220;
    window.lightEffects_intervalId = setInterval(function(){//try{
        window.lightEffects_sprite.bitmap.fillAll('#000')
        lightEffects.flashlight();/*
        // Paint the canvas black.
        window.lightEffects_sprite.bitmap._context.fillStyle = '#000';
        window.lightEffects_sprite.bitmap._context.clearRect(0, 0, SceneManager._screenWidth, SceneManager._screenHeight);
        window.lightEffects_sprite.bitmap._context. fillRect(0, 0, SceneManager._screenWidth, SceneManager._screenHeight);
        // Paint a black circle around x, y.
        window.lightEffects_sprite.bitmap._context.beginPath();
        window.lightEffects_sprite.bitmap._context.arc($gamePlayer.screenX(), $gamePlayer.screenY()-20, 60, 0, 2 * Math.PI);
        window.lightEffects_sprite.bitmap._context.fillStyle = '#000';
        window.lightEffects_sprite.bitmap._context.fill();
        // With xor compositing, the result is a circular hole.
    }catch(e){alert(e.message)}*/
    },20);
}

lightEffects.flashlight = function(){try{
    window.lightEffects_sprite.bitmap.paintOpacity = 150;
    window.lightEffects_sprite.bitmap.drawCircle($gamePlayer.screenX(), $gamePlayer.screenY()-20, 100, "#330");
    window.lightEffects_sprite.bitmap.drawCircle($gamePlayer.screenX(), $gamePlayer.screenY()-20,  80, "#551");
    window.lightEffects_sprite.bitmap.drawCircle($gamePlayer.screenX(), $gamePlayer.screenY()-20,  60, "#662");
    window.lightEffects_sprite.bitmap.drawCircle($gamePlayer.screenX(), $gamePlayer.screenY()-20,  50, "#883");
    window.lightEffects_sprite.bitmap.drawCircle($gamePlayer.screenX(), $gamePlayer.screenY()-20,  40, "#aa5");
    window.lightEffects_sprite.bitmap.drawCircle($gamePlayer.screenX(), $gamePlayer.screenY()-20,  30, "#cc6");
    }catch(e){this.clear();}
}

//INIT//
lightEffects.initSprite = function(){
    var sprite = new Sprite();
    sprite.bitmap = new Bitmap(SceneManager._screenWidth, SceneManager._screenHeight);
    sprite.x = 0;
    sprite.y = 0;
    sprite.opacity = 0;
    return sprite;
}
lightEffects.init = function(){
    window.lightEffects_sprite = lightEffects.initSprite();
    SceneManager._scene.addChild(window.lightEffects_sprite);
}