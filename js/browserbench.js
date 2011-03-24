/**
 * Graphics Test Object
 */
var GraphicsTest = {
    run: function(container) {},
    framerate: function() {},
};


var CanvasTest = $.extend({}, GraphicsTest, {
    
    run: function(container) {
        // create canvas element
        var canvas = $("<canvas width='500' height='500'></canvas>").appendTo(container);
        var ctx = canvas[0].getContext("2d");

        ctx.fillStyle = "rgb(0,0,255)";
        ctx.fillRect(50, 50, 100, 100);
    },

    framerate: function() {
        return 0;
    }

});

$(document).ready(function() {
    CanvasTest.run($("#canvas"));
});
