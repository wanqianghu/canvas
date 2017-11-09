/**
 * Created by huwanqiang on 2017/4/21.
 */
var img = document.getElementById("fireworks");
var img1 = document.getElementById("fireworks1");
var T = setInterval(function () {
    if( isNotEmpty(img) && isNotEmpty(img1)){
        clearInterval(T);
        Init();
    }
},100);
function isNotEmpty(param) {
    if(param == null || param == undefined || param == ""){
        return false;
    }
    return true;
}
function Init(){

    var Rectangles = [];

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var W = window.innerWidth, H = (window.innerHeight/3)*2;
    canvas.width = W;
    canvas.height = H;

    var g = 2;//重力参数

    function Rectangle(x, y, w, h, img, t,v){
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.img = img;
        this.t = t;
        this.v=v;
    }

    //清除canvas
    function clear() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    //画烟花
    function drawRectangle(ctx, x, y, w, h, img,v) {
        ctx.beginPath();
        if(v > 10){
            var grad  = ctx.createLinearGradient(x,y-2,x,y+8);
            /* 指定几个颜色 */
            grad.addColorStop(0,'#ffffff');    //
           // grad.addColorStop(0.5,'#cccccc'); // 绿
            grad.addColorStop(1,'#cccccc');  //hong
            /* 将这个渐变设置为fillStyle */
            ctx.fillStyle = grad;
            ctx.arc(x,y,2,0,Math.PI*2,true);
            ctx.moveTo(x-2,y);
            ctx.lineTo(x,y+8);
            ctx.lineTo(x+2,y);
            ctx.closePath();
            ctx.fill();
        }else {
            ctx.drawImage(img, x-(w/2)-10, y, w, h);
            ctx.closePath();
        }
    }

    function initDrawScene() {
        for (var i=0; i<Rectangles.length; i++){
            Rectangles[i].y=parseInt(Rectangles[i].y-Rectangles[i].v*Rectangles[i].t+(g*Rectangles[i].t*Rectangles[i].t)/2);
            Rectangles[i].x=Rectangles[i].x-1;
            Rectangles[i].w=Rectangles[i].w+2;
            Rectangles[i].h=Rectangles[i].h+2;
            Rectangles[i].v=Rectangles[i].v-g*Rectangles[i].t;
            if(Rectangles[i].v <= 0 ){
                Rectangles.splice(i,1);
            }
        }
        clear();
        for (var i=0; i<Rectangles.length; i++){
            drawRectangle(ctx, Rectangles[i].x, Rectangles[i].y, Rectangles[i].w, Rectangles[i].h, Rectangles[i].img,Rectangles[i].v);
        }
    }
    function setRectangle() {
        var image = null;
        if(Math.random()*10 < 5){
            image = img;
        }else {
            image = img1;
        }
        var r = new Rectangle(Math.random()*W, H, 0, 0, image, 0.5,30+Math.random()*10);
        Rectangles.push(r);
    }
    function setRandom() {
        setTimeout(setRandom,Math.random()*500);
        setRectangle();
    }

    setRandom();
    setInterval(initDrawScene,50);


};