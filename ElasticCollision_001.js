/*=============================================================================================================== ElasticCollision_001 ===*/
/*                                                                                                                                        */
/*                                                        Elastic Collision                                                               */
/*                                                                                                                                        */
/*------------------------------------------------------------------------------------------------------------------------------- main ---*/

(function () {
  async function __main__() {
    "use strict";
    var version = ["3.0", "glowscript"];
    Array.prototype.toString = function () {
      return __parsearray(this);
    };

    /*............................................................................................................................ scene ...*/

    var scene = canvas({ center: vec(35, 15, 0), background: color.black });
    scene.width = 800;
    scene.height = 400;
    scene.range = 1.3;

    scene.x = scene.y = 0;
    scene.z = 0;
    scene.fov = 0.001;
    scene.range = 20;
    scene.userzoom = 0;
    scene.userspin = 0;
    //scene.rotate({angle:1,axis:vec(0,0,1)})
    //scene.forward = vec(1["-u"](), 1["-u"](), 1["-u"]());

    /*......................................................................................................................... variable ...*/

    var omegaT = "\u03C9"; // greak omega
    var alphaT = "\u03B1"; // greak alpha

    var nReset = 0; // run constant Reset
    var nBwd = 1; //              Backward
    var nFwd = 2; //              Forward
    var nStop = 3; //              Stop
    var nRun = 0; //              Run   (toggle Run/Stop)

    var bRun = false; // boolean      bRun
    var bStop = true; //              bStop

    var nTime = 0; // time   current
    var nTimePrev = 0;
    var dt = 0.01;

    var rise;
    var theta;
    var cosTheta;
    var sinTheta;
    var vx1Prime;
    var vx2Prime;
    var vy1Prime;
    var vy2Prime;
    var p;
    var v;
    var v2f;
    var v1f;
    var vx1Prime;
    var vx2Prime;
    var vx1;
    var vx2;
    var vy1;
    var vy2;

    /*.............................................................................................................................. obj ...*/

    var btn_reset = button({ text: "Reset", bind: reset });
    var btn_bwd = button({ text: "Bwd", bind: bwd });
    var btn_fwd = button({ text: "Fwd", bind: fwd });
    var btn_stop = button({ text: "Stop", bind: stop });
    var btn_run = button({ text: "Run", bind: run });
    scene.append_to_caption(
      "                                                       "
    );
    var txt_tT = wtext({ text: "t=" });
    var txt_t = wtext({ text: "0" });

    //var txt_inWT = wtext  ({text:omegaT+'= '});  var txt_WT = winput({text:'1',width:70,bind:angSpeed});  scene.append_to_caption('       ')
    //var txt_inAT = wtext  ({text:alphaT+'= '});  var txt_AT = winput({text:'0',width:70,bind:angAcc  });  scene.append_to_caption('\n\n'   )

    scene.append_to_caption("\n\n");

    //var rb_C       = radio ({text:'Classic'        ,checked:true ,bind: rbC     ,name:'CQ'});   scene.append_to_caption('\n')
    //var cb_m1      = checkbox ({text:'Measurement M1' ,checked:false ,bind:cbM1});             scene.append_to_caption('\n')
    //var txt_AT     = winput({text:'',width:70,bind:angAcc  });  scene.append_to_caption('\n'   )

    var nTime = 0;

    var m1 = 5;
    var m2 = 1;

    var x0 = 0;
    var y0 = 0;
    var z0 = 0;
    var x1 = 0;
    var y1 = 0;
    var x2 = 40;
    var y2 = 30;
    var xcm = 0;
    var ycm = 0;
    var zcm = 0;
    const g = -9.81;

    var z0 = 0;

    var v10 = 0;
    var v10x = 26.67;
    var v10y = 20;
    var v20 = 0;
    var v20x = 0;
    var v20y = 0;
    var v1 = v10;
    var v1x = v10x;
    var v1y = v10y;
    var v2 = v20;
    var v2x = v20x;
    var v2y = v20y;

    var vFac = 0.2;

    //var x0     =   0;   var y0   =  0;    var z0   = 0
    //var x1     =   5;   var y1   =  0
    //var x2     =  10;   var y2   =  0

    var p1x = x1;
    var p1y = y1;
    var p1z = 0;
    var p2x = x2;
    var p2y = y2;
    var p2z = 0;
    //var p1x    =  5;    var p1y = 0 ;    var p1z  = 0
    //var p2x    = 10;    var p2y = 0 ;    var p2z  = 0
    var rP = 2;
    var rCM = 0.3;
    var d = rP;

    //var c1     = cylinder({pos:vec(x1,y1,0),size:vec(20,0.2,0.2),color:vec(0.5,0.5,0.8),axis:vec(0,1,0)})
    //var c2     = cylinder({pos:vec(x1+1,y1,0),size:vec(20,0.2,0.2),color:vec(0.5,0.5,0.8),axis:vec(0,1,0)})
    //var c3     = cylinder({pos:vec(x1+2,y1,0),size:vec(20,0.2,0.2),color:vec(0.5,0.5,0.8),axis:vec(0,1,0)})

    var p1 = sphere({
      pos: vec(p1x, p1y, p1z),
      size: vec(rP, rP, rP),
      color: vec(0, 1, 0),
      axis: vec(0, 0, 1),
    }); //p1.visible = false
    var p2 = sphere({
      pos: vec(p2x, p2y, p2z),
      size: vec(rP, rP, rP),
      color: vec(1, 0, 1),
      axis: vec(0, 0, 1),
    }); //p2.visible = false

    compute_cm();

    var cm = sphere({
      pos: vec(xcm, ycm, z0),
      size: vec(rCM, rCM, rCM),
      color: vec(5, 5, 5),
      axis: vec(1, 0, 0),
    }); //p2.visible = false

    var arr_v1 = arrow({
      pos: vec(p1.pos.x, p1.pos.y, z0),
      color: vec(3, 3, 3),
      axis: vec(v1x, v1y, 0),
      length: 10,
      shaftwidth: 0.1,
    });
    var arr_v2 = arrow({
      pos: vec(p2.pos.x, p2.pos.y, z0),
      color: vec(3, 3, 3),
      axis: vec(v2x, v2y, 0),
      length: 5,
      shaftwidth: 0.1,
    });

    //var arr_x   = arrow ({pos:vec(0,  0,0),axis:vec(1,0,0),color:vec(3,3,3),length:30,shaftwidth:0.1})

    //var arr_v1  = arrow ({pos:vec(0,0,0),axis:vec(0,0,0),color:vec(0,1,0),length:10,shaftwidth:0.1})

    //var cm      = sphere({pos:vec(p2x,p2y,p2z),size:vec(rCM,rCM,rCM),color:vec(0,0,1),axis:vec(0,0,1)}); //p2.visible = false
    //var cyl     = cylinder({pos:vec(5,0,0),size:vec(5,0.8,0.8),color:vec(0.5,0.5,0.8),axis:vec(1,1,0)})
    //var c12     = cylinder({pos:vec(x1-5,y1,z0),size:vec((x2-x1)+5,0.2,0.2),color:vec(0.5,0.5,0.5),axis:vec(1,0,0)})
    //var lblNx   = label({pos:vec(x4+8,y4  ,0),text:nH,color:vec(0.5,0.5,0.5),box:false,font:'serif'})

    var txt_m1T = wtext({ text: "m1=" });
    var txt_m1 = winput({ text: m1, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_x1T = wtext({ text: "x1=" });
    var txt_x1 = winput({ text: x1, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_y1T = wtext({ text: "y1= " });
    var txt_y1 = winput({ text: y1, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_v1xT = wtext({ text: "v1x=" });
    var txt_v1x = winput({ text: v1x, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_v1yT = wtext({ text: "v1y=" });
    var txt_v1y = winput({ text: v1y, width: 50, bind: angAcc });
    scene.append_to_caption("\n");

    var txt_m2T = wtext({ text: "m2=" });
    var txt_m2 = winput({ text: m2, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_x2T = wtext({ text: "x2=" });
    var txt_x2 = winput({ text: x2, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_y2T = wtext({ text: "y2= " });
    var txt_y2 = winput({ text: y2, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_v2xT = wtext({ text: "v2x=" });
    var txt_v2x = winput({ text: v2x, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_v2yT = wtext({ text: "v2y=" });
    var txt_v2y = winput({ text: v2y, width: 50, bind: angAcc });
    scene.append_to_caption("\n\n");
    scene.append_to_caption(
      "                                                             "
    );
    var txt_u1xT = wtext({ text: "u1x=" });
    var txt_u1x = winput({ text: v1x, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_u1yT = wtext({ text: "u1y=" });
    var txt_u1y = winput({ text: v1y, width: 50, bind: angAcc });
    scene.append_to_caption("\n");
    scene.append_to_caption(
      "                                                             "
    );
    var txt_u2xT = wtext({ text: "u2x=" });
    var txt_u2x = winput({ text: v2x, width: 50, bind: angAcc });
    scene.append_to_caption("     ");
    var txt_u2yT = wtext({ text: "u2y=" });
    var txt_u2y = winput({ text: v2y, width: 50, bind: angAcc });
    scene.append_to_caption("");

    reset();
    /*----------------------------------------------------------------------------------------------------------------------- run button ---*/

    function angAcc(b) {
      var bt = b.text;
      if (b == txt_m1) {
        m1 = bt;
      } else if (b == txt_m2) {
        m2 = bt;
      } else if (b == txt_x1) {
        x1 = bt;
      } else if (b == txt_x2) {
        x2 = bt;
      } else if (b == txt_y1) {
        y1 = bt;
      } else if (b == txt_y2) {
        y2 = bt;
      } else if (b == txt_v1x) {
        v1x = bt;
      } else if (b == txt_v1y) {
        v1y = bt;
      } else if (b == txt_v2x) {
        v2x = bt;
      } else if (b == txt_v2y) {
        v2y = bt;
      }
      p1x = x1;
      p1y = y1;
      p2x = x2;
      p2y = y2;
      reset();
    }
    function reset() {
      bStop = true;
      nRun = 0;
      nTime = 0;
      nTime = 0;
      p1.pos.x = p1x;
      p1.pos.y = p1y;
      p1.pos.z = p1z;
      v1 = v10;
      v1x = v10x;
      v1y = v10y;
      p2.pos.x = p2x;
      p2.pos.y = p2y;
      p2.pos.z = p2z;
      v2 = v20;
      v2x = v20x;
      v2y = v20y;
      compute_cm();
      cm.pos.x = xcm;
      cm.pos.y = ycm;
      v1x = v10x;
      v1y = v10y;
      v1 = v10;
      v2x = v20x;
      v2y = v20y;
      v2 = v20;
      arr_v1.pos = vec(p1.pos.x, p1.pos.y, z0);
      arr_v1.axis = vec(v1x, v1y, z0);
      arr_v1.length = abs(vFac * v1);
      arr_v2.pos = vec(p2.pos.x, p2.pos.y, z0);
      arr_v2.axis = vec(v2x, v2y, z0);
      arr_v2.length = abs(vFac * v2);
      txt_x1.text = x1;
      txt_y1.text = y1;
      txt_x2.text = x2;
      txt_y2.text = y2;
      txt_u1x.text = v1x;
      txt_u1y.text = v1y;
      txt_u2x.text = v2x;
      txt_u2y.text = v2y;
      txt_v1x.text = v1x;
      txt_v1y.text = v1y;
      txt_v2x.text = v2x;
      txt_v2y.text = v2y;
    }
    function bwd() {
      bStop = false;
      nRun = 1;
    }
    function fwd() {
      bStop = false;
      nRun = 2;
    }
    function stop() {
      bStop = true;
      nRun = 3;
    }
    function run() {
      bStop = !bStop;
      nRun = 4;
    }

    function compute_cm() {
      xcm = (1 / (m1 + m2)) * (m1 * p1.pos.x + m2 * p2.pos.x);
      ycm = (1 / (m1 + m2)) * (m1 * p1.pos.y + m2 * p2.pos.y);
    }
    /*--------------------------------------------------------------------------------------------------------------------------- cTest ---*/

    function cTest() {
      var dx = p1.pos.x - p2.pos.x;
      var dy = p1.pos.y - p2.pos.y;
      var dist = sqrt(dx * dx + dy * dy);

      if (dist < d) {
        // Bevegelsesmengde i x og y-kompenent
        var bevegMeng_x = m1 * v1x + m2 * v2x;
        var bevegMeng_y = m1 * v1y + m2 * v2y;

        // Fart rett etter kollisjon
        var fartRettEtter_x = bevegMeng_x / (m1 + m2);
        var fartRettEtter_y = bevegMeng_y / (m1 + m2);

        // Siden kulene henger sammen, vil fartsvektorene ha samme x og y kompenenter
        v1x = v2x = fartRettEtter_x;
        v1y = v2y = fartRettEtter_y;

        // Place p1 and p2 at the point of collision
        var theta = atan2(dy, dx);
        p1.pos.x = p2.pos.x + cos(theta) * d;
        p1.pos.y = p2.pos.y + sin(theta) * d;

        // Lagrer verdier rett etter kollisjon
        txt_u1x.text = v1x;
        txt_u1y.text = v1y;
        txt_u2x.text = v2x;
        txt_u2y.text = v2y;
      }
    }
    /*----------------------------------------------------------------------------------------------------------------------------- sim ---*/

    function act_sim() {
      if (!bStop && nRun == 4) {
        nTime = nTime + dt;
        moveObj();
      } else if (!bStop && nRun == 3) {
        bStop = true;
      } else if (!bStop && nRun == 2) {
        nTime = nTime + dt;
        bStop = true;
        moveObj();
      } else if (!bStop && nRun == 1) {
        nTime = nTime - dt;
        bStop = true;
        moveObj();
      } else if (nRun == 0) {
        nTime = 0;
        // moveObj();
      }
      txt_t.text = nTime;
    }

    function moveObj() {
      var x = p1.pos.x;
      var y = p1.pos.y;
      cTest();
      compute_cm();
      v1y += g * dt;
      v2y += g * dt;
      p1.pos.x = p1.pos.x + v1x * dt;
      p1.pos.y = p1.pos.y + v1y * dt;
      p2.pos.x = p2.pos.x + v2x * dt;
      p2.pos.y = p2.pos.y + v2y * dt;
      cm.pos.x = xcm;
      cm.pos.y = ycm;
      arr_v1.pos = vec(p1.pos.x, p1.pos.y, z0);
      arr_v1.axis = vec(v1x, v1y, z0);
      arr_v1.length = abs(vFac * Math.hypot(v1x, v1y));
      arr_v2.pos = vec(p2.pos.x, p2.pos.y, z0);
      arr_v2.axis = vec(v2x, v2y, z0);
      arr_v2.length = abs(vFac * Math.hypot(v2x, v2y));

      // Display new speed components
      txt_v1x.text = v1x;
      txt_v1y.text = v1y;
      txt_v2x.text = v2x;
      txt_v2y.text = v2y;

      // Display new position components
      txt_x1.text = p1.pos.x;
      txt_y1.text = p1.pos.y;
      txt_x2.text = p2.pos.x;
      txt_y2.text = p2.pos.y;
    }
    /*.............................................................................................................................. run ...*/

    var start = clock();
    while (true) {
      var t = clock() - start;
      act_sim();
      await scene.waitfor("redraw");
    }
  }
  $(function () {
    window.__context = {
      glowscript_container: $("#glowscript").removeAttr("id"),
    };
    __main__();
  });
})();

/*========================================================================================================================================*/
