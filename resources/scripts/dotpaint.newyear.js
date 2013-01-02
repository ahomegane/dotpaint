/**
* @fileOverview dotpaint main process
* https://github.com/ahomegane/dotpaint/
* @name dotpaint.js
* @author ahomegane / Keiichiro Watanabe
* @version 1.0.0
* @namespace global [cv,sc]
*/

//for demo
document.addEventListener('DOMContentLoaded', function(){

  //create canvas
  var freeCanvas = new cv.FreeCanvas({
    canvasId:'freeCanvas', 
    canvasWidth:800, 
    canvasHeight:600, 
    canvasColor:'#fff',
    canvasBorderColor:'#000',
    canvasBorderWidth:'2px',
    bgId:'freeCanvasBg', 
    bgColor:'#fff'
  });
  freeCanvas.create();
  
  //dotpaint
  var dotPaint = new cv.DotPaint({
    canvasId: 'freeCanvas',
    dotR: 6
   });
  dotPaint.init();
  
  //dotPaint.sample();

  /**
  * dot circle
  */
  for(var i=300; i>0; i =i-dotPaint.dotR*2) {
    if(i > 250) {
      dotPaint.overrideDotR(10);
    } else if(i > 170) {
      dotPaint.overrideDotR(6);
    } else if(i > 100) {
      dotPaint.overrideDotR(4);
    }
    var randomColorLine = dotPaint.calculateRandomXColor(0xffffff,0xffffff);
    //paintCircle
    dotPaint.paintCircle({
      r:i,
      a:700,
      b:550,
      color:randomColorLine
      //cntMax:500
    });
    var randomColorDot = dotPaint.calculateRandomXColor();
    //paintCircleNoPile: 重なりなしのドット円
    dotPaint.paintCircleNoPile({
      r:i,
      a:700,
      b:550,
      color:randomColorDot,
      //cntMax:1000,
      loopTime:2
    });
  }

  /**
  * new year test
  */
  setTimeout(function(){
    dotPaint.overrideDotR(6);

    var sc01 = sc(true,'',100,12);
    var imageDataSc01 = sc01.text('2013年','#fff','normal normal 12px sans-serif', 0, 0).getImageData(0,0,44,12);//44pxの幅のエリアを抽出
    dotPaint.paintImageData({
      imageData:imageDataSc01,
      imageW:44,
      imageH:12,
      startX:50,
      startY:50,
      loopTime:0
    });
  },1000);

  setTimeout(function(){
    var sc02 = sc(true,'',100,12,'#fff');
    var imageDataSc02 = sc02.text('明けまし','#000','normal bold 10px sans-serif', 0, 0, 100).getImageData(0,0,40,12);
    dotPaint.paintImageDataRandom({
      imageData:imageDataSc02,
      imageW:40,
      imageH:12,
      startX:50,
      startY:220,
      loopTime:0
    });

    var sc03 = sc(true,'',100,20,'#fff');
    var imageDataSc03 = sc03.text('た！','#000','normal bold 17px sans-serif', 0, 0, 100).getImageData(0,0,28,20);
    dotPaint.paintImageDataRandom({
      imageData:imageDataSc03,
      imageW:28,
      imageH:20,
      startX:120,
      startY:360,
      loopTime:0
    });
  },3500);

  setTimeout(function(){
    //すでにあるctxに追加する場合、false
    var sc04 = sc(false,'#freeCanvas');
    sc04.text('よろしくお願いします。', '#EF454A', 'normal bold 16px serif', 610, 110);
  },7000);

  /**
  * file drop
  */
  var fileDrop = new cv.FileDrop('fileReader','drop');
  // fileDrop.createWindow(function(){
    
  //   var imageData = fileDrop.imageData;
  //   var imageWidth = fileDrop.imageWidth;
  //   var imageHeight = fileDrop.imageHeight;
  //   fileDrop.closeWindow();

  //   dotPaint.paintImageDataRandom({
  //     imageData:imageData,
  //     imageW:imageWidth,
  //     imageH:imageHeight,
  //     startX:200,
  //     startY:200,
  //     loopTime:1
  //   });

  // });
  fileDrop.closeWindow();

}, false);

(function(){

//release global namespace later
var cv = window.cv || {};

/**
* FreeCanvasクラス
* this.createで背景を含めた白紙のcanvas領域(背景はwindowサイズ100%)を作成。
* htmlには、
* <div id="[freeCanvasBg]">
* <canvas id="[freeCanvas]"></canvas>
* </div><!--/#freeCanvasBg-->
* を記述。
*/
cv.FreeCanvas = function(/*{
  canvasId:canvasId,
  canvasWidth:canvasWidth,
  canvasHeight:canvasHeight,
  canvasColor:canvasColor,
  canvasBorderColor:canvasBorderColor,
  canvasBorderWidth:canvasBorderWidth,
  bgId:bgId,
  bgColor:bgColor
}*/){
  this.el = {};
  this.el.canvas = document.getElementById(arguments[0].canvasId);
  this.canvasW = arguments[0].canvasWidth;
  this.canvasH = arguments[0].canvasHeight;
  this.canvasColor = arguments[0].canvasColor;
  this.canvasBorderColor = arguments[0].canvasBorderColor;
  this.canvasBorderWidth = arguments[0].canvasBorderWidth;
  
  this.el.bg = document.getElementById(arguments[0].bgId);
  this.bgColor = arguments[0].bgColor;

  this.timerIdWinResize = [];

};
cv.FreeCanvas.prototype = {

  winW : document.documentElement.clientWidth || document.body.clientWidth,

  winH : document.documentElement.clientHeight || document.body.clientHeight,
  
  create : function() {
    this.createBg(false);
    this.createCanvas(false);
    this.onWindowResize();
  },

  createBg : function(isResize) {
    //console.log(document.styleSheets);
    //http://bmky.net/text/note/javascript-css/
    this.el.bg.style.width = this.winW + 'px';
    this.el.bg.style.height = this.winH + 'px';
    if(!isResize) {
      this.el.bg.style.backgroundColor = this.bgColor;
    }
  },
  
  createCanvas : function(isResize) {
    this.el.canvas.style.left = (this.winW - this.canvasW)/2 + 'px';
    this.el.canvas.style.top = (this.winH - this.canvasH)/2 + 'px';
    
    if(!isResize) {
      var style = {
        'background-color':this.canvasColor,
        'border-color':this.canvasBorderColor,
        'border-style':'solid',
        'border-width':this.canvasBorderWidth,
        'position': 'absolute',
        'display': 'block'
      }
      for(var i in style) {
        this.el.canvas.style[i] = style[i];
      }
      this.el.canvas.width = this.canvasW;
      this.el.canvas.height = this.canvasH;

      this.ctx = this.el.canvas.getContext('2d');
      if(this.canvasColor) {
        this.ctx.fillStyle = this.canvasColor;
        this.ctx.fillRect(0,0, this.canvasW, this.canvasH);
      }
      //fillStyleを黒に戻す
      this.ctx.fillStyle = '#000';
      }
  },
  
  onWindowResize : function() {
    var self = this;
    window.addEventListener('resize', function(e) {
      do{clearTimeout(self.timerIdWinResize.shift());} while(self.timerIdWinResize.length > 0);
      self.timerIdWinResize.push(setTimeout(function(){
        self.winW = document.documentElement.clientWidth || document.body.clientWidth;
        self.winH = document.documentElement.clientHeight || document.body.clientHeight;
        self.createBg(true);
        self.createCanvas(true);
      }),100);
    },false);
  }
}


/**
* simpleCanvasクラス Interface function
*/
//release global namespace later
var sc = window.sc || function(isCreate,canvasSelector,canvasWidth,canvasHeight,canvasBgColor) {
  return new cv.SimpleCanvas(isCreate,canvasSelector,canvasWidth,canvasHeight,canvasBgColor);
}

/**
* simpleCanvasクラス
*/
cv.SimpleCanvas = function(isCreate,canvasSelector,canvasWidth,canvasHeight,canvasBgColor) {
  this.selector = canvasSelector;
  this.width = canvasWidth;
  this.height = canvasHeight;
  this.bgColor = canvasBgColor;

  this.el = null;
  this.ctx = null;
  
  if(isCreate) {
    return this.create(this.selector,this.width,this.height,this.bgColor);
  } else {
    return this.find(this.selector);
  }
}
cv.SimpleCanvas.prototype = {

  create: function(selector, width, height, bgColor) {
    var el = document.createElement('canvas');
    
    if(selector) {
      if(/^#/.test(selector)) {
        selector = selector.replace(/^#/,'');
        el.id = selector;
      } else if(/^\./.test(selector)){
        selector = selector.replace(/^\./,'');
        el.className = selector;
      }
    }

    el.width = width;
    el.height = height;

    this.el = el;
    this.ctx = el.getContext('2d');
    
    if(bgColor) {
      el.style.backgroundColor = bgColor;
      this.ctx.fillStyle = bgColor;
      this.ctx.fillRect(0,0,width, height);
    }
    //fillStyleを黒に戻す
    this.ctx.fillStyle = '#000';

    return this;
  },

  find: function(selector) {
    var el = document.querySelector(selector);
    this.ctx = el.getContext('2d');
    this.width = el.width;
    this.height = el.height;
    this.el = el;

    return this;
  },

  //style: http://www.htmq.com/style/font-size.shtml
  //colorはグラデーションできるっぽい http://www.w3schools.com/tags/canvas_stroketext.asp
  text: function(string, color, style, startX, startY, maxWidth) {
    this.ctx.fillStyle = color || '#000';
    this.ctx.font = style || 'italic bold 100px serif';

    startX = startX || 0;
    startY = startY || 0;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    if(maxWidth) {
      this.ctx.fillText(string,startX,startY,maxWidth);
    } else {
      this.ctx.fillText(string,startX,startY);
    }
    return this;
  },

  strokeText: function(string, color, style, startX, startY, maxWidth) {
    this.ctx.strokeStyle = color || '#000';
    this.ctx.font = 'italic bold 100px serif';

    startX = startX || 0;
    startY = startY || 0;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    if(maxWidth) {
      this.ctx.strokeText(string,startX,startY,maxWidth);
    } else {
      this.ctx.strokeText(string,startX,startY);
    }
    return this;
  },

  getImageData: function(x,y,w,h) {
    return this.ctx.getImageData(x,y,w,h);
  }
}

/**
* DotPaintクラス
* dom上のcanvasElementのidとdotの半径を引数として渡す。
* init後、メソッドを用いてdot絵を描画。
* dotの半径dotRはそのサイズに基づいてguideを作成するため、ガイドが関連する描画の場合は新たにnew DotPainする想定。
* 各メソッドの使用についてはthis.sampleを参照。
*/
cv.DotPaint = function(/*{
  canvasId: cnavasId,
  dotR: dotR
}*/){

  this.el = {};
  this.el.canvas = document.getElementById(arguments[0].canvasId);
  this.ctx = this.el.canvas.getContext('2d');
  
  this.dotR = arguments[0].dotR;
  
  var styleCanvas = document.defaultView.getComputedStyle(this.el.canvas, '');
  this.canvasW = this.el.canvas.width || parseInt(styleCanvas.width.replace('px',''));
  this.canvasH = this.el.canvas.height || parseInt(styleCanvas.height.replace('px',''));
  
};
cv.DotPaint.prototype = {
  
  guide: [],
  
  sample: function(imageData,imageWidth,imageHeight) {
    
    var dotPaint = this;
    //dotPaint.init();
    
    //アボリジナルの4色セット
    var naitureColors = ['#000','#fff','#B72914','#ffcc66'];

    //paintFree
    // dotPaint.paintFree({
    //   cntMax:500, 
    //   colors:naitureColors,
    //   loopTime: 1
    // });

    //painFreeOnGuide
    // dotPaint.paintFreeOnGuide({
    //   cntMax:1000, 
    //   colors:naitureColors,
    //   loopTime: 1
    // });

    //paintFillOnGuide
    // dotPaint.paintFillOnGuide({ 
    //   colors:naitureColors,
    //   //cntMax:1000,
    //   loopTime: 1
    // });

    //paintCircle
    // dotPaint.paintCircle({
    //   r:200,
    //   a:200,
    //   b:300,
    //   color:'#B72914',
    //   //cntMax:500
    // });

    //paintCircleNoPile: 重なりなしのドット円
    // dotPaint.paintCircleNoPile({
    //   r:100,
    //   a:200,
    //   b:100,
    //   color:'#B72914',
    //   //cntMax:1000,
    //   loopTime:1
    // });

    //paintCircleOnGuide: ガイド上に円を描く
    // dotPaint.paintCircleOnGuide({
    //   r:300,
    //   a:200,
    //   b:200,
    //   color:'#B72914',
    //   //cntMax:1000,
    //   loopTime:1
    // });

    //paintImageData: canvas imageDataをもとにドット絵を描く
    // dotPaint.paintImageData({
    //   imageData:imageData,
    //   imageW:imageWidth,
    //   imageH:imageHeight,
    //   startX:0,
    //   startY:0,
    //   loopTime:1
    // });

    //paintImageDataRandom: canvas imageDataをもとにドット絵を描く(ランダム)
    // dotPaint.paintImageDataRandom({
    //   imageData:imageData,
    //   imageW:imageWidth,
    //   imageH:imageHeight,
    //   startX:200,
    //   startY:200,
    //   loopTime:1
    // });

    //paintSquare
    // dotPaint.paintSquare({
    //   startX:100,
    //   startY:100,
    //   topLength:200,
    //   leftLength:300,
    //   color:'#000',
    //   loopTime:5
    // });

    //paintSquareOnGuide
    // dotPaint.paintSquareOnGuide({
    //   startX:100,
    //   startY:100,
    //   topLength:500,
    //   leftLength:300,
    //   color:'#000',
    //   loopTime:5
    // });

  },
  
  init: function() {
    this.guide = this.createGuide();
  },
  
  overrideDotR: function(val) {
    this.dotR = val;
  },

  //16進数の色の数値のランダムに生成
  //0xffffff〜0x000000の間でmaxval〜minval(16進数指定 0x******)を指定
  //http://www.nthelp.com/colorcodes.htm
  calculateRandomXColor: function(maxVal, minVal) {
    //変数に代入した時点で16進数は10進数として扱われている模様。そのため.toString(10)は不要
    if(maxVal == null) maxVal = 0xffffff;
    if(minVal == null) minVal = 0x000000;
    //色指定は3or6桁である必要条件。そのため、'000000'を＋し、後ろから6桁をslice
    var rv = '000000' + (Math.floor(Math.random() * (maxVal-minVal)) + minVal).toString(16);
    rv = '#' + rv.slice(-6);
    return rv;
  },

  // ↓y →x
  createGuide: function() {
    var center = [], tmpCenter = [],
        i = 0, j = 0;
    
    for(var centerX = this.dotR; centerX <= this.canvasW; centerX += this.dotR*2) {//→x
      for(var centerY = this.dotR; centerY < this.canvasH; centerY += this.dotR*2) {//↓y
        tmpCenter.push({x: centerX, y: centerY});
        i++;
      }
      center.push(tmpCenter);
      tmpCenter = [];
      j++;
    }
    return center;
  },
  
  drawDot: function(centerX,centerY,radius,fillColor) {
    this.ctx.beginPath();
    this.ctx.arc(centerX,centerY,radius,0*Math.PI/180, 360*Math.PI/180,false);
    this.ctx.closePath();
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
  },

  paintFree: function(/*{cntMax:cntMax, colors:colors, [loopTime: loopTime]}*/) {
    var self = this;
    var cntMax = arguments[0].cntMax,
        colors = arguments[0].colors,
        loopTime = arguments[0].loopTime || 1;
    var timerId = [],
        cnt = 0;

    function paint() {
      //colorsで指定した色が均等になるようcolors[cnt%colors.length]
      self.drawDot(Math.floor(Math.random() * self.canvasW), Math.floor(Math.random() * self.canvasH), self.dotR, colors[cnt%colors.length]);  
      cnt++;

      if(cnt <= cntMax) {
        timerId.push(setTimeout(paint, loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }    
    paint();
  },
  
  paintFreeOnGuide: function(/*{cntMax:cntMax, colors:colors, [loopTime: loopTime]}*/) {
    var self = this;
    var cntMax = arguments[0].cntMax,
        colors = arguments[0].colors,
        loopTime = arguments[0].loopTime || 1;
    var timerId = [],
        cnt = 0;

    function paint() {
      var randX = Math.floor(Math.random() * self.guide.length);
      var randY = Math.floor(Math.random() * self.guide[0].length);

      if(randX > -1 && randY > -1 && randX < self.guide.length && randY < self.guide[0].length) {
        self.drawDot(self.guide[randX][randY].x, self.guide[randX][randY].y, self.dotR, colors[cnt%colors.length]); 
      }
      cnt++;
      
      if(cnt <= cntMax) {
        timerId.push(setTimeout(paint, loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }
    paint();
  },
  
  paintFillOnGuide: function(/*{colors:colors, [cntMax:cntMax], [loopTime:loopTime]}*/) {
    var self = this;
    var colors = arguments[0].colors,
        cntMax = arguments[0].cntMax && self.guide.length * self.guide[0].length > arguments[0].cntMax ? arguments[0].cntMax : self.guide.length * self.guide[0].length,
        loopTime = arguments[0].loopTime || 1;
    var  timerId = [],
        cnt = 0, x = -1, y = 0;

    function paint() {
      if(x < self.guide.length-1) {
        x++;
      } else {
        x=0;
        y++;
      }
      
      if(x > -1 && y > -1 && x < self.guide.length && y < self.guide[0].length) {
        self.drawDot(self.guide[x][y].x, self.guide[x][y].y, self.dotR, colors[cnt%colors.length]);
      }
      cnt++;
      
      if(cnt <= cntMax) {
        timerId.push(setTimeout(paint, loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }
    paint();
  },
  
  paintCircle: function (/*{[r:r], [a:a], [b:b], color:color, [cntMax:cntMax]}*/) {
    var self = this;
    var r = arguments[0].r || 200,
        a = arguments[0].a || 0,
        b = arguments[0].b || 0,
        cntMax = arguments[0].cntMax && arguments[0].cntMax < r*2 ? arguments[0].cntMax : r*2,
        color = arguments[0].color;
    var  timerId = [],
        cnt = 0,
        x1 = a-r-1,
        y2 = b-r-1;
    
    for(cnt=0;cnt <= cntMax; cnt++) {
      x1++;//→x
      //左の半円,右の半円
      var y1_1 = -Math.sqrt(r*r - (x1-a)*(x1-a)) + b,
          y1_2 = Math.sqrt(r*r - (x1-a)*(x1-a)) + b;
      if(!isNaN(x1) && !isNaN(y1_1) && !isNaN(y1_2)){
        self.drawDot(x1,y1_1,self.dotR,color);
        self.drawDot(x1,y1_2,self.dotR,color);
      }
      
      //xが0に近似する箇所はドットの感覚が広くなる。
      //そのため、↓y方向にも同時に線を描くことで隙間のない円を描く

      y2++;//↓y
      //上の半円,下の半円
      var x2_1 = -Math.sqrt(r*r - (y2-b)*(y2-b)) + a,
          x2_2 = Math.sqrt(r*r - (y2-b)*(y2-b)) + a;
      if(!isNaN(x2_1) && !isNaN(x2_2) && !isNaN(y2)){
        self.drawDot(x2_1,y2,self.dotR,color);
        self.drawDot(x2_2,y2,self.dotR,color);
      }
    }
    
  },
  
  paintCircleNoPile: function (/*{[r:r], [a:a], [b:b], color:color, [cntMax:cntMax], [loopTime:loopTime]}*/) {
    var self = this;
    var r = arguments[0].r || 200,
        a = arguments[0].a || 0,
        b = arguments[0].b || 0,
        color = arguments[0].color,
        cntMax = arguments[0].cntMax,
        loopTime = arguments[0].loopTime || 1;
    var timerId = [],
        cnt = 0;
    
    //ロジック：
    //円の内側にちょうど収まる正方形を求め、
    //左上→右上/右上→右下/右下→左下/左下→左上 それぞれ4方向についてself.dotR*2+2をしていき、
    //座標を計算、重なりのない円を描画
    
    //正方形の各辺の長さ
    var sqTop = r*Math.sin(45*Math.PI/180)*2,
        sqLeft = r*Math.cos(45*Math.PI/180)*2;

    //stop max val
    cntMax = cntMax && cntMax > sqTop ? cntMax : sqTop;

    //各点の座標[x,y]
    var sqMatrix1 = {x:a-sqTop/2,y:b-sqLeft/2},//左上
        sqMatrix2 = {x:a+sqTop/2,y:b-sqLeft/2},//右上
        sqMatrix3 = {x:a+sqTop/2,y:b+sqLeft/2},//右下
        sqMatrix4 = {x:a-sqTop/2,y:b+sqLeft/2};//左下
    
    //基準となる x or y のスタート座標
    var x1 = sqMatrix1.x - self.dotR*2,//sqMatrix1
        y2 = sqMatrix2.y - self.dotR*2,//sqMatrix2
        x3 = sqMatrix3.x + self.dotR*2,//sqMatrix3
        y4 = sqMatrix4.y + self.dotR*2;//sqMatrix4
    
    function paint() {

      //左上→右上
      x1 = x1 + self.dotR*2+2;
      var y1 = -Math.sqrt(r*r - (x1-a)*(x1-a)) + b;
      if(!isNaN(x1) && !isNaN(y1)){
         self.drawDot(x1,y1,self.dotR,color);
      }
      
      //右上→右下
      y2 = y2 + self.dotR*2+2;
      var x2 = Math.sqrt(r*r - (y2-b)*(y2-b)) + a;
      if(!isNaN(y2) && !isNaN(x2)){
        self.drawDot(x2,y2,self.dotR,color);
      }
      
      //右下→左下
      x3 = x3 - self.dotR*2-2;
      var y3 = Math.sqrt(r*r - (x3-a)*(x3-a)) + b;
      if(!isNaN(x3) && !isNaN(y3)){
        self.drawDot(x3,y3,self.dotR,color);
      }
      
      //左下→左上
      y4 = y4 - self.dotR*2-2;
      var x4 = -Math.sqrt(r*r - (y4-b)*(y4-b)) + a;
      if(!isNaN(y4) && !isNaN(x4)){
        self.drawDot(x4,y4,self.dotR,color);
      }
      
      if(x1 < sqMatrix2.x) {
        cnt++;
      } else {
        cnt  = cntMax+1;
      }
      
      if(cnt <= cntMax) {
        timerId.push(setTimeout(paint,loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }    
    paint();  
  },
  
  paintCircleOnGuide: function (/*{[r:r], [a:a], [b:b], color:color, [cntMax:cntMax], [loopTime:loopTime]}*/) {
    var self = this;
    var r = arguments[0].r || 200,
        a = arguments[0].a || 0,
        b = arguments[0].b || 0,
        color = arguments[0].color,
        cntMax = arguments[0].cntMax && arguments[0].cntMax < r*2 ? arguments[0].cntMax : r*2,
        loopTime = arguments[0].loopTime || 1;
    var timerId = [],
        cnt = 0;
    
    var x1 = a-r-1,
        y2 = b-r-1;
    
    function paint() {
      x1++;
      var y1_1 = -Math.sqrt(r*r - (x1-a)*(x1-a)) + b,
          y1_2 = Math.sqrt(r*r - (x1-a)*(x1-a)) + b;
      //dotの直径で割ってguideの基準値に合わせる
      var gx1 = Math.ceil(x1 / (self.dotR*2)),
          gy1_1 = Math.ceil(y1_1 / (self.dotR*2)),
          gy1_2 = Math.ceil(y1_2 / (self.dotR*2)); 
      if(!isNaN(gx1) && !isNaN(gy1_1) && !isNaN(gy1_2) && gx1 > -1 && gy1_1 > -1  && gy1_2 > -1 && gx1 < self.guide.length && gy1_1 < self.guide[0].length && gy1_2 < self.guide[0].length){
        self.drawDot(self.guide[gx1][gy1_1].x,self.guide[gx1][gy1_1].y,self.dotR,color);
        self.drawDot(self.guide[gx1][gy1_2].x,self.guide[gx1][gy1_2].y,self.dotR,color);
      }
      
      y2++;
      var x2_1 = -Math.sqrt(r*r - (y2-b)*(y2-b)) + a,
          x2_2 = Math.sqrt(r*r - (y2-b)*(y2-b)) + a;
      //dotの直径で割ってguideの基準値に合わせる
      var gy2 = Math.ceil(y2 / (self.dotR*2)),
          gx2_1 = Math.ceil(x2_1 / (self.dotR*2)),
          gx2_2 = Math.ceil(x2_2 / (self.dotR*2));
      if(!isNaN(gx2_1) && !isNaN(gx2_2) && !isNaN(gy2) && gx2_1 > -1 && gx2_2> -1  && gy2 > -1 && gx2_1 < self.guide.length && gx2_2 < self.guide.length && gy2 < self.guide[0].length){
        self.drawDot(self.guide[gx2_1][gy2].x,self.guide[gx2_1][gy2].y,self.dotR,color);
        self.drawDot(self.guide[gx2_2][gy2].x,self.guide[gx2_2][gy2].y,self.dotR,color);
      }
      
      cnt++;
      if(cnt <= cntMax) {
        timerId.push(setTimeout(paint, loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }    
    paint();
  },
  
  paintImageData: function(/*{imageData:imageData, imageW:imageW, imageH:imageH, [startX:startX], [startY:startY], [loopTime:loopTime]}*/) {
    var self = this;
    var imageData = arguments[0].imageData,
        imageW = arguments[0].imageW,
        imageH = arguments[0].imageH,
        startX = Math.floor(arguments[0].startX/(self.dotR*2)) || 0,
        startY = Math.floor(arguments[0].startY/(self.dotR*2)) || 0,
        loopTime = arguments[0].loopTime || 1;
    var data = imageData.data,
        dataLen = data.length,
        pixels = dataLen/4;
    var rgb = [];
    
    //各pixelのrgb値を抽出
    for(var i=0; i<pixels; i++) {
      var r = data[i*4],
          g = data[i*4+1],
          b = data[i*4+2];
      rgb[i] = 'rgb(' + r + ', ' + g + ', ' + b + ');'      
    }
    
    var cnt = 0,
        cntMax = pixels-1,
        x = startX-1,
        y = startY,
        wMax = imageW+startX,
        timerId = [];

    function paint() {      
      if(x < wMax-1) {
        x++;
      } else {
        x=startX;
        y++;
      }
      if(x > -1 && y > -1 && x < self.guide.length && y < self.guide[0].length) {
        self.drawDot(self.guide[x][y].x,self.guide[x][y].y,self.dotR,rgb[cnt]);
      }
      cnt++;
      
      if(cnt <= cntMax) {
        timerId.push(setTimeout(paint, loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }

    paint();
  },
  
  paintImageDataRandom: function(/*{imageData:imageData, imageW:imageW, imageH:imageH, [startX:startX], [startY:startY], [loopTime:loopTime]}*/) {
    var self = this;
    var imageData = arguments[0].imageData,
        imageW = arguments[0].imageW,
        imageH = arguments[0].imageH,
        startX = Math.floor(arguments[0].startX/(self.dotR*2)) || 0,
        startY = Math.floor(arguments[0].startY/(self.dotR*2)) || 0,
        loopTime = arguments[0].loopTime || 1;
    var data = imageData.data,
        dataLen = data.length,
        pixels = dataLen/4;
    var rgb = [],
        timerId = [];
    
    //各pixelのrgb値を抽出
    for(var i=0; i<pixels; i++) {
      var r = data[i*4],
          g = data[i*4+1],
          b = data[i*4+2];    
      rgb[i] = 'rgb(' + r + ', ' + g + ', ' + b + ');'
    }
    
    //guideに沿った座標およびその色を配列に格納
    var x = startX-1,
        y = startY,
        wMax = imageW + startX,
        guideData = [];
    for(var i=0; i<pixels; i++) {
      if(x < wMax-1) {
        x++;
      } else {
        x=startX;
        y++;
      }      
      guideData.push({x:x,y:y,rgb:rgb[i]});
    }

    //描画開始
    var cnt=0,
        cntMax = guideData.length;

    //重複しないようにカウントチェック配列
    var cntCheckAry = [];
    for(var i=0; i<cntMax; i++) {
      cntCheckAry.push('noUse');
    }

    //描画
    function paint() {
      //randomNum生成
      var randomCnt;
      do {
        randomCnt =  Math.floor(Math.random() * cntMax);
        if(cntCheckAry[randomCnt] == 'noUse') {
          cntCheckAry[randomCnt] = 'used';
        } else {
          randomCnt = null;
        }  
      } while(randomCnt==null);
      
      if(guideData[randomCnt].x > -1 && guideData[randomCnt].y > -1 && guideData[randomCnt].x < self.guide.length && guideData[randomCnt].y < self.guide[0].length) {
        self.drawDot(self.guide[guideData[randomCnt].x][guideData[randomCnt].y].x, self.guide[guideData[randomCnt].x][guideData[randomCnt].y].y, self.dotR, guideData[randomCnt].rgb);
      }
      cnt++;
      
      if(cnt < cntMax) {
        timerId.push(setTimeout(paint, loopTime));
      } else {
        do{clearTimeout(timerId.shift());}while(timerId.length > 0);
      }
    }
    paint();
  },
  
  paintSquare: function (/*{[startX:startX], [startY:startY], topLength:topLength, leftLength:leftLength, color:color, [loopTime:loopTime]}*/) {
    var self = this;
    var startX = arguments[0].startX || 0,
        startY = arguments[0].startY || 0,
        topLength = arguments[0].topLength,
        leftLength = arguments[0].leftLength,
        color = arguments[0].color,
        loopTime = arguments[0].loopTime || 1;

    var timerIdPaintX = [],
        cntPaintX = 0,
        xPaintX = startX,
        yPaintX = startY,
        cntMaxPaintX = topLength;
    function paintX() {
      xPaintX++;
      self.drawDot(xPaintX,yPaintX,self.dotR,color);
      self.drawDot(xPaintX,yPaintX+leftLength,self.dotR,color);
      
      cntPaintX++;
      if(cntPaintX < cntMaxPaintX) {
        timerIdPaintX.push(setTimeout(paintX,loopTime));
      } else {
        do{clearTimeout(timerIdPaintX.shift());}while(timerIdPaintX.length > 0);
      }
    }
  
    var timerIdPaintY = [],
        cntPaintY = 0,
        xPaintY = startX,
        yPaintY = startY,
        cntMaxPaintY = leftLength;
    function paintY() {
      yPaintY++;
      self.drawDot(xPaintY,yPaintY,self.dotR,color);
      self.drawDot(xPaintY+topLength,yPaintY,self.dotR,color);
          
      cntPaintY++;
      if(cntPaintY < cntMaxPaintY) {
        timerIdPaintY.push(setTimeout(paintY,loopTime));
      } else {
        do{clearTimeout(timerIdPaintY.shift());}while(timerIdPaintY.length > 0);
      }
    }
    
    paintX();
    paintY();
  },
  
  paintSquareOnGuide: function (/*{[startX:startX], [startY:startY], topLength:topLength, leftLength:leftLength, color:color, [loopTime:loopTime]}*/) {
    var self = this;
    var startX = arguments[0].startX || 0,
        startY = arguments[0].startY || 0,
        topLength = arguments[0].topLength,
        leftLength = arguments[0].leftLength,
        color = arguments[0].color,
        loopTime = arguments[0].loopTime || 1;
    
    //startXのガイド上の近似値を求める
    for(var i=0; i < self.guide.length-1; i++) {
      if(self.guide[i][0].x < startX && self.guide[i+1][0].x >= startX) {
        startX = i+1;
        break;
      }
    }

    //startYのガイド上の近似値を求める
    for(var i=0; i < self.guide[0].length-1; i++) {
      if(self.guide[0][i].y < startY && self.guide[0][i+1].y >= startY) {
        startY = i+1;
        break;
      }
    }
        
    //leftLengthのガイド上の近似値を求める
    if(leftLength % (self.dotR*2) != 0 ) {
      leftLength = (self.dotR*2)*Math.floor(leftLength/(self.dotR*2))+(self.dotR*2);
    }

    //topLengthのガイド上の近似値を求める
    if(topLength % (self.dotR*2) != 0 ) {
      topLength = (self.dotR*2)*Math.floor(topLength/(self.dotR*2))+(self.dotR*2);
    }

    var timerIdPaintX = [],
        cntPaintX = -1,
        xPaintX = startX-1,
        yPaintX = startY,
        cntMaxPaintX = topLength/(self.dotR*2);
    function paintX() {
      xPaintX++;
      if(xPaintX > -1 && yPaintX > -1 && xPaintX < self.guide.length && yPaintX < self.guide[0].length){
        self.drawDot(self.guide[xPaintX][yPaintX].x,self.guide[xPaintX][yPaintX].y,self.dotR,color);
        self.drawDot(self.guide[xPaintX][yPaintX].x,self.guide[xPaintX][yPaintX].y+leftLength,self.dotR,color);
      }
          
      cntPaintX++;
      if(cntPaintX < cntMaxPaintX) {
        timerIdPaintX.push(setTimeout(paintX, loopTime));
      } else {
        do{clearTimeout(timerIdPaintX.shift());}while(timerIdPaintX.length > 0);
      }
    }
  
    var timerIdPaintY = [],
        cntPaintY = 0,
        xPaintY = startX,
        yPaintY = startY,
        cntMaxPaintY = leftLength/(self.dotR*2);
    function paintY() {
      yPaintY++;
      if(xPaintY > -1 && yPaintY > -1 && xPaintY < self.guide.length && yPaintY < self.guide[0].length){
        self.drawDot(self.guide[xPaintY][yPaintY].x,self.guide[xPaintY][yPaintY].y,self.dotR,color);
        self.drawDot(self.guide[xPaintY][yPaintY].x+topLength,self.guide[xPaintY][yPaintY].y,self.dotR,color);
      }

      cntPaintY++;
      if(cntPaintY < cntMaxPaintY) {
        timerIdPaintY.push(setTimeout(paintY, loopTime));
      } else {
        do{clearTimeout(timerIdPaintY.shift());}while(timerIdPaintY.length > 0);
      }
    }
    
    paintX();
    paintY();
  } 
}


/**
* fileDropクラス
* 画像データのドロップ領域を作成。ユーザーが画像をドロップすると、
* this.imageData(canvas)/this.imageWidth/this.imageHeightに画像データを格納する。
* closeWindow()でドロップ領域をクリア。
*/
cv.FileDrop = function(fileReaderId, dropId){
  this.el = {};
  this.el.fileReader = document.getElementById(fileReaderId);
  this.el.drop = document.getElementById(dropId);

  this.reader = null;
  this.imageData = null;
  this.imageWidth = 0;
  this.imageHeight = 0;

  this.timerIdWinResize = [];

};
cv.FileDrop.prototype = {
  
  // window.innerWidth はスクロールバーを無視したwindowサイズ
  // http://kaelab.ranadesign.com/blog/2010/10/javascript-5.html
  // http://www.albert2005.co.jp/study/javascript/miscellaneous.html#entry_3
  winW : document.documentElement.clientWidth || document.body.clientWidth,

  winH : document.documentElement.clientHeight || document.body.clientHeight,
  
  createWindow : function(callback, isResize) {    
    var self = this;

    if(!isResize) {
      //背景領域
      this.el.bg = this.el.fileReader.querySelector('.bg');    
      //drop領域
      this.el.dropArea = this.el.fileReader.querySelector('.dropArea');
      
      this.el.drop.addEventListener('dragover',function(e) {
        e.preventDefault();
      },false);
      
      this.el.drop.addEventListener('drop',function(e) {
        e.preventDefault();
        self.fileDroped(e, callback);
      },false);

      self.onWindowResize();

    }

    this.el.bg.style.width = this.winW + 'px';
    this.el.bg.style.height = this.winH + 'px';
    
    this.el.dropArea.style.left = (this.winW - this.el.dropArea.offsetWidth)/2 + 'px';
    this.el.dropArea.style.top = (this.winH - this.el.dropArea.offsetHeight)/2 + 'px';
    
  },
  
  fileDroped: function(e,callback) {
    var self = this;

    //連続してdropされた場合を考慮
    this.el.drop.innerHTML = ''
    
    var file = e.dataTransfer.files[0];
    this.reader = new FileReader();
    
    if(!/^image/.test(file.type)) {
      alert('画像ファイルをドロップしてください');
    }
    
    this.reader.addEventListener('load',function(e) {
      //thisが実行時の環境に依存するため、引数selfとして渡す
      self.getImageData(e, self, callback);
    }, false);

    this.reader.readAsDataURL(file);
  },
  
  getImageData: function(e,self,callback) {
    
    var image = document.createElement('img');
    image.setAttribute('src', self.reader.result);
    
    image.addEventListener('load', function() {
      var w = parseInt(image.width);
      var h = parseInt(image.height);
      
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image,0,0);
      
      self.el.drop.appendChild(canvas);
      
      var imageData = ctx.getImageData(0,0,w,h);
      
      self.imageData = imageData;
      self.imageWidth = w;
      self.imageHeight = h;
      
      if(typeof callback == 'function') {
        callback();
      }
      
    },false);

    self.el.drop.appendChild(image);
  },
  
  closeWindow:function(){
    this.el.fileReader.innerHTML = '';
  },

  onWindowResize : function() {
    var self = this;
    window.addEventListener('resize', function(e) {
      do{clearTimeout(self.timerIdWinResize.shift());} while(self.timerIdWinResize.length > 0);
      self.timerIdWinResize.push(setTimeout(function(){
        self.winW = document.documentElement.clientWidth || document.body.clientWidth;
        self.winH = document.documentElement.clientHeight || document.body.clientHeight;
        self.createWindow(null,true);
      }),100);
    },false);
  }
}


//release global namespace
window.cv = cv;
window.sc = sc;

})();
