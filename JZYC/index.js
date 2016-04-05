var canvas, ctx;
var up, down,del;
var Rectangles = [
    {
        "h":300,
        "w":300,
        "x":50,
        "y":40,
        "img":[],
        "src":"a.png",
        "checked":false
    },
    {
        "h":150,
        "w":230,
        "x":80,
        "y":350,
        "img":[],
        "src":"b.png",
        "checked":false

    },
    {
        "h":100,
        "w":100,
        "x":350,
        "y":250,
        "img":[],
        "src":"c.png",
        "checked":false
    }
];//所有的图
var selectedRectangle;//将要拖动的矩形
function Rectangle(x, y, w, h, img, checked){
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.img = img;
    this.checked=checked;
}
//清除canvas
function clear() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
//画图
function drawRectangle(ctx, x, y, w, h, img, checked) {
    ctx.beginPath();
    if(checked){
        ctx.strokeStyle = 'red';
        ctx.rect(x, y, w, h);
        ctx.drawImage(img, x, y, w, h);
        ctx.stroke();
    }else{
        ctx.drawImage(img, x, y, w, h);
    }
    ctx.closePath();
}
//画场景
function drawScene() {
    clear();
    for (var i=0; i<Rectangles.length; i++) {
        drawRectangle(ctx, Rectangles[i].x, Rectangles[i].y, Rectangles[i].w, Rectangles[i].h, Rectangles[i].img, Rectangles[i].checked);
    }
    requestNextAnimationFrame(drawScene);
}
//
function touchS(x1,y1,x2,y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.l=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

//初始化
window.onload=function(){
    canvas = document.getElementById('scene');
    up = document.getElementById('up');
    down = document.getElementById('down');
    del = document.getElementById('delete');

    ctx = canvas.getContext('2d');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight-100;
    var width = canvas.width;
    var height = canvas.height;
    for(var i=0; i<Rectangles.length;i++){
        var img = new Image();
        img.src = Rectangles[i].src;
        Rectangles[i].img = img;
    }
    var mouse_X=0,mouse_Y=0;
    var touch_s=[];
    //鼠标按下事件,这是传统的事件绑定,它非常简单而且稳定,适应不同浏览器.e表示事件,this指向当前元素.
    //但是这样的绑定只会在事件冒泡中运行,捕获不行.一个元素一次只能绑定一个事件函数.
    canvas.addEventListener("touchstart",function(e){
        var rect = this.getBoundingClientRect();
        if(e.touches.length==1){
            var touch = e.touches[0];
            var mouseX =touch.clientX - rect.left;//获取鼠标在canvsa中的坐标
            var mouseY =touch.clientY - rect.top;
            for (var i=0; i<Rectangles.length; i++) { //检查每一个图，看鼠标是否落在其中
                var RectangleX = Rectangles[i].x;
                var RectangleY = Rectangles[i].y;
                var w = Rectangles[i].w;
                var h = Rectangles[i].h;
                if (RectangleX<mouseX && mouseX<RectangleX+w) {
                    if(RectangleY<mouseY && mouseY<RectangleY+h){
                        selectedRectangle = i;//选中此图
                        mouse_X = mouseX-RectangleX; //点在图片上的位置
                        mouse_Y = mouseY-RectangleY; //点在图片上的位置
                        break;
                    }
                }
            }
        }else{
            var touch1 = e.touches[0];
            var mouseX1 =touch1.clientX - rect.left;//第一个手指在屏幕中的位置
            var mouseY1 =touch1.clientY - rect.top;

            var touch2 = e.touches[1];
            var mouseX2 =touch2.clientX - rect.left;//第二个手指在屏幕中的位置
            var mouseY2 =touch2.clientY - rect.top;
            touch_s.push(new touchS(mouseX1,mouseY1,mouseX2,mouseY2));
        }
    }, false);

    canvas.addEventListener("touchmove",function(e){
        e.preventDefault();

        var rect = this.getBoundingClientRect();
        if(e.touches.length==1) {   //一个手指操作时
            var touch = e.touches[0];
            var mouseX = touch.clientX - rect.left;//获取鼠标在canvsa中的坐标
            var mouseY = touch.clientY - rect.top;
            if (selectedRectangle != undefined) {
                var h = Rectangles[selectedRectangle].h;
                var w = Rectangles[selectedRectangle].w;
                var img = Rectangles[selectedRectangle].img;
                if (mouseX - mouse_X > 0 && mouseY - mouse_Y > 0) {
                    if (mouseX - mouse_X < width - w && mouseY - mouse_Y < height - h) {
                        Rectangles[selectedRectangle] = new Rectangle(mouseX - mouse_X, mouseY - mouse_Y, w, h, img, Rectangles[selectedRectangle].checked); //改变选中图的位置
                    }
                }
            }
        }else{     //多个手指操作时，取两个手指
            var touch1 = e.touches[0];
            var mouseX1 =touch1.clientX - rect.left;//第一个手指在屏幕中的位置
            var mouseY1 =touch1.clientY - rect.top;

            var touch2 = e.touches[1];
            var mouseX2 =touch2.clientX - rect.left;//第二个手指在屏幕中的位置
            var mouseY2 =touch2.clientY - rect.top;

            touch_s.push(new touchS(mouseX1,mouseY1,mouseX2,mouseY2));
            var x, y; //将要改变的坐标值和大小值
            x = Math.abs(mouseX1-mouseX2)/2;
            y = Math.abs(mouseY1-mouseY2)/2;
            for(var i=0;i<Rectangles.length;i++){
                if(Rectangles[i].checked){
                    var th = Rectangles[i].h/Rectangles[i].w; //图片的高比例
                    if(touch_s[touch_s.length-1].l>touch_s[touch_s.length-2].l){   //判断两个手指之间的距离增大
                        //限制增大的时候，图片始终在画布内
                        if(Rectangles[i].x-x/100 > rect.left && Rectangles[i].x-x/100+Rectangles[i].w+x/10 < rect.left+canvas.width && Rectangles[i].y-y/100 > rect.top && Rectangles[i].y-y/100+Rectangles[i].h+x/10*th<rect.top+canvas.height){
                            Rectangles[i] = new Rectangle(Rectangles[i].x-x/100, Rectangles[i].y-y/100, Rectangles[i].w+x/10, Rectangles[i].h+x/10*th, Rectangles[i].img, Rectangles[i].checked); //改变选中图的位置
                        }
                    }else{
                        //限制图片缩小的最小宽度为100
                        if(Rectangles[i].w-x/10 > 100){
                            Rectangles[i] = new Rectangle(Rectangles[i].x+x/100, Rectangles[i].y+y/100, Rectangles[i].w-x/10, Rectangles[i].h-x/10*th, Rectangles[i].img, Rectangles[i].checked); //改变选中图的位置
                        }
                    }
                }
            }
        }
    }, false);

    canvas.addEventListener("touchend",function(e){
        selectedRectangle = undefined;
    }, false);

    canvas.onclick =function(e){
        var rect = this.getBoundingClientRect();
        var mouseX =e.clientX - rect.left;//获取鼠标在canvsa中的坐标
        var mouseY =e.clientY - rect.top;
        var a=[];
        for (var i=0; i<Rectangles.length; i++) { //检查每一个图，看鼠标是否落在其中
            var RectangleX = Rectangles[i].x;
            var RectangleY = Rectangles[i].y;
            var w = Rectangles[i].w;
            var h = Rectangles[i].h;
            Rectangles[i].checked = false;
            //到图心的距离是否小于半径
            if (RectangleX<mouseX && mouseX<RectangleX+w) {
                if(RectangleY<mouseY && mouseY<RectangleY+h){
                    a.push(i);
                }
            }
        }
        if(a.length >= 2){
            var n=a.length-1;
            Rectangles[n].checked = true;
        }
        if(a.length == 1){
            Rectangles[a[0]].checked = true;
        }
    };
    up.onclick=function(){
        var j; //要提升层次对象的序号
        for(var i=0;i<Rectangles.length;i++){
            if(Rectangles[i].checked){
                j=i;
                break;
            }
        }
        if(j != Rectangles.length-1){
            var centre = Rectangles[j];
            Rectangles[j] = Rectangles[j+1];
            Rectangles[j+1] = centre;
        }
    };
    down.onclick=function(){
        var j; //要降低层次对象的序号
        for(var i=0;i<Rectangles.length;i++){
            if(Rectangles[i].checked){
                j=i;
                break;
            }
        }
        if(j != 0){
            var centre = Rectangles[j-1];
            Rectangles[j-1] = Rectangles[j];
            Rectangles[j] = centre;
        }
    };
    del.onclick = function(){
        var j; //要降低层次对象的序号
        for(var i=0;i<Rectangles.length;i++){
            if(Rectangles[i].checked){
                j=i;
                Rectangles.splice(i,1);
                break;
            }
        }
    };
    requestNextAnimationFrame(drawScene);
};