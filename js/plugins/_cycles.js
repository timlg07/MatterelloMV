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
cycles.SPEED = 6; // How many times faster the simulated time should go in comparison to the real time
cycles.WEATHER_CHANGE_MIN_COOLDOWN = 6  * ( 60 * 1000 ); // The interval when weather could change in MS[simulated]
cycles.WEATHER_CHANGE_CHANCE = 10; // The cance of weather changing in percent
cycles.WETHER_TYPES = ['none', 'rain', 'storm', 'snow']; // all possible types of weather
cycles.THROTTLE_INTERVAL = 10; // lower interval, but same speed // higher value for higher performance
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
 * @method start
 * @author Tim Greller
 *
 * @param {Object} A Object from the 'simulatedTime' class.
 */
cycles.start = function(t)
{
    if(!( t instanceof simulatedTime )) throw new Error('_cycles.js > cycles.start: t is no instance of simulatedTime.');
    if(!( typeof window._cycles === 'undefined' )) throw new Error('_cycles.js > cycles.start: already initialized.');
        
    window._cycles = {
        currentTime: t,
        
        currentWeather: 'none',
        currentWeatherPower : 0,
        weatherCoolDown: cycles.WEATHER_CHANGE_MIN_COOLDOWN,
        
        interval_ID: setInterval(cycles.update,cycles.THROTTLE_INTERVAL/cycles.SPEED) // call the update function every second
    };
}

/**
 * stops updating cycles
 * @method stop
 * @author Tim Greller
 */
cycles.stop = function()
{
    if( typeof window._cycles === 'undefined' ) throw new Error('_cycles.js > cycles.stop: not initialized.');
    clearInterval(window._cycles.interval_ID);
}



/**
 * update function; called every 1ms[simulated]
 * @method update
 * @author Tim Greller
 */
cycles.update = function()
{
    window._cycles.currentTime.add( {msec:cycles.THROTTLE_INTERVAL} );
    window._cycles.weatherCoolDown -=     cycles.THROTTLE_INTERVAL;
    
    if( window._cycles.weatherCoolDown <  cycles.THROTTLE_INTERVAL ) 
    {
        window._cycles.weatherCoolDown =  cycles.WEATHER_CHANGE_MIN_COOLDOWN;
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
            window._cycles.currentWeather, 
            window._cycles.currentWeatherPower, 
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
    var newWeather = window._cycles.currentWeather;
    do
    {
        newWeather = cycles.WETHER_TYPES[ Math.floor ( Math.random() * cycles.WETHER_TYPES.length ) ];
    }
    while(newWeather === window._cycles.currentWeather);
          
    window._cycles.currentWeather = newWeather;
    window._cycles.currentWeatherPower = power;
    
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
simulatedTime.getTotalDays = function()
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
simulatedTime.getTotalHours = function()
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
simulatedTime.getTotalMinutes = function()
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
simulatedTime.getTotalSeconds = function()
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
simulatedTime.getTotalMilliseconds = function()
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
simulatedTime.getAdditionalDays = function()
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
simulatedTime.getAdditionalHours = function()
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
simulatedTime.getAdditionalMinutes = function()
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
simulatedTime.getAdditionalSeconds = function()
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
simulatedTime.getAdditionalMilliseconds = function()
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
simulatedTime.add = function(timeObj)
{
    if('msec' in timeObj) this.value += timeObj.msec * 1 ;
    if('secs' in timeObj) this.value += timeObj.secs * 1 * 1000 ;
    if('mins' in timeObj) this.value += timeObj.mins * 1 * 1000 * 60 ;
    if('hour' in timeObj) this.value += timeObj.hour * 1 * 1000 * 60 * 60 ;
    if('days' in timeObj) this.value += timeObj.days * 1 * 1000 * 60 * 60 * 24 ;
}






