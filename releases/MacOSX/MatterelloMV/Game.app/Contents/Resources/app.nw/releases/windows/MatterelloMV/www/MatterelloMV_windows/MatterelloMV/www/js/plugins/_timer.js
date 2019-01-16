/**===================================================================
 * timer
 *
 * A simple timer
 *
 * @class  = TIMER
 * @author = TIM_GRELLER
 * @params = none
 **-------------------------------------------------------------------
 */

function Timer() {
    this._frames = 0;
    this._working = false;
    this.onExpire = function(){}
    
    //=======SETTER=========//
    this.setFrames = function(frames){
        this._frames = frames;
    }
    
    this.setTime = function(seconds){
        this.setFrames(Graphics.frameCount*seconds);
    }
    
    this.setOnExpire = function(newFunction){
        this.onExpire = newFunction;
    }
    
    //=======GETTER=========//
    this.getFrames = function(){
        return this._frames;
    }
    
    this.getSeconds = function(){
        return this._frames/Graphics.frameCount;
    }
    
    //=======WORKING========//
    this.start = function(){
        this._working = true;
    }
    
    this.stop = function(){
        this._working = false;
    }
    
    this.toggle = function(){
        this._working = !this.isWorking();
    }
    
    this.isWorking = function() {
        return this._working;
    }
    
    //====FUNCTIONALITY=====//
    this.update = function() {
        if(this._working&&this._frames>0){
            this._frames--;
            if(this._frames==0){
                this.onExpire();
            }
        }
    }
    $updater.add(this.update);
}

/*---------------------------------------------------------------
 * END OF timer 
 *===============================================================
 */
