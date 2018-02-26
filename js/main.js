//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
    screenInit();//NEW@TIM#SIZE
};

function screenInit(){
		SceneManager.mush_changeGraphicResolution(screen.width,screen.height);
}//NEW@TIM#SIZE
