var GraphicTest = {
    run: function(container, drawFunc, maxfps, numParticles) {
        var width = 800, height = 600, drawInterval, frameCount = 0, 
            data = {}, fps = 0, lastTime = new Date(), drawArea;        
        
        if (maxfps == undefined || typeof(maxfps) != "number" || maxfps <= 0) { 
            throw "Invalid max fps";
        }
        
        drawInterval = 1000 / maxfps;

        // create canvas element
        var canvas = $("<canvas width='" + width + "' height='" + 15 + "'></canvas>").appendTo(container);
        var ctx = canvas[0].getContext("2d");
       
        drawArea = $("<div></div>").appendTo(container);

        var draw = function() {
            var nowTime = new Date();
            var diffTime = Math.ceil((nowTime.getTime() - lastTime.getTime()));
            
            if (diffTime >= 1000) {
               fps = frameCount;
               frameCount = 0.0;
               lastTime = nowTime;
            }

            ctx.clearRect(0, 0, width, height);
            drawFunc(drawArea, width, height, numParticles, data);
            
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, 15);
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('FPS: ' + fps + '/' + maxfps, 4, 10);
            ctx.restore();
            
            frameCount++;
        }
        
        setInterval(draw, drawInterval);
    }
};

function Particle(paper, updateFunc, width, height) {
    var _x, _y, _xDir, _yDir, _speed, _thisParticle = this;

    this.update = function() { 
        var x = _x, y = _y;
        
        // update pos and direction
        if (_x >= width || _x <= 0) _xDir *= -1;
        if (_y >= height || _y <= 0) _yDir *= -1;
       
        _x += _xDir * _speed;
        _y += _yDir * _speed;
    
        updateFunc(paper, _x, _y, _x - x, _y - y, _thisParticle); 
    }

    var _randomDir = function() {
        if (Math.round(Math.random()) == 1) return 1;
        else return -1;
    };

    var _initialise = function() {
        _x = Math.floor(Math.random() * width);
        _y = Math.floor(Math.random() * height);
        _xDir = _randomDir();
        _yDir = _randomDir();
        _speed = 1 + Math.random() * 4;
    };

    _initialise();
}

var canvasTest = function(container, width, height, numParticles, data) {
    if (data.canvas == undefined) {
        data.canvas = $("<canvas width='" + width + 
            "' height='" + height + "'></canvas>")
            .appendTo(container);
    }
    
    if (data.particles == undefined) {
        data.particles = [];

        var update = function(paper, x, y) {
            var ctx = paper[0].getContext("2d");
            
            // draw the particle
            ctx.fillStyle = "rgb(0,0,255)";
            ctx.fillRect(x, y, 5, 5);
        };

        // create some particles
        for (var i = 0; i < numParticles; i++) {
            data.particles.push(new Particle(data.canvas, update, width, height));
        }
    }

    // draw all of the particles
    data.canvas[0].getContext("2d").clearRect(0, 0, data.canvas.width(), data.canvas.height());

    $.each(data.particles, function(index, particle) {
        particle.update();
    });
};

var svgTest = function(container, width, height, numParticles, data) {
    if (data.r == undefined) data.r = Raphael(container[0], width, height);
    
    if (data.particles == undefined) {
        data.particles = [];

        var update = function(paper, x, y, dx, dy, that) {
            if (that.__svgnode__ == undefined) {
                that.__svgnode__ = paper.rect(x, y, 5, 5)
                    .attr({ "stroke-width": 0, "stroke-opacity": 0, fill: "rgb(0,0,255)" });
            } else {
                that.__svgnode__.translate(dx, dy);
            }
        };
        
        // create some particles
        for (var i = 0; i < numParticles; i++) {
            data.particles.push(new Particle(data.r, update, width, height));
        }
    }

    $.each(data.particles, function(index, particle) {
        particle.update();
    });
};

var htmlTest = function(container, width, height, numParticles, data) {
    if (data.h == undefined) data.h = $('<div></div>').css({ width: width, height: height, position: 'absolute' }).appendTo(container);
    
    if (data.particles == undefined) {
        data.particles = [];

        var update = function(paper, x, y, dx, dy, that) {
            if (that.__divnode__ == undefined) {
                that.__divnode__ = $('<div></div>')
                    .css({ "position": "absolute", "background-color": "rgb(0,0,255)", "width": 5, "height": 5 })
                    .appendTo(paper);
            } else {
                that.__divnode__.css({ top: y, left: x });
            }
        };
        
        // create some particles
        for (var i = 0; i < numParticles; i++) {
            data.particles.push(new Particle(data.h, update, width, height));
        }
    }

    $.each(data.particles, function(index, particle) {
        particle.update();
    });
};
