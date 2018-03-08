// Frank Diaz, DIG 2930, Professor Kahn Mai

/* In this entire set of code, I will be creating a basic bouncing and collectable game using all of the code below. Most of my coding was inspired by the code written for a basic 2d platformer game by codepen user dissimulate. I will leave a link below to credit his work. I will create my own game that heavily relies on having the player use bounce pads to traverse across the level collect objects needed to open the level's exit. This game will be fairly simple, but it could be possible that I might pick this up again to create this into a fully fledged game in the future. So let's see how this goes. */

/* Code was inspired by the code for a game from dissimulate. Link to his codepen project: https://codepen.io/dissimulate/pen/CqIxk */

// Create a variable that will contain the data to customize the entire map.
var map = {
    tile_size: 16,
// Write down an array below for the key data.
keys: [
    {id: 0, color: '#333', solid: 0}, // Canvas Border
    {id: 1, color: '#87CEFA',solid: 0}, // Sky
    {id: 2, color: '#FFFFFF',solid: 0}, // Clouds
    {id: 3, color: '#7CFC00',solid: 1,bounce: 0.35}, // Grass
    {id: 4, color: '#CD853F',solid: 1,bounce: 0.35}, // Dirt
    {id: 5, color: '#FF0000',solid: 1,bounce: 0}, // Bounce Pad
    {id: 6, color: '#FFFF00',solid: 0,script: 'exit_key'}, // Key to Exit
    {id: 7, color: '#A9A9A9',solid: 1}, // Locked Gate
    {id: 8, color: '#FF69B4',solid: 0,script: 'end_game'}, // Exit
    {id: 9, color: '#FFA500',solid: 0, script: 'lava'}, // Lava
    // {id: 9, color: '#87CEFA',solid: 0, script: 'unlocked-gate'} // Unlocked Gate
    ],

// Create an array below that will fill in the data for the map tiles.
data: [
    [0111111111111111111111111111111111111111110],
    [0111111111111111111111111111112211111177770],
    [0111112212022111111111111111222211111178880],
    [0111111212222111111111111112222221111178880],
    [0111111122222111111111111111222111111178880],
    [0111111111111111133331111111121111133333330],
    [0111111111111111144441111111111111144444440],
    [0111111111111111111111112221111111111111110],
    [0333333111111111111111112222211111111111110],
    [0333333111111111112111111112211111111111110],
    [0434343111115555112222111111111131111111110],
    [0444444111111111112222211111111141122211110],
    [0444444111122211111221111111111141222111110],
    [0444444111222221111111111111111141112220555],
    [0444444111212122111111155551111141111111110],
    [0444444111111111111111111111111141111111110],
    [0444444111111111133331111111111141111151110],
    [0444444111111111144441111111111141115555110],
    [0444444111111111111111111111111141111111110],
    [0444444111111111111111111111111141111111110],
    [0444444999999999999999999999999949999999999]
],

// Create the gravity for the map.
gravity: {
    x: 0,
    y:0.5,
},

// Set the player's speed.
vel_limit: {
    x: 2,
    y: 16
},

// Set movement speed when player moves.
movement_speed: {
    jump: 3,
    left: 0.5,
    right: 0.5,
},

// Create the player character below.
player: {
    x: 2,
    y: 2,
    color: '#800080'
},

// Set the lives for the player below.
player_lives: {
    lives: 3
},
 
// Create the scripts for the different set of keys below.
scripts: {
    // collectable_object: 
    end_game: 'console.log("Congratulations! You Win!)',
    lava: 'console.log("You Died!");this.load_map;',
    exit_key: 'this.current_map.keys[6].solid = 0;this.current_map.keys[6].color = "#FFFF00";'
 }
};

// Create variables that contain the player's live and hud values if the above scripts don't work.
var playerLives = 3;
var livesHUD;
 
// Create a function that will display the lives hud on the screen.
function createLives() {
    textStyle = { font: '15px Arial', fill: '#FFFFFF' };
    livesHUD = this.add.text(this.world.width-10, 10, 'Lives: ' +lives, textStyle);
    livesHUD.anchor.set(1,0);

}

// Create the game engine below based off the Clarity engine.
var clarityEngine = function () {
    this.alert_errors = false;
    this.log_info = true;
    this.tile_size = 16;
    this.limit_viewport = false;
    this.jump_switch = 0;
    
    this.viewport = {
        x: 200,
        y: 200
    };
    this.camera = {
        x: 0,
        y: 0
    };
    
    this.key = {
        left: false,
        right: false,
        up: false
    };
    
    this.player = {
        
        loc: {
        x: 0,
        y: 0
    },
        vel: {
            x: 0,
            y: 0
        },
            can_jump: true
    };
    window.onkeydown = this.keydown.bind(this);
    window.onkeyup = this.keyup.bind(this);
};

// Declare a function that will set up the console messages of the game.
clarityEngine.prototype.error = function (message) {
    
    if (this.alert_errors) alert(message);
    if (this.log_info) console.log(message);
};

clarityEngine.prototype.log = function (message) {
    
    if (this.log_info) console.log(message);
};

// Delacre a function that sets up the engine's viewport.
clarityEngine.prototype.set_viewport = function (x, y) {
    this.viewport.x = x;
    this.viewport.y = y;
};

// Declare a function that will set up the player control binds.
clarityEngine.prototype.keydown = function (e) {
    
    var _this = this;
    
    switch (e.keyCode) {
        case 37:
            _this.key.left = true;
            break;
        case 32:
            _this.key.up = true;
            break;
        case 39:
            _this.key.right = true;
            break;
    }
};

clarityEngine.prototype.keyup = function(e) {
    var _this = this;
    
    switch (e.keyCode) {
        case 37:
            _this.key.left = false;
            break;
        case 32:
            _this.key.up = false;
            break;
        case 39:
            _this.key.right = false;
            break;
    }
};
    
// Declare a function that will load up the map to the canvas and will display errors if it doesn't load properly.
clarityEngine.prototype.load_map = function (map) {
    
    if (typeof map === 'undefined' || typeof map.data === 'undefined' || typeof map.keys == 'undefined') {
        
        this.error('Error: Map Data is Invalid!');
        
        return false;
    }
    
    // Create code below that will set up the map and successfully load it onto the screen.
    this.current_map = map;
    
    this.current_map.background = map.background || '#87CEFA'; 
    this.current_map.gravity = map.gravity || {x: 0, y: 0.3};
    this.tile_size = map.tile_size || 16;
    
    var _this = this;
    
    this.current_map.width = 0;
    this.current_map.height= 0;
    
    map.keys.forEach(function (key) {
        
        map.data.forEach(function (row, y) {
            
            _this.current_map.height = Math.max(_this.current_map.height, y);
            
            row.forEach(function (tile, x) {
                
                _this.current_map.width = Math.max(_this.current_map.width, x);
                
                if (tile == key.id)
                    _this.current_map.data[y][x] = key;
            });
        });
    });
    
    // Set up the width and height of the tile sizes.
    this.current_map.width_p = this.current_map.width * this.tile_size;
    this.current_map.height_p = this.current_map.height * this.tile_size;
    
    // set up the coordinates and color of the player.
    this.player.loc.x = map.player.x * this.tile_size || 0;
    this.player.loc.y = map.player.y * this.tile_size || 0;
    this.player.color = map.player.color || '#000';
    
    this.key.left = false;
    this.key.up = false;
    this.key.right = false;
    
    this.camera = {
        x: 0,
        y: 0
    };
    
    this.player.vel = {
        x: 0,
        y: 0
    };
    
    this.log('Success! Map Data has been loaded.');
    
    return true;
};

// Declare functions below that will set up the game tiles to the engine.
clarityEngine.prototype.get_tile = function (x, y) {
    
    return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map[y][x] : 0;
};

// Declare a function below that will draw the map tiles.
clarityEngine.prototype.draw_tile = function (x, y, tile, context) {
    
    if (!tile || !tile.color) return;
    
    context.fillStyle = tile.color;
    context.fillRect(
    x, 
    y,
    this.tile_size,
    this.tile_size
    );
};

// Declare a function below that will draw the map.
clarityEngine.prototype.draw_map = function (context, fore) {
    
    for (var y = 0; y < this.current_map.data.length; y++) {
        
        for (var x = 0; x < this.current_map.data[y].length; x++) {
            
            if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {
                
                var t_x = (x * this.tile_size) - this.camera.x;
                var t_y = (y * this.tile_size) - this.camera.y;
                
                if(t_x < -this.tile_size || t_y < -this.tile_size || t_x > this.viewport.x || t_y > this.viewport.y) continue;
                
                this.draw_tile(
                t_x,
                t_y,
                this.current_map.data[y][x],
                context
                );
            }
        }
    }
    
    if (!fore) this.draw_map(context, true);
};

// Declare a function that sets up the player's movement below.
clarityEngine.prototype.move_player = function () {
    
    var tX = this.player.loc.x + this.player.vel.x;
    var tY = this.player.loc.y + this.player.vel.y;
    
    var offset = Math.round((this.tile_size / 2) - 1);
    
    var tile = this.get_tile(
    Math.round(this.player.loc.x / this.tile_size),
    Math.round(this.player.loc.y / this.tile_size)
    );
    
    if(tile.gravity) {
        
        this.player.vel.x += tile.gravity.x;
        this.player.vel.y += this.gravity.y;
        
    } else {
        
        this.player.vel.x += this.current_map.gravity.x;
        this.player.vel.y += this.current_map.gravity.y;
    }
    
    if (tile.friction) {
        this.player.vel.x *= tile.friction.x;
        this.player.vel.y *= tile.friction.y;
    }
    
    // Create variables the will set up the player's movements accirding to certain tiles.
    var t_y_up = Math.floor(tY / this.tile_size);
    var t_y_down = Math.ceil(tY / this.tile_size);
    var y_near1 = Math.round((this.player.loc.y - offset) / this.tile_size);
    var y_near2 = Math.round((this.player.loc.y + offset) / this.tile_size);
    
    var t_x_left = Math.floor(tX / this.tile_size);
    var t_x_right = Math.ceil(tX / this.tile_size);
    var x_near1 = Math.round ((this.player.loc.x - offset) / this.tile_size);
    var x_near2 = Math.round ((this.player.loc.x + offset) / this.tile_size);
    
    var top1 = this.get_tile(x_near1, t_y_up);
    var top2 = this.get_tile(x_near2, t_y_up);
    var bottom1 = this.get_tile(x_near1, t_y_down);
    var bottom2 = this.get_tile(x_near2, t_y_down);
    var left1 = this.get_tile(t_x_left, y_near1);
    var left2 = this.get_tile(t_x_left, y_near2);
    var right1 = this.get_tile (t_x_right, y_near1);
    var right2 = this.get_tile(t_x_right, y_near2);
    
    // Write an if conditional statement to set up how the player jumps on certain tiles.
    if (tile.jump && this.jump_switch > 15) {
        this.player.can_jump = true;
        this.jump_switch = 0;
    } else this.jump_switch++;
        this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
         this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);
    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;
    
    this.player.vel.x *= 0.9;
    
    if (left1.solid || left2.solid || right1.solid || right2.solid) {
        
        while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid) 
            this.player.loc.x += 0.1;
         
        while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid) 
            this.player.loc.x -= 0.1;
        
        var tileBounce = 0;
        
        if (left1.solid && left1.bounce > tileBounce) tileBounce = left1.bounce;
        if (left2.solid && left2.bounce > tileBounce) tileBounce = left2.bounce;
        if (right1.solid && right1.bounce > tileBounce) tileBounce = right1.bounce;
        if (right2.solid && right2.bounce > tileBounce) tileBounce = right2.bounce;
        
        this.player.vel.x *= -tileBounce || 0;
    }
    
    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {
        
         while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid || this.get_tile(x_near2, Math.floor(this.player.loc.x / this.tile_size)).solid) 
            this.player.loc.y += 0.1;
        
        while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid || this.get_tile(x_near2, Math.ceil(this.player.loc.x / this.tile_size)).solid) 
            this.player.loc.y += 0.1;
        
        var tileBounce = 0;
        
        if (top1.solid && top1.bounce > tileBounce) tileBounce = top1.bounce;
        if (top2.solid && top2.bounce > tileBounce) tileBounce = top2.bounce;
        if (bottom1.solid && bottom1.bounce > tileBounce) tileBounce = bottom1.bounce;
        if (bottom2.solid && bottom2.bounce > tileBounce) tileBounce = bottom2.bounce;
        
        this.player.vel.y *= -tileBounce || 0;
        
        if ((bottom1.solid || bottom2.solid) && !tile.jump) {
            
            this.player.on_floor = true;
            this.player.can_jump = true;
        }
    }
    
    var c_x = Math.round(this.player.loc.x - this.viewport.x/2);
    var c_y = Math.round(this.player.loc.y - this.viewport.y/2);
    var x_dif = Math.abs(c_x - this.camera.x);
    var y_dif = Math.abs(c_y - this.camera.y);
    
    if(x_dif > 5) {
        var mag = Math.round(Math.max(1, x_dif * 0.1));
        if(c_x != this.camera.x) {
            this.camera.x += c_x > this.camera.x ? mag : -mag;
            
            if(this.limit_viewport) {
                this.camera.x =
                    Math.min(
                this.current_map.width_p - this.viewport.x + this.tile_size,
                this.camera.x
                );
                
                this.camera.x =
                    Math.max(
                0,
                this.camera.x
                );
            }
        }
    }
    if(y_dif > 5) {
        var mag = Math.round(Math.max(1, y_dif * 0.1));
        if(c_y != this.camera.y) {
            this.camera.y += c_y > this.camera.y ? mag : -mag;
            if(this.limit_viewport) {
                this.camera.y =
                    Math.min(
                this.current_map.height_p - this.viewport.y + this.tile_size,
                this.camera.y
                );
            }
        }
    }
    
    if(this.last_tile != tile.id && tile.script) {
        
        eval(this.current_map.scripts[tile.script]);
    }
    
    this.last_tile = tile.id;
    
};

clarityEngine.prototype.update_player = function () {
    
    if (this.key.left) {
        
        if (this.player.vel.x > -this.current_map.vel_limit.x)
            this.player.vel.x -= this.current_map.movement_speed.left;
    }
    
    if (this.key.up) {
        
        if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y) {
            this.player.vel.y -= this.current_map.movement_speed.jump;
            this.player.can_jump = false;
        }
    }
    
    if (this.key.right) {
        
        if (this.player.vel.x < this.current_map.vel_limit.x)
            this.player.vel.x += this.current_map.movement_speed.left;
    }
    
    this.move_player();
};

// Create a function that will render everything coded above onto the DOM's canvas.
clarityEngine.prototype.draw_player = function (context) {
    
    context.fillStyle = this.player.color;
    
    context.beginPath();
    
    context.arc(
        this.player.loc.x + this.tile_size / 2 -this.camera.x,
        this.player.loc.y + this.tile_size / 2 -this.camera.y,
        this.tile_size / 2 - 1,
        0,
        Math.PI * 2
    );
    
    context.fill();
};

clarityEngine.prototype.update = function () {
    
    this.update_player();
};

clarityEngine.prototype.draw = function (context) {
    
    this.draw_map(context, false);
    this.draw_player(context);
};

window.requestAnimFrame = 
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
    return window.setTimeout(callback, 1000 / 60);
};
    
var canvas = document.querySelector('.canvas-game'),
    ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 400;
    
var game = new clarityEngine();
    game.set_viewport(canvas.width, canvas.height);
    game.load_map(map);
    
    game.limit_viewport = true;
    
var Loop = function() {
    
    ctx.fillStyle = '#87CEFA'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    game.update();
    game.draw(ctx);
    
    window.requestAnimFrame(Loop);
};

Loop();


    
    
        
    

