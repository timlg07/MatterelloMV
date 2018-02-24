/**
 * This is a updater for all custom Functions which need updates
 * access the global updater with $updater
 *
 * @class Updater
 * @author TIM_GRELLER
 */
function Updater(){
    
    this.update = function(){
        
    }
    
    this.add = function(newFunction){
        var rest = this.update;
        this.update = function(){
            if(rest)rest();
            newFunction();
        }
    }
}//END_OF_NEW