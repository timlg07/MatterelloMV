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
cycles.SPEED = 6; // How many times faster the simulated time should go in comparison to the real time // d=6x
cycles.WEATHER_CHANGE_MIN_COOLDOWN = 6  * ( 60 * 1000 ); // The interval when weather could change in MS[simulated] // d=6min
cycles.WEATHER_CHANGE_CHANCE = 10; // The cance of weather changing in percent // d=10%
cycles.WETHER_TYPES = ['none', 'rain', 'storm', 'snow']; // all possible types of weather
cycles.THROTTLE_INTERVAL = 60; // lower interval, but same speed // higher value for higher performance
//======// CONFIG //======//


/**
 * for day cycle and weather
 * @author Tim Greller
 * @method cycles
 * @static
 */
function cycles()
{
    throw new Error('js/plugins/_cycles.js: cycles is a static class');
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
        
        currentWeather: 'none',
        currentWeatherPower : 0,
        weatherCoolDown: cycles.WEATHER_CHANGE_MIN_COOLDOWN,
        
        intervalID: null,
        isRunning : false
    };
}

cycles.start = function()
{
    $cycles.intervalID = setInterval( 
        cycles.update, 
        cycles.THROTTLE_INTERVAL/cycles.SPEED
    ); // call the update function every millisecond[simulted] | throttled down |
    $cycles.isRunning = true;
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
    var duration   = cycles.WEATHER_CHANGE_MIN_COOLDOWN/1000 * 60; //60FPS
    var newWeather = $cycles.currentWeather;
    do
    {
        newWeather = cycles.WETHER_TYPES[ Math.floor ( Math.random() * cycles.WETHER_TYPES.length ) ];
    }
    while(newWeather === $cycles.currentWeather);
          
    alert("weather changed from "+$cycles.currentWeather+"(power="+$cycles.currentWeatherPower+") to "+newWeather+"(power="+power+")")
    
    $cycles.currentWeather = newWeather;
    $cycles.currentWeatherPower = power;
    
    $gameScreen.changeWeather(newWeather, power, duration);
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
    if('msec' in timeObj) this.value += timeObj.msec * 1 ;
    if('secs' in timeObj) this.value += timeObj.secs * 1 * 1000 ;
    if('mins' in timeObj) this.value += timeObj.mins * 1 * 1000 * 60 ;
    if('hour' in timeObj) this.value += timeObj.hour * 1 * 1000 * 60 * 60 ;
    if('days' in timeObj) this.value += timeObj.days * 1 * 1000 * 60 * 60 * 24 ;
}






