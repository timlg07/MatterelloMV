/*********************************\
|* This plugin controls:         *|
|* > day cycle                   *|
|*    - time                     *|
|*    - different light effects  *|
|*    - flashlight for the night *|
|* > weather                     *|
|*    - changing weather effects *|
\*********************************/


//======// CONFIG //======//
cycles.SPEED = 1440; // How many times faster the simulated time should go in comparison to the real time // d=144x -> 1d^=10min
cycles.WEATHER_CHANGE_MIN_COOLDOWN = 3 * (60*60*1000); // The interval when weather could change in MS[simulated] // d=3h^=75sec
cycles.WEATHER_CHANGE_CHANCE = 10; // The chance of weather changing in percent // d=10%
cycles.THUNDERBOLT_APPEAR_CHANCE = 0.01; // The chance of a lightning appers during storm in percentage // d=0.01
cycles.WETHER_TYPES = [ 'none', 'none', 'rain', 'storm', 'snow' ];// possible types of weather; multiple entrys -> higher chance
cycles.THROTTLE_INTERVAL = 10 * cycles.SPEED; // lower interval, but same speed // higher value for higher performance
//======// CONFIG //======//


/**
 * static class for day cycle and weather
 * @author Tim Greller
 * @method cycles
 * @static
 */
function cycles()
{
    throw new Error('/js/plugins/_cycles.js: cycles is a static class');
}

/**
 * initializes cycles
 * @method init
 * @author Tim Greller
 *
 * @return {Object} the default cycles object
 */
cycles.init = function()
{
    return {
        currentTime: new simulatedTime( {ms:0} ),
        
        brightnessSprite: cycles.initBrightnessSprite(),
        
        currentWeather: cycles.WETHER_TYPES[ Math.floor ( Math.random() * cycles.WETHER_TYPES.length ) ],
        //currentWeather: cycles.WETHER_TYPES[3],
        currentWeatherPower : Math.random() * 8 + 1,
        weatherCoolDown: cycles.WEATHER_CHANGE_MIN_COOLDOWN,
        
        intervalID: null,
        isRunning : false
    };
}

/**
 * starts updating cycles
 * @method start
 * @author Tim Greller
 */
cycles.start = function()
{
    $cycles.intervalID = setInterval( 
        cycles.update, 
        cycles.THROTTLE_INTERVAL/cycles.SPEED
    ); // call the update function every millisecond[simulted] | throttled down |
    
    $cycles.isRunning = true;
    
    if
    (
        $gameMap.mapId()==3 ||
        $gameMap.mapId()==16
    )
    {
        $gameScreen.changeWeather(
            $cycles.currentWeather, 
            $cycles.currentWeatherPower, 
            cycles.WEATHER_CHANGE_MIN_COOLDOWN /1000 /cycles.SPEED * 60
        );
    }
    //alert("weather set to "+$cycles.currentWeather+"(power="+$cycles.currentWeatherPower+")");
    
    //=================// THUNDERBOLT //================//
    var alias = Weather.prototype._updateStormSprite;
    Weather.prototype._updateStormSprite = function(sprite){
        alias.call(this, sprite);
        cycles.thunderbolt();
    }
}

/**
 * shows all sprites
 * @method showSprites
 * @author Tm Greller
 */
cycles.showSprites = function()
{
    SceneManager._scene.addChild($cycles.brightnessSprite);
    cycles.updateBrightness();
    
    $cycles.currentTime.initDigitalClock();
}

/**
 * stops updating cycles
 * @method stop
 * @author Tim Greller
 */
cycles.stop = function()
{
    if( typeof $cycles === 'undefined' || $cycles == null) throw new Error('_cycles.js > cycles.stop: not initialized.');
    clearInterval($cycles.intervalID);
}



/**
 * update function; called every 1ms[simulated]
 * @method update
 * @author Tim Greller
 */
cycles.update = function()
{
    $cycles.currentTime.add( {msec:cycles.THROTTLE_INTERVAL} );
    $cycles.weatherCoolDown -=     cycles.THROTTLE_INTERVAL;
    
    if( $cycles.weatherCoolDown <  cycles.THROTTLE_INTERVAL ) 
    {
        $cycles.weatherCoolDown =  cycles.WEATHER_CHANGE_MIN_COOLDOWN;
        cycles.weatherChange();
    }
}

cycles.initBrightnessSprite = function()
{
    var sprite = new Sprite();
    sprite.bitmap = new Bitmap(SceneManager._screenWidth, SceneManager._screenHeight);
    sprite.x = 0;
    sprite.y = 0;
    sprite.opacity = 0;
    sprite.bitmap.fillAll('#000');
    return sprite;
}

/** 
 * sets the brightness of the light depending on the time
 * @method updateBrightness
 * @author Tim Greller
 */
cycles.updateBrightness = function()
{
    // set opacity to 0 if indoor:
    if(!(
        $gameMap.mapId() ===  3 ||
        $gameMap.mapId() === 16
    )){
        $cycles.brightnessSprite.opacity = 0;
    } else {

        // f(x) = 100 (cos(x / (445.63383/2)) + 1)
        $cycles.brightnessSprite.opacity = ( Math.cos($cycles.currentTime.getTotalMinutes() / (445.63383/2)) + 1 ) * 75;

    }
}


/**
 * decides whether a weather change is done or not
 * @method weatherChange
 * @author Tim Greller
 */
cycles.weatherChange = function()
{
    if( Math.random() < cycles.WEATHER_CHANGE_CHANCE/100 )
    {
        cycles.performWeatherChange();
    }
    else
    {
        $gameScreen.changeWeather(
            $cycles.currentWeather, 
            $cycles.currentWeatherPower, 
            cycles.WEATHER_CHANGE_MIN_COOLDOWN/1000 * 60
        );
    }
}

/**
 * performs the weather change
 * @method performWeatherChange
 * @author Tim Greller
 */
cycles.performWeatherChange = function()
{
    var power      = Math.random() * 8 + 1; // to avoid power=0; [power in range(0..9)]
    var duration   = cycles.WEATHER_CHANGE_MIN_COOLDOWN /1000 /cycles.SPEED * 60; //60FPS
    var newWeather = $cycles.currentWeather;
    do
    {
        newWeather = cycles.WETHER_TYPES[ Math.floor ( Math.random() * cycles.WETHER_TYPES.length ) ];
    }
    while(newWeather === $cycles.currentWeather);
          
    //alert("weather changed from "+$cycles.currentWeather+"(power="+$cycles.currentWeatherPower+") to "+newWeather+"(power="+power+"); duration="+duration/60+"s")
    
    $cycles.currentWeather = newWeather;
    $cycles.currentWeatherPower = power;
    
    if
    (
        $gameMap.mapId()==3 ||
        $gameMap.mapId()==16
    )
    {
        $gameScreen.changeWeather(newWeather, power, duration);
    }
}

cycles.onMapChange = function()
{
    if
    (
        $gameMap.mapId()!=3 &&
        $gameMap.mapId()!=16
    )
    {
        $gameScreen.changeWeather(
            cycles.WETHER_TYPES[0], 
            $cycles.currentWeatherPower, 
            cycles.WEATHER_CHANGE_MIN_COOLDOWN /1000 /cycles.SPEED * 60
        );
    } else {
        $gameScreen.changeWeather(
            $cycles.currentWeather, 
            $cycles.currentWeatherPower, 
            cycles.WEATHER_CHANGE_MIN_COOLDOWN /1000 /cycles.SPEED * 60
        );
    }
}

cycles.thunderboltState = 'inactive';

/**
 * calls a thunderbolt with a certain chance
 * @method thunderbolt
 * @author Tim Greller
 */
cycles.thunderbolt = function()
{
    if( Math.random() < cycles.THUNDERBOLT_APPEAR_CHANCE/100 &&
        cycles.thunderboltState == 'inactive' )
    {
        cycles.performThunderbolt();
    }
}

/**
 * shows a thunderbolt
 * @method performThunderbolt
 * @author Tim Greller
 */
cycles.performThunderbolt = function()
{
    cycles.thunderboltState = 'active';
    
    //thunderbolt sprite
    cycles.sprite = new Sprite();
    cycles.sprite.bitmap = new Bitmap(SceneManager._screenWidth, SceneManager._screenHeight);
    cycles.sprite.x = 0;
    cycles.sprite.y = 0;
    cycles.sprite.opacity = 150;
    SceneManager._scene.addChild(cycles.sprite);
    
    //Fill White
    cycles.sprite.bitmap.fillAll('#fff');
    
    //TIMEOUT
    setTimeout(function(){
        SceneManager._scene.removeChild(cycles.sprite);
        cycles.sprite = null;
        cycles.thunderboltState = 'inactive';
    }, 60 * ( Math.random + 1 ) )
}


/***********************************\
|* This class includes:            *|
|* > a time format                 *|
|* > calculating with time         *|
|* > data to save the current time *|
\***********************************/


/**
 * time format
 * @author Tim Greller
 * @method simulatedTime
 *
 * @param {Object} The time object can contain different values:
 *                 days, hour, mins, secs, msec; all values will be added
 */
function simulatedTime(timeObj)
{
    this.value = 0;//value in ms since game started in simulated time
    
    //add if exist
    if('msec' in timeObj) this.value += timeObj.msec * 1 ;
    if('secs' in timeObj) this.value += timeObj.secs * 1 * 1000 ;
    if('mins' in timeObj) this.value += timeObj.mins * 1 * 1000 * 60 ;
    if('hour' in timeObj) this.value += timeObj.hour * 1 * 1000 * 60 * 60 ;
    if('days' in timeObj) this.value += timeObj.days * 1 * 1000 * 60 * 60 * 24 ;
    
}


//====================// GETTER //========================//

/**
 * Gives you the amount of days since the game was started first
 * @method getTotalDays
 * @author Tim Greller
 *
 * @return {Number} Amount of days from this.value
 */
simulatedTime.prototype.getTotalDays = function()
{
    return Math.floor( this.value / 24 / 60 / 60 / 1000 );
}

/**
 * Gives you the amount of hours since the game was started first
 * @method getTotalHours
 * @author Tim Greller
 *
 * @return {Number} Amount of hours from this.value
 */
simulatedTime.prototype.getTotalHours = function()
{
    return Math.floor( this.value / 60 / 60 / 1000 );
}

/**
 * Gives you the amount of minutes since the game was started first
 * @method getTotalMinutes
 * @author Tim Greller
 *
 * @return {Number} Amount of minutes from this.value
 */
simulatedTime.prototype.getTotalMinutes = function()
{
    return Math.floor( this.value / 60 / 1000 );
}

/**
 * Gives you the amount of seconds since the game was started first
 * @method getTotalSeconds
 * @author Tim Greller
 *
 * @return {Number} Amount of seconds from this.value
 */
simulatedTime.prototype.getTotalSeconds = function()
{
    return Math.floor( this.value / 1000 );
}

/**
 * Gives you the amount of milliseconds since the game was started first
 * @method getTotalMilliseconds
 * @author Tim Greller
 *
 * @return {Number} Amount of milliseconds from this.value
 */
simulatedTime.prototype.getTotalMilliseconds = function()
{
    return Math.floor( this.value );
}


/**
 * Gives you the amount of days since the game was started first
 * @method getAdditionalDays
 * @author Tim Greller
 *
 * @return {Number} Amount of days from this.value
 */
simulatedTime.prototype.getAdditionalDays = function()
{
    return Math.floor( this.getTotalDays() );
}

/**
 * Gives you the amount of hours additional to totalDays
 * @method getAdditionalHours
 * @author Tim Greller
 *
 * @return {Number} Amount of additional hours
 */
simulatedTime.prototype.getAdditionalHours = function()
{
    return Math.floor( this.getTotalHours() % 24 );
}

/**
 * Gives you the amount of minutes additional to totalHours
 * @method getAdditionalMinutes
 * @author Tim Greller
 *
 * @return {Number} Amount of additional minutes
 */
simulatedTime.prototype.getAdditionalMinutes = function()
{
    return Math.floor( this.getTotalMinutes() % 60 );
}

/**
 * Gives you the amount of seconds additional to totalMinutes
 * @method getAdditionalSeconds
 * @author Tim Greller
 *
 * @return {Number} Amount of additional seconds
 */
simulatedTime.prototype.getAdditionalSeconds = function()
{
    return Math.floor( this.getTotalSeconds() % 60 );
}

/**
 * Gives you the amount of milliseconds additional to totalSeconds
 * @method getAdditionalMilliseconds
 * @author Tim Greller
 *
 * @return {Number} Amount of additional milliseconds
 */
simulatedTime.prototype.getAdditionalMilliseconds = function()
{
    return Math.floor( this.getTotalMilliseconds() % 1000 );
}


//======================// SETTER //=====================//

/**
 * adding extra time
 * @author Tim Greller
 * @method add
 *
 * @param {Object} The time object can contain different values:
 *                 days, hour, mins, secs, msec;
 */
simulatedTime.prototype.add = function(timeObj)
{
    var old = new simulatedTime({ms:this.getTotalMilliseconds()});
    
    if('msec' in timeObj) this.value += timeObj.msec * 1 ;
    if('secs' in timeObj) this.value += timeObj.secs * 1 * 1000 ;
    if('mins' in timeObj) this.value += timeObj.mins * 1 * 1000 * 60 ;
    if('hour' in timeObj) this.value += timeObj.hour * 1 * 1000 * 60 * 60 ;
    if('days' in timeObj) this.value += timeObj.days * 1 * 1000 * 60 * 60 * 24 ;
    
    this.onChange(old);
}

/**
 * updating clock
 * @author Tim Greller
 * @method onChange
 * 
 * @param {Object} The simulatedTime before the change
 */
simulatedTime.prototype.onChange = function(simulatedTimeObj)
{
    //update on Minutes changed
    if( simulatedTimeObj.getAdditionalMinutes() < this.getAdditionalMinutes())
    {
        this.updateDigitalClock();
        cycles.updateBrightness();
    }
}

/**
 * displays digital clock
 * @author Tim Greller
 * @method initDigitalClock
 */
simulatedTime.prototype.initDigitalClock = function()
{
    this.sprite = new Sprite();
    this.sprite.bitmap = new Bitmap(SceneManager._screenWidth, SceneManager._screenHeight);
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.opacity = 220;
    SceneManager._scene.addChild(this.sprite);
}

/**
 * updates the time of the digitalClock
 * @author Tim Greller
 * @method updateDigitalClock
 */
simulatedTime.prototype.updateDigitalClock = function()
{
    var hour = this.getAdditionalHours  ();
    var mins = this.getAdditionalMinutes();
    var ampm = "AM"                       ;
    
    if( hour  > 12 ){ 
        hour -= 12  ;
        ampm  = "PM";
    }
    
    if(hour.toString().length<2) hour = "0" + hour.toString();
    if(mins.toString().length<2) mins = "0" + mins.toString();
    var time = hour + ":" + mins + " " + ampm;
    
    this.sprite.bitmap.clear();
    this.sprite.bitmap.textColor = "#fff";
    this.sprite.bitmap.drawText(time, SceneManager._screenWidth - 100, 10 , 90, 30, "right");
}




