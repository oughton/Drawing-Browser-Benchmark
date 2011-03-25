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

function Particle(paper, drawFunc, updateFunc, width, height) {
    var _x, _y, _xDir, _yDir, _speed, _thisParticle = this;

    this.x = function(val) { if (val != undefined) _x = val; else return _x; };
    this.y = function(val) { if (val != undefined) _y = val; else return _y; };
    this.xDir = function(val) { if (val != undefined) _xDir = val; else return _xDir; };
    this.yDir = function(val) { if (val != undefined) _yDir = val; else return _yDir; };
    this.speed = function() { return _speed; };

    this.draw = function() { drawFunc(paper, _thisParticle); }
    this.update = function() { updateFunc(paper, _thisParticle); }

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

        var update = function(paper, that) {
            var ctx = paper[0].getContext("2d");
            
            // update pos and direction
            if (that.x() >= width || that.x() <= 0) that.xDir(that.xDir() * -1);
            if (that.y() >= height || that.y() <= 0) that.yDir(that.yDir() * -1);
           
            that.x(that.x() + that.xDir() * that.speed());
            that.y(that.y() + that.yDir() * that.speed());
            
            // draw the particle
            ctx.fillStyle = "rgb(0,0,255)";
            ctx.fillRect(that.x(), that.y(), 5, 5);
        };

        // create some particles
        for (var i = 0; i < numParticles; i++) {
            data.particles.push(new Particle(data.canvas, function(){}, update, width, height));
        }
    }

    // draw all of the particles
    data.canvas[0].getContext("2d").clearRect(0, 0, data.canvas.width(), data.canvas.height());

    $.each(data.particles, function(index, particle) {
        particle.update();
    });
};

var svgTest = function(container, width, height, numParticles, data) {
    var particle;
    
    if (data.r == undefined) data.r = Raphael(container[0], width, height);
    
    if (data.particles == undefined) {
        data.particles = [];

        var init = function(paper, that) {
            that.__svgnode__ = paper.rect(that.x(), that.y(), 5, 5)
                .attr({ "stroke-width": "0px", fill: "rgb(0,0,255)" });
        };

        var update = function(paper, that) {
            var x = that.x();
            var y = that.y();
            
            // update pos and direction
            if (that.x() >= width || that.x() <= 0) that.xDir(that.xDir() * -1);
            if (that.y() >= height || that.y() <= 0) that.yDir(that.yDir() * -1);
           
            that.x(that.x() + that.xDir() * that.speed());
            that.y(that.y() + that.yDir() * that.speed());
        
            that.__svgnode__.translate(that.x() - x, that.y() - y);
        };
        
        // create some particles
        for (var i = 0; i < numParticles; i++) {
            particle = new Particle(data.r, init, update, width, height);
            particle.draw();
            data.particles.push(particle);
        }
    }

    $.each(data.particles, function(index, particle) {
        particle.update();
    });
};
