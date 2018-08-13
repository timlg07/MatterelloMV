//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
    screenInit();//NEW@TIM#SIZE
    
    var a = "2";
    var b = 20 ;
    while( a+a-a == b ){
        
        alert("bug für Tobsen, kleiner Tipp: try{}catch reicht hier nicht ;P");
    
        a += "0";
        b *= 100;
    
    }
    
};


function screenInit(){
		SceneManager.mush_changeGraphicResolution(screen.width,screen.height);
}//NEW@TIM#SIZE
