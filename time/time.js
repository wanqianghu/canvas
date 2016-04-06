var centroid_radius = 5,
    centroid_stroke_style = 'rgba(0,0,0,0.5)',
    centroid_fill_style = 'rgba(80,190,240,0.6)',

    ring_inner_radius = 35,
    ring_outer_radius = 35,

    annotations_fill_style = 'rgba(0,0,230,0.9)',
    annotations_text_size = 12,

    tick_width = 10,
    tick_long_stroke_style = 'rgba(100,140,230,0.9)',
    tick_short_stroke_style = 'rgba(100,140,230,0.7)',

    tracking_dial_stroking_style = 'rgba(100,140,230,0.5)',

    guidewire_stroke_style = 'goldenrod',
    guidewire_fill_style = 'rgba(250,250,0,0.6)';



function drawGrid(context,color, stepx, stepy){
    context.save();
    context.shadowColor = undefined;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.strokeStyle = color;
    context.fillStyle = '#ffffff';
    context.lineWidth = 0.5;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    for(var i = stepx + 0.5 ; i < context.canvas.width ; i += stepx){
        context.beginPath();
        context.moveTo(i,0);
        context.lineTo(i,context.canvas.height);
        context.stroke();
    }
    for(var i = stepy + 0.5 ; i < context.canvas.height ; i += stepy){
        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(context.canvas.width,i);
        context.stroke();
    }
    context.restore();

}

function drawDial(context,circle){
    var loc = {x:circle.x,y:circle.y};
    drawHour(loc,circle,context);
    drawMinute(loc,circle,context);
    drawSecond(loc,circle,context);
    drawRing(context,circle);
    drawTickInnerCircle(context,circle);
    drawTicks(context,circle);
    drawAnnotations(context,circle);
    drawCentroid(context,circle);
}

function drawCentroid(context,circle){ //绘制中心圆点
    context.beginPath();
    context.save();
    context.strokeStyle = centroid_stroke_style;
    context.fillStyle = centroid_fill_style;
    context.arc(circle.x,circle.y,centroid_radius,0,Math.PI*2,false);
    context.stroke();
    context.fill();
    context.restore();
}
function drawSecond(loc,circle,context){ //绘制秒针
    var t = new Date();
    var angle = t.getSeconds()/60*Math.PI*2-Math.PI/2,
        radius ,endpt;
    radius = circle.radius +ring_outer_radius-circle.radius/4;
    if(loc.x >= circle.x){
        endpt = {
            x:circle.x + radius*Math.cos(angle),
            y:circle.y + radius*Math.sin(angle)
        };
    }else{
        endpt = {
            x:circle.x - radius*Math.cos(angle),
            y:circle.y - radius*Math.sin(angle)
        }
    }
    context.save();
    context.strokeStyle = guidewire_stroke_style;
    context.fillStyle = guidewire_fill_style;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(circle.x,circle.y);
    context.lineTo(endpt.x,endpt.y);
    context.stroke();
    context.fill();
    context.restore();
}

function drawMinute(loc,circle,context){ //绘制分针
    var t = new Date();
    var angle = t.getMinutes()/60*Math.PI*2-Math.PI/2+ (t.getSeconds()/60)*(Math.PI/30),
        radius ,endpt;
    radius = circle.radius +ring_outer_radius-circle.radius/2.5; //针长
    if(loc.x >= circle.x){
        endpt = {
            x:circle.x + radius*Math.cos(angle),
            y:circle.y + radius*Math.sin(angle)
        };
    }else{
        endpt = {
            x:circle.x - radius*Math.cos(angle),
            y:circle.y - radius*Math.sin(angle)
        }
    }
    context.save();
    context.strokeStyle = guidewire_stroke_style;
    context.fillStyle = guidewire_fill_style;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(circle.x,circle.y);
    context.lineTo(endpt.x,endpt.y);
    context.stroke();
    context.fill();
    context.restore();
}

function drawHour(loc,circle,context){ //绘制时针
    var t = new Date();
    var h = t.getHours();
    if(h>12){
        h=h-12;
    }
    var angle = h/12*Math.PI*2-Math.PI/2 + t.getMinutes()/60*Math.PI/8,
        radius ,endpt;
    radius = circle.radius +ring_outer_radius-circle.radius/3*2;
    if(loc.x >= circle.x){
        endpt = {
            x:circle.x + radius*Math.cos(angle),
            y:circle.y + radius*Math.sin(angle)
        };
    }else{
        endpt = {
            x:circle.x - radius*Math.cos(angle),
            y:circle.y - radius*Math.sin(angle)
        }
    }
    context.save();
    context.strokeStyle = guidewire_stroke_style;
    context.fillStyle = guidewire_fill_style;
    context.lineWidth = 6;  //针的粗细
    context.beginPath();
    context.moveTo(circle.x,circle.y);
    context.lineTo(endpt.x,endpt.y);
    context.stroke();
    context.fill();
    context.restore();
}

function drawRing(context,circle){
    drawRingOuterCircle(context,circle);

    context.strokeStyle = 'rgba(0,0,0,0.1)';
    context.arc(circle.x,circle.y,circle.radius+ring_inner_radius,0,Math.PI*2,false);
    context.fillStyle = 'rgba(100,140,230,0.1)';
    context.fill();
    context.stroke();
}

function drawRingOuterCircle(context,circle){
    context.shadowColor = 'rgba(0,0,0,0.7)';
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 6;
    context.strokeStyle = tracking_dial_stroking_style;
    context.beginPath();
    context.arc(circle.x,circle.y,circle.radius+ring_outer_radius,0,Math.PI*2,true);
    context.stroke();
}

function drawTickInnerCircle(context,circle){
    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0,0,0,0.1)';
    context.arc(circle.x,circle.y,circle.radius+ring_inner_radius-tick_width,0,Math.PI*2,false);
    context.stroke();
    context.restore();
}

function drawTick(context,angle,radius,cnt,circle){
    var tickWidth = cnt % 5 === 0 ? tick_width : tick_width/2;
    context.strokeStyle = tick_short_stroke_style;
    context.beginPath();
    context.moveTo(circle.x + Math.cos(angle)*(radius-tickWidth),
        circle.y + Math.sin(angle)*(radius-tickWidth));

    context.lineTo(circle.x + Math.cos(angle)*(radius),
        circle.y+Math.sin(angle)*(radius));

    context.stroke();
    context.closePath();
}

function drawTicks(context,circle){
    var radius = circle.radius + ring_inner_radius,
        angle_max = 2*Math.PI,
        angle_delta = Math.PI/30,
        tickWidth;
    context.save();
    for(var angle = 0,cnt = 0;angle < angle_max;angle +=angle_delta,cnt++){
        drawTick(context,angle,radius,cnt,circle);
    }
    context.restore();
}

function drawAnnotations(context,circle){
    var radius =circle.radius+ring_inner_radius;
    context.save();
    context.fillStyle = annotations_fill_style;
    context.font = annotations_text_size + 'px Helvetica';
    for(var angle = Math.PI/2,n=12;angle < Math.PI*5/2;angle += Math.PI/6, n -=1){
        context.beginPath();
        context.fillText(n,
            circle.x +Math.cos(angle)*(radius-tick_width*2),
            circle.y - Math.sin(angle)*(radius-tick_width*2));
        context.closePath();
    }
    context.restore();
}

function clearDraw(context){
    context.clearRect(0,0,context.canvas.width,context.canvas.height);

}

window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext('2d');
    if(window.innerWidth > window.innerHeight){
        canvas.width = window.innerHeight-2;
        canvas.height = window.innerHeight-2;
    }else{
        canvas.width = window.innerWidth-2;
        canvas.height = window.innerWidth-2;
    }
    canvas.style.marginLeft = (window.innerWidth-canvas.width)/2 +"px";

    var circle = {
        x:canvas.width/2,
        y:canvas.height/2,
        radius:canvas.width/3
    };
    context.shadowColor = 'rgba(0,0,0,0.4)';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 4;

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    setInterval(function(){
        clearDraw(context);
        drawDial(context,circle);
    },100);

}

