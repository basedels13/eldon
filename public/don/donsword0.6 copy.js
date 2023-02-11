//v5:カンの実装を諦めた世界線の続き
//サウンドオプションとスキル実装
//next:cpuのスキル、プレイガイド、セーブ、実績？、マスロ1つくらい
window.onload = function(){
draw();
};

function draw(){
  var mouseX;
	var mouseY;
  var title = "ロナン";
  var mute="ON"
  var alpha = 0;
  var loadstate=0;
	var pcname = "プレイヤー";
	const canvas = document.getElementById("canvas0");//ベースレイヤ。背景、置物
  var canvas1 = document.getElementById("canvas1");//立ち絵,捨てパイ
  var canvas2 = document.getElementById("canvas2");//パイ、ボタン
	var canvas3 = document.getElementById("canvas3");//カーソル、
	var canvas4 = document.getElementById("canvas4");//残パイ、アニメーション用
  var canvas6 = document.getElementById("canvas6");//パイの一覧表用
  var canvas5 = document.getElementById("canvas5");//カーソルのアニメーション用

	if ( ! canvas || ! canvas.getContext ) { return false; }
	var cx = canvas.getContext("2d");
  var cx1 = canvas1.getContext("2d");
  var cx2 = canvas2.getContext("2d");
  var cx3 = canvas3.getContext("2d");
  var cx4 = canvas4.getContext("2d");
  var cx6 = canvas6.getContext("2d");
  var cx5 = canvas5.getContext("2d");
  //cx6.globalAlpha=0;

  class Music extends Howl {
    constructor (data, debugStart=0) {
      const params = {
        src: [data.src],
        volume:[data.volume]*vBar,
        preload: false,
        // オーデイオスプライト設定
        sprite: {
          start: [debugStart, data.loopEnd-debugStart],
          loop: [data.loopStart, data.loopEnd - data.loopStart, true],
        },
      };
      super(params);
      this.load();
    }
    playMusic () {
      this.play("start");
      this.once('end', ()=> {
        console.log('bgm loop!');
        this.play("loop");
      });
    }
  }

var LP =new Array(0,75000,75000,75000,75000);
//LP[0]:0->半荘150000/スキルあり 1->半荘300000/スキルあり 2->ミリオネア 3->無限を予定
//6-9:ベルドレイド？
var LPtemp=new Array(0,0,0,0,0)
var chara =new Array(0,3,1,2,1)
//chara0 0->cpuランダム 1->cpu決める
var cputype=new Array(0,0,0,0,0)
var typerand=new Array(0,0,0,0,0)
//覚醒ゲージ0-30
var DP =new Array(0,0,0,0,0)
//バフ 1スキン 2マナシールド 3ネイチャ 4ナソコア 5ほうせんきょ 6凍結
var Buff =new Array(0,[],[],[],[])
var mode=0
var musicnum=0
var musicset=new Array(3,4,6);
//通常時、自分の立直時、オーラス時
var vBar=1;
var sBar=1;
var sBartemp=0;
//音量調節機能を追加
var auras=0;
//オーラスの時1　現在音楽のみに影響
var Ronturn=[];
//データベース
var raidlog=new Array(0,300000,0,0);//与ダメ、受ダメ、その他個別用、コンテニュー
var raidscore=new Array(0,0,0)
var LPlist=new Array("150000","300000","ミリオネア","∞")
var musiclist=new Array("test","夜の迷宮の入口","決闘のテーマ","盲目のアストライア","The Evil Sacrifice Archenemies","Nine Jack","ロベリア")
var chrlist=new Array("名無しさん","エルス","アイシャ","レナ")//,"レイヴン","エド","アラ","ラビィ")
var chrimg_src= new Array("Don_chara0.png","Don_chara1.png","Don_chara2.png","Don_chara3.png");
var atrbute_src= new Array("Don_DP.png","Duel_mana.png","Duel_sun.png","Duel_aqua.png","Duel_wind.png","Duel_moon.png","Duel_gaia.png","Duel_heat.png","Don_HA.png");
var tour=new Array(1,"1回戦")
//push"準決勝","決勝","ランダム"
var bgimg_src=new Array(1,"Don_bg1.png","elimg2.png","stadium2.png");
//説明用
var epic_src =new Array("elstudio_bg1.png","Don_epic1.png","Don_epic2.png","Don_epic3.png","Don_epicline.png");
//裏＆ツモロンボタン
var eltearB_src =new Array( "Don_img0.png","Don_tumoA.png","Don_tumoB.png","Don_tumoC.png","Don_tumoD.png");
var eltear= new Image();
//donpaiのidは0から始まるためそのまま
var eltear_src = new Array("Don_img1.png","Don_img2.png","Don_img3.png","Don_img4.png","Don_img5.png","Don_img6.png","Don_img7.png","Don_img8.png","Don_img9.png","Don_img10.png",);
eltear_src.push("Don_img11.png","Don_img12.png","Don_img13.png","Don_img14.png","Don_img15.png","Don_img16.png","Don_img17.png","Don_img18.png","Don_img19.png","Don_img20.png",);
eltear_src.push("Don_img21.png","Don_img22.png","Don_img23.png","Don_img24.png","Don_img25.png","Don_img26.png","Don_img27.png","Don_img28.png","Don_img29.png","Don_img30.png",);
eltear_src.push("Don_img31.png","Don_img32.png","Don_img33.png","Don_img34.png","Don_img35.png","Don_img36.png","Don_img37.png","Don_img38.png","Don_img39.png","Don_img40.png",);
eltear_src.push("Don_img41.png","Don_img42.png","Don_img43.png","Don_img44.png","Don_img45.png");
  console.log(eltear_src.length);
//expected 45
var win_src= new Array("win1.png","win1.png","win2.png","win3.png","win4.png","win5.png","win6.png","wintumo.png","winron.png","winreach.png");
var musiclistDT=[
{title:"0",elia:"0",nod:"0"},
{title:"夜の迷宮の入口",elia:"提供",nod:"『夜の迷宮』のイントロのイメージ"},
{title:"決闘のテーマ",elia:"提供",nod:"エルソードの決闘のイメージ"},
{title:"盲目のアストライア",elia:"ISAo",nod:"@ DOVA-SYNDROM"},
{title:"The Evil Sacrifice Archenemies",elia:"ISAo",nod:"@ DOVA-SYNDROM"},
{title:"Nine Jack",elia:"まんぼう二等兵",nod:"@ DOVA-SYNDROM"},
{title:"ロベリア",elia:"まんぼう二等兵",nod:"@ DOVA-SYNDROM"},
]
var skilltext=[{fir:"0",sec:"0",thr:"0"},
{fir:"フレイムガイザー",sec:"FLAME GEYSER",thr:"0"},
{fir:"メモライズ",sec:"MEMORIZE",thr:"0"},
{fir:"フリージングアロー",sec:"FREEZING ARROW",thr:"0"},
]
//name->キャラsub->職、役判定で使用　line->ライン役判定に使用 0->all　color->1234567陽水風月土火E 0->all
//都合によりロゼを最後に
var donpai=[
{name:"エルス",sub:"ナイトエンペラー",line:1,color:1},
{name:"エルス",sub:"ルーンマスター",line:2,color:1},
{name:"エルス",sub:"イモータル",line:3,color:1},
{name:"アイシャ",sub:"エーテルセイジ",line:1,color:2},
{name:"アイシャ",sub:"オズソーサラー",line:2,color:2},
{name:"アイシャ",sub:"メタモルフィ",line:3,color:2},
{name:"レナ",sub:"アネモス",line:1,color:3},
{name:"レナ",sub:"デイブレイカー",line:2,color:3},
{name:"レナ",sub:"トワイライト",line:3,color:3},
{name:"レイヴン",sub:"フューリアスブレード",line:1,color:0},
{name:"レイヴン",sub:"レイジハーツ",line:2,color:0},
{name:"レイヴン",sub:"ノヴァインペラトル",line:3,color:0},
{name:"イヴ",sub:"コードアルティメイト",line:1,color:4},
{name:"イヴ",sub:"コードエセンシア",line:2,color:4},
{name:"イヴ",sub:"コードサリエル",line:3,color:4},
{name:"ラシェ",sub:"コメットクルセイダー",line:1,color:2},
{name:"ラシェ",sub:"フェイタルファントム",line:2,color:2},
{name:"ラシェ",sub:"センチュリオン",line:3,color:2},
{name:"アラ",sub:"飛天",line:1,color:5},
{name:"アラ",sub:"黒闇天",line:2,color:5},
{name:"アラ",sub:"羅天",line:3,color:5},
{name:"エリシス",sub:"エンパイアソード",line:1,color:6},
{name:"エリシス",sub:"フレイムロード",line:2,color:6},
{name:"エリシス",sub:"ブラッディクイーン",line:3,color:6},
{name:"エド",sub:"ドゥームブリンガー",line:1,color:4},
{name:"エド",sub:"ドミネーター",line:2,color:4},
{name:"エド",sub:"マッドパラドックス",line:3,color:4},
{name:"ルシエル",sub:"カタストロフィ",line:1,color:6},
{name:"ルシエル",sub:"イノセント",line:2,color:6},
{name:"ルシエル",sub:"ディアンゲリオン",line:3,color:6},
{name:"アイン",sub:"リヒター",line:1,color:7},
{name:"アイン",sub:"ブルーヘン",line:2,color:7},
{name:"アイン",sub:"ヘルシャー",line:3,color:7},
{name:"ラビィ",sub:"エタニティーウィナー",line:1,color:5},
{name:"ラビィ",sub:"ラディアントソウル",line:2,color:5},
{name:"ラビィ",sub:"ニーシャラビリンス",line:3,color:5},
{name:"ノア",sub:"リベレーター",line:1,color:7},
{name:"ノア",sub:"セレスティア",line:2,color:7},
{name:"ノア",sub:"ニュクスピエタ",line:3,color:7},
{name:"ロゼ",sub:"テンペストバスター",line:1,color:3},
{name:"ロゼ",sub:"ブラックマッサーカー",line:2,color:3},
{name:"ロゼ",sub:"ミネルヴァ",line:3,color:3},
{name:"ロゼ",sub:"プライムオペレーター",line:4,color:3},
{name:"アリエル",sub:"コボ",line:0,color:0},
{name:"ルリエル",sub:"コボ",line:0,color:0},
]
for(var i=0; i<donpai.length;i++){
  donpai[i].id=i;
}
console.log(donpai.length);//45
var handE1= new Image();
var handE2= new Image();
var handE3= new Image();
var handE4= new Image();
var handE5= new Image();
var handE6= new Image();
var handE7= new Image();
var handE8= new Image();
var handE9= new Image();
var handE10= new Image();//カンで追加される分
var handE11= new Image();//カンで追加される分
var etitle= new Image();
var e1= new Image();
var e2= new Image();
var e3= new Image();
//メニュー用
var e4= new Image();
var e5= new Image();
//handgraphで使用
var e6= new Image();

var e7= new Image();
//ドラ
var e8= new Image();
//アガリ牌描画
var e9= new Image();
//リーチの待ちパイ、cpuのpon
//メニューウインドウ
var e10= new Image();
//背景
var BGimg=new Image();
var DPimg=new Image();
var e11= new Image();
var e12= new Image();
var e13= new Image();
var e14= new Image();
//立ち絵
var e15= new Image();
var e16= new Image();
var e17= new Image();
//ツモロンの時の表示に
var e18= new Image();
var e19= new Image();
var epic= new Image();
//ツモロンボタン
var skilltext1
var skilltext2
var skilltext3
//山札と画像と手札
var deck=[]
//王牌
var king=[]
var dora=[]
//手札.hand1[0]==-1 ron -2 tumo -3上がり判定、
var hand1=[]
var hand2=[]
var hand3=[]
var hand4=[]
var handtemp=[]
hand1=Array(10).fill(0);
hand1[0]=-1;
//ポンポポン
var ponsw=[0,0,0,0,0]
var poncpu=[0,0,0,0,0]
var pon1=[];
var pon2=[];
var pon3=[];
var pon4=[];
var kansw=[0,0,0,0,0]
//1->カンできるよ 2->カンした直後だよ
var kansw2=[0,0,0,0,0]
//sw2はカンした回数
//描画用
var reachhand=[];
//console.log(hand1.length,hand1);
//ツモロン判定用
//cpuの思考用
var Cpuhandtemp=[]
var cpuwant =0
//初手の積み込み用
var hand1b =new Array

var trash1=[]
var trash2=[]
var trash3=[]
var trash4=[]
//捨て牌
var c1=0
//playerで使われている=>ctl[1]
//var c2=0;var c3=0;var c4=0
//cpuのインターバルをクリアするスイッチはctlを使用
var ctl=new Array(0,0,0,0,0)
var ctlerror=new Array(0,0,0,0,0)
var ctlswitch
var cLock=1
var opLock=0;
//残パイ確認・役確認等用
var handsort=0;
//0->ID順、1->職ライン順
//0->操作不可 1 2 3
var nodyaku=[]
var ElnameM=0;//説明枠を省略する
var rootscore=0
var score =0
var fu =0
var han =new Array(0,0,0,0,0)
var reach =new Array(0,0,0,0,0)
//reach 1->リーチできます 2->リーチします　3->リーチ中 1,2ならパイを切った後に0に
var ippatu =new Array(0,0,0,0,0)
var rorder =new Array(0,0,0,0,0)
var porder =new Array(0,0,0,0,0)
//捨て牌の座標
var riverx=new Array(0,120,120,120,120)
var rivery=new Array(0,400,100,200,300)
var counter=new Array(0,0,0,0,0)
//スペシャルスキル関連
var skillswitch=new Array(0,0,0,0,0)
var skillusage=new Array(0,0,0,0,0)
//ここまで局ごとに初期化=>deckh
var skillusage2=new Array(0,0,0,0,0,0)
//skillusage2[0][5]=>何局目か数える
var startTime=0
var clearTime=0
var thinkTime=0
var timevalue=0
var timerw=150
var hand1x=0
var hand2x=0
var hand3x=0
var hand4x=0
var hand1y=500
//自分の手札描画用の座標
var size=70
var sizey=93
var pagestate=0
var msgstate=0
var gamestate =10;
//-1=>tumoronで使用,クリックさせたくない時 0=>クリックで1に,ゲームをしてない時 1=>game中 2=>クリックで0に,ツモのアニメーション 3=>ゲームオーバー、タイトルに戻るなどする 10=>麻雀をしていない
var turn =0
var turntemp
var parent=0
var dorax=0
var loopX
var loopX2
//var looptype
var parentY
var tumo
var tumo2
//cpuのtumoを変数変えた方が良さそう
//捨て牌
var tumotemp
//ツモロンボタン
var TRswitch=0;
//cputumoで使用
var r4=0

var se1 = new Howl({
src:"decision9.mp3",
volume: 0.25,
});
var se2 = new Howl({
  src:"cancel3.mp3",
      volume: 0.4,
    });
var se3 = new Howl({
  src:"decision32.mp3",
      volume: 0.3,
    });
var se4 = new Howl({
  src:"card-flip.mp3",
      volume: 0.3,
    });
var se5 = new Howl({
  src:"decision47.mp3",
  volume: 0.2,
    });
var se6 = new Howl({
  src:"news_title3.mp3",
  volume: 0.25,
  });
var se7 = new Howl({
  src:"K.O..mp3",
  volume: 0.18,
  });
var se8 = new Howl({
  src:"jidaigeki3.mp3",
  volume: 0.2,
  });
var se9 = new Howl({
  src:"scene2.mp3",
  volume: 0.3,
  });
var se10 = new Howl({
  src:"rinbell.mp3",
  volume: 0.3,
  });
var se11 = new Howl({
  src:"shufflecard2.mp3",
  volume: 0.3,
  });
var se12 = new Howl({
  src:"decision18.mp3",
  volume: 0.2,
  });
const bgm1data ={
    src: "nishaint.mp3",
    loopStart: 6460,
    loopEnd: 44870,
    volume: 0.4,
  };
const bgm2data ={
  src: "Duel_li.mp3",
  loopStart: 11200,
  loopEnd: 112250,
  volume: 0.45,
};
const bgm3data ={
  src: "盲目のアストライア.mp3",
  loopStart: 0,
  loopEnd: 98000,
  volume: 0.12,
};
const bgm4data ={
  src: "The_Evil_Sacrifice_Archenemies.mp3",
  loopStart: 0,
  loopEnd: 100000,
  volume: 0.1,
};
const bgm5data ={
  src: "Nine_Jackshort.mp3",
  loopStart: 0,
  loopEnd: 181000,
  volume: 0.1,
};
const bgm6data ={
  src: "ロベリア.mp3",
  loopStart: 0,
  loopEnd: 169000,
  volume: 0.07,
};
  var Bgm=new Music(bgm1data);
var musicnum=0

var donX=10;
var donY=100;
var loadmax=51;
DPimg.src=atrbute_src[0];
etitle.src="Don_title.png";
BGimg.src=bgimg_src[1]
BGimg.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
loadstate+=1;
}
epic.src=epic_src[0]
epic.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
loadstate+=1;
epic.src=epic_src[1]
epic.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
loadstate+=1;
epic.src=epic_src[2]
epic.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
loadstate+=1;
epic.src=epic_src[3]
epic.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
loadstate+=1;
epic.src=epic_src[4]
epic.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
loadstate+=1;
}}}}}
eltear.src=eltear_src[0]
eltear.onload=function(){
cx3.fillStyle = "#e4e4e4";
cx6.drawImage(eltear,donX,donY,60,78)
donX+=60;
loadstate+=1;
cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[1]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[2]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[3]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[4]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[5]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[6]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[7]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[8]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[9]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX=10;
  donY+=78
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[10]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
console.log("harmony!");
eltear.src=eltear_src[11]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[12]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[13]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[14]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[15]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[16]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[17]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
console.log("critical!")
eltear.src=eltear_src[18]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[19]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX=10;
  donY+=78
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[20]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[21]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[22]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[23]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[24]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[25]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[26]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[27]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[28]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[29]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX=10;
  donY+=78
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[30]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[31]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[32]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[33]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
console.log("destroy!")
eltear.src=eltear_src[34]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[35]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[36]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[37]
eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadstate+=1;
  cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[38]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[39]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX=10;
    donY+=78
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[40]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[41]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[42]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[43]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
eltear.src=eltear_src[44]
	eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    loadstate+=1;
    cx3.fillRect(100, 200, loadstate/loadmax*600, 50);
 console.log("beteran!",loadstate)
cx6.globalAlpha=0;
//cx5.drawImage(canvas6,0,0,800,600);
cx3.fillStyle = "rgb(0,0,0)";
cx3.fillRect(0, 0, 800, 600);
cx3.fillStyle = "#007fd9";
cx3.fillRect(100, 200, 600, 50);
cx3.font = "24px 'Century Gothic'";
cx3.fillStyle = "#e4e4e4";
　cx3.fillText( "画面をクリック（音が出ます）",240,360)
  }}}}}}}}}}
}}}}}}}}}}
  }}}}}}}}}}
}}}}}}}}}}
}}}}}

if(loadstate <50){
  cx3.fillStyle = "rgb(0,0,0)";
cx3.fillRect(0, 0, 800, 600);
cx3.font = "24px 'Century Gothic'";
cx3.fillStyle = "#e4e4e4";
　cx3.fillText( "Now Loading…",300,360)
}
	canvas5.onmousemove = mouseMoveListener;
	function mouseMoveListener(e) {
		var rect = e.target.getBoundingClientRect();
		mouseX = Math.floor(e.clientX - rect.left);
		mouseY = Math.floor(e.clientY - rect.top);
		cx3.clearRect(710, 10, 80, 38);
		cx3.fillStyle = "#ffffff";
		cx3.font = "12px Arial";
      cx3.fillText("X座標：" + mouseX, 712, 22);
      cx3.fillText("Y座標：" + mouseY, 712, 34);
      cx3.fillText("Lock：" + cLock, 712, 46);
        //カーソル
      corsor();
	}
  canvas5.addEventListener("mousedown", mouseDownHandler, false);
	function mouseDownHandler(e) {
 		var rect = e.target.getBoundingClientRect();
 		mouseX =  Math.floor(e.clientX - rect.left);
		mouseY =  Math.floor(e.clientY - rect.top);
      console.log('mousedown!',cLock)
		if(mouseX>710 && mouseX <790){
          if(mouseY>10 && mouseY<48){
            //for debug
            se1.volume(0);
            se2.volume(0);
            se3.volume(0);
            se4.volume(0);
            se5.volume(0);
            se6.volume(0);
            se7.volume(0);
            se8.volume(0);
            se9.volume(0);
            se10.volume(0);
            se11.volume(0);
            se12.volume(0);
            console.log(cx5.globalAlpha,cLock);
            cx5.clearRect(710, 10, 80, 38);
            cx5.globalAlpha = 1;
            if(cLock==0){
              cLock=1;
            }
    //ミュートの切り替え
  if( mute=="OFF" ){
    se1.volume(0.25*sBar);
    se2.volume(0.4*sBar);
    se3.volume(0.3*sBar);
    se4.volume(0.3*sBar);
    se5.volume(0.2*sBar);
    se6.volume(0.25*sBar);
    se7.volume(0.18*sBar);
    se8.volume(0.2*sBar);
    se9.volume(0.3*sBar);
    se10.volume(0.3*sBar);
    se11.volume(0.3*sBar);
    se12.volume(0.2*sBar);
    Bgm.mute(false);
    switch (musicnum){
      case 1:
        Bgm =new Music(bgm1data);
        Bgm.playMusic();
        break;
      case 2:
        Bgm =new Music(bgm2data);
        Bgm.playMusic();
      break;
      case 3:
        Bgm =new Music(bgm3data);
        Bgm.playMusic();
      break;
      case 4:
        Bgm =new Music(bgm4data);
        Bgm.playMusic();
      break;
      case 5:
        Bgm =new Music(bgm5data);
        Bgm.playMusic();
      break;
      case 6:
        Bgm =new Music(bgm6data);
        Bgm.playMusic();
      break;
      default:
        console.log(musicnum,'bgm error!')
        Bgm.stop();
    }
    mute="ON";
    }else{
    Bgm.mute(true);
    Bgm.stop();
    mute="OFF";
        console.log(musicnum,'bgm muted!')
    }
  cx.clearRect(710, 10, 80, 38);
  cx.font = "12px Arial";
  cx.fillText("SOUND", 710, 22);
  cx.font = "Bold 24px Arial";
  cx.fillText( mute, 730, 42);
        }};
        //クリックした場所を教える
        var r=2;
        var alphaS=1;
        cx5.lineWidth=3
        cx5.strokeStyle = "#fff596";
        var sx=mouseX
        var sy=mouseY
        window.requestAnimationFrame(circle)
        function circle(){
          if(alphaS > 0){
            cx5.clearRect(0,0,800,600);
            cx5.globalAlpha =alphaS
            cx5.beginPath();
            cx5.arc(sx,sy,r, 0, 2 * Math.PI, false)
            cx5.stroke();
            alphaS -= 3/60
            r=1+r+1/r
            window.requestAnimationFrame(circle)
          }else{
        cx5.clearRect(0,0,800,600);
}}
if(gamestate==10){
  //メニュー画面
  Menu();
  function Menu(){
switch(pagestate){
  case 0:
    musicnum=0;
    Bgm.stop();
    se1.play();
    e4.src=eltearB_src[0]
    e4.onload=function(){
    pagestate=1
    cx.clearRect(0,0,800,600)
    cx1.clearRect(0,0,800,600)
    cx2.clearRect(0,0,800,600)
    cx3.clearRect(0,0,800,600)
    BGimg.src=bgimg_src[1]
    BGimg.onload=function(){
    cx.drawImage(BGimg,0,0,800,600);
    cx.clearRect(0,520,800,70)
    cx1.drawImage(e4,80,80,300,400)
    cx1.drawImage(etitle,90,0,660,220)
    cx1.font = "32px 'Century Gothic'";
     cx1.fillStyle = "black";
    cx1.fillText( "Ｍ Ｅ Ｎ Ｕ",150,130)
    cx1.font = "28px 'Century Gothic'";
    cx1.fillStyle = "black";
    cx1.textAlign = "center";
    cx1.fillText( "プレイガイド",230,200)
    cx1.fillText( "フリーバトル",230,250)
    //cx1.fillText( "マスターロード",230,300);
    cx1.fillText( "オプション",230,350);
    cx1.fillText( "セーブ",230,400);
    cx1.textAlign = "start";
    corsor();
    }}
    break;
    case 1:
      if(mouseX >80 && mouseX <380){
        if(mouseY >210 && mouseY <260){//自由
          pagestate=3
  //if(chara[1]>6){chara[1]=0}
  se1.play();
  e10.src=chrimg_src[chara[1]]
  e10.onload=function(){
  cx2.drawImage(e10,400,0,350,510,10,0,350,510)
  cx1.fillStyle = "rgba(20,20,20,0.7)";
  cx1.fillRect(0,0,800,510)
  cx1.drawImage(e4,370,10,357,480)
  cx2.fillStyle = "black";
  cx2.font = "26px 'Century Gothic'";
  cx2.fillText("　ルール",390,100)
  cx2.font = "24px 'Century Gothic'";
  cx2.fillText("◀ "+LPlist[LP[0]],520,100)
  cx2.fillText("プレイヤー",390,150)
  cx2.fillText("ＣＰＵ設定",390,200)
  cx2.fillText("◀ "+chrlist[chara[1]],520,150);
  cx2.fillText(" ▶",670,100)
  cx2.fillText(" ▶",670,150)
  if(chara[0]==0){
  cx2.fillText("✓おまかせ",520,200);
  cx2.fillStyle = "rgba(0,0,0,0.4)";
  }else{
  cx2.fillText("　おまかせ",520,200)
  cx2.fillStyle = "black";
  }
  cx2.font = "24px 'Century Gothic'";
  cx2.fillText("ＣＰＵ１",390,250)
  cx2.fillText("ＣＰＵ２",390,290)
  cx2.fillText("ＣＰＵ３",390,330)
  cx2.fillText("◀ "+chrlist[chara[2]],520,250)
  cx2.fillText("◀ "+chrlist[chara[3]],520,290)
  cx2.fillText("◀ "+chrlist[chara[4]],520,330)
  cx2.fillText(" ▶",670,250)
  cx2.fillText(" ▶",670,290)
  cx2.fillText(" ▶",670,330)
  drawbuttom2(470,410,"START！")
        }}
        if(mouseY >310 && mouseY <360){//オプション
          se1.play();
          cx1.fillStyle = "rgba(20,20,20,0.7)";
          cx1.fillRect(0,0,800,510)
          cx1.drawImage(e4,370,10,390,500)
          drawbuttom(690,200,"Play",0,60,40)
          drawbuttom(690,270,"Play",0,60,40)
          drawbuttom(690,340,"Play",0,60,40)
          cx2.fillStyle = "black";
          cx2.font = "26px 'Century Gothic'";
          cx2.fillText("音量設定",390,100)
          cx2.font = "24px 'Century Gothic'";
          cx2.fillText("BGM(0-7)",430,130)
          cx2.fillText("SE(0-7)",430,160)
          cx2.fillText("フリーバトルBGM設定",390,200)
          cx2.fillText("◀ "+Math.floor(vBar*5)+" ▶",580,130)
          cx2.fillText("◀ "+Math.floor(sBar*5)+" ▶",580,160)
          cx2.fillText("通常",430,230)
          cx2.fillText("リーチ",430,300)
          cx2.fillText("オーラス",430,370)
          cx2.font = "20px 'Century Gothic'";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[0]],560,260)
          cx2.fillText(musiclist[musicset[1]],560,330)
          cx2.fillText(musiclist[musicset[2]],560,400)
          cx2.textAlign = "start";
          cx2.fillText("◀ ",380,260)
          cx2.fillText("◀ ",380,330)
          cx2.fillText("◀ ",380,400)
          cx2.fillText(" ▶",720,260)
          cx2.fillText(" ▶",720,330)
          cx2.fillText(" ▶",720,400)
          pagestate=2;
            }
      }
    break;
    case 3:
      //フリバへ
      if(mouseX >80 && mouseX <380 && mouseY >80 && mouseY <480){
        //se3.play();
        pagestate=0;
        Menu();
      }
      if(mouseX >470 && mouseX <640 && mouseY >410 && mouseY <470){
      gamestate=1;
      Bgm =new Music(bgm2data);
      musicnum=2;
      //bgm1.fade(0, 0.4, 100);
      bgimg_src[0]=1
      Setup();
      }
      if(mouseX >510 && mouseX <560 && mouseY >80 && mouseY <110){
      se3.play();
      if(LP[0]==0){LP[0]=LPlist.length-1}else{LP[0]-=1}
      cx2.font = "24px 'Century Gothic'";
      cx2.fillStyle = "black";
      cx2.clearRect(510,80,170,26)
      cx2.fillText("◀ "+LPlist[LP[0]],520,100)
      }
      if(mouseX >670 && mouseX <705 && mouseY >80 && mouseY <110){
        se3.play();
        if(LP[0]==LPlist.length-1){LP[0]=0}else{LP[0]+=1}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(510,80,170,26)
        cx2.fillText("◀ "+LPlist[LP[0]],520,100)
        }
      if(mouseX >510 && mouseX <560 && mouseY >130 && mouseY <160){
        se3.play();
        if(chara[1]==0){chara[1]=chrlist.length-1}else{chara[1]-=1}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(510,130,170,26)
        cx2.fillText("◀ "+chrlist[chara[1]],520,150);
        e10.src=chrimg_src[chara[1]]
        e10.onload=function(){
        cx2.clearRect(10,0,350,510);
        cx2.drawImage(e10,400,0,350,510,10,0,350,510)
        }
        }
      if(mouseX >670 && mouseX <705 && mouseY >130 && mouseY <160){
        se3.play();
        if(chara[1]==chrlist.length-1){chara[1]=0}else{chara[1]+=1}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(510,130,170,26)
        cx2.fillText("◀ "+chrlist[chara[1]],520,150);
        e10.src=chrimg_src[chara[1]]
        e10.onload=function(){
        cx2.clearRect(10,0,350,510);
        cx2.drawImage(e10,400,0,350,510,10,0,350,510)
        }
        }
      if(mouseX >520 && mouseX <650 && mouseY >175 && mouseY <205){
        se3.play();
        if(chara[0]==0){chara[0]=1}else{chara[0]=0};
        cx2.clearRect(515,180,130,30)
        cx2.clearRect(380,220,330,120)
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        if(chara[0]==0){
          cx2.fillText("✓おまかせ",520,200);
          cx2.fillStyle = "rgba(0,0,0,0.4)";
          }else{
          cx2.fillText("　おまかせ",520,200)
          cx2.fillStyle = "black";
          }
          cx2.font = "24px 'Century Gothic'";
          cx2.fillText("ＣＰＵ１",390,250)
          cx2.fillText("ＣＰＵ２",390,290)
          cx2.fillText("ＣＰＵ３",390,330)
          cx2.fillText("◀ "+chrlist[chara[2]],520,250)
          cx2.fillText("◀ "+chrlist[chara[3]],520,290)
          cx2.fillText("◀ "+chrlist[chara[4]],520,330)
          cx2.fillText(" ▶",670,250)
          cx2.fillText(" ▶",670,290)
          cx2.fillText(" ▶",670,330)
      }
      if(mouseX >670 && mouseX <705 && mouseY >230 && mouseY <260){
        if(chara[0]==1){
        se3.play();
        if(chara[2]==chrlist.length-1){chara[2]=0}else{chara[2]+=1}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(510,230,170,26)
        cx2.fillText("◀ "+chrlist[chara[2]],520,250);
        }
        }
      if(mouseX >670 && mouseX <705 && mouseY >270 && mouseY <300){
        if(chara[0]==1){
        se3.play();
        if(chara[3]==chrlist.length-1){chara[3]=0}else{chara[3]+=1}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(510,270,170,26)
        cx2.fillText("◀ "+chrlist[chara[3]],520,290);
        }
        }
      if(mouseX >670 && mouseX <705 && mouseY >310 && mouseY <340){
        if(chara[0]==1){
        se3.play();
        if(chara[4]==chrlist.length-1){chara[4]=0}else{chara[4]+=1}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(510,310,170,26)
        cx2.fillText("◀ "+chrlist[chara[4]],520,330);
        }
        }
        if(mouseX >510 && mouseX <560 && mouseY >230 && mouseY <260){
          if(chara[0]==1){
          se3.play();
          if(chara[2]==0){chara[2]=chrlist.length-1}else{chara[2]-=1}
          cx2.font = "24px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.clearRect(510,230,170,26)
          cx2.fillText("◀ "+chrlist[chara[2]],520,250);
          }
          }
        if(mouseX >510 && mouseX <560 && mouseY >270 && mouseY <300){
          if(chara[0]==1){
          se3.play();
          if(chara[3]==0){chara[3]=chrlist.length-1}else{chara[3]-=1}
          cx2.font = "24px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.clearRect(510,270,170,26)
          cx2.fillText("◀ "+chrlist[chara[3]],520,290);
          }
          }
        if(mouseX >510 && mouseX <560 && mouseY >310 && mouseY <340){
          if(chara[0]==1){
          se3.play();
          if(chara[4]==0){chara[4]=chrlist.length-1}else{chara[4]-=1}
          cx2.font = "24px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.clearRect(510,310,170,26)
          cx2.fillText("◀ "+chrlist[chara[4]],520,330);
          }
          }
    corsor();
    break;
    case 2:
      //オプション画面
      if(mouseX >80 && mouseX <380 && mouseY >80 && mouseY <480){
        //se3.play();
        if(musicnum!==0){
        musicnum=0;
        Bgm.fade(0.05*vBar, 0, 500);
        Bgm.on("fade", ()=>{
        Bgm.stop();
        });
        }
        pagestate=0;
        Menu();
      }
      if(mouseX >570 && mouseX <610 && mouseY >100 && mouseY <135){
        se3.play();
        if(vBar<=0.2){vBar=0}else{vBar-=0.2}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(578,105,80,26)
        cx2.fillText("◀ "+Math.floor(vBar*5)+" ▶",580,130)
        }
      if(mouseX >620 && mouseX <660 && mouseY >100 && mouseY <135){
        se3.play();
        if(vBar>=1.4){vBar=1.4}else{vBar+=0.2}
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(578,105,80,26)
        cx2.fillText("◀ "+Math.floor(vBar*5)+" ▶",580,130)
        }
      if(mouseX >570 && mouseX <610 && mouseY >135 && mouseY <170){
        if(sBar<=0.2){sBar=0}else{sBar-=0.2}
        se1.volume(0.25*sBar);
        se2.volume(0.4*sBar);
        se3.volume(0.3*sBar);
        se4.volume(0.3*sBar);
        se5.volume(0.2*sBar);
        se6.volume(0.25*sBar);
        se7.volume(0.18*sBar);
        se8.volume(0.2*sBar);
        se9.volume(0.3*sBar);
        se10.volume(0.3*sBar);
        se11.volume(0.3*sBar);
        se12.volume(0.2*sBar);
        se3.play();
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(578,135,80,26)
        cx2.fillText("◀ "+Math.floor(sBar*5)+" ▶",580,160)
        }
      if(mouseX >620 && mouseX <660 && mouseY >135 && mouseY <170){
        if(sBar>=1.4){sBar=1.4}else{sBar+=0.2}
        se1.volume(0.25*sBar);
        se2.volume(0.4*sBar);
        se3.volume(0.3*sBar);
        se4.volume(0.3*sBar);
        se5.volume(0.2*sBar);
        se6.volume(0.25*sBar);
        se7.volume(0.18*sBar);
        se8.volume(0.2*sBar);
        se9.volume(0.3*sBar);
        se10.volume(0.3*sBar);
        se11.volume(0.3*sBar);
        se12.volume(0.2*sBar);
        se3.play();
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle = "black";
        cx2.clearRect(578,135,80,26)
        cx2.fillText("◀ "+Math.floor(sBar*5)+" ▶",580,160)
        }
        if(mouseX >370 && mouseX <430 && mouseY >240 && mouseY <270){
          //bgm
          se3.play();
          if(musicset[0]==1){musicset[0]=musiclist.length-1}else{musicset[0]-=1}
          cx2.clearRect(400,240,335,30)
          cx2.font = "20px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[0]],560,260)
          cx2.textAlign = "start";
          if(musicnum==musicset[0]){
            drawbuttom(690,200,"Play",1,60,40)
          }else{
          drawbuttom(690,200,"Play",0,60,40)
          }
        }
        if(mouseX >370 && mouseX <430 && mouseY >310 && mouseY <340){
          se3.play();
          if(musicset[1]==1){musicset[1]=musiclist.length-1}else{musicset[1]-=1}
          cx2.clearRect(400,310,335,30)
          cx2.font = "20px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[1]],560,330)
          cx2.textAlign = "start";
          if(musicnum==musicset[1]){
            drawbuttom(690,270,"Play",1,60,40)
          }else{
            drawbuttom(690,270,"Play",0,60,40)
          }
        }
        if(mouseX >370 && mouseX <430 && mouseY >380 && mouseY <410){
          se3.play();
          if(musicset[2]==1){musicset[2]=musiclist.length-1}else{musicset[2]-=1}
          cx2.clearRect(400,380,335,30)
          cx2.font = "20px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[2]],560,400)
          cx2.textAlign = "start";
          if(musicnum==musicset[2]){
            drawbuttom(690,340,"Play",1,60,40)
          }else{
            drawbuttom(690,340,"Play",0,60,40)
          }
        }
        if(mouseX >690 && mouseX <750 && mouseY >240 && mouseY <270){
          se3.play();
          if(musicset[0]==musiclist.length-1){musicset[0]=1}else{musicset[0]+=1}
          cx2.clearRect(400,240,335,30)
          cx2.font = "20px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[0]],560,260)
          cx2.textAlign = "start";
          if(musicnum==musicset[0]){
            drawbuttom(690,200,"Play",1,60,40)
          }else{
          drawbuttom(690,200,"Play",0,60,40)
          }
        }
        if(mouseX >690 && mouseX <750 && mouseY >310 && mouseY <340){
          se3.play();
          if(musicset[1]==musiclist.length-1){musicset[1]=1}else{musicset[1]+=1}
          cx2.clearRect(400,310,335,30)
          cx2.font = "20px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[1]],560,330)
          cx2.textAlign = "start";
          if(musicnum==musicset[1]){
            drawbuttom(690,270,"Play",1,60,40)
          }else{
            drawbuttom(690,270,"Play",0,60,40)
          }
        }
        if(mouseX >690 && mouseX <750 && mouseY >380 && mouseY <410){
          se3.play();
          if(musicset[2]==musiclist.length-1){musicset[2]=1}else{musicset[2]+=1}
          cx2.clearRect(400,380,335,30)
          cx2.font = "20px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.textAlign = "center";
          cx2.fillText(musiclist[musicset[2]],560,400)
          cx2.textAlign = "start";
          if(musicnum==musicset[2]){
            drawbuttom(690,340,"Play",1,60,40)
          }else{
            drawbuttom(690,340,"Play",0,60,40)
          }
        }
      if(mouseX >690 && mouseX <750 && mouseY >200 && mouseY <240){
        //通常play
        if(musicnum==musicset[0]){
          musicnum=0;
          Bgm.stop()
          drawbuttom(690,200,"Play",0,60,40)
          drawbuttom(690,270,"Play",0,60,40)
          drawbuttom(690,340,"Play",0,60,40)            
        }else{
          Bgm.stop()
          musicnum=musicset[0];
          switch (musicnum){
            case 1:
              Bgm =new Music(bgm1data);
              Bgm.playMusic();
              break;
            case 2:
              Bgm =new Music(bgm2data);
              Bgm.playMusic();
            break;
            case 3:
              Bgm =new Music(bgm3data);
              Bgm.playMusic();
            break;
            case 4:
              Bgm =new Music(bgm4data);
              Bgm.playMusic();
            break;
            case 5:
              Bgm =new Music(bgm5data);
              Bgm.playMusic();
            break;
            case 6:
              Bgm =new Music(bgm6data);
              Bgm.playMusic();
            break;
          }
        drawbuttom(690,200,"Play",1,60,40)
        drawbuttom(690,270,"Play",0,60,40)
        drawbuttom(690,340,"Play",0,60,40) 
        }      
      }
      if(mouseX >690 && mouseX <750 && mouseY >270 && mouseY <310){
        //リーチplay
        if(musicnum==musicset[1]){
          musicnum=0;
          Bgm.stop()
          drawbuttom(690,200,"Play",0,60,40)
          drawbuttom(690,270,"Play",0,60,40)
          drawbuttom(690,340,"Play",0,60,40)            
        }else{
          Bgm.stop()
          musicnum=musicset[1];
          switch (musicnum){
            case 1:
              Bgm =new Music(bgm1data);
              Bgm.playMusic();
              break;
            case 2:
              Bgm =new Music(bgm2data);
              Bgm.playMusic();
            break;
            case 3:
              Bgm =new Music(bgm3data);
              Bgm.playMusic();
            break;
            case 4:
              Bgm =new Music(bgm4data);
              Bgm.playMusic();
            break;
            case 5:
              Bgm =new Music(bgm5data);
              Bgm.playMusic();
            break;
            case 6:
              Bgm =new Music(bgm6data);
              Bgm.playMusic();
            break;
          }
          drawbuttom(690,200,"Play",0,60,40)
          drawbuttom(690,270,"Play",1,60,40)
          drawbuttom(690,340,"Play",0,60,40)
        }      
      }
      if(mouseX >690 && mouseX <750 && mouseY >340 && mouseY <380){
        //オーラスplay
        if(musicnum==musicset[2]){
          musicnum=0;
          Bgm.stop()
          drawbuttom(690,200,"Play",0,60,40)
          drawbuttom(690,270,"Play",0,60,40)
          drawbuttom(690,340,"Play",0,60,40)            
        }else{
          Bgm.stop()
          musicnum=musicset[2];
          switch (musicnum){
            case 1:
              Bgm =new Music(bgm1data);
              Bgm.playMusic();
              break;
            case 2:
              Bgm =new Music(bgm2data);
              Bgm.playMusic();
            break;
            case 3:
              Bgm =new Music(bgm3data);
              Bgm.playMusic();
            break;
            case 4:
              Bgm =new Music(bgm4data);
              Bgm.playMusic();
            break;
            case 5:
              Bgm =new Music(bgm5data);
              Bgm.playMusic();
            break;
            case 6:
              Bgm =new Music(bgm6data);
              Bgm.playMusic();
            break;
          }
        drawbuttom(690,200,"Play",0,60,40)
        drawbuttom(690,270,"Play",0,60,40)
        drawbuttom(690,340,"Play",1,60,40)
        }
      }
      corsor();
      break;
  }
}
}
if(gamestate ==0){//ほんぺ
  //ニューゲーム
  cx5.globalAlpha = 1;
  //と言いたいけどダブロンがあればその処理
  if(Ronturn.length>0){
    gamestate=1;
    TumoRon(Ronturn[0],turn+1);
    Ronturn.shift();
    return false;
  }
  //一般ルール
  if(LP[0]>=0 && LP[0] <=1){
    if(skillusage2[0]>=8){
    gameover();
    return false;
  }
}
  //ミリオネア
  if(LP[0]==2){
    if(LP[1] >=1000000 || LP[2] >=1000000 || LP[3] >=1000000 || LP[4]>=1000000){
    gameover();
    return false;
  }else{
    gamestate =1
    deckHandler();
    return false;
  }
}
  if(LP[1] >0 && LP[2]>0 && LP[3] >0 && LP[4]>0){
  gamestate =1
  deckHandler();
  }else{gameover();}
  }else if(gamestate ==2){//次のゲームへ
  gamestate=0
  }else if(gamestate ==3){//タイトルへ
  pagestate =0
  gamestate=10;
  console.log(pagestate)
  }else if(gamestate ==1){
    if(opLock==2){
      if(mouseX >460 && mouseY > 240 && mouseX <580 && mouseY <300){
        cx4.clearRect(0,0,800,600)
        opLock=0;
        se3.play();
        corsor();
      }
      //終了
      if(mouseX >220 && mouseY > 240 && mouseX <340 && mouseY <300){
      se3.play();
      cx4.clearRect(0,0,800,600)
      opLock=0;
      gameover();
      }
    return false;
    }
    if(opLock==1){
      cx4.clearRect(10,100,610,400)
      opLock=0;
      drawbuttom(400,10,"残パイリスト",0,130,44);
      se2.play();
      corsor();
      return false;
    }
    if(mouseX >400 && mouseY > 10 && mouseX <530 && mouseY <55){
      //残パイチェック欄を押す　ゲームを進めない
      if(cLock==1){
      opLock=1;
      se4.play();
      drawbuttom(400,10,"残パイリスト",1,130,44);
      cx4.clearRect(10,100,610,400)
      cx4.fillStyle = "rgba(20,20,20,0.7)";
      cx4.fillRect(10,100,610,390)
      cx4.drawImage(canvas6,0,0,800,600);
      Remaincheck();
      return false;
      }
    }
  if(cLock==3){
    //**スキルで自分のパイ選択画面
  cx3.clearRect(0,0,800,600)
  if(mouseY >490 && mouseY < 590 && mouseX >100 && mouseX <760){
      var SX=Math.floor((mouseX+size-100)/size);
        if(mouseX >100 && mouseX <660){
          if(hand1.length>SX+1){
            PlayertoCpu(SX);
          }
          if(ponsw[1]==1 && hand1.length==SX+1){
            PlayertoCpu(SX);
          }
        }else if(mouseX >690 && mouseX <690+size){
          if(turn==0){
            PlayertoCpu(hand1.length-1);
          }
        }
  }else{cLock=1}
  }else if(cLock==2){//スキル対象選択画面
  if(mouseX >0 && mouseX <150 && mouseY >100){
  if(mouseY >100 && mouseY <200){SpecialSkill(1,2)
  }else if(mouseY >200 && mouseY <300){SpecialSkill(1,3)
  }else if(mouseY >300 && mouseY <400){SpecialSkill(1,4)
  }else if(mouseY >400 && mouseY <600){SpecialSkill(1,1)
  }
  }else{
  cx3.clearRect(0,0,800,600)
  cLock=1
  }
  }else if(cLock==1){
  //クリックしてから捨て牌を描写してturnroleに繋げるところまで
  ctl[1]=0
  if(turn ==0){
    if(mouseY >550 && mouseY< 590){
      if(mouseX >10 && mouseX<90){
        //一番右のパイを除いて並び替えなければならない
        if(handsort==1){
      handsort=0;
      var Hlast=hand1.pop();
      console.log(Hlast);
      hand1.sort(compareFunc) 
      hand1=hand1.concat(Hlast)
      handgraph(0,1)
      if(ponsw[1]!==1){
        eltear.src=eltear_src[hand1[hand1.length-1]]
        eltear.onload=function(){
        cx2.clearRect(690,500,size,sizey)
        cx2.drawImage(eltear,690,500,size,sizey)
        }}
      drawbuttom(10,550,"SORT");
      se4.play();
        }else if(handsort==0){
      handsort=1;
      var Hlast=hand1.pop();
      console.log(Hlast);
      hand1.sort(compareFunc3);
      hand1=hand1.concat(Hlast) 
      handgraph(0,1)
      //9枚目だけここで書く
      if(ponsw[1]!==1){
      eltear.src=eltear_src[hand1[hand1.length-1]]
      eltear.onload=function(){
      cx2.clearRect(690,500,size,sizey)
      cx2.drawImage(eltear,690,500,size,sizey)
      }}
      drawbuttom(10,550,"SORT",1);
      se4.play();
        }
    }}//並べ替え
  if(reach[1] !==3){
  //自分のツモ
  if(mouseY >400 && mouseY< 440){
    if(mouseX >710 && mouseX<790){
        //スキル
        SpecialSkill(1,0);
  }}
  if(mouseY >440 && mouseY <480){
  if(mouseX >710 && mouseX <790){
  //スキル選択？
  //SpecialSkill(1,0);
  }}
  if(mouseY >490 && mouseY < 590){
    var SX=Math.floor((mouseX+size-100)/size);
      if(mouseX >100 && mouseX <660){
        if(hand1.length>SX+1){
          PlayertoCpu(SX);
        }
        if(ponsw[1]==1 && hand1.length==SX+1){
          PlayertoCpu(SX);
        }
      }else if(mouseX >690 && mouseX <690+size){
        if(turn==0){
          PlayertoCpu(hand1.length-1);
        }
      }
    }
  }else{//reach[1] ==3
  if(mouseY >348 && mouseY< 454){
  if(mouseX >326 && mouseX<474){
  if(hand1[0] <-1){console.log('578行でアガリ',han[1])}
  }}
  if(mouseY >490 && mouseY < 590){
    if(mouseX >690 && mouseX <760){
      PlayertoCpu(hand1.length-1);
    }}
  }
  //リーチボタン
  if(mouseY >440 && mouseY <480){
  if(mouseX >630 && mouseX <710){
    switch(reach[1]){
      case 1:
        se5.play()
        cx2.clearRect(630,440,80,40)
        drawbuttom(630,440,"リーチ",1);
        reach[1]=2//reach=2は仮確定、切った後3に確定
        ElnameM=0;
        corsor();
      break;
      case 2:
        se3.play()
        cx2.clearRect(630,440,80,40)
        drawbuttom(630,440,"リーチ");
        reach[1]=1;
        cx3.clearRect(200,370,360,120);
        corsor();
      break;
      default:
        //立直不可・立直済み
        break;
    }
  //console.log(reach)
  }}
  //アガリ
  if(hand1[0]==-3){
    if(mouseY >348 && mouseY< 490){
      if(mouseX >326 && mouseX<474){    
  console.log('アガリ',han[1])
  cx3.clearRect(326,348,148,142);
  TumoRon(1,0)
  }}}
  
  }//turn
  //ロンアガリ、turn0ではない
  if(hand1[0]==-2){
  if(mouseY >348 && mouseY< 490 && mouseX >326 && mouseX<474){
  console.log('アガリ',han[1])
  cx3.clearRect(326,348,148,142);
  Ronturn.push(1);
  }else{
  console.log('ロンをスルー')
  se3.play();
  cx3.clearRect(326,348,148,142);
  }
  rorder[1]=1
  hand1[0]=-1
  turn=turntemp;
  turnchecker();
  //turnrole();
  }
  //ポン
  if(ponsw[1]==1 && turn !==0){
  if(mouseY >400 && mouseY <440 && mouseX >630 && mouseX <710){
      console.log(ponsw[1]);
        Pon(1,tumotemp);
    }else{
      //キャンセル
      console.log('ポンをスルー')
      cLock=0;
      se3.play();
      cx2.clearRect(630,400,80,40)
      cx2.fillStyle = "rgba(20,20,20,0.5)";
      cx2.fillRect(630,400,80,40)
      ponsw[1]=pon1.length;
      ponsw[0]=1;
      turn=turntemp;
      turnchecker();
    }};
  }
  }//gamestate
            }
window.addEventListener("keyup", keyupHandler, false);
  function keyupHandler(e) {
  if(e.keyCode==13){
  key13=0;//enter
  }
  if(e.keyCode==27){
  key27=0;//esc
  }}
  window.addEventListener("keydown", keyDownHandler, false);
	function keyDownHandler(e) {
    if(e.keyCode==27 && key27==0){
      key27=1;
      //対局を止める
      if(opLock==0 && gamestate ==1 && cLock==1){
      opLock=2;
      cx4.globalAlpha=1;
      se2.play();
      cx4.fillStyle = "rgba(20,20,20,0.7)";
      cx4.fillRect(0,0,800,600)
      cx4.font = "bold 26px 'メイリオ'";
      cx4.fillStyle = "black";
      cx4.strokeStyle ="rgba(250,250,250,0.9)";
      cx4.lineWidth=5;
      cx4.strokeText("タイトル画面に戻りますか？",240,200);
      cx4.fillText("タイトル画面に戻りますか？",240,200);
      cx4.fillStyle="#ff3838";
      cx4.strokeRect(220,240,120,60)
      cx4.fillRect(220,240,120,60)
      cx4.fillStyle = "#f0f0f0";
      cx4.font = "bold 24px 'メイリオ'";
      cx4.fillText("YES",250,280);
      cx4.fillStyle="#3898ff";
      cx4.strokeRect(460,240,120,60)
      cx4.fillRect(460,240,120,60)
      cx4.fillStyle = "#f0f0f0";
      cx4.fillText("NO",500,280);
      }}
    }
function Remaincheck(num=-1){
  //残パイ
  //num -1->リスト n~->指定パイのチェック
  var RemainPack=deck.concat(king);
  RemainPack=RemainPack.concat(hand2);
  RemainPack=RemainPack.concat(hand3);
  RemainPack=RemainPack.concat(hand4);
  //console.log(RemainPack.length);
  switch(num){
    case -1:
      cx4.fillStyle = "rgba(20,20,20,0.7)";
      for(var i=0;i<45;i++){
        var X=Math.floor(i%10);
        var Y=Math.floor(i/10);
        var A=RemainPack.filter(value=>value==i)
        if(A.length){
          cx4.font = "26px Bold Arial";
          cx4.fillStyle = "black";
          cx4.strokeStyle ="rgba(250,250,250,0.9)";
          cx4.strokeText(A.length,30+60*X,150+78*Y)
          cx4.fillText(A.length,30+60*X,150+78*Y)
        }else{
          cx4.fillStyle = "rgba(20,20,20,0.7)";
          cx4.fillRect(10+60*X,100+78*Y,60,78)
        }
      }
      break;
    default:
        var A=RemainPack.filter(value=>value==num)
        if(A.length){
          return A.length;
        }else{
          return false;
        }
      break;
  }
}
function shuffle(){
  for(var i =deck.length-1; i>0 ; i--){
  var r =Math.floor(Math.random()*(i+1));
  var temp = deck[i];
  deck[i] = deck[r]
  deck[r] = temp
}};
function decklength(){
  //残り枚数と表ドラを描写
  var DD=dora[dora.length-1]+1
  if(DD>=45){DD=0;}
  e7.src=eltear_src[DD]
  e7.onload=function(){
  cx1.clearRect(dorax,10,620-dorax,44)
  cx1.fillStyle = "rgba(10,10,10,0.6)";
  cx1.fillRect(dorax,10,40,44)
  cx1.drawImage(e7,dorax,10,33,43.5)
  cx1.fillRect(530,10,90,44)
  cx1.font = "24px 'Century Gothic'";
  cx1.fillStyle ="white";
  cx1.fillText("残:"+ deck.length,540,40)
  drawbuttom(400,10,"残パイリスト",0,130,44);
}}
function compareFunc(a,b){return a-b;}
function compareFuncID(a,b){return(a.id - b.id);}  
function compareFunc2(a,b){return(a.elia - b.elia);}  
function compareFunc3(a,b){
  if(a>=42){return 1}else{return a%3-b%3;}}
function deckHandler(){
  //ゲームスタート時の配牌と画面
  cx.clearRect(0,0,800,600)
  cx1.clearRect(0,0,800,600)
  cx2.clearRect(0,0,800,600)
  cx3.clearRect(0,0,800,600)
  alpha=1
  //背景
  cx.drawImage(BGimg,0,0,800,600);
  cx1.fillStyle = "rgba(10,10,10,0.6)";
  cx1.fillRect(630,400,160,80)
  cx1.fillRect(630,10,160,350)
  cx1.fillRect(10,100,135,400)
  cx1.fillRect(10,10,120,44)
  cx1.fillRect(10,60,135,34)
  cx1.font = "24px 'Century Gothic'";
  cx1.fillStyle ="white";
  cx1.fillText("ドラ",10,40)
  skillusage2[0]+=1
  auras=0;
  if(LP[0]>=0 && LP[0] <=1 && skillusage2[0]==8){
    cx1.fillText("オーラス"+(skillusage2[5]),10,88);
    auras=1;
  }else if(LP[0]==2 && skillusage2[0]==16){
    cx1.fillText("オーラス"+(skillusage2[5]),10,88);
    auras=1;
  }else{cx1.fillText("第"+(skillusage2[0])+"局 "+(skillusage2[5])+"本場",10,88);
       }
  //music
  if(auras==0 && musicset[0]!==musicnum){
    musicnum=musicset[0]
    if( mute=="ON" ){
    Bgm.stop();
  switch (musicset[0]){
    case 1:
      Bgm =new Music(bgm1data);
      Bgm.playMusic();
      break;
    case 2:
      Bgm =new Music(bgm2data);
      Bgm.playMusic();
    break;
    case 3:
      Bgm =new Music(bgm3data);
      Bgm.playMusic();
    break;
    case 4:
      Bgm =new Music(bgm4data);
      Bgm.playMusic();
    break;
    case 5:
      Bgm =new Music(bgm5data);
      Bgm.playMusic();
    break;
    case 6:
      Bgm =new Music(bgm6data);
      Bgm.playMusic();
    break;
    default:
      console.log(musicnum,'bgm error!')
      Bgm.stop();
  }}}else if(auras==1 && musicset[2]!==musicnum){
  musicnum=musicset[2]
  if( mute=="ON" ){
    Bgm.stop();
switch (musicset[2]){
  case 1:
    Bgm =new Music(bgm1data);
    Bgm.playMusic();
    break;
  case 2:
    Bgm =new Music(bgm2data);
    Bgm.playMusic();
  break;
  case 3:
    Bgm =new Music(bgm3data);
    Bgm.playMusic();
  break;
  case 4:
    Bgm =new Music(bgm4data);
    Bgm.playMusic();
  break;
  case 5:
    Bgm =new Music(bgm5data);
    Bgm.playMusic();
  break;
  case 6:
    Bgm =new Music(bgm6data);
    Bgm.playMusic();
  break;
  default:
    console.log(musicnum,'bgm error!')
    Bgm.stop();
}}};
  cx1.font = "16px 'Century Gothic'";
  cx1.fillText("ポン",640,425)
  //cx1.fillText("カン",720,425)
  cx1.fillText("リーチ",640,465)
  cx1.fillText("スキル",720,425)
  //cx1.fillText("覚醒",730,465)
  handsort=0;
  drawbuttom(10,550,"SORT");
  parentY =400
  e11.src=chrimg_src[chara[1]]
  e11.onload=function(){
  cx1.drawImage(e11,500,0,300,600,0,parentY,100,200)
  parentY=100
  e12.src=chrimg_src[chara[2]]
  e12.onload=function(){
  cx1.drawImage(e12,500,0,300,300,0,parentY,100,100)
  parentY+=100
  e13.src=chrimg_src[chara[3]]
  e13.onload=function(){
  cx1.drawImage(e13,500,0,300,300,0,parentY,100,100)
  parentY+=100
  e14.src=chrimg_src[chara[4]]
  e14.onload=function(){
  cx1.drawImage(e14,500,0,300,300,0,parentY,100,100)
  if(LP[0]>=6 && LP[0]<10){
  cx1.fillStyle ="white";
  cx1.strokeStyle = '#eb5600';
  }else{
  cx1.fillStyle ="black";
  cx1.strokeStyle = 'white';
  }
  for(var i=1; i<skillswitch.length;i++){
    skillswitch[i]=0;
    }
    skillusage=new Array(0,0,0,0,0)
    //chara2の時のみskillusage2を-1に
    for(var i=1 ;i<5; i++){
    if(chara[1]==2 && LP[i]>0){skillusage2[i]=-1}
    }
  if(LP[0]==2){
  for(var i=1; i<5 ; i++){//復活
    if(LP[i]<=0){
    skillusage2[i]+=1;
    if(skillusage2[i] >=3){
      LP[i]=75000;
    if(chara[i]==2 ){skillusage2[i]=-1;}else{skillusage2[i]=0;}
    }}
      }}
  cx1.lineWidth = 3;
  cx1.lineJoin = 'round';
  parentY =170
  cx1.strokeText(LP[2],80,parentY)
  cx1.fillText(LP[2],80,parentY)
  parentY +=100
  cx1.strokeText(LP[3],80,parentY)
  cx1.fillText(LP[3],80,parentY)
  parentY +=100
  cx1.strokeText(LP[4],80,parentY)
  cx1.fillText(LP[4],80,parentY)
  parentY +=100
  cx1.strokeText(LP[1],80,parentY)
  cx1.fillText(LP[1],80,parentY)
  parentY +=100
  cx1.fillStyle ="black";
  cx1.strokeStyle = 'white';
  cx1.lineWidth = 3;
  cx1.lineJoin = 'round';
  parentY =125+100*parent
  cx1.strokeText("柔軟",110,parentY)
  cx1.fillText("柔軟",110,parentY)
  if(parentY ==425){parentY =125}else{parentY +=100}
  cx1.strokeText("強靭",110,parentY)
  cx1.fillText("強靭",110,parentY)
  if(parentY ==425){parentY =125}else{parentY +=100}
  cx1.strokeText("強烈",110,parentY)
  cx1.fillText("強烈",110,parentY)
  if(parentY ==425){parentY =125}else{parentY +=100}
  cx1.strokeText("超越",110,parentY)
  cx1.fillText("超越",110,parentY)
  cx1.font = "18px 'Century Gothic'";
  cx1.fillStyle ="white";
  cx1.strokeStyle ="#d92100"
  cx1.strokeText("親",80,parentY)
  cx1.fillText("親",80,parentY)
  parentY -=8
  cx1.beginPath () ;
  cx1.arc( 90, parentY, 18, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
  cx1.strokeStyle = "red" ;
  cx1.lineWidth = 2 ;
  cx1.stroke() ;
  cx2.fillStyle = "rgba(20,20,20,0.5)";
  cx2.fillRect(630,400,160,80)
  //cx2.clearRect(630,440,80,40)
  //初期化
  deck=[]
  dora=[]
  handtemp=[]
  tumotemp=0;
  //Tumotemp=[]
  cpuwant =0
  hand1=[]
  hand2=[]
  hand3=[]
  hand4=[]
  Ronturn=[];
  trash1=[]
  trash2=[]
  trash3=[]
  trash4=[]
  c1=0
  opLock=0;
  //ポンポポン
  ponsw=[0,0,0,0,0]
  poncpu=[0,0,0,0,0]
  pon1=[];
  pon2=[];
  pon3=[];
  pon4=[];
  kansw=[0,0,0,0,0]
  kansw2=[0,0,0,0,0]
  //c2=0
  //c3=0
  //c4=0
  ctl=new Array(0,0,2,2,2)
  ctlerror=new Array(0,0,0,0,0)
  cLock = 0;
  //clock0->反応させない　1以上->操作を許可 2->リーチからのパイ切り？ 3->スキルキーからのパイ切り
  han =new Array(0,0,0,0,0)
  reach =new Array(0,0,0,0,0)
  ippatu =new Array(0,0,0,0,0)
  rorder =new Array(0,0,0,0,0)
  porder =new Array(0,0,0,0,0)
  typerand=new Array(0,0,0,0,0)
  for(var i=1; i<5;i++){
  if(LP[i]<=0){rorder[i]=2}else{rorder[i]=0}
  if(cputype[i]==3){typerand[i]=Math.floor(Math.random()*3);}
  }
  console.log(typerand);
  counter=new Array(0,0,0,0,0)
  riverx=new Array(0,120,120,120,120)
  rivery=new Array(0,400,100,200,300)
  DP =new Array(0,0,0,0,0)
  Buff =new Array(0,[],[],[],[])
  //配牌
  for(var i =0; i<43; i++){
  deck.push(i);
  deck.push(i);
  }
  deck.push(43);
  deck.push(44);
  console.log(deck.length);
  //expected88
  //山シャッフル
  shuffle();
  //初手積み込み
  console.log(parent);
  if(chara[1]==3 && parent==2){
    console.log("NF 1")
    for(var i=0;i<3;i++){
    var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
    var B=[1,0.6,0.2];
    var R=Math.random();
    if(R<B[i]){
      hand1.push(deck[A]);
      deck.splice(A,1);
    }
    }
  }
  if(chara[2]==3 && parent==3){
    console.log("NF 2")
    for(var i=0;i<3;i++){
    var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
    var B=[1,0.6,0.2];
    var R=Math.random();
    if(R<B[i]){
      hand2.push(deck[A]);
      deck.splice(A,1);
    }
    }
  }
  if(chara[3]==3 && parent==0){
    console.log("NF 3")
    for(var i=0;i<3;i++){
    var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
    var B=[1,0.6,0.2];
    var R=Math.random();
    if(R<B[i]){
      hand3.push(deck[A]);
      deck.splice(A,1);
    }
    }
  }
  if(chara[4]==3 && parent==1){
    console.log("NF 4")
    for(var i=0;i<3;i++){
    var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
    var B=[1,0.6,0.2];
    var R=Math.random();
    if(R<B[i]){
      hand4.push(deck[A]);
      deck.splice(A,1);
    }
    }
  }
  king =deck.splice(0,7)
  hand1b=deck.splice(0,8-hand1.length)
  hand1=hand1.concat(hand1b)
  hand1b=deck.splice(0,8-hand2.length)
  hand2=hand2.concat(hand1b)
  hand1b=deck.splice(0,8-hand3.length)
  hand3=hand3.concat(hand1b)
  hand1b=deck.splice(0,8-hand4.length)
  hand4=hand4.concat(hand1b)
  //手札をソート
  hand1.sort(compareFunc);
  hand2.sort(compareFunc);
  hand3.sort(compareFunc);
  hand4.sort(compareFunc);
  //1番目の配列は上がり判定に使用
  hand1.unshift(-1)
  hand2.unshift(-1)
  hand3.unshift(-1)
  hand4.unshift(-1)
  //最後9番目の配列はドローカードに使うので適当に100を代入
  hand1.push(100)
  hand2.push(100)
  hand3.push(100)
  hand4.push(100)
  

  console.log(king);//嶺上牌
  console.log(hand1);//自分の手札
  console.log(hand2);
  console.log(hand3);
  console.log(hand4);
  
  dora.push(king[0])
  console.log(dora)
  dorax=60
  
  handgraph(-1,1);
  decklength();
  //最初ターン流詰みこみ
  //player1();
  turn =parent
  if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
  if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
  if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
  parent +=1
  if(parent ==4){parent =0}
  ctl[turn+1]=0
  //turnrole();
  }}}}
  };

  function turnchecker(){
    console.log('turnchecker'+turn)
    //捨て牌で誰も上がらないならターンを回す
    //ダブロン
    //ロン＞ポン
    //だれもロンしないなら隣の人がポンするか判定
    var Fr1=Buff[1].findIndex(value=>value==6);
    var Fr2=Buff[2].findIndex(value=>value==6);
    var Fr3=Buff[3].findIndex(value=>value==6);
    var Fr4=Buff[4].findIndex(value=>value==6);
    if(rorder[1] !==2){
    if(rorder[1]==0 && turn !==0 && Fr1==-1){ron(1)};
    if(rorder[2]==0 && turn !==1 && Fr2==-1){ron(2)}
    if(rorder[3]==0 && turn !==2 && Fr3==-1){ron(3)}
    if(rorder[4]==0 && turn !==3 && Fr4==-1){ron(4)}
    }
    if(hand1[0]==-2){
      se6.play();
      //cx2.clearRect(630,400,80,40)
      turntemp =turn
      turn=4
      e18.src=eltearB_src[3];
      e18.onload=function(){
        e19.src=eltearB_src[4];
        e19.onload=function(){
      cx3.drawImage(e18,326,348,148,142)
      cLock=1;
      corsor();
      console.log('操作可',cLock)
      }}
    }else if(hand2[0]==-2){
    //console.log('cpu2アガル？')
    //ron(2)
    turntemp=turn
    turn=5
    cpu(2);
    }else if(hand3[0]==-2){
    //ron(3)
    turntemp=turn
    turn=6
    cpu(3);
    }else if(hand4[0]==-2){
    //ron(4)
    turntemp=turn
    turn=7
    cpu(4);
    }else{
      //ロン処理
      if(Ronturn.length>0){
        //var ronn=...になっていたが問題なかった？
        setTimeout(function(){
          TumoRon(Ronturn[0],turn+1);
          Ronturn.shift();
          }, 550);
        return false;
      }
      //次の人のポンへ
      if(turn==0 && ponsw[0]==0 && Fr2==-1 && LP[2]>0){
      //可能な限りポン->ライン揃えに行く場合はポンしない
        if(Pon(2)){
          var R=Math.random();
          if(R>poncpu[2]){
          Pon(2,tumotemp);
          return false;
        }else{
          ponsw[2]=pon2.length;
        }
      }
      };
      if(turn==1 && ponsw[0]==0 && Fr3==-1 && LP[3]>0){
        if(Pon(3)){
          var R=Math.random();
          if(R>poncpu[3]){
          Pon(3,tumotemp);
          return false;
        }else{
          ponsw[3]=pon3.length;
        }}
      }
      if(turn==2 && ponsw[0]==0 && Fr4==-1 && LP[4]>0){
        if(Pon(4)){
          var R=Math.random();
          if(R>poncpu[4]){
          Pon(4,tumotemp);
          return false;
        }else{
          ponsw[4]=pon4.length;
        }
        }
      }
      if(turn==3 && ponsw[0]==0 && Fr1==-1 && LP[1]>0){
        if(Pon(1)){
        se1.play();
        cx2.clearRect(630,400,80,40)
        turntemp =turn
        turn=4
        cx3.clearRect(630,400,80,40)
        drawbuttom(630,400,"ポン")
        cLock=1;
        corsor();
        console.log('操作可',cLock);
        return false;
      }}
      //ターンを回す
    if(deck.length <= 0 && ponsw[1]!==1 &&ponsw[2]!==1 && ponsw[3]!==1 && ponsw[4]!==1){
      ryukyoku();
    }else{
    //飛んだ人を飛ばす
    turn +=1;
    switch(turn){
      case 1:
        var Freeze=Buff[2].filter(value=>value==6)
        if(Freeze.length>0 || LP[2]<=0){
          if(Freeze.length>0){
          var F=Buff[2].findIndex(value=>value==6)
          Buff[2].splice(F,1)
          }
          turn+=1;ctl[3]=0;
          Freeze=Buff[3].filter(value=>value==6)
          if(Freeze.length>0 || LP[3]<=0){
            if(Freeze.length>0){
            var F=Buff[3].findIndex(value=>value==6)
            Buff[3].splice(F,1)
            }
            turn+=1;ctl[4]=0;
            Freeze=Buff[4].filter(value=>value==6)
            if(Freeze.length>0 || LP[4]<=0){
              if(Freeze.length>0){
              var F=Buff[4].findIndex(value=>value==6)
              Buff[4].splice(F,1)
              }
              turn=0
            }
          }}
          if(rorder[2]==1){rorder[2]=0}
          if(rorder[3]==1){rorder[3]=0}
          if(rorder[4]==1){rorder[4]=0}
        break;
      case 2:
        var Freeze=Buff[3].filter(value=>value==6)
        if(Freeze.length>0 || LP[3]<=0){
          if(Freeze.length>0){
          var F=Buff[3].findIndex(value=>value==6)
          Buff[3].splice(F,1)
          }
          turn+=1;ctl[4]=0;
          Freeze=Buff[4].filter(value=>value==6)
          if(Freeze.length>0 || LP[4]<=0){
            if(Freeze.length>0){
            var F=Buff[4].findIndex(value=>value==6)
            Buff[4].splice(F,1)
            }
            turn=0
          Freeze=Buff[1].filter(value=>value==6)
          if(Freeze.length>0 || LP[1]<=0){
            if(Freeze.length>0){
            var F=Buff[1].findIndex(value=>value==6)
            Buff[1].splice(F,1)
            }
            turn+=1;ctl[2]=0;
            }
          }}
          if(rorder[1]==1){rorder[1]=0}
          if(rorder[3]==1){rorder[3]=0}
          if(rorder[4]==1){rorder[4]=0}
        break;
      case 3:
        var Freeze=Buff[4].filter(value=>value==6)
        if(Freeze.length>0 || LP[4]<=0){
          if(Freeze.length>0){
          var F=Buff[4].findIndex(value=>value==6)
          Buff[4].splice(F,1)
          }
          turn=0;
          Freeze=Buff[1].filter(value=>value==6)
          if(Freeze.length>0 || LP[1]<=0){
            if(Freeze.length>0){
            var F=Buff[1].findIndex(value=>value==6)
            Buff[1].splice(F,1)
            }
            turn+=1;ctl[2]=0;
            Freeze=Buff[2].filter(value=>value==6)
        if(Freeze.length>0 || LP[2]<=0){
          if(Freeze.length>0){
          var F=Buff[2].findIndex(value=>value==6)
          Buff[2].splice(F,1)
          }
          turn+=1;ctl[3]=0;
            }
          }}
          if(rorder[1]==1){rorder[1]=0}
          if(rorder[2]==1){rorder[2]=0}
          if(rorder[4]==1){rorder[4]=0}
        break;
      case 4:
          turn=0;
          var Freeze=Buff[1].filter(value=>value==6)
          if(Freeze.length>0 || LP[1]<=0){
            if(Freeze.length>0){
            var F=Buff[1].findIndex(value=>value==6)
            Buff[1].splice(F,1)
            }
            turn+=1;ctl[2]=0;
            Freeze=Buff[2].filter(value=>value==6)
        if(Freeze.length>0 || LP[2]<=0){
          if(Freeze.length>0){
          var F=Buff[2].findIndex(value=>value==6)
          Buff[2].splice(F,1)
          }
          turn+=1;ctl[3]=0;
          Freeze=Buff[3].filter(value=>value==6)
        if(Freeze.length>0 || LP[3]<=0){
          if(Freeze.length>0){
          var F=Buff[3].findIndex(value=>value==6)
          Buff[3].splice(F,1)
          }
          turn+=1;ctl[4]=0;
          }
        }}
          if(rorder[1]==1){rorder[1]=0}
          if(rorder[3]==1){rorder[3]=0}
          if(rorder[2]==1){rorder[2]=0}
        break;
      default:
        console.log(turn,"turnchecker error!")
        break;
    }
    console.log(turn,Ronturn)
    turnrole();
    }
    }}
    
function handgraph(num,player){
  console.log('handgraph',num,player,tumotemp)
    if(num>0){
    //e5を使って捨て牌の描写してアガリ判定後ターンを進める
    se4.play();
    //ポン、カンしたパイかく
    Tumoname();
    e5.src=eltear_src[tumotemp]
    if(counter[player]==28){
    rivery[player] +=50
    riverx[player] =110
    }
    if(counter[player]==14){
    rivery[player] +=50
    riverx[player] =110
    }
    if(chara[player]==3){
      if((tumotemp>=6 && tumotemp<=8)||(tumotemp>=39 && tumotemp<=42)){
        var MS=Buff[player].filter(value=>value==2)
        if(MS.length<3){Buff[player].push(3)}
      };
      }
    if(chara[player]==2){
      if((tumotemp>=3 && tumotemp<=5)||(tumotemp>=15 && tumotemp<=17)){
        var MS=Buff[player].filter(value=>value==2)
        if(MS.length<5){Buff[player].push(2)}
      };
      }
    if(ippatu[player]==1){//守備表示
    riverx[player] +=43.5
    e5.onload=function(){
    cx1.translate(riverx[player], rivery[player])
    cx1.rotate(90 * Math.PI / 180);
    cx1.translate(10.5-riverx[player], -33-rivery[player])
    cx1.drawImage(e5, riverx[player], rivery[player],33,43.5)
    cx1.translate(-10.5+riverx[player], 33+rivery[player])
    cx1.rotate(-90 * Math.PI / 180);
    cx1.translate(-riverx[player], -rivery[player])
    counter[player] +=1
    console.log(player)
    if(chara[player]==1){Buff[player].push(1)};
    console.log(Buff);
    loopX=0
    loopX2=0;
    alpha=1;
    e17.src=win_src[9]
    e17.onload=function(){
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
      se9.play();
      if(auras==0 && musicnum!==musicset[1]){
      musicnum=musicset[1];
      if( mute=="ON" ){
        Bgm.stop();
      switch (musicset[1]){
        case 1:
          Bgm =new Music(bgm1data);
          Bgm.playMusic();
          break;
        case 2:
          Bgm =new Music(bgm2data);
          Bgm.playMusic();
        break;
        case 3:
          Bgm =new Music(bgm3data);
          Bgm.playMusic();
        break;
        case 4:
          Bgm =new Music(bgm4data);
          Bgm.playMusic();
        break;
        case 5:
          Bgm =new Music(bgm5data);
          Bgm.playMusic();
        break;
        case 6:
          Bgm =new Music(bgm6data);
          Bgm.playMusic();
        break;
        default:
          console.log(musicnum,'bgm error!')
          Bgm.stop();
      }}}
      window.requestAnimationFrame((ts)=>ReachAnimation(ts))
  }}
    //turnchecker();
    }}else{//通常
    riverx[player] +=33
    e5.onload=function(){
    cx1.clearRect(riverx[player],rivery[player],33,43.5)
    cx1.drawImage(e5,riverx[player],rivery[player],33,43.5)
    counter[player] +=1
    //console.log(player)
    turnchecker();
    }}
    //turnrole();
    }
    if(num ==0){//*
    reachhand=[];
    var ponnum=pon1.length;
    reachhand=hand1.concat(pon1);
    var H=reachhand.findIndex(value=>value==100);
    if(H !==-1){
    reachhand.splice(H,1)
    }
    console.log(reachhand,ponnum)
    //handE1-handE9　reachhandをポン時に出した方が計算量減るかモ
    //カンを実装したら手札が増えそうで震え
    hand1x =100
    hand2x =hand1x+size*3
    hand3x =hand2x+size*3
    var h=1
    var c=4
    var d=7
    //cx2.clearRect(0,hand1y-5,670,60);
    //cx2.clearRect(hand1x-2,hand1y,485,sizey);
    var r1=hand1[h];;
    handE1.src=eltear_src[reachhand[1]]
    handE2.src=eltear_src[reachhand[2]]
    handE3.src=eltear_src[reachhand[3]]
    handE4.src=eltear_src[reachhand[4]]
    handE5.src=eltear_src[reachhand[5]]
    handE6.src=eltear_src[reachhand[6]]
    handE7.src=eltear_src[reachhand[7]]
    handE8.src=eltear_src[reachhand[8]]
        //消えるのが気になるので消す前に書いとく
        var img4 = cx2.getImageData(95,499,570,110);
        cx3.clearRect(4,499,762,110);
        cx3.putImageData(img4,95,499);
        cx2.clearRect(95,499,705,110);
    if(H ==-1 || kansw[1]==2){
      handE9.src=eltear_src[reachhand[9]]
      handE9.onload=function(){
        cx3.clearRect(hand1x+size*8,499,size,110)
        if(pon1.length>0){
          //一番右のポン
          if(ponsw[1]==1 || kansw[1]==2){
        cx1.clearRect(590,450,33,43.5)
        cx1.drawImage(handE9,590,450,33,43.5);
        cx1.fillStyle = "rgba(20,20,20,0.2)";
        cx1.fillRect(590,450,33,43.5)
          }
      }else{
        handE9.src=eltear_src[hand1[hand1.length-1]]
        handE9.onload=function(){
        //たぶんこ↑こ↓出番ない、ありました、フレイムガイザー直後にありました
        //cx2.drawImage(handE9,hand1x+size*8,hand1y,size,sizey);
        cx2.drawImage(handE9,690,500,size,sizey);
      }}
      };
    }
    handE1.onload=function(){
      cx2.drawImage(handE1,hand1x,hand1y,size,sizey);
      cx3.clearRect(hand1x,499,size,110)
    }
    handE2.onload=function(){
      cx3.clearRect(hand1x+size,499,size,110)
      if(pon1.length>7){
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(359,450,33,43.5)
      cx1.drawImage(handE2,359,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(359,450,33,43.5)
        }
      }else if(ponsw[1]<7){
        cx2.drawImage(handE2,hand1x+size,hand1y,size,sizey);
      }
    }
    handE3.onload=function(){
      cx3.clearRect(hand1x+size*2,499,size,110)
      if(pon1.length>6){
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(392,450,33,43.5)
      cx1.drawImage(handE3,392,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(392,450,33,43.5)
        }
      }else if(ponsw[1]<6){
      cx2.drawImage(handE3,hand1x+size*2,hand1y,size,sizey);
      }
    }
    handE4.onload=function(){
      cx3.clearRect(hand1x+size*3,499,size,110)
      if(pon1.length>5){
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(425,450,33,43.5)
      cx1.drawImage(handE4,425,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(425,450,33,43.5)
        }
    }else{
      cx2.drawImage(handE4,hand1x+size*3,hand1y,size,sizey);
    }
    }
    handE5.onload=function(){
      cx3.clearRect(hand1x+size*4,499,size,110)
      if(pon1.length>4){
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(458,450,33,43.5)
      cx1.drawImage(handE5,458,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(458,450,33,43.5)
        }
    }else{
      cx2.drawImage(handE5,hand1x+size*4,hand1y,size,sizey);
    }
    }
    handE6.onload=function(){
      cx3.clearRect(hand1x+size*5,499,size,110)
      if(pon1.length>3){
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(491,450,33,43.5)
      cx1.drawImage(handE6,491,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(491,450,33,43.5)
        }
    }else if(ponsw[1]<3){
      cx2.drawImage(handE6,hand1x+size*5,hand1y,size,sizey);
    }
    }
    handE7.onload=function(){
      cx3.clearRect(hand1x+size*6,499,size,110)
      if(pon1.length>2){
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(524,450,33,43.5)
      cx1.drawImage(handE7,524,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(524,450,33,43.5)
        }
    }else{
      cx2.drawImage(handE7,hand1x+size*6,hand1y,size,sizey);
    }
    }
    handE8.onload=function(){
      cx3.clearRect(hand1x+size*7,499,size,110)
      if(pon1.length>1){
        //ポン
        if(ponsw[1]==1 || kansw[1]==2){
      cx1.clearRect(557,450,33,43.5)
      cx1.drawImage(handE8,557,450,33,43.5);
      cx1.fillStyle = "rgba(20,20,20,0.2)";
      cx1.fillRect(557,450,33,43.5)
        }
    }else{
      cx2.drawImage(handE8,hand1x+size*7,hand1y,size,sizey);
    }
    }
    }
    if(num ==-1){//最初だけ
      //e1~e4を使って自分の手札を描画
      //cx1.clearRect(0,480,800,580)
      hand1x =100
      hand2x =hand1x+size*3
      hand3x =hand2x+size*3
      //forが速すぎたので1個ずつonloadでかいていくよ
      var h=1
      var c=4
      var d=7
      //cx2.clearRect(0,hand1y-5,670,60);
      cx2.clearRect(hand1x-2,hand1y,485,sizey);
      var r1=hand1[h];
      e1.src=eltear_src[r1]
      e1.onload=function(){
        se11.play();
        cx2.drawImage(e1,hand1x,hand1y,size,sizey);
        //if(Hand1[h].eltype==1){draweye(hand1x+22,hand1y+29)};
        hand1x +=size
        h +=1
        r1=hand1[h]
        e1.src=eltear_src[r1]
        e1.onload=function(){
            cx2.drawImage(e1,hand1x,hand1y,size,sizey)
      hand1x +=size
            h +=1
            r1=hand1[h]
          e1.src=eltear_src[r1]
          e1.onload=function(){
            cx2.drawImage(e1,hand1x,hand1y,size,sizey)
      hand1x +=size
            h +=1}}};
            //時間ラグを付ける
      setTimeout(
        ()=>{
      var r2=hand1[c];
      e2.src=eltear_src[r2]
      e2.onload=function(){
        se4.play();
        cx2.drawImage(e2,hand2x,hand1y,size,sizey)
      //cx2.clearRect(hand2x-8,hand1y-1,60,62)
        hand2x +=size
        c +=1
        r2=hand1[c]
        e2.src=eltear_src[r2]
      e2.onload=function(){
        se4.play();
        cx2.drawImage(e2,hand2x,hand1y,size,sizey)
      hand2x +=size
        c +=1
        r2=hand1[c]
        e2.src=eltear_src[r2]
      e2.onload=function(){
        cx2.drawImage(e2,hand2x,hand1y,size,sizey)
      hand2x +=size
        c +=1}}};
        },400)
      setTimeout(
        ()=>{
      var r3=hand1[d]
      e3.src=eltear_src[r3]
      e3.onload=function(){
        se4.play();
      cx2.drawImage(e3,hand3x,hand1y,size,sizey)
      //cx2.clearRect(hand3x-8,hand1y-1,60,62)
      hand3x +=size
      d +=1
      r3=hand1[d]
      e3.src=eltear_src[r3]
      e3.onload=function(){
      cx2.drawImage(e3,hand3x,hand1y,size,sizey)
      d +=1
      }};
    },800)
    setTimeout(
      ()=>{
    turnrole();
    },1000)
      }
  
    }
function Setup(){//デュエル開始の宣言をする
  se1.play();
  skillusage2=new Array(0,0,0,0,0,0)
  BGimg.src=bgimg_src[bgimg_src[0]]
  BGimg.onload=function(){
  parent= Math.floor(Math.random()*4);
  switch(LP[0]){
    case 0:
      for(var i=1;i<LP.length;i++){LP[i]=150000}
      break;
    case 1:
      for(var i=1;i<LP.length;i++){LP[i]=300000}
      break;
    case 2:
      for(var i=1;i<LP.length;i++){LP[i]=100000}
      mode=1;
      break;
    default:
      mode=1;
    }
  if(chara[0]==0){
    for(var i=2;i<chara.length;i++){
      var R=Math.floor(Math.random()*chrlist.length)
      chara[i]=R
    }
  }
  //parent=0;//for debug
  gamestate =1
  if( mute=="ON" ){
    Bgm.playMusic();
      }
  console.log('setup',timevalue)
  deckHandler();
  }};

function PlayertoCpu(num){
  //ノーテンリーチ禁止
if(reach[1]==2 && reach[0]==1){
  return false;
}
if(cLock==3){SpecialSkill(1,num);}else{
cLock=0;
console.log('操作禁止',cLock)
//切った後の整列描画と自分の捨て牌リスト
if(ponsw[1]==1){ponsw[1]=pon1.length;}
if(kansw[1]==2){kansw[1]=0};
tumotemp=hand1[num]
hand1[num]=hand1[hand1.length-1]
hand1[hand1.length-1]=100
console.log(tumotemp,hand1.length-1,hand1[num],hand1[hand1.length-1])
if(turn ==0 && ctl[1]==0){
if(ippatu[1]==1){ippatu[1]=2}
if(reach[1] ==2){
cx1.font = "bold 16px 'Century Gothic'";
cx1.fillStyle = "orange";
cx1.fillText("リーチ",640,465)
//リーチのアニメーションがあれば
ippatu[1]=1
reach[1]=3}
}
//cx1.clearRect(690,500,size,sizey)
if(handsort==0){
hand1.sort(compareFunc);
}else{
  var Hlast=hand1.pop();
  hand1.sort(compareFunc3) 
  hand1=hand1.concat(Hlast)
}
trash1.push(tumotemp)
//console.log(trash1)
ctl[2]=0
handgraph(0,1)
handgraph(1,1)

//ボタンとカーソルを消す
cx3.clearRect(326,348,148,142);
cx3.clearRect(630,400,160,80)
cx3.clearRect(200,370,360,120);
if(hand1[0] ==-3){
hand1[0]=-1
cx2.fillStyle = "rgba(20,20,20,0.5)";
//cx2.fillRect(630,400,80,40)
}
if(reach[1] ==0 || reach[1] ==1){
reach[1]=0;
cx2.clearRect(630,440,80,40)
cx2.fillStyle = "rgba(20,20,20,0.5)";
cx2.fillRect(630,440,80,40)
}
if(chara[1]!==0){
  //スキル欄
cx2.clearRect(710,400,80,40)
cx2.fillStyle = "rgba(20,20,20,0.5)";
cx2.fillRect(710,400,80,40)
}
}};
function Tumoname(){
  cx2.font = "14px Arial";
  cx2.fillStyle = "white";
  cx2.clearRect(630,320,160,40)
  cx2.fillText("捨牌：", 640, 340);
  var type1=donpai.findIndex(value=>value.id==tumotemp)
  if(type1==-1){
    console.log('Donpai error!')
    return false;
  }
  cx2.fillStyle = "white";
  cx2.fillText(donpai[type1].name, 680, 340);
  cx2.fillText(donpai[type1].sub,645,355);
  }    
function timer(t){//持ち時間をt秒とする 未使用
if(t>0){
clearTime = Date.now()
thinkTime =clearTime - startTime;
timerw=150*((t*1000 - thinkTime)/(t*1000))
cx2.clearRect(630,365,150,30)
cx2.fillStyle = "#007fd9";
cx2.fillRect(630,365,timerw,30)
if(thinkTime >t*1000){
PlayertoCpu(9);}
}}

  function turnrole(){
    console.log('turnrole',turn)
    console.log(reach[1],reach)
    //ネクストバッターのctl[n]を0にしてターンを回す
    //player->ツモったら1にする
    //無限に呼び出し処理が終わったら2にする?
    ponsw[0]=0;
    switch(turn){
      case 0:
        var Player1 =setInterval(function(){
          player1();
          //console.log(turn)
          if(ctl[1]>0){
          clearInterval(Player1);
          }
          }, 340);
        break;
      case 1:
        var Cpu2 =setTimeout(function(){
          cpu(2);
          if(ctl[2]>=1){clearTimeout(Cpu2)};
          }, 250);
        break;
      case 2:
        var Cpu3 =setTimeout(function(){
          cpu(3);
          if(ctl[3]>=1){clearTimeout(Cpu3)};
          }, 250);
        break;
      case 3:
        var Cpu4 =setTimeout(function(){
          cpu(4);
          if(ctl[4]>=1){clearTimeout(Cpu4)};
          }, 250);
        break;
    }
    }
    
  function player1(){
    //var pp=hand1.filter(value=>value==100);
    //console.log(pp,pp.length)
  if(ponsw[1]==1){
    //疲れたのでポン後は別の場所にしますわ
    //100var PE=hand1.findIndex(value=>value==100);hand1.splice(PE,1);
    judge(1);
    //リーチ判定だけ
    if(deck.length==0 && reach[1]!==3){reach[1]=0};
    if(reach[1] ==1){
      se1.play();
      drawbuttom(630,440,"リーチ")};
    if(chara[1] !==0 && skillswitch[1]==0){
      drawbuttom(710,400,"スキル");
    }
    setTimeout(()=>{
      cLock=1;
      corsor();
      console.log('操作可',cLock)
      },100)
  if(reach[1] ==0){cx2.clearRect(630,440,80,40)}
  }else{
  //山から1枚引いてくる
  if(deck.length<=0){console.log('deckerror');ryukyoku()}else{
  ctl[1]=1
  tumo =deck.shift();
  var PE=hand1.findIndex(value=>value==100);
  hand1[PE]=tumo;
  //console.log(hand1[9])
  decklength();
  }
  eltear.src=eltear_src[tumo]
  eltear.onload=function(){
  cx2.clearRect(690,500,size,sizey)
  cx2.drawImage(eltear,690,500,size,sizey)
  }
  if(reach[1] <3 && skillswitch[0]!==-1){
    //スキル
    if(skillswitch[1]==1 & cLock !==3){
    skillswitch[1]=0}
    if(chara[1]==1){
      //ガイザー条件
      if(trash1.length<2 && trash2.length<2 && trash3.length<2 && trash4.length<2){
        skillswitch[1]=1;
      }}
    if(chara[1] !==0 && skillswitch[1]==0){
      //cx2.clearRect(710,400,80,40)
      drawbuttom(710,400,"スキル");
    }
    }
  if(judge(1)){hand1[0]=-3};
  if(deck.length==0 && reach[1]!==3){reach[1]=0};
  if(reach[1] ==1){
    se1.play();
    drawbuttom(630,440,"リーチ")};
  if(hand1[0]==-3){
    se6.play();
    e18.src=eltearB_src[1];
    e18.onload=function(){
      e19.src=eltearB_src[2];
      e19.onload=function(){
    cx3.drawImage(e18,326,348,148,142)
    setTimeout(()=>{
    cLock=1;
    corsor();
    console.log('操作可',cLock)
    },100)
    }}
  }else{
    setTimeout(()=>{
  cLock=1
  corsor();
  console.log(hand1[0],reach[1])
  console.log('操作可',cLock)
  },100)
  }}};

  function cpu(chr){//expected chr=2,3,4
    //コピーよりも先にjudgeに行くことでエラーになっている？
    //r4も空回りしていない？大丈夫？
        console.log('cpu',chr,ctl)
        var cturn=chr -1
        //リーチしているならロン判定?
        if(turn !==cturn){
          switch(chr){
            case 2:
              if(hand2[0]==-2){//cpu2
                Ronturn.push(2);
                rorder[chr]=1;turn=turntemp;hand2[0]=-1;
                turnchecker();//他にロンする人がいないかチェックへ
              };
              break;
            case 3:
              if(hand3[0]==-2){//cpu2
                Ronturn.push(3);
                rorder[chr]=1;turn=turntemp;hand3[0]=-1;
                turnchecker();//他にロンする人がいないかチェックへ
              };
              break;
            case 4:
              if(hand4[0]==-2){//cpu2
                Ronturn.push(4);
                rorder[chr]=1;turn=turntemp;hand4[0]=-1;
                turnchecker();//他にロンする人がいないかチェックへ
              };
              break;
          }
          //***
        }
        if(turn ==cturn){//cpuの自分ターン
        if(ctl[chr] ==0){
        ctl[chr]=1//*
        if(deck.length<=0){
          console.log('deck.error!');
          ryukyoku();
        }else{
        //モつ
        switch(chr){
          case 2:
            Cpuhandtemp=hand2.concat();
            handtemp=Cpuhandtemp.concat(pon2)
            break;
          case 3:
            Cpuhandtemp=hand3.concat();
            handtemp=Cpuhandtemp.concat(pon3)
            break;
          case 4:
            Cpuhandtemp=hand4.concat();
            handtemp=Cpuhandtemp.concat(pon4)
            break;
        }
        //cpuponここから
        if(ponsw[chr]!==1){
        tumo2=deck.shift();
        var PEP=handtemp.findIndex(value=>value==100);
        handtemp[PEP]=tumo2
        Cpuhandtemp[PEP]=tumo2
      }}
        decklength();
        if(skillswitch[chr]==1){skillswitch[chr]=0}
    }
    if(ctl[chr] ==1){
        var PP=handtemp.findIndex(value=>value==100);
        if(PP!==-1){
          console.log(PP);
          var PEP=handtemp.findIndex(value=>value==100);
          handtemp[PEP]=tumo2
          Cpuhandtemp[PEP]=tumo2
        console.log('waitcpu',chr,ctl[chr],turn,ctlerror);
        setTimeout(()=>{
          cpu(chr);
          },100)
          return false;
        }
        if(judge(chr)){
          Cpuhandtemp[0]=-3;
        };
        if(Cpuhandtemp[0]==-3){
        //console.log(chr,'ツモスルーする条件がある？');
        if(reach[chr]==3 || deck.length==0){//流す理由が無い、つも
        console.log('cp',chr,'ツモ',han[chr])
        ctl[chr]=2
        TumoRon(chr,0)
        return false;
        }}
        if(Cpuhandtemp[0]==-1){
          if(ippatu[chr]==1){ippatu[chr]=2}
          //cpuskill(chr);//おいおい
          }
          ctl[chr]=2
          cpu(chr);
          }else if(ctl[chr]==2){
          //ctlswitch=0
          //if(ctlswitch==5){}
          cpuplay(chr);
          }
   }};

  function cpuplay(chr){
  //思考ルーチンに従い牌をきる
  ctlerror[chr]=0;
  //r4=9;//result
  if(gamestate==1){
  //console.log(Cpuhandtemp);
  if(reach[chr]==3){r4=Cpuhandtemp.length-1}else{
    Cpuhandtemp.sort(compareFunc);//これいるのか分からんが
    r4 =Cputumo(chr,cputype[chr]);//時間がかかるとしたらcputumoのこの部分
  }
  console.log('cpuplay',r4,Cpuhandtemp[r4])
  if(reach[chr]==2 && ippatu[chr]==0){
    if(deck.length==0){reach[chr]=0}else{
    reach[chr]=3;
    ippatu[chr]=1}}
    tumotemp=Cpuhandtemp[r4]
    Cpuhandtemp[r4]=100;
    Cpuhandtemp.sort(compareFunc);
  if(chr==2){
    trash2.push(tumotemp)
    hand2=Cpuhandtemp.concat();
  if(ponsw[chr]==1){ponsw[chr]=pon2.length;}
  ctl[3]=0;
  }else if(chr==3){
    trash3.push(tumotemp)
    hand3=Cpuhandtemp.concat();
  if(ponsw[chr]==1){ponsw[chr]=pon3.length;}
  ctl[4]=0;
  }else if(chr==4){
    trash4.push(tumotemp)
    hand4=Cpuhandtemp.concat();
    if(ponsw[chr]==1){ponsw[chr]=pon4.length;}
  }
  handgraph(r4,chr)
  }};
    
  function Cputumo(player,type){
    startTime = Date.now()
  //敵の思考ルーチン
  var cputumo =Cpuhandtemp.length-1;//何番目を切るのかを返す
  //console.log(handtemp[1],Cpuhandtemp[1]);
  //まずリーチできる場合
  var Count={};
  var Line={};
  var end=0;
  for(var i=1; i<handtemp.length;i++){
    var C=donpai.findIndex(value=>value.id==handtemp[i])
    var elm=donpai[C].name;
    var elm2=donpai[C].line
    Count[elm]=(Count[elm] || 0)+1
    Line[elm2]=(Line[elm2] || 0)+1
  }
  var keyj=Object.keys(Count);
  var keyj2=Object.keys(Line);
  //console.log(keyj.length);
  //console.log(keyj2.length);//expected 1~5
  var reachj=0;//同じキャラ2枚をカウント
  var tumoj=0;//同じキャラ3枚をカウント
  var kanj=0;//同じキャラ4枚をカウント
  for(var j=0;j<keyj.length;j++){
    //console.log(Count[keyj[j]]);
    if(Count[keyj[j]]==2){
      reachj+=1;
    }
    if(Count[keyj[j]]==3){
      tumoj+=1;
    }
    if(Count[keyj[j]]==4){
      kanj+=1;
    }
  }
        //ラインチェック
        switch(Line["0"]){
          case 2:
          case 1:
            if(keyj2.length==2){
              console.log('line tumo')
                if(reach[player]==1){reach[player]=2};
                cputumo=1+Math.floor(Math.random()*9);
                end=1;
            }
            if(keyj2.length==3){
              if(Line["1"]==1 || Line["2"]==1 || Line["3"]==1 || Line["4"]==1){
                console.log('line reach')
                if(reach[player]==1){reach[player]=2};
                //1枚しかないラインのやつをはじけ
                var A=Cpuhandtemp.filter(value=>value <=41 && value %3 ==0);
                var B=Cpuhandtemp.filter(value=>value <=41 && value %3 ==1);
                var C=Cpuhandtemp.filter(value=>value <=41 && value %3 ==2);
                var D=Cpuhandtemp.filter(value=>value ==42);
                if(A.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==A[0]);
                }else if(B.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==B[0]);
                }else if(C.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==C[0]);
                }else if(D.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==42);
                }else{
                  //
                  console.log('line error')
                  reach[player]=1;
                  cputumo=1+Math.floor(Math.random()*9)
                }
                end=1;
              }
            }
            break;
          default:
             //0line->undefined
            if(keyj2.length==1){
              console.log('line tumo')
              if(reach[player]==1){reach[player]=2};
              cputumo=1+Math.floor(Math.random()*9)
              end=1;
            }
            if(keyj2.length==2){
              if(Line[keyj2[0]]==1 || Line[keyj2[1]]==1){
                console.log('line reach')
                if(reach[player]==1){reach[player]=2};
                //1枚しかないラインのやつをはじけ
                var A=Cpuhandtemp.filter(value=>value <=41 && value %3 ==0);
                var B=Cpuhandtemp.filter(value=>value <=41 && value %3 ==1);
                var C=Cpuhandtemp.filter(value=>value <=41 && value %3 ==2);
                var D=Cpuhandtemp.filter(value=>value ==42);
                if(A.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==A[0]);
                }else if(B.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==B[0]);
                }else if(C.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==C[0]);
                }else if(D.length==1){
                  cputumo=Cpuhandtemp.findIndex(value=>value==42);
                }else{
                  //
                  console.log('line error')
                  reach[player]=1;
                  cputumo=1+Math.floor(Math.random()*9)
                }
                end=1;
              }
            }
          break;
        }
        if(end>0){
        console.log('Cputumo',player,type,cputumo)
        clearTime = Date.now()
        thinkTime =clearTime - startTime;
        console.log(thinkTime)
        return cputumo;
        }
        //ペアチェック
        switch(Line["0"]){
          case 2:
            //リーチとなるのは3,4 4,2,1 3,2,1,1 2,2,2,1
            if(keyj.length==4){
              if(tumoj==1 && reachj==0){
                console.log('line reach')
                end=4;
              }
            }
            if(keyj.length==5){
              if(kanj==1 && reachj==1){
                console.log('line reach')
                end=4;
              }
              //ツモとなるのは3,3,1 3,2,2
              if(tumoj==2 && reachj==0){
                end=1;
              }
              if(tumoj==1 && reachj==2){
                end=2;
              }
            }
            if(keyj.length==6){
              if(tumoj==1 && reachj==1){
                console.log('line reach')
                end=1;
              }
              if(tumoj==0 && reachj==3){
                console.log('line reach')
                //all以外なら何でも
                end=2;
              }
            }
            break;
          case 1:
            //リーチとなるのは4,2,2 3,4,1 3,3,1,1 3,2,2,1 
            if(keyj.length==4){
              if(tumoj==1 && reachj==0){
                //cputumo=1+Math.floor(Math.random()*9);
                end=4;
                console.log('line reach')
              }
              if(tumoj==0 && reachj==2){
                end=4;
                console.log('line reach')
              }
            }
            if(keyj.length==5){
              if(tumoj==2 && reachj==0){
                end=1;
                console.log('line reach')
              }
              if(tumoj==1 && reachj==2){
                end=1;
                console.log('line reach')
              }
            }
            //ツモとなるのは3,3,2
            if(tumoj==2 && reachj==1){
              end=3;
              //アガリ
            }
            break;
          default:
              //リーチとなるのは3,3,2,1 or 3,4,2
            if(tumoj==2 && reachj==1){
              end=1;
            }
            if(tumoj==1 && reachj==1 && kanj==1){
              end=4;
            }
            if(tumoj==3){
              //アガリ
              end=3;
            }
            break;
      }
  //end 4->4枚あるやつを切って立直　ポンしてないやつ
  //end 1->1枚あるやつを切って立直
  //end 3->オールマイティ以外なら何でも　ポンしてないやつ
      if(end>0){
        console.log('end',end)
        if(reach[player]==1){reach[player]=2};
        switch(end){
          case 2:
          case 3:
          case 4:
            var resultH=[];
            var resultF=Object.keys(Count).filter((key)=>Count[key]==end);//->あればキャラ名が帰ってくる
            var F=resultF.findIndex(value=>value =="アリエル")
            if(F!==-1){resultF.splice(F,1)}
            var FF=resultF.findIndex(value=>value =="ルリエル")
            if(FF!==-1){resultF.splice(FF,1)}
            var R=Math.floor(Math.random()*resultF.length)
            console.log(resultF,R)
            var E=donpai.filter(value=>value.name==resultF[R]);
            for(var i=0; i<E.length ; i++){
              var A=Cpuhandtemp.findIndex(value=>value==E[i].id);//ポンに含まれていない
              if(A!==-1){
            resultH.push(A);
              }
          }
            //console.log(resultH);
            if(resultH.length >0){
              var N=Math.floor(Math.random()*resultH.length);
              cputumo=resultH[N]
              console.log(cputumo,N)
            }
            break;
          case 1:
            var resultH=[];
            for(var i=0;i<13;i++){
              var I=Cpuhandtemp.filter(value=>value/3 >=i && value/3 <i+1)
              if(I.length==1){
                resultH.push(I[0])
              }
            }
            var J=Cpuhandtemp.filter(value=>value>=39 && value <=42)
            if(J.length==1){
              resultH.push(J[0])
            }
            //console.log(resultH);
            if(resultH.length >0){
              var N=Math.floor(Math.random()*resultH.length);
              cputumo=Cpuhandtemp.findIndex(value=>value==resultH[N]);
              console.log(cputumo,N)
              return cputumo;
            }
            break;          
        }
        clearTime = Date.now()
        thinkTime =clearTime - startTime;
        console.log(thinkTime)
        return cputumo;
      }
  //非テンパイ時 -1になってる原因この辺にありそう
  if(type ==0){
    //1つのライン6枚以上あればラインを狙いに行く,ポンしない
    //1つのライン5枚以上あればラインを狙いに行く,1/2の確率でポンしない
    //ライン条件該当しないなら（オールマイティ以外の）1枚しか持っていないキャラを優先して切る
    //↑2つに該当しなければ（オールマイティ以外の）ランダムに切る
    var resultF=Object.keys(Line).find((key)=>Line[key]>5);//->あればlineが帰ってくる
    //console.log(resultF);
    //var resultG =[];for( const [key,value] of Object.entries(Line)){resultG.push(key,value);}console.log(resultG);//[key,value,key,value...]の配列ができる
    if(ponsw[player]<3 && resultF !==undefined){
      var resultFF=Object.keys(Line).find((key)=>Line[key]==5);//->あればlineが帰ってくる
      if(resultFF !==undefined){
        if(ponsw[player]<3){poncpu[player]=0.5};
      }else{
      if(ponsw[player]<3){poncpu[player]=1};
      }
      resultF-=1;
      var E=Cpuhandtemp.filter(value=>value==42 || (value>=0 &&value<42 && value%3!==resultF));
      console.log(E);
      var F=Math.floor(Math.random()*E.length)
      cputumo=Cpuhandtemp.findIndex(value=>value==E[F]);
      console.log('noten',cputumo)
      return cputumo;
    }
    //各キャラ算出
    var resultH=[];
    for(var i=0;i<13;i++){
      var I=Cpuhandtemp.filter(value=>value/3 >=i && value/3 <i+1)
      if(I.length==1){
        resultH.push(I[0])
      }
    }
    var J=Cpuhandtemp.filter(value=>value>=39 && value <=42)
    if(J.length==1){
      resultH.push(J[0])
    }
    //console.log(resultH);
    if(resultH.length >0){
      var N=Math.floor(Math.random()*resultH.length);
      cputumo=Cpuhandtemp.findIndex(value=>value==resultH[N]);
      //console.log(cputumo,N)
      console.log('noten',cputumo)
      return cputumo;
    }
    console.log('nokori')
    var K=Cpuhandtemp.filter(value=>value>=0 && value <=42)
    var KK=Math.floor(Math.random()*K.length);
    cputumo=Cpuhandtemp.findIndex(value=>value==K[KK]);
    return cputumo;
  }else if(type==1){//ランダムに切る
    cputumo =1+ Math.floor(Math.random()*(Cpuhandtemp.length-1));
  }
  console.log('Cputumo',player,type,cputumo)
  return cputumo;
  }
  
  function judge(player,mode=0){
    //自摸牌＋自分の手札を使ってアガれる形か否か
    //リーチ可能ならreach[player]を1にする
    //ツモ可能ならreturn trueする
    //mode 0->そのまま　1->参照時点でのhandtempで上がり判定のみやる
    var Count={};
    var Line={};
    var reachR=0;
    var PonN=0
    switch(mode){
      case 1:
        reachR=1;
        var HH=handtemp.findIndex(value=>value==100);
      break;
      default:
          switch(player){
            case 1:
            handtemp = hand1.concat(pon1);
            PonN=pon1.length;
            break;
            case 2:
              PonN=pon2.length;
            case 3:
              PonN=pon3.length;
            case 4:
              PonN=pon4.length;
              //handtempはcpu先でコピー済
            break;
            default:
            handtemp = hand2.concat();
            //自信ないから残しとく
            break;
          }
          //下でCがエラー吐くことがある　100が2つある？
          handtemp.sort(compareFunc);
          var HH=handtemp.filter(value=>value==100);
          //console.log(HH,handtemp)
          if(HH.length>0){
            console.log('handtemp error?')
            return false;
          }
      break;
    }
        for(var i=1; i<handtemp.length;i++){
          var C=donpai.findIndex(value=>value.id==handtemp[i])
          var elm=donpai[C].name;//cpuでerror?
          var elm2=donpai[C].line
          Count[elm]=(Count[elm] || 0)+1
          Line[elm2]=(Line[elm2] || 0)+1
        }
        console.log(Count);
        console.log(Line);
        //リーチできるならreach[player]=1;
        //アガリ系は3ペアorライン統一
        //ラインチェック
        var keyj2=Object.keys(Line);
        //console.log(keyj2.length);//expected 1~5
        var reachj=0;//同じキャラ2枚をカウント
        var tumoj=0;//同じキャラ3枚をカウント
        var kanj=0;//同じキャラ4枚をカウント
        var keyj=Object.keys(Count);
        //console.log(keyj.length);
        //Count.length->undefined
        for(var j=0;j<keyj.length;j++){
          //console.log(Count[keyj[j]]);
          if(Count[keyj[j]]==2){
            reachj+=1;
          }
          if(Count[keyj[j]]==3){
            tumoj+=1;
          }
          if(Count[keyj[j]]==4){
            kanj+=1;
          }
        }
        if(PonN==0){
        switch(Line["0"]){
          case 2:
          case 1:
            if(keyj2.length==2){
              console.log('line tumo')
              if(reach[player]==0 && reachR==0){reach[player]=1};
                return true;
            }
            if(keyj2.length==3){
              if(Line["1"]==1 || Line["2"]==1 || Line["3"]==1 || Line["4"]==1){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            break;
          default:
             //0line->undefined
            if(keyj2.length==1){
              console.log('line tumo')
              if(reach[player]==0 && reachR==0){reach[player]=1};
                return true;
            }
            if(keyj2.length==2){
              if(Line[keyj2[0]]==1 || Line[keyj2[1]]==1){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
          break;
        }
      }
        //カン時のペアチェック
        if(kansw2[player]>0){
          //カン2回なら3+4+4 カン1回なら3+3+4
      switch(Line["0"]){
          case 2:
            if(kansw2[player]==2){
              //どうあがいてもツモ
              if(reach[player]==0 && reachR==0){reach[player]=1};
              //アガリ
              return true;
            }
            if(kansw2[player]==1){
              //リーチとなるのは4,n,n+4 2,1,1,n,n+4
              if(keyj.length==4){
                if(kanj==2){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              if(keyj.length==6){
                if(kanj==1 && tumoj==0 && reachj==1){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモとなるのは3,1,n,n+4  2,2,n,n+4
              if(keyj.length==5){
                if(kanj==1 && tumoj==0 && reachj==2){                
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
                }
                if(kanj==1 && tumoj==1 && reachj==0){                
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
                }
              }
            }
            break;
          case 1:
            if(kansw2[player]==2){
              //リーチ1,1,n,4,4
              if(keyj.length==4){
                if(kanj==2 && reachj==0){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモ2,n,4,4
              if(keyj.length==5){
                if(kanj==2 && reachj==1){                
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
                }
              }
            }
            if(kansw2[player]==1){
              //リーチ 3,1,1,n+4  2,2,1,n+4 4,1,n+4
              if(keyj.length==5){
                if(kanj==1 && tumoj==1 && reachj==0){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
                if(kanj==1 && reachj==2){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
                if(kanj==2){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモ 3,2,n+4 閉廷
              if(kanj==1 && tumoj==1 && reachj==1){
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
              }
            }
            break;
          default:
            if(kansw2[player]==2){
              //リーチ1,2,4,4
              if(keyj.length==4){
                if(reachj==1){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモ3,4,4
              if(keyj.length==3){
                if(kanj==2 && tumoj==1){                
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
                }
              }
            }
            if(kansw2[player]==1){
              //リーチ 3,2,1,+4  4,2+4
              if(keyj.length==4){
                if(kanj==1 && tumoj==1 && reachj==1){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              if(keyj.length==3){
                if(kanj==2 && reachj==1){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモ 3,3,4 閉廷
              if(kanj==1 && tumoj==2){
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
              }
            }
            break;
        }
    }else{
        //3ペアチェック 同キャラ6枚は考えないことにする
        switch(Line["0"]){
          case 2:
            //リーチとなるのは3,4 4,2,1 3,2,1,1 2,2,2,1
            if(keyj.length==4){
              if(tumoj==1 && reachj==0){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            if(keyj.length==5){
              if(kanj==1 && reachj==1){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            if(keyj.length==6){
              if(tumoj==1 && reachj==1){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
              if(tumoj==0 && reachj==3){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            //ツモとなるのは3,3,1 3,2,2
            if(keyj.length==5){
              if(tumoj==2 && reachj==0){
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
              }
              if(tumoj==1 && reachj==2){
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
              }
            }
            break;
          case 1:
            //リーチとなるのは4,2,2 3,4,1 3,3,1,1 3,2,2,1 
            if(keyj.length==4){
              if(tumoj==1 && reachj==0){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
              if(tumoj==0 && reachj==2){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            if(keyj.length==5){
              if(tumoj==2 && reachj==0){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
              if(tumoj==1 && reachj==2){
                console.log('line reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            //ツモとなるのは3,3,2
            if(tumoj==2 && reachj==1){
              if(reach[player]==0 && reachR==0){reach[player]=1};
              //アガリ
              return true;
            }
            break;
          default:
              //リーチとなるのは3,3,2,1 or 3,4,2
            if(tumoj==2 && reachj==1){
              if(reach[player]==0 && reachR==0){reach[player]=1};
            }
            if(tumoj==1 && reachj==1 && kanj==1){
              if(reach[player]==0 && reachR==0){reach[player]=1};
            }
            if(tumoj==3){
              if(reach[player]==0 && reachR==0){reach[player]=1};
              //アガリ
              return true;
            }
            break;
      }
    }
      //国士無双:エピックラインのみ、かつ同パイを含まない
      var Kokushi=[0,3,7,10,13,15,18,21,24,28,31,34,36,41,43,44]
      var Kreach=0;
      var KKreach=0;
      for(var k=1;k<handtemp.length;k++){
        var A=Kokushi.findIndex(value=>value==handtemp[k])
        if(A!==-1){
          var B=handtemp.filter(value=>value==handtemp[k])
        KKreach+=B.length-1;
        //KKreachは0か2かそれ以上
      }else{Kreach+=1}
        if(Kreach>2){break;}
        }
      console.log(Kreach);
      if(Kreach==1){
        if(KKreach==0){
          console.log('国士リーチ');
          if(reach[player]==0 && reachR==0){reach[player]=1};
        }
      }
      if(Kreach==0){
        if(KKreach==2){
          console.log('国士リーチ');
          if(reach[player]==0 && reachR==0){reach[player]=1};
        }else if(KKreach==0){
          //国士ツモ
          if(reach[player]==0 && reachR==0){reach[player]=1};
          //アガリ
          return true;
        }
      }
      console.log('judge',player)
    }//judge

  function ron(player){//ロン
    console.log('ron'+player,reach[player]);
    var result=0;
    if(reach[player]!==3){
      //立直していなければ基本的にロンできない
      //console.log('ron false');
      return false;
    }
    handtemp=[];
    switch(player){
      case 1:
        handtemp = hand1.concat(pon1);
      break;
      case 2:
        handtemp = hand2.concat(pon2);
      break;
      case 3:
        handtemp = hand3.concat(pon3);
      break;
      case 4:
        handtemp = hand4.concat(pon4);
      break;
    }

    var HH=handtemp.findIndex(value=>value==100);
    console.log(HH,handtemp)
    if(HH !==-1){
      handtemp[HH]=tumotemp
    }
    handtemp.sort(compareFunc);
      //役チェック
      if(judge(player,1)){
      if(player ==1){hand1[0]=-2}
      if(player ==2){hand2[0]=-2}
      if(player ==3){hand3[0]=-2}
      if(player ==4){hand4[0]=-2}
      console.log('ロン可')
      }
      };
  
  function TumoRon(player,num){
    //上がった画面描画～次のゲーム,num=0→ツモ,1~→ロン
    console.log("tumoron",player,num,ctl)
    console.log(ponsw[player])
    se7.play();
    cLock=0
    gamestate=-1
    var vichand=[]
    var ponf=0
    if(player ==1){
      handtemp = hand1.concat();
      handtemp=handtemp.concat(pon1);
      handtemp.sort(compareFunc);
      if(ponsw[player]>0){
      ponf=Math.floor(pon1.length/3);
      //100を[9]にしたい
    }}
    if(player ==2){
      handtemp = hand2.concat();
        handtemp=handtemp.concat(pon2);
        handtemp.sort(compareFunc);
        if(ponsw[player]>0){
        ponf=Math.floor(pon2.length/3);
      }}
    if(player ==3){
      handtemp = hand3.concat();
        handtemp=handtemp.concat(pon3);
        handtemp.sort(compareFunc);
        if(ponsw[player]>0){
        ponf=Math.floor(pon3.length/3);
      }}
    if(player ==4){
      handtemp = hand4.concat();
        handtemp=handtemp.concat(pon4);
        handtemp.sort(compareFunc);
        if(ponsw[player]>0){
        ponf=Math.floor(pon4.length/3);
      }}
    console.log(handtemp[9]); 
    if(num>0){
    handtemp[9]=tumotemp
    }else if(player !==1){
      handtemp[9]=tumo2;
    }
    console.log(handtemp[9]);
    vichand=Array.from(handtemp)
    //handtemp.sort(compareFunc);
    var Astyle=Nodyaku(player);//ラインorペア
    //3ペア→+30符
    fu =30;
    if(Astyle=="3ペア"){
      fu+=30;
      fu-=10*ponf;
    }
    if(Astyle=="国士無双"){
      fu+=30;
      han[player]+=6;
    }
    if(num==0){han[player] +=1}//ツモ役
    //if(reach[player]==3){han[player] +=1}//立直は廃止
    if(ippatu[player]==1){han[player] +=1}
    if(deck.length ==0){han[player] +=1};//海底
    if(ponsw[player] >0){han[player] -=2};//鳴き
    for(var i=0; i<dora.length ; i++){

    }
    var doracheck =Doracheck(player);
    function Doracheck(player){
      var result =0
      if(reach[player]==3){dora.push(king[6])
        var DD=dora[dora.length-1]+1
        if(DD>=45){DD=0;}
        e7.src=eltear_src[DD]
      e7.onload=function(){
      dorax+=40
      cx.drawImage(e7,dorax,10,33,43.5)
      }}
      //console.log(dora)
      for(var D=0 ; D< dora.length ; D++){
      var DD=dora[D]+1
      if(DD>=45){DD=0;}
      var dorahand =handtemp.filter(value => value== DD )
      han[player]+= dorahand.length
      result +=dorahand.length
      }
      console.log('dora',result)
      return result
      }
      nodyaku =Nodyaku2(player)
      han[player] +=nodyaku[0];
    rootscore =Score(player);
    //役満ブロック
    if(mode==0){
    if(rootscore>220000){
      rootscore=220000;
    }else if(rootscore>150000){
      rootscore=150000;
    }else if(rootscore>100000){
      rootscore=100000;
    }else if(rootscore>75000){
      rootscore=75000;
    }else if(rootscore>50000){
      rootscore=50000;
    };
  }
    if(parent==0){Scorepay(player,4,num)}else{Scorepay(player,parent,num)}
    
    var i=1
    var hai=vichand[i];
    console.log(hai);
    var haix =15
    var haiy =120
    //cx2.clearRect(630,60,160,320)
    cx2.clearRect(10,100,780,400)
    cx2.fillStyle = "rgba(20,20,20,0.7)";
    cx2.fillRect(10,100,780,400)
    e8.src=eltear_src[hai]
    e8.onload=function(){
      cx2.drawImage(e8,haix,haiy,size,sizey)
      haix +=size
      i +=1
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size
        i +=1
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size
        i +=1
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size
        i +=1
    //console.log(h)
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size
        i +=1
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size
        i +=1
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size
        i +=1
        if(kansw2[player]>0){
          hai=vichand[i]
          handE10.src=eltear_src[hai]
          var haixx=haix;
          haix +=size
          i +=1
          handE10.onload=function(){
            cx2.drawImage(handE10,haixx,haiy,size,sizey)
        }}
        if(kansw2[player]>1){
          hai=vichand[i]
          handE11.src=eltear_src[hai]
          var haixxx=haix;
          haix +=size
          i +=1
          handE11.onload=function(){
            cx2.drawImage(e8,haixxx,haiy,size,sizey)
        }}
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        haix +=size+10
        i +=1
    //console.log(h)
      hai=vichand[i]
      e8.src=eltear_src[hai]
      e8.onload=function(){
        cx2.drawImage(e8,haix,haiy,size,sizey)
        i +=1
        //{}閉じるかっこは最後にまとめて
    //console.log(i)
    haiy=250
    cx2.font = "20px 'Century Gothic'";
    cx2.fillStyle ="white";
    haix=30
    console.log(Astyle);
    cx2.fillText(Astyle,haix,haiy)
    haiy +=35
    if(counter[player] ==0){
      if(num==0){cx2.fillText('天和 4翻',haix,haiy)}
      if(num>0){cx2.fillText('地和 4翻',haix,haiy)}
      haiy +=25
      }
      if(Astyle=="国士無双"){
        cx2.fillText('国士無双 6翻',haix,haiy)
        haiy +=25
      }
    if(num==0){
    cx2.fillText('ツモ 1翻',haix,haiy)
    haiy +=25}
    if(ippatu[player]==1){
    cx2.fillText('一発 1翻',haix,haiy)
    haiy +=25
    }
    if(deck.length ==0){
    cx2.fillText('海底 1翻',haix,haiy)
    haiy +=25
    }
    if(doracheck>0){
      cx2.fillText('ドラ '+doracheck+'翻',haix,haiy)
      haiy +=25
      }
    if(ponsw[player] >0){
        cx2.fillText('鳴き -2翻',haix,haiy)
        haiy +=25
        }
      haiy=250
      haix=390;
    cx2.textAlign = "right";
    if(nodyaku[0] >0){
      for(var i=1 ;i<nodyaku.length;i++){
      cx2.fillText(nodyaku[i],haix,haiy)
      haiy+=25
      if(haiy>400){
        haix+=240
        haiy=250
      }
      }}
    cx2.textAlign = "start";
    cx2.font = "26px 'Century Gothic'";
    cx2.fillStyle ="white";
    //cx2.fillText(fu+"符",530,260)
    cx2.fillText(han[player]+"翻",530,360)
    cx2.font = "28px 'Century Gothic'";
    if(mode==0){
    if(rootscore==220000){
    cx2.fillStyle ="red";
    cx2.fillText("数え役満",630,360)}
    if(rootscore==150000){
    cx2.fillStyle ="red";
    cx2.fillText("三倍満",630,360)}
    if(rootscore==100000){
    cx2.fillStyle ="red";
    cx2.fillText("二倍満",630,360)}
    if(rootscore==75000){
    cx2.fillStyle ="red";
    cx2.fillText("跳満",630,360)}
    if(rootscore==50000){
    cx2.fillStyle ="red";
    cx2.fillText("満貫",630,360)}
    }
    //cx2.font = "28px 'Century Gothic'";
    cx2.strokeStyle ="#ff4c38";
    cx2.lineWidth = 5;
    cx2.lineJoin = 'round';
    cx2.fillStyle ="white";
    cx2.strokeText("　　　 "+score,530,400)
    cx2.fillText("戦闘力 "+score,530,400)
    //5番の人食いしばり
    for(var i=1 ;i<5; i++){
    if(LP[i]<0 && chara[i]==5){
    if(skillusage[i]==0 && skillusage2[i]==0){
    LP[i]=1
    skillusage2[i]=1
    cx2.font = "bold 24px 'Century Gothic'";
    cx2.fillStyle ="#ff4c38";
    cx2.fillText("耐",i*200-60,490)
    }}
  }
    cx2.font = "24px 'Century Gothic'";
    cx2.fillStyle ="white";
    cx2.fillText("プレイヤー",30,430)
    cx2.fillText(chrlist[chara[1]],30,460)
    cx2.fillText(LPtemp[1],30,490)
    cx2.fillText("ＣＰＵ２",230,430)
    cx2.fillText(chrlist[chara[2]],230,460)
    cx2.fillText(LPtemp[2],230,490)
    cx2.fillText("ＣＰＵ３",430,430)
    cx2.fillText(chrlist[chara[3]],430,460)
    cx2.fillText(LPtemp[3],430,490)
    cx2.fillText("ＣＰＵ４",630,430)
    cx2.fillText(chrlist[chara[4]],630,460)
    cx2.fillText(LPtemp[4],630,490)
    
    gamestate =2
    loopX=0
    loopX2=0;
    alpha=1;
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
    if(num==0){e16.src=win_src[7]}else{e16.src=win_src[8]}
    e16.onload=function(){window.requestAnimationFrame((ts)=>LoopAnimation(ts))}
  }
    }}}};
    }}}};
    };
    }

  function Score(player){
    //符　tumoronで一部出してる
    //オールマイティ1枚につき-10
    var All=handtemp.filter(value=>value==43 || value==44)
    //console.log(All.length);
    fu-=-10*(All.length)
    var Wind=Buff[player].filter(value=>value==3);
    if(Wind.length){
      fu+=10*Wind.length;
    }
    if(fu<20){fu=20};
    var fuH =0;
    var fuC =0
    if(han[player]<=0){han[player]=1};
    var h=han[player]+6
    var hellhan=0
    hellhan=fu*3*(1+h+(h*h)/2+(h*h*h)/6)
    hellhan=Math.ceil(hellhan/100)*100
    console.log(fu,hellhan)
    return hellhan
    };

  function Scorepay(player,parentS,num){
    //type0 通常 type1 サバイバル（予定）
    if(player ==parentS){
    score =rootscore *1.5
    skillusage2[0]-=1;
    skillusage2[5]+=1
    if(parent ==0){parent =3}else{parent -=1}
    }else{score=rootscore
    skillusage2[5]=0
    }
    //支払いしないならここまで
    if(LP[0] !==3){
    LPtemp=[0,0,0,0,0]
    if(num >0){//ロン
      LPtemp[player]+=score;
      var MS=Buff[num].filter(value=>value==2);
      if(MS.length){
        LPtemp[num]+=Math.floor(score*(MS.length)/10);
      }
    LPtemp[num]-=score
    }
    if(num ==0){
    if(player==parentS){//おやつも
    for(var i=1;i<LP.length;i++){
    if(i==player){
      LPtemp[i]+=score;
    }else{
      LPtemp[i]-=score/3;
      var MS=Buff[i].filter(value=>value==2);
      if(MS.length){
        LPtemp[i]+=Math.floor((score/3)*(MS.length)/10);
      }
    }
    }}
    if(player!==parentS){//こつも
    for(var i=1;i<LP.length;i++){
    if(i==player){
      LPtemp[i]+=score
    }else if(i==parentS){LPtemp[i]-=score/2;
    var MS=Buff[i].filter(value=>value==2);
    if(MS.length){
      LPtemp[i]+=Math.floor((score/2)*(MS.length)/10);
    }
    }else{LPtemp[i]-=score/4
    var MS=Buff[i].filter(value=>value==2);
    if(MS.length){
      LPtemp[i]+=Math.floor((score/4)*(MS.length)/10);
    }
  }
    }
    }}
    for(var i=1; i<LP.length;i++){
      if(chara[i]==2){//ちゃん様復活関連
        if(LP[i]+LPtemp[i]<0){
      skillusage2[i]=0
        }
      }
    LP[i]+=LPtemp[i]
    }
  switch(LP[0]){
    case 0:
    case 1:
    if(player==parentS && skillusage2[0]==7){//オーラスで1位なら対局終了
    var LPrank=[
    {chara:1, elia:LP[1]},
    {chara:2, elia:LP[2]},
    {chara:3, elia:LP[3]},
    {chara:4, elia:LP[4]},
      ]
    LPrank.sort(compareFunc2);
    if(LPrank[3].chara ==parentS){
    skillusage2[0]+=1;
    console.log('オーラス',skillusage2[0])
    }
    }
    break;
    case 2:
      //ミリオネア
    if(LP[1]>=1000000 || LP[2]>=1000000 || LP[3]>=1000000 || LP[4]>=1000000){
    var LPrank=[
      {chara:1, elia:LP[1]},
      {chara:2, elia:LP[2]},
      {chara:3, elia:LP[3]},
      {chara:4, elia:LP[4]},
        ]
      LPrank.sort(compareFunc2);
    }
    break;
    }}
  }

  function Nodyaku(player,mode=0){//アガリ条件チェック
    //ラインとペアの確認
    var result=0
    cx2.fillStyle = "white";
      handtemp.sort(compareFunc);
      //console.log(handtemp[9],handtemp)
          var Count={};
          var Line={};
          for(var i=1; i<handtemp.length;i++){
            var C=donpai.findIndex(value=>value.id==handtemp[i]);
            if(C==-1){
              console.log(handtemp[i],'Nodyaku eroor!')
              break;
            }
            var elm=donpai[C].name;
            var elm2=donpai[C].line
            Count[elm]=(Count[elm] || 0)+1
            Line[elm2]=(Line[elm2] || 0)+1
          }
          console.log(Count);
          console.log(Line);
          //アガリ系は3ペアorライン統一
          //ラインチェック
          var keyj2=Object.keys(Line);
          //console.log(keyj2.length);//expected 1~5
          switch(Line["0"]){
            case 2:
            case 1:
              if(keyj2.length==2){
                console.log('line tumo',keyj2[1])
                result="ライン通貫"
                  return result;
              }
              break;
            default:
               //0line->undefined
              if(keyj2.length==1){
                console.log('line tumo')
                result="ライン通貫"
                  return result;
              }
            break;
          }
          //3ペアチェック 同キャラ6枚は考えないことにする
          var reachj=0;//同じキャラ2枚をカウント
          var tumoj=0;//同じキャラ3枚をカウント
          var kanj=0;
          var keyj=Object.keys(Count);
          //console.log(keyj.length);
          //Count.length->undefined
          for(var j=0;j<keyj.length;j++){
            //console.log(Count[keyj[j]]);
            if(Count[keyj[j]]==2){
              reachj+=1;
            }
            if(Count[keyj[j]]==3){
              tumoj+=1;
            }
            if(Count[keyj[j]]==4){
              kanj+=1;
            }
          }
          //ルリエルとアリエルは別名扱いに注意
          console.log(tumoj,reachj);
          if(kansw[player]>0){
            switch(Line["0"]){
              case 2:
                if(kansw[player]==2){
                    console.log('chara tumo')
                    result="3ペア"
                      return result;
                }
                if(kansw[player]==1){
                //ツモとなるのは3,1,n+n+4 2,2,n,n+4
                if(keyj.length==5){
                  if(tumoj==1 && reachj==0){
                    console.log('chara tumo')
                    result="3ペア"
                      return result;
                  }
                  if(tumoj==0 && reachj==2){
                    console.log('chara tumo')
                    result="3ペア"
                      return result;
                  }
                }
              }
                break;
              case 1:
                if(kansw[player]==2){
                  //2,n,4+4
                  if(reachj==2){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
              }}
              if(kansw[player]==1){
              //ツモとなるのは3,2,n+4
              if(keyj.length==4){
                if(tumoj==1 && reachj==1){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
                }
              }
            }
                break;
              default:
                //4,4,3
                if(kansw[player]==2){
                  if(tumoj==1){
                    console.log('chara tumo')
                    result="3ペア"
                      return result;
                  }
                }
                if(kansw[player]==1){
                  //3,3,4
                if(tumoj==2){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
                }
              }
                break;
          }
          }else{
          switch(Line["0"]){
            case 2:
              //ツモとなるのは3,3,1 3,2,2
              if(keyj.length==5){
                if(tumoj==2 && reachj==0){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
                }
                if(tumoj==1 && reachj==2){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
                }
              }
              break;
            case 1:
              //ツモとなるのは3,3,2
              if(tumoj==2 && reachj==1){
                console.log('chara tumo')
                result="3ペア"
                  return result;
              }
              break;
            default:
              if(tumoj==3){
                console.log('chara tumo')
                result="3ペア"
                  return result;
              }
              break;
        }
      }
          //国士無双:エピックラインのみ、かつ同パイを含まない
          var Kokushi=[0,3,7,10,13,15,18,21,24,28,31,34,36,41,43,44]
          var Kreach=0;
          var KKreach=0;
          for(var k=1;k<handtemp.length;k++){
          var A=Kokushi.findIndex(value=>value==handtemp[k])
          if(A!==-1){
            var B=handtemp.filter(value=>value==handtemp[k])
          KKreach+=B.length-1;
        }else{Kreach+=1}
          if(Kreach>2){break;}
          }
          if(Kreach==0 && KKreach==0){
              //アガリ
              console.log('kokushi tumo')
              result="国士無双"
              return result;
            }
    }

  function Nodyaku2(player,mode=-1){//役
    //該当するシナジーの組み合わせ（同キャラは重複しない）を判定
      //mode>=0 は右枠に表示 kの場合はhandtemp->hand1にしてください
      var result=0
      var noddes=[]
      var nodpair1
      var nodpair2
      var nodpair3
      var resultA=[0]
      cx2.fillStyle = "white";
      var yy=210;
      var xx=635
      if(mode==-1){
        nodpair1=handtemp.findIndex(value=>value==18);
        if(nodpair1 !==-1){
          resultA[0]+=1
          resultA.push("貫徹する足取り1/1 1翻")}
          nodpair1=handtemp.findIndex(value=>value==19);
          if(nodpair1 !==-1){
            resultA[0]+=1
            resultA.push("豊かな足取り1/1 1翻")}
            nodpair1=handtemp.findIndex(value=>value==20);
            if(nodpair1 !==-1){
              resultA[0]+=1
              resultA.push("上手な足取り1/1 1翻")}
      nodpair1=handtemp.findIndex(value=>value==35);
      if(nodpair1 !==-1){
        resultA[0]+=1
        resultA.push("ラビィの友達1/1 1翻")}
      nodpair1=handtemp.findIndex(value=>value==42);
      if(nodpair1 !==-1){
        resultA[0]+=1
        resultA.push("機械工学1/1 1翻")}
      nodpair1=handtemp.findIndex(value=>value==14);
      nodpair2=handtemp.findIndex(value=>value==41);
      if(nodpair1 !==-1 && nodpair2 !==-1 ){
        resultA[0]+=1
        resultA.push("戦場の天使2/2 1翻")}
      nodpair1=[11,23,31,34,38];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("痛いから問題ない"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[1,3,15,22];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("属性鍛錬者"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
  
      nodpair1=[4,19,23,26,29,31,32];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("渇望"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[0,9,21];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("原初的な動き"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[3,13,17,25,37,42];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("探求する者"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[4,20,34];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("マナ守護"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[2,11,17,39,30,37];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("巨人審判者"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[27,28,29];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("魔族"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
        nodpair1=[6,7,8];
        nodpair2=[];
        for(var i=0;i<nodpair1.length;i++){
          var A=handtemp.findIndex(value=>value==nodpair1[i]);
          if(A!==-1){nodpair2.push(nodpair1[i])}
        }
        if(nodpair2.length >=2){
          var B=1+Math.floor((nodpair2.length-1)/2)
          resultA[0]+=B
          resultA.push("精霊の加護"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
          nodpair1=[12,13,14,24,42];
          nodpair2=[];
          for(var i=0;i<nodpair1.length;i++){
            var A=handtemp.findIndex(value=>value==nodpair1[i]);
            if(A!==-1){nodpair2.push(nodpair1[i])}
          }
          if(nodpair2.length >=2){
            var B=1+Math.floor((nodpair2.length-1)/2)
            resultA[0]+=B
            resultA.push("ナソード研究"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[5,26,32];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("時空間"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[10,24,33];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("殴り合い"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[0,15,18,21,30];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("正義を貫徹する者"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[2,6,9,16,36,40];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("敏捷さ"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[1,10,16,24,31];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("魔法特化"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
      nodpair1=[5,8,27,35,36,41];
      nodpair2=[];
      for(var i=0;i<nodpair1.length;i++){
        var A=handtemp.findIndex(value=>value==nodpair1[i]);
        if(A!==-1){nodpair2.push(nodpair1[i])}
      }
      if(nodpair2.length >=2){
        var B=1+Math.floor((nodpair2.length-1)/2)
        resultA[0]+=B
        resultA.push("物理特化"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
        nodpair1=[7,12,24,28,33,38,39];
        nodpair2=[];
        for(var i=0;i<nodpair1.length;i++){
          var A=handtemp.findIndex(value=>value==nodpair1[i]);
          if(A!==-1){nodpair2.push(nodpair1[i])}
        }
        if(nodpair2.length >=2){
          var B=1+Math.floor((nodpair2.length-1)/2)
          resultA[0]+=B
          resultA.push("鋭さ"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
          //属性枠
          nodpair1=handtemp.filter(value=>value>=0 && value<=2);
          nodpair2=handtemp.filter(value=>value>=9 && value<=11);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブソーレス 1翻")}
          nodpair1=handtemp.filter(value=>value>=3 && value<=5);
          nodpair2=handtemp.filter(value=>value>=15 && value<=17);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブデニフ 1翻")}
          nodpair1=handtemp.filter(value=>value>=6 && value<=8);
          nodpair2=handtemp.filter(value=>value>=39 && value<=42);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブベントス 1翻")}
          nodpair1=handtemp.filter(value=>value>=12 && value<=14);
          nodpair2=handtemp.filter(value=>value>=24 && value<=26);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブアドリアン 1翻")}
          nodpair1=handtemp.filter(value=>value>=21 && value<=23);
          nodpair2=handtemp.filter(value=>value>=27 && value<=29);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブロッソ 1翻")}
          nodpair1=handtemp.filter(value=>value>=18 && value<=20);
          nodpair2=handtemp.filter(value=>value>=33 && value<=35);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブガイア 1翻")}
          nodpair1=handtemp.filter(value=>value>=30 && value<=32);
          nodpair2=handtemp.filter(value=>value>=36 && value<=38);
          if(nodpair1.length==3 && nodpair2.length==3){
            resultA[0]+=1
            resultA.push("クレストオブハルニエ 1翻")}

        console.log(resultA)
        return resultA
      }
      if(mode>-1){
        //今度は逆に選択中のパイが可能な役を表示
        function YakuDT(word){
          nodpair2=[];
          for(var i=0;i<nodpair1.length;i++){
            var A=hand1.findIndex(value=>value==nodpair1[i]);
            if(A!==-1){nodpair2.push(nodpair1[i])}
          }
          if(nodpair2.length >=2){
            cx2.fillStyle = "#ff4c38";}else{cx2.fillStyle = "white";}
            cx2.font = "bold 16px Arial";
            cx2.fillText(word+nodpair2.length+"/"+nodpair1.length,xx,yy);
            yy+=22;
          }
        switch(mode){
          case 0://エル
            nodpair1=[0,9,21];
            YakuDT("原初的な動き");
             nodpair1=[0,15,18,21,30];
             YakuDT("正義を貫徹する者");
            break;
          case 1:
            nodpair1=[1,3,15,22];
            YakuDT("属性鍛錬者");
              nodpair1=[1,10,16,24,31];
              YakuDT("魔法特化");
            break;
          case 2:
            nodpair1=[2,6,9,16,36,40];
            YakuDT("敏捷さ");
            nodpair1=[2,11,17,39,30,37];
            YakuDT("巨人審判者");
            break;
          case 3://アイ
          nodpair1=[3,13,17,25,37,42];
            YakuDT("探求する者");
            nodpair1=[1,3,15,22];
            YakuDT("属性鍛錬者");
            break;
          case 4:
            nodpair1=[4,20,34];
            YakuDT("マナ守護");
            nodpair1=[4,19,23,26,29,31,32];
            YakuDT("渇望");
            break;
          case 5:
            nodpair1=[5,8,27,35,36,41];
            YakuDT("物理特化");
            nodpair1=[5,26,32];
            YakuDT("時空間");
            break;
          case 6://レナ
          nodpair1=[6,7,8];
            YakuDT("精霊の加護");
            nodpair1=[2,6,9,16,36,40];
            YakuDT("敏捷さ");
            break;
          case 7:
          nodpair1=[6,7,8];
            YakuDT("精霊の加護");
            nodpair1=[7,12,24,28,33,38,39];
            YakuDT("鋭さ");
            break;
          case 8:
            nodpair1=[6,7,8];
            YakuDT("精霊の加護");
            nodpair1=[5,8,27,35,36,41];
            YakuDT("物理特化");
            break;
          case 9://ヴン
          nodpair1=[0,9,21];
          YakuDT("原初的な動き");
          nodpair1=[2,6,9,16,36,40];
          YakuDT("敏捷さ");
            break;
          case 10:
            nodpair1=[1,10,16,24,31];
            YakuDT("魔法特化");
            nodpair1=[10,24,33];
            YakuDT("殴り合い");
            break;
          case 11:
            nodpair1=[11,23,31,34,38];
            YakuDT("痛いから問題ない");
            nodpair1=[2,11,17,39,30,37];
            YakuDT("巨人審判者");
            break;
          case 12://イヴ
          nodpair1=[12,13,14,24,42];
          YakuDT("ナソード研究");
          nodpair1=[7,12,24,28,33,38,39];
          YakuDT("鋭さ");
            break;
          case 13:
            nodpair1=[12,13,14,24,42];
            YakuDT("ナソード研究");
            nodpair1=[3,13,17,25,37,42];
            YakuDT("探求する者");
            break;
          case 14:
            nodpair1=[12,13,14,24,42];
            YakuDT("ナソード研究");
            nodpair1=hand1.findIndex(value=>value==14);
            nodpair2=hand1.findIndex(value=>value==41);
            cx2.font = "bold 16px Arial";
            if(nodpair2 !==-1 ){
              cx2.fillStyle = "#ff4c38";
              cx2.fillText("戦場の天使 2/2",xx,yy)
            }else{
              cx2.fillStyle = "white";
              cx2.fillText("戦場の天使 1/2",xx,yy)
            }
              yy+=20;
            break;
          case 15://ラシェ
          nodpair1=[0,15,18,21,30];
          YakuDT("正義を貫徹する者");
          nodpair1=[1,3,15,22];
          YakuDT("属性鍛錬者");
            break;
          case 16:
            nodpair1=[2,6,9,16,36,40];
            YakuDT("敏捷さ");
            nodpair1=[1,10,16,24,31];
            YakuDT("魔法特化");
            break;
          case 17:
            nodpair1=[3,13,17,25,37,42];
            YakuDT("探求する者");
            nodpair1=[2,11,17,39,30,37];
            YakuDT("巨人審判者");
            break;
          case 18://アラ
          cx2.fillStyle = "#ff4c38";
          cx2.font = "bold 16px Arial";
          cx2.fillText("貫徹する足取り1/1",xx,yy);
          yy+=20;
          nodpair1=[0,15,18,21,30];
          YakuDT("正義を貫徹する者");
            break;
            case 19:
            cx2.fillStyle = "#ff4c38";
            cx2.font = "bold 16px Arial";
            cx2.fillText("豊かな足取り1/1",xx,yy);
            yy+=20;
            nodpair1=[4,19,23,26,29,31,32];
            YakuDT("渇望");
              break;
              case 20:
                cx2.fillStyle = "#ff4c38";
                cx2.font = "bold 16px Arial";
                cx2.fillText("上手な足取り1/1",xx,yy);
                yy+=20;
                nodpair1=[4,20,34];
                YakuDT("マナ守護");
                  break;
            case 21://エリ
            nodpair1=[0,9,21];
            YakuDT("原初的な動き");
            nodpair1=[0,15,18,21,30];
            YakuDT("正義を貫徹する者");
            break;
            case 22:
              nodpair1=[1,3,15,22];
              YakuDT("属性鍛錬者");
              nodpair1=[7,12,24,28,33,38,39];
              YakuDT("鋭さ");
              break;
            case 23:
              nodpair1=[11,23,31,34,38];
              YakuDT("痛いから問題ない");
              nodpair1=[4,19,23,26,29,31,32];
              YakuDT("渇望");
              break;
            case 24://エド
            nodpair1=[1,10,16,24,31];
            YakuDT("魔法特化");
            nodpair1=[10,24,33];
            YakuDT("殴り合い");
            break;
            case 25:
              nodpair1=[3,13,17,25,37,42];
              YakuDT("探求する者");
              nodpair1=[12,13,14,24,42];
              YakuDT("ナソード研究");
            break;
            case 26:
              nodpair1=[5,26,32];
              YakuDT("時空間");
              nodpair1=[4,19,23,26,29,31,32];
              YakuDT("渇望");
            break;
            case 27://ルシ
            nodpair1=[27,28,29];
            YakuDT("魔族");   
            nodpair1=[5,8,27,35,36,41];
            YakuDT("物理特化"); 
              break;
            case 28:
              nodpair1=[27,28,29];
              YakuDT("魔族");
              nodpair1=[7,12,24,28,33,38,39];
              YakuDT("鋭さ");   
              break;
              case 29:
                nodpair1=[27,28,29];
                YakuDT("魔族");
                nodpair1=[4,19,23,26,29,31,32];
                YakuDT("渇望"); 
                break;
            case 30://アイン
            nodpair1=[0,15,18,21,30];
            YakuDT("正義を貫徹する者");
            nodpair1=[2,11,17,39,30,37];
            YakuDT("巨人審判者");
            break;  
            case 31:
              nodpair1=[1,10,16,24,31];
              YakuDT("魔法特化");
              nodpair1=[11,23,31,34,38];
              YakuDT("痛いから問題ない");
              break;
            case 32:
              nodpair1=[5,26,32];
              YakuDT("時空間");
              nodpair1=[4,19,23,26,29,31,32];
              YakuDT("渇望"); 
              break;
            case 33://らび
            nodpair1=[10,24,33];
            YakuDT("殴り合い");
            nodpair1=[7,12,24,28,33,38,39];
            YakuDT("鋭さ");
              break;
            case 34:
              nodpair1=[4,20,34];
              YakuDT("マナ守護");
              nodpair1=[11,23,31,34,38];
              YakuDT("痛いから問題ない");
              break;
            case 35:
              nodpair1=[5,8,27,35,36,41];
              YakuDT("物理特化"); 
              cx2.fillStyle = "#ff4c38";
              cx2.font = "bold 16px Arial";
              cx2.fillText("ラビィの友達1/1",xx,yy);
              yy+=20;
              break;
            case 36://ノア
            nodpair1=[2,6,9,16,36,40];
            YakuDT("敏捷さ");
            nodpair1=[5,8,27,35,36,41];
            YakuDT("物理特化"); 
            break;
            case 37:
              nodpair1=[3,13,17,25,37,42];
              YakuDT("探求する者");
              nodpair1=[2,11,17,39,30,37];
              YakuDT("巨人審判者");
              break;
            case 38:
              nodpair1=[11,23,31,34,38];
              YakuDT("痛いから問題ない");
              nodpair1=[7,12,24,28,33,38,39];
              YakuDT("鋭さ");
              break;
            case 39://ロゼ
            nodpair1=[7,12,24,28,33,38,39];
            YakuDT("鋭さ");
            nodpair1=[2,11,17,39,30,37];
            YakuDT("巨人審判者");
              break;
            case 40:
              nodpair1=[5,8,27,35,36,41];
              YakuDT("物理特化"); 
              nodpair1=[4,19,23,26,29,31,32];
              YakuDT("渇望"); 
              break;
            case 41:
              nodpair1=[2,6,9,16,36,40];
              YakuDT("敏捷さ");
              nodpair1=hand1.findIndex(value=>value==41);
              nodpair2=hand1.findIndex(value=>value==14);
              cx2.font = "bold 16px Arial";
              if(nodpair2 !==-1 ){
                cx2.fillStyle = "#ff4c38";
                cx2.fillText("戦場の天使 2/2",xx,yy)
              }else{
                cx2.fillStyle = "white";
                cx2.fillText("戦場の天使 1/2",xx,yy)
              }
                yy+=20;
              break;
            case 42:
              cx2.fillStyle = "#ff4c38";
              cx2.font = "bold 16px Arial";
              cx2.fillText("機械工学1/1",xx,yy);
              yy+=20;
              nodpair1=[3,13,17,25,37,42];
              YakuDT("探求する者");
              nodpair1=[12,13,14,24,42];
              YakuDT("ナソード研究");
              break;
              }
      }
    }
 
  function Reachwait(num){
    //hand1のnum番目を切った場合に
    //何待ちなのか3枚くらいパイを表示する
    console.log('Reachwait',num)
    var Count={};
    var Line={};
    var Result=[];
    //0に○○待ちの文字、1~3に待ちパイ
    Result.push("ノーテン");
            handtemp = hand1.concat(pon1);
          //下でCがエラー吐いたので
          handtemp.splice(num,1);
          var HH=handtemp.findIndex(value=>value==100);
          console.log(handtemp.length,HH)
          handtemp.sort(compareFunc);
          for(var i=1; i<handtemp.length;i++){
            var C=donpai.findIndex(value=>value.id==handtemp[i])
            var elm=donpai[C].name;//cpuでerror?
            var elm2=donpai[C].line
            Count[elm]=(Count[elm] || 0)+1
            Line[elm2]=(Line[elm2] || 0)+1
          }
          console.log(Count);
          console.log(Line);
          //ラインチェック
          var keyj2=Object.keys(Line);
          //console.log(keyj2.length);//expected 1~5
          switch(Line["0"]){
            case 2:
            case 1:
              if(keyj2.length==2){
                var resultF=Object.keys(Line).find((key)=>Line[key]>=5);//->あればlineが帰ってくる
                if(resultF !==undefined){
                  Result[0]=resultF+"ライン待ち"
                  resultF-=1;
                  var E=donpai.filter(value=>value.id==42 || (value.id<42 && value.id%3==resultF));
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
              }
              }
            }
              break;
            default:
               //0line->undefined
              if(keyj2.length==1){
                console.log('line tumo')
                var resultF=Object.keys(Line).find((key)=>Line[key]>=5);//->あればlineが帰ってくる
                if(resultF !==undefined){
                  Result[0]=resultF+"ライン待ち"
                  resultF-=1;
                  var E=donpai.filter(value=>value.id==42 || (value.id<42 && value.id%3==resultF));
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
              }
              }
            }
            break;
          }
          //3ペアチェック 同キャラ6枚は考えないことにする
          var reachj=0;//同じキャラ2枚をカウント
          var tumoj=0;//同じキャラ3枚をカウント
          var kanj=0;//同じキャラ4枚をカウント
          var keyj=Object.keys(Count);
          //console.log(keyj.length);
          //Count.length->undefined
          for(var j=0;j<keyj.length;j++){
            //console.log(Count[keyj[j]]);
            if(Count[keyj[j]]==2){
              reachj+=1;
            }
            if(Count[keyj[j]]==3){
              tumoj+=1;
            }
            if(Count[keyj[j]]==4){
              kanj+=1;
            }
          }
          //console.log(tumoj,reachj);
          if(kansw2[1]>0){
            //カン2回なら3+4+4 カン1回なら3+3+4
        switch(Line["0"]){
            case 2:
              if(kansw2[1]==2){
                //n,n,4+4
                Result[0]="全待ち"
                for(var i=0; i<45 ; i++){
                  if(Remaincheck(i)){
                    Result.push(i);
                  }
                  if(Result.length>6){break;}
              }
            }
              if(kansw2[1]==1){
                //リーチとなるのは3,n,n+4 2,1,n,n+4
                if(keyj.length==4){
                  if(tumoj.length==1){
                  Result[0]="全待ち"
                  for(var i=0; i<45 ; i++){
                    if(Remaincheck(i)){
                      Result.push(i);
                    }
                    if(Result.length>6){break;}
                }}
                }
                if(keyj.length==5){
                  if(tumoj==0 && reachj==1){
                    var resultF=Object.keys(Count).find((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    var resultG=Object.keys(Count).filter((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                    for(var i=0;i<resultG.length;i++){
                      if(resultG[i]=="アリエル"||resultG[i]=="アリエル"){resultG.splice(i,1)}
                    }
                    Result[0]=resultF+","+resultG[0]+"待ち"
                    var E=donpai.filter(value=>value.name==resultF ||value.name==resultG[0]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>6){break;}
                  }
                }
                }
              }
              break;
            case 1:
              if(kansw2[1]==2){
                //リーチ1,n,4,4
                if(keyj.length==4){
                  var resultG=Object.keys(Count).filter((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                  for(var i=0;i<resultG.length;i++){
                    if(resultG[i]=="アリエル"||resultG[i]=="アリエル"){resultG.splice(i,1)}
                  }
                  Result[0]=resultG[0]+"待ち"
                  var E=donpai.filter(value=>value.name==resultG[0]);
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
                }
                }
              }
              if(kansw2[1]==1){
                //リーチ 3,1,n+4  2,2,n+4 
                if(keyj.length==4){
                  if(kanj==1 && tumoj==1 && reachj==0){
                    var resultG=Object.keys(Count).filter((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                    for(var i=0;i<resultG.length;i++){
                      if(resultG[i]=="アリエル"||resultG[i]=="アリエル"){resultG.splice(i,1)}
                    }
                    Result[0]=resultG[0]+"待ち"
                    var E=donpai.filter(value=>value.name==resultG[0]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>6){break;}
                  }
                  }
                  if(kanj==1 && reachj==2){
                    var resultG=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    Result[0]=resultG[0]+resultG[1]+"待ち"
                    var E=donpai.filter(value=>value.name==resultG[0] ||value.name==resultG[1]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>6){break;}
                  }
                  }
                }
              }
              break;
            default:
              if(kansw2[1]==2){
                //リーチ2,4,4
                if(keyj.length==3){
                  if(reachj==1){
                    var resultG=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    Result[0]=resultG[0]+"待ち"
                    var E=donpai.filter(value=>value.name==resultG[0]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>6){break;}
                  }
                  }
                }
              }
              if(kansw2[1]==1){
                //リーチ 3,2+4  4,2+4
                if(keyj.length==3){
                  if(kanj==1 && tumoj==1 && reachj==1){
                    var resultG=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    Result[0]=resultG[0]+"待ち"
                    var E=donpai.filter(value=>value.name==resultG[0]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>6){break;}
                  }
                  }
                }
              }
              break;
          }
      }else{
          switch(Line["0"]){
            case 2:
              //リーチとなるのは3,3+1+1 3,2,1+1+1 2,2,2+1+1
              if(keyj.length==5){
                if(tumoj==1 && reachj==1){
                  var resultF=Object.keys(Count).find((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                  var resultG=Object.keys(Count).filter((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                  for(var i=0;i<resultG.length;i++){
                    if(resultG[i]=="アリエル"||resultG[i]=="アリエル"){resultG.splice(i,1)}
                  }
                  Result[0]=resultF+","+resultG[0]+"待ち"
                  var E=donpai.filter(value=>value.name==resultF ||value.name==resultG[0]);
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
              }
                }
                if(tumoj==0 && reachj==3){
                  var resultF=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                  Result[0]=resultF[0]+","+resultF[1]+","+resultF[2]+"待ち"
                  var E=donpai.filter(value=>value.name==resultF[0] ||value.name==resultF[1] ||value.name==resultF[2]);
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
              }
                }
              }
              if(keyj.length==4){
                if(tumoj==2){
                  Result[0]="全待ち"
                  for(var i=0; i<45 ; i++){
                    if(Remaincheck(i)){
                      Result.push(i);
                    }
                    if(Result.length>6){break;}
                  }
                }
              }
              break;
            case 1:
              //3,3,1+1 3,2,2+1
              if(keyj.length==4){
                if(tumoj==2 && reachj==0){
                  var resultF=Object.keys(Count).find((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                  console.log(resultF);
                  Result[0]=resultF+"待ち"
                  var E=donpai.filter(value=>value.name==resultF);
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
              }
                }
                if(tumoj==1 && reachj==2){
                  var resultF=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                  console.log(resultF);
                  Result[0]=resultF[0]+","+resultF[1]+"待ち"
                  var E=donpai.filter(value=>value.name==resultF[0] || value.name==resultF[1]);
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>6){break;}
              }
                }
              }
              break;
            default:
              //3ペアでリーチ後の待ちは3,3,2だけ
              if(tumoj==2 && reachj==1){
                //アガリ
                var resultF=Object.keys(Count).find((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                console.log(resultF);
                Result[0]=resultF+"待ち"
                var E=donpai.filter(value=>value.name==resultF);
                for(var i=0; i<E.length ; i++){
              if(Remaincheck(E[i].id)){
                Result.push(E[i].id);
              }
              if(Result.length>6){break;}
            }

              }
              break;
        }
      }
        //国士無双:エピックラインのみ、かつ同パイを含まない
        var Kokushi=[0,3,7,10,13,15,18,21,24,28,31,34,36,41,43,44]
        var resultF=Kokushi.concat();
        var Kreach=0;
        var KKreach=0;
        for(var k=1;k<handtemp.length;k++){
          var A=Kokushi.findIndex(value=>value==handtemp[k])
          if(A!==-1){
            var C=resultF.findIndex(value=>value==handtemp[k])
            resultF.splice(C,1);
            var B=handtemp.filter(value=>value==handtemp[k])
          KKreach+=B.length-1;
          //KKreachは0か2かそれ以上
        }else{Kreach+=1}
          if(Kreach>2){break;}
          }
          console.log(resultF);
        if(Kreach==0 && KKreach==0){
            //国士ツモ
            console.log(resultF.length);
            Result[0]="国士無双待ち"
            for(var i=0; i<resultF.length ; i++){
              if(Remaincheck(resultF[i])){
                Result.push(resultF[i]);
              }
              if(Result.length>6){break;}
            }
        }
        return Result;
  }

  function Pon(player,num=-1){//自分の同じキャラ2枚+前の人が切った同じキャラを除外
    if(num==-1){
      //ポンできるかどうかの判定
      console.log('pon'+player,reach[player]);
      var result=0;
      if(reach[player]==3){
        //立直しているならポンできない
        //console.log('ron false');
        return false;
      }
      if(tumotemp==43 || tumotemp==44){
        //オールマイティはポンできない、ポンに使えないことにする
        //console.log('ron false');
        return false;
      }
      handtemp=[];
      switch(player){
        case 1:
          if(pon1.length>=6){
            //ポンすると手札がなくなるZE
            return false;
          }
          //ponsw[1]=0;
          handtemp = hand1.concat();
        break;
        case 2:
          if(pon2.length>=6){
            return false;
          }
          handtemp = hand2.concat();
        break;
        case 3:
          if(pon3.length>=6){
            return false;
          }
          handtemp = hand3.concat();
        break;
        case 4:
          if(pon4.length>=6){
            return false;
          }
          handtemp = hand4.concat();
        break;
      }
      if(tumotemp>=39 && tumotemp<=42){
        var B=handtemp.filter(value=>value>=39 && value<=42);
      }else{
        var A=Math.floor(tumotemp/3);
        var B=handtemp.filter(value=>value>=3*A && value<3*(A+1));
      }
        console.log(B)
              if(B.length>=2){ponsw[player]=1;
                return true;
              }
            }else{
      //ポンしますわよ
      handtemp=[];
      switch(player){
        case 1:
          handtemp = hand1.concat();
        break;
        case 2:
          handtemp = hand2.concat();
        break;
        case 3:
          handtemp = hand3.concat();
        break;
        case 4:
          handtemp = hand4.concat();
        break;
      }
      var pp=handtemp.findIndex(value=>value==100);
      if(pp==-1){
        console.log('pon error!',handtemp)
        return false;
      }
        handtemp[pp]=tumotemp;
        handtemp.sort(compareFunc);
    switch(player){
      case 1:
        //ポンする組み合わせは考えないものとする
        //ポンされたパイを塗りつぶす
        cLock=0;
        cx1.fillStyle = "rgba(20,20,20,0.5)";
        if(ippatu[4]==1){
        cx1.fillRect(riverx[4]-10.5,rivery[4]+10.5,43.5,33)
        }else{
        cx1.fillRect(riverx[4],rivery[4],33,43.5)
        }
        hand1.splice(pp,1)
        if(num>=39 && num<=42){
          var pA=hand1.findIndex(value=>value>=39 && value<=42);
          var ponA=hand1.splice(pA,1)
          var pB=hand1.findIndex(value=>value>=39 && value<=42);
          var ponB=hand1.splice(pB,1)
          pon1.unshift(num,ponA[0],ponB[0])
        }else{
          var A=Math.floor(num/3);
        var pA=hand1.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponA=hand1.splice(pA,1)
        var pB=hand1.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponB=hand1.splice(pB,1)
        pon1.unshift(num,ponA[0],ponB[0])
        }
        console.log(hand1.length,hand1);
            //一発を潰す
    for(var i=1;i<5;i++){
      if(ippatu[i]==1){
        ippatu[i]=2;
      }
    }
        loopX=0
        loopX2=0;
        alpha=1;
        cx2.clearRect(630,400,80,40)
        cx2.fillStyle = "rgba(20,20,20,0.5)";
        cx2.fillRect(630,400,80,40)
        e15.src=chrimg_src[chara[player]]
        e15.onload=function(){
          se8.play();
          window.requestAnimationFrame((ts)=>PonAnimation(ts,0,player))
      }
        break;
      case 2:
        cx1.fillStyle = "rgba(20,20,20,0.5)";
        if(ippatu[1]==1){
        cx1.fillRect(riverx[1]-10.5,rivery[1]+10.5,43.5,33)
        }else{
        cx1.fillRect(riverx[1],rivery[1],33,43.5)
        }
        hand2.splice(pp,1)
        if(num>=39 && num<=42){
          var pA=hand2.findIndex(value=>value>=39 && value<=42);
          var ponA=hand2.splice(pA,1)
          var pB=hand2.findIndex(value=>value>=39 && value<=42);
          var ponB=hand2.splice(pB,1)
          pon2.unshift(num,ponA[0],ponB[0])
        }else{
          var A=Math.floor(num/3);
        var pA=hand2.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponA=hand2.splice(pA,1)
        var pB=hand2.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponB=hand2.splice(pB,1)
        pon2.unshift(num,ponA[0],ponB[0])
        }
        e9.src=eltear_src[pon2[0]]
        e9.onload=function(){
          var x=33*(pon2.length-3)
          cx1.drawImage(e9,590-x,150,33,43.5);
          cx1.fillStyle = "rgba(20,20,20,0.2)";
          cx1.fillRect(590-x,150,33,43.5)
            e9.src=eltear_src[pon2[1]]
            e9.onload=function(){
              cx1.drawImage(e9,557-x,150,33,43.5);
              cx1.fillStyle = "rgba(20,20,20,0.2)";
              cx1.fillRect(557-x,150,33,43.5)
              e9.src=eltear_src[pon2[2]]
              e9.onload=function(){
                cx1.drawImage(e9,524-x,150,33,43.5);
                cx1.fillStyle = "rgba(20,20,20,0.2)";
                cx1.fillRect(524-x,150,33,43.5)
        console.log(hand2.length,hand2);
            //一発を潰す
    for(var i=1;i<5;i++){
      if(ippatu[i]==1){
        ippatu[i]=2;
      }
    }
    loopX=0
    loopX2=0;
    alpha=1;
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
      se8.play();
      window.requestAnimationFrame((ts)=>PonAnimation(ts,0,player))
  }
              }}}
        break;
      case 3:
        cx1.fillStyle = "rgba(20,20,20,0.5)";
        if(ippatu[2]==1){
        cx1.fillRect(riverx[2]-10.5,rivery[2]+10.5,43.5,33)
        }else{
        cx1.fillRect(riverx[2],rivery[2],33,43.5)
        }
        hand3.splice(pp,1)
        if(num>=39 && num<=42){
          var pA=hand3.findIndex(value=>value>=39 && value<=42);
          var ponA=hand3.splice(pA,1)
          var pB=hand3.findIndex(value=>value>=39 && value<=42);
          var ponB=hand3.splice(pB,1)
          pon3.unshift(num,ponA[0],ponB[0])
        }else{
          var A=Math.floor(num/3);
        var pA=hand3.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponA=hand3.splice(pA,1)
        var pB=hand3.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponB=hand3.splice(pB,1)
        pon3.unshift(num,ponA[0],ponB[0])
        }
        e9.src=eltear_src[pon3[0]]
        e9.onload=function(){
          var x=33*(pon3.length-3)
          cx1.drawImage(e9,590-x,250,33,43.5);
          cx1.fillStyle = "rgba(20,20,20,0.2)";
          cx1.fillRect(590-x,250,33,43.5)
            e9.src=eltear_src[pon3[1]]
            e9.onload=function(){
              cx1.drawImage(e9,557-x,250,33,43.5);
              cx1.fillStyle = "rgba(20,20,20,0.2)";
              cx1.fillRect(557-x,250,33,43.5)
              e9.src=eltear_src[pon3[2]]
              e9.onload=function(){
                cx1.drawImage(e9,524-x,250,33,43.5);
                cx1.fillStyle = "rgba(20,20,20,0.2)";
                cx1.fillRect(524-x,250,33,43.5)
        console.log(hand3.length,hand3);
            //一発を潰す
    for(var i=1;i<5;i++){
      if(ippatu[i]==1){
        ippatu[i]=2;
      }
    }
    loopX=0
    loopX2=0;
    alpha=1;
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
      se8.play();
      window.requestAnimationFrame((ts)=>PonAnimation(ts,0,player))
  }
              }}}
        break;
      case 4:
        cx1.fillStyle = "rgba(20,20,20,0.5)";
        if(ippatu[3]==1){
        cx1.fillRect(riverx[3]-10.5,rivery[3]+10.5,43.5,33)
        }else{
        cx1.fillRect(riverx[3],rivery[3],33,43.5)
        }
        hand4.splice(pp,1)
        if(num>=39 && num<=42){
          var pA=hand4.findIndex(value=>value>=39 && value<=42);
          var ponA=hand4.splice(pA,1)
          var pB=hand4.findIndex(value=>value>=39 && value<=42);
          var ponB=hand4.splice(pB,1)
          pon4.unshift(num,ponA[0],ponB[0])
        }else{
          var A=Math.floor(num/3);
        var pA=hand4.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponA=hand4.splice(pA,1)
        var pB=hand4.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponB=hand4.splice(pB,1)
        pon4.unshift(num,ponA[0],ponB[0])
        }
        e9.src=eltear_src[pon4[0]]
        e9.onload=function(){
          var x=33*(pon4.length-3)
          cx1.drawImage(e9,590-x,350,33,43.5);
          cx1.fillStyle = "rgba(20,20,20,0.2)";
          cx1.fillRect(590-x,350,33,43.5)
            e9.src=eltear_src[pon4[1]]
            e9.onload=function(){
              cx1.drawImage(e9,557-x,350,33,43.5);
              cx1.fillStyle = "rgba(20,20,20,0.2)";
              cx1.fillRect(557-x,350,33,43.5)
              e9.src=eltear_src[pon4[2]]
              e9.onload=function(){
                cx1.drawImage(e9,524-x,350,33,43.5);
                cx1.fillStyle = "rgba(20,20,20,0.2)";
                cx1.fillRect(524-x,350,33,43.5)
        console.log(hand4.length,hand4);
            //一発を潰す
    for(var i=1;i<5;i++){
      if(ippatu[i]==1){
        ippatu[i]=2;
      }
    }
    loopX=0
    loopX2=0;
    alpha=1;
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
      se8.play();
      window.requestAnimationFrame((ts)=>PonAnimation(ts,0,player))
  }
              }}}
        break;
    }
  }
  }

  function Kan(player,num=-1){
    //自分のターンにしかできない　他の人から貰うカンは保留とする
    //ぶっちゃけ4/6なので難易度は高くな
    //手札の4枚の同じパイを除外
    //ポンしたパイに1枚足すタイプは保留とする
    if(num==-1){
      //カンできるかどうかの判定
      console.log('kan'+player,reach[player]);
      var cturn=player-1
      if(reach[player]==3 && turn !==cturn){
        //立直しているなら自分のターンでしかカンできない
        return false;
      }
      handtemp=[];
      switch(player){
        case 1:
          if(pon1.length>=8){
            //ポンすると手札がなくなるZE
            return false;
          }
          //ponsw[1]=0;
          handtemp = hand1.concat();
        break;
        case 2:
          if(pon2.length>=6){
            return false;
          }
          handtemp = hand2.concat();
        break;
        case 3:
          if(pon3.length>=6){
            return false;
          }
          handtemp = hand3.concat();
        break;
        case 4:
          if(pon4.length>=6){
            return false;
          }
          handtemp = hand4.concat();
        break;
      }
      if(reach[player]==3){
        //リーチ後のカン
      if(tumo>=39 && tumo<=42){
        var B=handtemp.filter(value=>value>=39 && value<=42);
      }else{
        var A=Math.floor(tumo/3);
        var B=handtemp.filter(value=>value>=3*A && value<3*(A+1));
      }
        console.log(B)
              if(B.length>=4){
                  kansw[player]=1;
                return true;
              }
            }else{
        //自分ターン、手札に4枚以上
        var Count={};
        for(var i=1; i<handtemp.length;i++){
          var C=donpai.findIndex(value=>value.id==handtemp[i])
          var elm=donpai[C].name;
          Count[elm]=(Count[elm] || 0)+1
        }
        var keyj=Object.keys(Count);
        for(var j=0;j<keyj.length;j++){
          //console.log(Count[keyj[j]]);
          if(Count[keyj[j]]==4){
            kansw[player]=1;
            return true;
          }
        }
            }
            }else{
      //カンしますわよ
      handtemp=[];
      switch(player){
        case 1:
          handtemp = hand1.concat();
        break;
        case 2:
          handtemp = hand2.concat();
        break;
        case 3:
          handtemp = hand3.concat();
        break;
        case 4:
          handtemp = hand4.concat();
        break;
      }
    switch(player){
      case 1:
        //カンする組み合わせは考えないものとする
        if(reach[player]==3){
          //リーチ後のカン
          num=handtemp[handtemp.length-1];
              }else{
          //自分ターン、手札に4枚以上
          var Count={};
          for(var i=1; i<handtemp.length;i++){
            var C=donpai.findIndex(value=>value.id==handtemp[i])
            var elm=donpai[C].name;
            Count[elm]=(Count[elm] || 0)+1
          }
          var keyj=Object.keys(Count);
          for(var j=0;j<keyj.length;j++){
            //console.log(Count[keyj[j]]);
            if(Count[keyj[j]]==4){
              var A=donpai.findIndex(value=>value.name==keyj[j])
              num=donpai[A].id;
              break;
            }
          }
              }
        if(num>=39 && num<=42){
          var pA=hand1.findIndex(value=>value>=39 && value<=42);
          var ponA=hand1.splice(pA,1)
          var pB=hand1.findIndex(value=>value>=39 && value<=42);
          var ponB=hand1.splice(pB,1)
          var pC=hand1.findIndex(value=>value>=39 && value<=42);
          var ponC=hand1.splice(pC,1)
          var pD=hand1.findIndex(value=>value>=39 && value<=42);
          var ponD=hand1.splice(pD,1)
        }else{
          var A=Math.floor(num/3);
        var pA=hand1.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponA=hand1.splice(pA,1)
        var pB=hand1.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponB=hand1.splice(pB,1)
        var pC=hand1.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponC=hand1.splice(pC,1)
        var pD=hand1.findIndex(value=>value>=3*A && value<3*(A+1));
        var ponD=hand1.splice(pD,1)
        }
        pon1.unshift(ponA[0],ponB[0],ponC[0],ponD[0])
        hand1.push(100);
        console.log(hand1.length,hand1);
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }
    var A=dora.length;
    dora.push(king[A]);
    dorax+=40
    //console.log(dora,king)
    kansw2[player]+=1;
    loopX=0
    loopX2=0;
    alpha=1;
    cx2.clearRect(630,400,80,40)
    cx2.fillStyle = "rgba(20,20,20,0.5)";
    cx2.fillRect(630,400,80,40)
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
      window.requestAnimationFrame((ts)=>KanAnimation(ts))
  }
  }
  }

  function ryukyoku(){
    se10.play();
  cx1.fillStyle = "rgba(20,20,20,0.5)";
  cx1.fillRect(10,100,780,400)
  cx2.fillStyle = "white";
  cx2.font = "36px 'Century Gothic'";
  cx2.fillText("流局",390,300)
  if(parent ==0){parent =3}else{parent -=1}
  skillusage2[0]-=1;
  skillusage2[5]+=1;
  for(var i=1 ;i<5; i++){
  ctl[i]=2;
  if(chara[i]==3){skillusage2[i]=1}}
  cLock=0;
  gamestate =0;
  console.log('流局',ctl)
  }

  function corsor(){
    if(gamestate==10){
      switch(pagestate){
        case 1:
            if(mouseX >70 && mouseX <390){
          if(mouseY >130 && mouseY < 500){
      cx2.clearRect(80,150,300,270)
      cx2.strokeStyle ='orange'
      cx2.lineWidth = 2;
      cx2.fillStyle = "black";
      cx2.font = "18px Arial";
          }}
            if(mouseX >80 && mouseX <380){
          if(mouseY >160 && mouseY < 210){
      cx2.clearRect(80,530,670,70)
      cx2.strokeRect(86,161,288,48)
      cx2.fillText("プレイガイド　9枚のパイで役を揃えるゲーム、", 80, 550);
      cx2.fillText("エルコレドンジャラのルール説明です。", 80, 570)
          }
          if(mouseY >210 && mouseY < 260){
      //cx2.clearRect(80,150,300,270)
      cx2.clearRect(80,530,670,70)
      cx2.strokeRect(86,211,288,48)
      cx2.fillText("フリーバトル　CPU3人と自由対局をします。", 80, 550);
      cx2.fillText("150000・300000では全員が親を2回行うか誰かの戦闘力が0になると終了です。", 80, 570);
          }
          if(mouseY >260 && mouseY < 310){
      cx2.clearRect(80,530,670,70)
      cx2.strokeRect(86,261,288,48)
      cx2.fillText("マスロ　工事中", 80, 550);
      cx2.fillText("テキスト", 80, 570);
          }
          if(mouseY >310 && mouseY < 360){
      cx2.clearRect(80,530,670,70)
      cx2.strokeRect(86,311,288,48)
      cx2.fillText("オプション　音楽の設定や実績確認ができます。", 80, 550);
          }}
          if(mouseY >360 && mouseY < 410){
      cx2.clearRect(80,530,670,70)
      cx2.strokeRect(86,361,288,48)
      cx2.fillText("セーブ", 80, 550);
      cx2.fillText("テキスト", 80, 570)
          }  
        break;
        case 3:
          //フリーバトル
      cx3.clearRect(370,70,360,440)
      //cx2.clearRect(80,150,300,270)
      cx3.strokeStyle ='orange'
      cx3.lineWidth = 2;
      cx2.fillStyle = "black";
      cx2.font = "18px Arial";
      cx3.font = "24px 'Century Gothic'";
      cx3.fillStyle = "orange";
      if(mouseX >510 && mouseX <560 && mouseY >80 && mouseY <110){
          cx3.fillText("◀ ",520,100)//ルール
        }
        if(mouseX >670 && mouseX <705 && mouseY >80 && mouseY <110){
          cx3.fillText(" ▶",670,100)
        }
        if(mouseX >470 && mouseX <640 && mouseY >410 && mouseY <470){
          cx3.strokeRect(470,640,170,60)
          cx2.clearRect(80,530,670,70)
          cx2.fillText("現在の設定でエルドンを開始します。", 80, 550);
        }
        if(mouseX >510 && mouseX <560 && mouseY >130 && mouseY <160){
          cx3.fillText("◀ ",520,150)//pc
        }
        if(mouseX >670 && mouseX <705 && mouseY >130 && mouseY <160){
          cx3.fillText(" ▶",670,150)
        }
        if(mouseX >670 && mouseX <705 && mouseY >230 && mouseY <260){
          cx3.fillText(" ▶",670,250)//chara2
        }
        if(mouseX >510 && mouseX <560 && mouseY >230 && mouseY <260){
          cx3.fillText("◀ ",520,250)
        }
        if(mouseX >670 && mouseX <705 && mouseY >270 && mouseY <300){
          cx3.fillText(" ▶",670,250)
        }
        if(mouseX >510 && mouseX <560 && mouseY >270 && mouseY <300){
          cx3.fillText("◀ ",520,290)
        }
        if(mouseX >670 && mouseX <705 && mouseY >310 && mouseY <340){
          cx3.fillText(" ▶",670,330)
        }
        if(mouseX >510 && mouseX <560 && mouseY >310 && mouseY <340){
          cx3.fillText("◀ ",520,330)
        }
      if(mouseX >510 && mouseX <705 && mouseY >80 && mouseY <110){
        //通常テキスト
        cx2.clearRect(80,530,670,70)
        cx2.fillText("ルールを選択できます。", 80, 550);
        switch(LP[0]){
          case 0:
          cx2.fillText(LPlist[LP[0]]+"：持ち点150,000の半荘戦です。役満ブロックが適応されます。", 80, 570);
          break;
          case 1:
            cx2.fillText(LPlist[LP[0]]+"：持ち点300,000の半荘戦です。役満ブロックが適応されます。", 80, 570);
          break;
          case 2:
            cx2.fillText(LPlist[LP[0]]+"：持ち点100,000で、誰かが戦闘力1,000,000に到達するまで続きます。", 80, 570);
          break;
          case 3:
            cx2.fillText(LPlist[LP[0]]+"：自由に打ち続けるモードです。Escキーでタイトル画面に戻れます。", 80, 570);
          break;
        }
      }
      if(mouseX >520 && mouseX <650 && mouseY >175 && mouseY <205){
        cx2.clearRect(80,530,670,70)
        cx2.fillText("CPUのキャラクター設定です。", 80, 550);
        cx2.fillText("おまかせにするとランダムに決定されます。", 80, 570);
      }
          break;
        case 2:
          //オプション
          cx3.clearRect(360,70,400,440)
          cx2.clearRect(80,150,300,270)
          cx3.strokeStyle ='orange'
          cx3.lineWidth = 2;
          cx2.fillStyle = "black";
          cx2.font = "18px Arial";
          cx3.font = "24px 'Century Gothic'";
          cx3.fillStyle = "orange";
            if(mouseX >570 && mouseX <610 && mouseY >100 && mouseY <135){
              cx3.fillText("◀ ",580,130)//音量
            }
            if(mouseX >620 && mouseX <660 && mouseY >100 && mouseY <135){
              cx3.fillText(" ▶",627,130)
            }
            if(mouseX >570 && mouseX <610 && mouseY >135 && mouseY <170){
              cx3.fillText("◀ ",580,160)
            }
            if(mouseX >620 && mouseX <660 && mouseY >135 && mouseY <170){
              cx3.fillText(" ▶",627,160)
            }
            cx3.font = "20px 'Century Gothic'";
            if(mouseX >370 && mouseX <430 && mouseY >240 && mouseY <270){
              cx3.fillText("◀ ",380,260)//bgm
            }
            if(mouseX >370 && mouseX <430 && mouseY >310 && mouseY <340){
              cx3.fillText("◀ ",380,330)
            }
            if(mouseX >370 && mouseX <430 && mouseY >380 && mouseY <410){
              cx3.fillText("◀ ",380,400)
            }
            if(mouseX >690 && mouseX <750 && mouseY >240 && mouseY <270){
              cx3.fillText(" ▶",720,260)
            }
            if(mouseX >690 && mouseX <750 && mouseY >310 && mouseY <340){
              cx3.fillText(" ▶",720,330)
            }
            if(mouseX >690 && mouseX <750 && mouseY >380 && mouseY <410){
              cx3.fillText(" ▶",720,400)
            }
          if(mouseX >380 && mouseX <750 && mouseY >200 && mouseY <260){
            if(mouseX >690 && mouseX <750 && mouseY >200 && mouseY <240){
              cx3.strokeRect(690,200,60,40)
            }
            //通常テキスト
            cx2.clearRect(80,530,670,70)
            cx2.fillText("通常対局時に流れるBGMを変更できます。", 80, 550);
            cx2.fillText("曲詳細："+musiclistDT[musicset[0]].title+", "+musiclistDT[musicset[0]].elia+"（"+musiclistDT[musicset[0]].nod+"）", 80, 570);
          }
          if(mouseX >380 && mouseX <750 && mouseY >270 && mouseY <330){
            if(mouseX >690 && mouseX <750 && mouseY >270 && mouseY <310){
              cx3.strokeRect(690,270,60,40)
            }
            //リーチテキスト
            cx2.clearRect(80,530,670,70)
            cx2.fillText("オーラスを除くリーチ時に流れるBGMを変更できます。", 80, 550);
            cx2.fillText("曲詳細："+musiclistDT[musicset[1]].title+", "+musiclistDT[musicset[1]].elia+"（"+musiclistDT[musicset[1]].nod+"）", 80, 570);
          }
          if(mouseX >380 && mouseX <750 && mouseY >340 && mouseY <400){
            if(mouseX >690 && mouseX <750 && mouseY >340 && mouseY <380){
              cx3.strokeRect(690,340,60,40)
            }
            //オーラステキスト
            cx2.clearRect(80,530,670,70)
            cx2.fillText("オーラス時に流れるBGMを変更できます。", 80, 550);
            cx2.fillText("曲詳細："+musiclistDT[musicset[2]].title+", "+musiclistDT[musicset[2]].elia+"（"+musiclistDT[musicset[2]].nod+"）", 80, 570);

          }
        break;
      }
    };
    if(cLock >0 && gamestate !==10){//カーソル
      if(cLock==2){
        //スキル対象選択プレイヤー編
        if(mouseX>10 && mouseX<140){
          if(mouseY>100 && mouseY<200){
            cx3.clearRect(10,100,130,400);
            cx3.strokeStyle ='yellow'
            cx3.lineWidth = 2;
            cx3.strokeRect(12,102,126,96);
          }
          if(mouseY>200 && mouseY<300){
            cx3.clearRect(10,100,130,400);
            cx3.strokeStyle ='yellow'
            cx3.lineWidth = 2;
            cx3.strokeRect(12,202,126,96);
          }
          if(mouseY>300 && mouseY<400){
            cx3.clearRect(10,100,130,400);
            cx3.strokeStyle ='yellow'
            cx3.lineWidth = 2;
            cx3.strokeRect(12,302,126,96);
          }
          if(mouseY>400 && mouseY<500){
            cx3.clearRect(10,100,130,400);
            cx3.strokeStyle ='yellow'
            cx3.lineWidth = 2;
            cx3.strokeRect(12,402,126,96);
          }
        }
        return false;
      }
      if(turn ==0){
        if(reach[1] !==3){
        if(skillswitch[1]==0){
    if(mouseY >390 && mouseY< 450){
    if(mouseX >700 && mouseX<800){
    cx3.clearRect(4,490,762,110)
    cx3.clearRect(710,400,80,40)
    }}
    if(mouseY >440 && mouseY< 480){
    if(mouseX >710 && mouseX<790){
    cx3.clearRect(4,490,762,110)
    cx3.clearRect(710,400,80,40)
    cx3.strokeStyle ='yellow'
    cx3.lineWidth = 2;
    //cx3.strokeRect(711,441,78,38)
    }}
    }
    if(skillswitch[1]==0){
      if(mouseY >390 && mouseY< 450){
        if(mouseX >700 && mouseX<800){
        cx3.clearRect(4,490,762,110)
        cx3.clearRect(710,400,80,40)
        }}
      if(mouseY >400 && mouseY <440){
        if(mouseX >710 && mouseX <790){
        cx3.strokeStyle ='yellow'
        cx3.lineWidth = 2;
        cx3.strokeRect(711,401,78,38)
        }}
      }
        if(reach[1]==1){
    if(mouseY >430 && mouseY <490){
    if(mouseX >620 && mouseX <720){
    cx3.clearRect(4,490,762,110)
    cx3.clearRect(630,440,80,40)
    }}
    if(mouseY >440 && mouseY <480){
    if(mouseX >630 && mouseX <710){
    cx2.font = "16px Arial";
    cx2.clearRect(630,60,160,260)
    cx2.fillStyle = "white";
    cx2.fillText("「リーチ」", 635, 270);
    cx3.clearRect(4,490,762,110)
    cx3.clearRect(630,440,80,40)
    cx3.strokeStyle ='yellow'
    cx3.lineWidth = 2;
    cx3.strokeRect(631,441,78,38)
    }}}
        if(reach[1]==2){
    if(mouseY >440 && mouseY <480){
    if(mouseX >630 && mouseX <710){
    cx3.strokeStyle ='orange'
    cx3.lineWidth = 2;
    cx3.strokeRect(631,441,78,38)
    }}
    }
        if(mouseY >470 && mouseY < 590){
          if(mouseX >0 && mouseX <720){
    cx3.clearRect(4,490,762,110)
          }}
        if(mouseY >490 && mouseY < 590){
    cx3.lineWidth = 2;
    cx3.strokeStyle ='yellow'
    //size参照100,690
    var SX=Math.floor((mouseX+size-100)/size);
    var SXX=100+size*(SX-1)
    //console.log(SX,SXX);
    if(SXX>=100 && SXX<660){
      cx3.clearRect(95,490,700,100)
      if(hand1.length>SX+1){
      cx3.strokeRect(SXX,500,size,sizey)
      }
      if(ponsw[1]==1 && hand1.length==SX+1){
        cx3.strokeRect(SXX,500,size,sizey) 
      }
    }else if(mouseX >690 && mouseX <690+size){
      if(ponsw[1]!==1){
    cx3.clearRect(95,490,700,100)
    cx3.strokeRect(690,500,size,sizey)
      }
    }}
      }else if(reach[1] ==3){
    cx3.clearRect(4,490,762,110)
    cx3.strokeStyle ='yellow'
    cx3.lineWidth = 2;
    if(mouseX >690 && mouseX <690+size){
      cx3.clearRect(95,490,700,100)
      cx3.strokeRect(690,500,size,sizey)
      }
    }
    if(hand1[0]==-3){
    if(mouseY >348 && mouseY< 490 &&mouseX >326 && mouseX<474){    
      if(TRswitch!==1){
    TRswitch=1;
    e19.src=eltearB_src[2]
    e19.onload=function(){
      cx3.clearRect(326,348,148,142)
    cx3.drawImage(e19,326,348,148,142)
    //cx3.clearRect(4,490,762,110)
    }
      }
    }else{
    TRswitch=0;
    e18.src=eltearB_src[1]
    e18.onload=function(){
      cx3.clearRect(326,348,148,142)
    cx3.drawImage(e18,326,348,148,142)
    }
    }
    }
      }
      if(turn !==0){
    if(hand1[0]==-2){
        if(mouseY >348 && mouseY< 490 && mouseX >326 && mouseX<474){    
          if(TRswitch!==1){
        TRswitch=1;
        e19.src=eltearB_src[4]
        e19.onload=function(){
          cx3.clearRect(326,348,148,142)
        cx3.drawImage(e19,326,348,148,142)
        //cx3.clearRect(4,490,762,110)
        }
          }
        }else{
          TRswitch=0;
          e18.src=eltearB_src[3]
          e18.onload=function(){
            cx3.clearRect(326,348,148,142)
          cx3.drawImage(e18,326,348,148,142)
          }
        }
    }
    if(mouseY >390 && mouseY <450){
      if(mouseX >620 && mouseX <720){
        cx3.clearRect(630,400,80,40)
    if(mouseY >400 && mouseY <440 && mouseX >630 && mouseX <710){
        if(ponsw[1]==1){
          //cx3.clearRect(4,480,762,110)
          cx3.clearRect(630,400,80,40)
          cx3.strokeStyle ='yellow'
          cx3.lineWidth = 2;
          cx3.strokeRect(631,401,78,38)
//ポンボタン
      }}
    }}
  }
    }
    if(gamestate ==1){
    //牌の詳細表示
    var SX=Math.floor((mouseX+size-100)/size);
    //console.log(SX,SXX);
    if(mouseY >490 && mouseY < 590){
          if(mouseX >100 && mouseX <660){
            if(hand1.length>SX+1){
    Elname(hand1[SX],SX);//描画まで行う
            }
            if(ponsw[1]==1 && hand1.length==SX+1){
              Elname(hand1[SX],SX);//描画まで行う
            }
          }else if(mouseX >690 && mouseX <690+size){
            if(turn==0){
    Elname(hand1[hand1.length-1],hand1.length-1);//描画まで行う
            }
          }
      };
    //スキルは右下に移動
      if(mouseY >400 && mouseY< 440){
        if(mouseX >710 && mouseX<790){
    Skillname(1);
  }}
      if(mouseX >0 && mouseX< 100){
        //クリックで切り替えできるように？
        if(mouseY >100 && mouseY<200){Skillname(2,1);}
        if(mouseY >200 && mouseY<300){Skillname(3,1);}
        if(mouseY >300 && mouseY<400){Skillname(4,1);}
        if(mouseY >400 && mouseY<480){Skillname(1,1);}
    }
    //河,riverx,120=>110,33,43.5
      }
    };
  function Elname(num,numb=0){
          //num->id の説明文を右枠に　numb->hand1の何番目
          if(num==ElnameM){
            return false;
          }else{
            ElnameM=num;
          }
          //console.log(num,ElnameM);
        cx2.font = "bold 18px Arial";
        cx2.clearRect(630,10,160,310)
        //expected num 1~45
        var type1=donpai.findIndex(value=>value.id==num)
        if(type1==-1){
          console.log('Donpai error!')
          return false;
        }
        e6.src=eltear_src[type1]
        e6.onload=function(){
          cx2.drawImage(e6,635,15,70,93);
        }
        cx2.font = "bold 24px Arial";
        cx2.fillStyle = "orange";
        cx2.fillText(donpai[type1].name, 635, 130);
        if(donpai[type1].sub.length>7){
          cx2.font = "14px Arial";
        }else{
          cx2.font = "18px Arial";
        }
        cx2.fillText("（"+donpai[type1].sub+"）", 630, 150);
        cx2.font = "20px Arial";
        cx2.fillStyle = "white";
        if(donpai[type1].line==0){
        cx2.fillText("オールマイティ", 635, 180);
        }else{
        cx2.fillText("CLASS："+donpai[type1].line+"Line", 635, 180);
        }
        Nodyaku2(1,num);
        if(reach[1]==2){
          var Wait=Reachwait(numb)
          if(Wait[0]=="ノーテン"){reach[0]=1}else{reach[0]=0};
          console.log(reach[0]);
          cx2.font = "18px Arial";
          cx2.clearRect(630,240,160,80)
          cx2.fillStyle = "white";
          cx2.fillText("「リーチ」", 635, 270);
          cx2.font = "Bold 16px Arial";
          cx2.fillStyle = "orange";
          cx2.fillText(Wait[0],635,300)
          cx3.clearRect(200,370,360,120);
          if(Wait.length>1){
            cx3.fillStyle = "rgba(20,20,20,0.7)";
            cx3.fillRect(201,371,358,118)
            cx3.font = "Bold 20px Arial";
            cx3.fillStyle = "orange";
            cx3.fillText(Wait[0],220,395)
          e9.src=eltear_src[Wait[1]]
          e9.onload=function(){
            cx3.drawImage(e9,210,410,60,78);
            if(Wait.length>2){
              e9.src=eltear_src[Wait[2]]
              e9.onload=function(){
                cx3.drawImage(e9,280,410,60,78);
                if(Wait.length>3){
                e9.src=eltear_src[Wait[3]]
                e9.onload=function(){
                  cx3.drawImage(e9,350,410,60,78);
                  if(Wait.length>4){
                    e9.src=eltear_src[Wait[4]]
                    e9.onload=function(){
                      cx3.drawImage(e9,420,410,60,78);
                      if(Wait.length>5){
                        e9.src=eltear_src[Wait[5]]
                        e9.onload=function(){
                          cx3.drawImage(e9,490,410,60,78);
                    }}}}
          }}}
          }}}
        }
    }
    function drawbuttom(x,y,word,type=0,w=80,z=40){
      //type->活性化時
      cx2.lineWidth = 2;
      if(type==0){
      cx2.strokeStyle="#68ceed";
      cx2.fillStyle="#0080ff"
      }else{
      cx2.strokeStyle="#233237";
      cx2.fillStyle="#043342";
      }
      cx2.beginPath();
      cx2.moveTo(x+1,y+1);
      cx2.lineTo(x+w-2, y+1);
      cx2.lineTo(x+w-2, y+z-2);
      cx2.lineTo(x+1,y+z-2);
      cx2.lineTo(x+1,y+1);
      cx2.fill();
      cx2.fillStyle="#68ceed";
      cx2.stroke();
      cx2.beginPath();
      cx2.moveTo(x+1,y+1);
      cx2.lineTo(x+31, y+1);
      cx2.lineTo(x+1, y+11);
      cx2.lineTo(x+1,y+1);
      cx2.fill();
      cx2.fillStyle = "#ffffff";
      cx2.font = "16px 'Century Gothic'";
      cx2.fillText(word,x+10,y+25)
      }
    function drawbuttom2(x,y,word,type=0,w=170,z=60){
      //オレンジボタン
      cx2.lineWidth = 2;
      if(type==0){
      cx2.strokeStyle="#ffbb4d";
      cx2.fillStyle="#ff7b00"
      }else{
      cx2.strokeStyle="#372d23";
      cx2.fillStyle="#5e5e5e";
      }
      cx2.beginPath();
      cx2.moveTo(x+1,y+1);
      cx2.lineTo(x+w-2, y+1);
      cx2.lineTo(x+w-2, y+z-2);
      cx2.lineTo(x+1,y+z-2);
      cx2.lineTo(x+1,y+1);
      cx2.fill();
      cx2.fillStyle="rgba(255, 187, 77,0.6)";//=#ffbb4d
      cx2.stroke();
      cx2.beginPath();
      cx2.moveTo(x+1,y+1);
      cx2.lineTo(x+75, y+1);
      cx2.lineTo(x+1, y+16);
      cx2.lineTo(x+1,y+1);
      cx2.fill();
      cx2.beginPath();
      cx2.moveTo(x+1,y+1);
      cx2.lineTo(x+51, y+1);
      cx2.lineTo(x+1, y+26);
      cx2.lineTo(x+1,y+1);
      cx2.fill();
      cx2.fillStyle = "#ffffff";
      cx2.font = "32px 'Century Gothic'";
      cx2.fillText(word,x+20,y+45)
      }  
    function drawstar(x,y){
      cx4.lineWidth = 1;
      cx4.beginPath();
      cx4.moveTo(x,y);
      cx4.lineTo(x+40, y);
      cx4.lineTo(x+7, y+22);
      cx4.lineTo(x+20,y-14);
      cx4.lineTo(x+33, y+22);
      cx4.lineTo(x,y);
      cx4.fill();
      }
             
  function LoopAnimation(ts){
    cx4.globalAlpha = alpha;
    cx4.clearRect(0,0,800,600)
    cx4.fillStyle = "#001c0d";
    cx4.beginPath();
      cx4.moveTo(0,200);
      cx4.lineTo(1600/3,0);
      cx4.lineTo(800, 0);
      cx4.lineTo(800,400);
      cx4.lineTo(800/3,600)
      cx4.lineTo(0,600)
      cx4.fill();
    loopX+=3
    loopX2+=80
    var x=loopX*4
    var y=300
    var loopxx=300/loopX
    y -=loopX*1.5
    if(x>=800){loopX=0}
    if(loopX2>=600){loopX2=600}
    
    cx4.fillStyle = "#ff4c38";
    cx4.strokeStyle = "#ff4c38";
    drawstar(x,y)
    cx4.fillStyle = "#007fd9";
    cx4.strokeStyle = "#007fd9";
    drawstar(x*1.2+100,y*1.2+100)
    cx4.fillStyle = "#f558e5";
    cx4.strokeStyle = "#f558e5";
    drawstar(x*1.1+140,y*1.1+200)
    
    cx4.drawImage(e15,loopX2-600,0,800+(600/loopX2),600+(600/loopX2))
    cx4.drawImage(e16,100,200,330+(loopxx/2),260+(loopxx*13/33))
    cx4.strokeStyle = "white";
    cx4.lineWidth = 6;
    cx4.beginPath();
    cx4.moveTo(x*3,y*3-200);
    cx4.lineTo(x*3+240,y*3-290);
    cx4.stroke();
    cx4.beginPath();
    cx4.moveTo(x*3,y*3-700);
    cx4.lineTo(x*3+240,y*3-790);
    cx4.stroke();
    
    if(alpha>0){
    if(gamestate==2){window.requestAnimationFrame((ts)=>LoopAnimation(ts));}else{
    alpha -=0.05
    window.requestAnimationFrame((ts)=>LoopAnimation(ts));}
    }else if(alpha <=0){
    cx4.clearRect(0,0,800,600);cx4.globalAlpha = 1;
    }
    };

function ReachAnimation(ts,A=0){
  cx4.globalAlpha = alpha;
  cx4.clearRect(0,0,800,600)
  cx4.fillStyle = "#001c0d";
  cx4.beginPath();
    cx4.moveTo(0,200);
    cx4.lineTo(1600/3,0);
    cx4.lineTo(800, 0);
    cx4.lineTo(800,400);
    cx4.lineTo(800/3,600)
    cx4.lineTo(0,600)
    cx4.fill();
  A+=1;
  loopX+=3
  loopX2+=80
  var x=loopX*4
  var xx=loopX*2
  var y=300
  y -=loopX*1.5
  if(x>=800){loopX=0}
  if(loopX2>=600){loopX2=600}
  cx4.rotate(-20*Math.PI/180);
  cx4.font = "bold 20px Arial";
  cx4.fillStyle = "#919191";
  var Reachtext='Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach!'
  cx4.fillText(Reachtext,xx-450,230);
  cx4.fillText(Reachtext,-xx+30,260);
  cx4.fillText(Reachtext,xx-450,290);
  cx4.fillText(Reachtext,-xx+30,320);
  cx4.fillText(Reachtext,xx-450,350);
  cx4.fillText(Reachtext,-xx-50,450);
  cx4.fillText(Reachtext,xx-470,480);
  cx4.fillText(Reachtext,-xx-50,510);
  cx4.fillText(Reachtext,xx-470,540);
  cx4.fillText(Reachtext,-xx-50,570);
  cx4.rotate(20*Math.PI/180);
  cx4.drawImage(e15,loopX2-600,0,800+(600/loopX2),600+(600/loopX2))
  cx4.drawImage(e17,110,260,216,150)
  cx4.strokeStyle = "white";
  cx4.lineWidth = 6;
  cx4.beginPath();
  cx4.moveTo(x*3,y*3-200);
  cx4.lineTo(x*3+240,y*3-290);
  cx4.stroke();
  cx4.beginPath();
  cx4.moveTo(x*3,y*3-700);
  cx4.lineTo(x*3+240,y*3-790);
  cx4.stroke();
  if(alpha>0){
  if(A<50){window.requestAnimationFrame((ts)=>ReachAnimation(ts,A));}else{
  alpha -=0.05
  window.requestAnimationFrame((ts)=>ReachAnimation(ts,A));}
  }else if(alpha <=0){
  cx4.clearRect(0,0,800,600);cx4.globalAlpha = 1;
  turnchecker();
  }
  };

function PonAnimation(ts,A=0,B){
  //余裕あればキャラごとにYを変えたい
    cx4.globalAlpha = alpha;
    A+=1;
    loopX+=3
    loopX2+=80
    var x=loopX*4
    var xx=loopX*3
    var y=300
    y -=loopX*1.5
    if(xx>50){xx=50};
    if(x>=800){loopX=0}
    if(loopX2>=500){loopX2=500}
    cx4.clearRect(0,0,800,600)
    cx4.fillStyle = "#001c0d";
    cx4.fillRect(0,250-xx,800,xx*2);
    cx4.drawImage(e15,400,200-xx,300,xx*2,loopX2,250-xx,300,xx*2)
    cx4.strokeStyle = "white";
    cx4.lineWidth = 6;
    cx4.beginPath();
    cx4.moveTo(0,250-xx);
    cx4.lineTo(800,250-xx);
    cx4.stroke();
    cx4.beginPath();
    cx4.moveTo(0,250+xx);
    cx4.lineTo(800,250+xx);
    cx4.stroke();
    cx4.rotate(-15*Math.PI/180);
    cx4.font = "bold 64px Arial";
    cx4.fillStyle = "#919191";
    var Reachtext='PON!'
    cx4.strokeText(Reachtext,50,300);
    cx4.fillText(Reachtext,50,300);
    cx4.rotate(15*Math.PI/180);
    if(alpha>0){
    if(A<30){window.requestAnimationFrame((ts)=>PonAnimation(ts,A,B));}else{
    alpha -=0.1
    window.requestAnimationFrame((ts)=>PonAnimation(ts,A,B));}
    }else if(alpha <=0){
    cx4.clearRect(0,0,800,600);cx4.globalAlpha = 1;
    console.log(B)
    switch(B){
      case 1:
      handgraph(0,1)
      turn=0;
      player1();
      break;
      default:
        turn=B-1;
        cpu(B);
        break;
    }
    }
  };
  
function KanAnimation(ts,A=0){
  //余裕あればキャラごとにYを変えたい
    cx4.globalAlpha = alpha;
    A+=1;
    loopX+=3
    loopX2+=80
    var x=loopX*4
    var xx=loopX*3
    var y=300
    y -=loopX*1.5
    if(xx>50){xx=50};
    if(x>=800){loopX=0}
    if(loopX2>=500){loopX2=500}
    cx4.clearRect(0,0,800,600)
    cx4.fillStyle = "#001c0d";
    cx4.fillRect(0,250-xx,800,xx*2);
    cx4.drawImage(e15,400,200-xx,300,xx*2,loopX2,250-xx,300,xx*2)
    cx4.strokeStyle = "white";
    cx4.lineWidth = 6;
    cx4.beginPath();
    cx4.moveTo(0,250-xx);
    cx4.lineTo(800,250-xx);
    cx4.stroke();
    cx4.beginPath();
    cx4.moveTo(0,250+xx);
    cx4.lineTo(800,250+xx);
    cx4.stroke();
    cx4.rotate(-15*Math.PI/180);
    cx4.font = "bold 64px Arial";
    cx4.fillStyle = "#919191";
    var Reachtext='KAN!'
    cx4.strokeText(Reachtext,50,300);
    cx4.fillText(Reachtext,50,300);
    cx4.rotate(15*Math.PI/180);
    if(alpha>0){
    if(A<30){window.requestAnimationFrame((ts)=>KanAnimation(ts,A));}else{
    alpha -=0.1
    window.requestAnimationFrame((ts)=>KanAnimation(ts,A));}
    }else if(alpha <=0){
    cx4.clearRect(0,0,800,600);cx4.globalAlpha = 1;
    kansw[1]=2;
    handgraph(0,1)
    turn=0;
    player1();
    }
  };
function SkillAnimation(ts){
  cx4.globalAlpha = alpha;
cx4.clearRect(0,0,800,600)
cx4.fillStyle = "#001c0d";
cx4.beginPath();
  cx4.moveTo(150,200);
  cx4.lineTo(683,0);
  cx4.lineTo(800,0);
  cx4.lineTo(800,400);
  cx4.lineTo(1600/3,500)
  cx4.lineTo(150,500)
  cx4.fill();
loopX+=3
loopX2+=80
var loopxx=300/loopX
var x=loopX*4
var y=300
y -=loopX*1.5
if(x>=800){loopX=0}
if(loopX2>=600){loopX2=600}

cx4.font = "32px 'Century Gothic'";
cx4.strokeStyle ="#05ff9b";
  cx4.lineWidth = 5;
  cx4.lineJoin = 'round';
cx4.fillStyle ="white";
cx4.strokeText(skilltext1,200+(loopxx),240)
cx4.fillText(skilltext1,200+(loopxx),240)
cx4.font = "24px 'Century Gothic'";
cx4.fillStyle ="#001c0d";
cx4.strokeText(skilltext2,300+(loopxx/10),280)
cx4.fillText(skilltext2,300+(loopxx/10),280)
cx4.drawImage(e17,loopX2-600,0,800,600)
cx4.strokeStyle = "white";
cx4.lineWidth = 6;
cx4.beginPath();
cx4.moveTo(x*3,y*3-200);
cx4.lineTo(x*3+240,y*3-290);
cx4.stroke();
cx4.beginPath();
cx4.moveTo(x*3,y*3-700);
cx4.lineTo(x*3+240,y*3-790);
cx4.stroke();
if(alpha>0){
alpha -=0.05
window.requestAnimationFrame((ts)=>SkillAnimation(ts));
}else if(alpha <= 0){cx4.clearRect(0,0,800,600);
cx4.globalAlpha = 1;
if(ctlswitch>1){ctl[ctlswitch]=2};
ctlswitch=5
console.log('4789'+ctl)
//cpuplay(ctlswitch);}
}
};

function SpecialSkill(player,target=0){
  var p=chara[player]
  console.log("skill",player,target)
  if(target>=100 || skillswitch[player]==0){
    //target 100->演出中の待ち
  //skillswitch 0使用可能 1次の自分のターンにリセット 2この局では使用不可
  if(p==1){//エル
  if(player==1){
  if(target>0){
  cLock=0;
  console.log('操作禁止')
  e17.src=chrimg_src[p]
  e17.onload=function(){
    var A;
    var B;
    var C=[0,0];
    var D=[0,0];
    var E;
  switch(target){
    case 1:
      if(trash1.length>=2){
        var Skin=Buff[target].findIndex(value=>value==1);
        if(Skin ==-1){
    A=1+Math.floor(Math.random()*(hand1.length-2));
    E=hand1.splice(A,1);
    C[0]=E[0]
    A=1+Math.floor(Math.random()*(hand1.length-2));
    E=hand1.splice(A,1);
    C[1]=E[0]
    B=Math.floor(Math.random()*(trash1.length));
    hand1.push(trash1[B]);
    D[0]=trash1[B]
    B=Math.floor(Math.random()*(trash1.length));
    hand1.push(trash1[B]);
    D[1]=trash1[B]
    console.log(A,B,C,D)
    judge(1);
        }
      }else{
        se2.play();
        cLock=2;
        return false;
      }
    //あえて並び替えしない
    //if(handsort==0){hand1.sort(compareFunc)}else{hand1.sort(compareFunc3);};
  break;
    case 2:
      if(trash2.length>=2){
        var Skin=Buff[target].findIndex(value=>value==1);
        if(Skin ==-1){
    A=1+Math.floor(Math.random()*(hand2.length-2));
    E=hand2.splice(A,1);
    C[0]=E[0]
    A=1+Math.floor(Math.random()*(hand2.length-2));
    E=hand2.splice(A,1);
    C[1]=E[0]
    B=Math.floor(Math.random()*(trash2.length));
    hand2.push(trash2[B]);
    D[0]=trash2[B]
    B=Math.floor(Math.random()*(trash2.length));
    hand2.push(trash2[B]);
    D[1]=trash2[B]
    console.log(A,B,C,D)
    hand2.sort(compareFunc);
        }
  }else{
    se2.play()
    cLock=2;
    return false;
  }
    break;
    case 3:
      if(trash3.length>=2){
        var Skin=Buff[target].findIndex(value=>value==1);
        if(Skin ==-1){
    A=1+Math.floor(Math.random()*(hand3.length-2));
    E=hand3.splice(A,1);
    C[0]=E[0]
    A=1+Math.floor(Math.random()*(hand3.length-2));
    E=hand3.splice(A,1);
    C[1]=E[0]
    B=Math.floor(Math.random()*(trash3.length));
    hand3.push(trash3[B]);
    D[0]=trash3[B]
    B=Math.floor(Math.random()*(trash3.length));
    hand3.push(trash3[B]);
    D[1]=trash3[B]
    console.log(A,B,C,D)
    hand3.sort(compareFunc);
        }
  }else{
    se2.play()
    cLock=2;
    return false;
  }
    break;
    case 4:
      if(trash4.length>=2){
        var Skin=Buff[target].findIndex(value=>value==1);
        if(Skin ==-1){
    A=1+Math.floor(Math.random()*(hand4.length-2));
    E=hand4.splice(A,1);
    C[0]=E[0]
    A=1+Math.floor(Math.random()*(hand4.length-2));
    E=hand4.splice(A,1);
    C[1]=E[0]
    B=Math.floor(Math.random()*(trash4.length));
    hand4.push(trash4[B]);
    D[0]=trash4[B]
    B=Math.floor(Math.random()*(trash4.length));
    hand4.push(trash4[B]);
    D[1]=trash4[B]
    console.log(A,B,C,D)
    hand4.sort(compareFunc);
        }
  }else{
    se2.play()
    cLock=2;
    return false;
  }
    break;
    default:
      console.log(ctlswitch);
      //スキル演出中
      if(ctlswitch==5){
      cLock=1;
      handgraph(0,1);
      //9枚目だけここで書く
      if(ponsw[1]!==1){
        eltear.src=eltear_src[hand1[hand1.length-1]]
        eltear.onload=function(){
        cx2.clearRect(690,500,size,sizey)
        cx2.drawImage(eltear,690,500,size,sizey)
        }}
      }else{
        setTimeout(function(){
          SpecialSkill(player,target)
          }, 550);
      }
      return false;
  }
  alpha=2;
  //cx4.globalAlpha=1
  loopX=0;
  loopX2=0;
  ctlswitch=player
  skilltext1=skilltext[p].fir
  skilltext2=skilltext[p].sec
  skilltext3=skilltext[p].thr
  window.requestAnimationFrame((ts)=>SkillAnimation(ts));
  se12.play();
  if(reach[target]==3){reach[target]=0}
  //cx2.fillStyle = "rgba(20,20,20,0.5)";
  drawbuttom(710,400,"スキル",1);
  cx3.clearRect(0,0,800,600)
  skillusage[player]+=1
  skillswitch[player]=2
  SpecialSkill(player,100);
  //player1();
  }}else if(target==0){
  se5.play()
  cx3.fillStyle = "rgba(20,20,20,0.3)";
  cx3.fillRect(0,0,800,100)
  cx3.fillRect(150,100,650,400)
  cx3.fillRect(0,500,800,100)
  cLock=2
  }}else{//cpu
  }
  }
  if(p==2){//アイ
    if(player==1){
    if(target>0){
    cLock=0;
    console.log('操作禁止')
    e17.src=chrimg_src[p]
    e17.onload=function(){
      //console.log(skillusage2[player])
    if(skillusage2[player]>-1){
      //メモライズしたパイに変える
      if(target>=100){ 
        if(ctlswitch==5){ 
        cLock=1;
        skillusage2[player]=-1;
        handgraph(0,1);
        judge(1);
              //9枚目だけここで書く
      if(ponsw[1]!==1){
        eltear.src=eltear_src[hand1[hand1.length-1]]
        eltear.onload=function(){
        cx2.clearRect(690,500,size,sizey)
        cx2.drawImage(eltear,690,500,size,sizey)
        }}
      }else{
        setTimeout(function(){
          SpecialSkill(player,target)
          }, 550);
        }
        return false;
      }else{hand1[target]=skillusage2[player];}
    }else{
      //メモライズしてから切る
    if(target>=100){ 
      if(ctlswitch==5){ 
      cLock=1;
      skillusage2[player]=hand1[target-100];
      var SX=hand1.findIndex(value=>value==skillusage2[player])
      PlayertoCpu(SX)
    }else{
      setTimeout(function(){
        SpecialSkill(player,target)
        }, 550);
      }
      return false;
    }
    }
    alpha=2;
    loopX=0;
    loopX2=0;
    ctlswitch=player
    skilltext1=skilltext[p].fir
    skilltext2=skilltext[p].sec
    skilltext3=skilltext[p].thr
    window.requestAnimationFrame((ts)=>SkillAnimation(ts));
    se12.play();
        //cx2.fillStyle = "rgba(20,20,20,0.5)";
    //cx2.fillRect(710,400,80,40)
    drawbuttom(710,400,"スキル",1);
    skillswitch[player]=1
    skillusage[player]+=1;
    if(skillusage[player]>=4){skillswitch[player]=2}
    target+=100;
    SpecialSkill(player,target);
    }}else if(target==0){
    se5.play()
    cx3.fillStyle = "rgba(20,20,20,0.3)";
    cx3.fillRect(0,0,800,600)
    cx3.clearRect(4,490,762,110)
    cLock=3;
    }}else{//cpu
    e17.src=chrimg_src[p]
    e17.onload=function(){
    alpha=2;
    loopX=0;
    loopX2=0;
    ctlswitch=player
    skilltext1=skilltext[p].fir
    skilltext2=skilltext[p].sec
    skilltext3=skilltext[p].thr
    window.requestAnimationFrame((ts)=>SkillAnimation(ts));
    se12.play();
    cx2.fillStyle = "rgba(20,20,20,0.5)";
    cx2.fillRect(710,400,80,40)
    //deck.push(Hand1[target].elia)
    if(skillusage2[p]>-1){
      //メモライズしたパイに変える
      Cpuhandtemp[target]=skillusage2[p];
      skillusage2[p]=-1;
      skillusage[player]+=1;
    }else{
      //メモライズしてから切る
      skillusage2[p]=Cpuhandtemp[target];
    }
    skillswitch[player]=1
    if(skillusage[player]>=2){skillswitch[player]=2}
    ctl[player]=2;cpuplay(player);
    }}
    }
  if(p==3){//レナ
    if(player==1){
    if(target>1){
    cLock=0;
    console.log('操作禁止')
    switch(target){
      case 2:
      case 3:
      case 4:
      var Skin=Buff[target].findIndex(value=>value==1);
      if(Skin ==-1){
        Buff[target].push(6,6)
        console.log(Buff[target]);
      }
      break;
    default:
      console.log(ctlswitch);
      //スキル演出中
      if(ctlswitch==5){
      cLock=1;
      //handgraph(0,1);
      console.log('操作可能')
      }else{
        setTimeout(function(){
          SpecialSkill(player,target)
          }, 550);
      }
      return false;
      break;
    }
    e17.src=chrimg_src[p]
    e17.onload=function(){
    alpha=2;
    //cx4.globalAlpha=1
    loopX=0;
    loopX2=0;
    ctlswitch=player
    skilltext1=skilltext[p].fir
    skilltext2=skilltext[p].sec
    skilltext3=skilltext[p].thr
    window.requestAnimationFrame((ts)=>SkillAnimation(ts));
    se12.play();
    //cx2.fillStyle = "rgba(20,20,20,0.5)";
    drawbuttom(710,400,"スキル",1);
    cx3.clearRect(0,0,800,600)
    skillusage[player]+=1
    skillswitch[player]=2
    SpecialSkill(player,100);
    //player1();
    }}else if(target==0){
    se5.play()
    cx3.fillStyle = "rgba(20,20,20,0.3)";
    cx3.fillRect(0,0,800,100)
    cx3.fillRect(150,100,650,300)
    cx3.fillRect(0,400,800,200)
    cLock=2
    }}else{//cpu
    }
    }
  }
  }//specialskill
  

function gameover(){//けっかはっぴょぉうする
  musicnum=0;
  Bgm.fade(0.05*vBar, 0, 1000);
  Bgm.on("fade", ()=>{
  Bgm.stop();
  });
  var LPresult=[
  {pc:1, chara:chara[1], elia:LP[1]},
  {pc:3, chara:chara[2], elia:LP[2]},
  {pc:4, chara:chara[3], elia:LP[3]},
  {pc:2, chara:chara[4], elia:LP[4]},
    ]
  LPresult.sort(compareFunc2);
  console.log(LPresult)
  gamestate=3
  cx1.fillStyle = "#001c0d";
  cx1.fillRect(0,0,800,600)
  cx2.clearRect(0,0,800,600)
  e10.src=chrimg_src[LPresult[3].chara]
    e10.onload=function(){
  cx2.drawImage(e10,400,0,300,600,0,100,200,400)
  e10.src=chrimg_src[LPresult[2].chara]
    e10.onload=function(){
  cx2.drawImage(e10,400,0,300,600,200,100,200,400)
  e10.src=chrimg_src[LPresult[1].chara]
    e10.onload=function(){
  cx2.drawImage(e10,400,0,300,600,400,100,200,400)
  e10.src=chrimg_src[LPresult[0].chara]
    e10.onload=function(){
  cx2.drawImage(e10,400,0,300,600,600,100,200,400)
  
  cx2.font = "bold 32px Arial";
  cx2.fillStyle = "white";
  cx2.fillText("1st", 0, 50);
  cx2.fillText("2nd", 200, 50);
  cx2.fillText("3rd", 400, 50);
  cx2.fillText("4th", 600, 50);
  cx2.font = "bold 24px Arial";
  cx2.fillText(LPresult[3].elia, 0, 550);
  cx2.fillText(LPresult[2].elia, 200, 550);
  cx2.fillText(LPresult[1].elia, 400, 550);
  cx2.fillText(LPresult[0].elia, 600, 550);
      }
      }}}
  }//
      
function Skillname(player,num=0){
  //num 0->キャラ情報　1->バフ情報
cx2.font = "bold 18px Arial";
cx2.fillStyle = "white";
cx2.clearRect(630,10,160,310)
var p=chara[player]
cx2.fillText(chrlist[p], 635, 80);
switch(num){
  case 0:
if(p==1){
cx2.font = "bold 16px Arial";
cx2.fillText("①ストーンスキン", 635, 110);
cx2.font = "14px Arial";
cx2.fillText("・リーチしている間,", 635, 130);
cx2.fillText("他のスキルの効果を", 635, 150);
cx2.fillText("受けない。", 635, 170);
cx2.font = "bold 16px Arial";
cx2.fillText("②フレイムガイザー", 635, 190);
cx2.font = "14px Arial";
cx2.fillText("・1局に1度,捨てパイが", 635, 210);
cx2.fillText("2枚以上あるプレイヤー", 635, 230);
cx2.fillText("を1人選んで発動できる.", 635, 250);
cx2.fillText("選んだプレイヤーのパイ", 635, 270);
cx2.fillText("をランダムに2枚破壊し,", 635, 290);
cx2.fillText("他の捨てパイに変える.", 635, 310);
}else if(p==2){
  var MS=Buff[player].filter(value=>value==2)
  if(!MS.length){MS=[]};
cx2.font = "bold 16px Arial";
cx2.fillText("①マナシールド"+MS.length, 635, 110);
cx2.font = "14px Arial";
cx2.fillText("・氷のパイを捨てる度に", 635, 130);
cx2.fillText("マナシールドを張る." ,635, 150);
cx2.font = "bold 16px Arial";
cx2.fillText("②メモライズ", 635, 170);
cx2.font = "14px Arial";
cx2.fillText("・1局に2度まで,自分の", 635, 190);
cx2.fillText("パイを選び発動できる.", 635, 210);
cx2.fillText("選んだパイをメモライズ", 635, 230);
cx2.fillText("してから捨てる.もう1度", 635, 250);
cx2.fillText("スキルキーを押すと,", 635, 270);
cx2.fillText("選んだパイをメモライズ", 635, 290);
cx2.fillText("したパイに変える.", 635, 310);
}else if(p==3){
cx2.font = "bold 15px Arial";
cx2.fillText("①ネイチャーフォース", 635, 110);
cx2.font = "14px Arial";
cx2.fillText("・風パイを切る度に", 635, 130);
cx2.fillText("NFバフがつく.", 635, 150);
cx2.fillText("・強靭番の時,風パイ", 635, 170);
cx2.fillText("が初手で入りやすい.", 635, 190);
cx2.font = "bold 15px Arial";
cx2.fillText("②フリージングアロー", 635, 210);
cx2.font = "14px Arial";
cx2.fillText("・1局に1度だけ,他の", 635, 230);
cx2.fillText("プレイヤーを1人選択", 635, 250);
cx2.fillText("して発動できる.", 635, 270);
cx2.fillText("選んだプレイヤーを", 635, 290);
cx2.fillText("2巡の間,凍結させる.", 635, 310);
}else if(p==4){

}else if(p==5){

}else if(p==6){

}else if(p==7){

}else if(p==9){

}else if(p==11){

}else{
cx2.font = "bold 16px Arial";
cx2.fillText("①パッシブスキル", 635, 110);
cx2.font = "14px Arial";
cx2.fillText("・なし", 635, 130);
cx2.font = "bold 16px Arial";
cx2.fillText("②アクティブスキル", 635, 190);
cx2.font = "14px Arial";
cx2.fillText("・なし", 635, 210);
}
break;
case 1:
  //Buff
  var y=110;
  if(LP[player]<0){
    cx2.font = "bold 20px Arial";
    cx2.fillText("戦闘不能", 635, y);
    cx2.font = "14px Arial";
    y+=20;
    var T=3-skillusage2[player]
    cx2.fillText(" "*T+"局後に復活", 635, y);
    y+=20
  }
  for(var i=1;i<7;i++){
    var A=Buff[player].filter(value=>value==i)
    if(A.length>0){
      switch(i){
        case 1:
          cx2.font = "bold 16px Arial";
          cx2.fillText("ストーンスキン", 635, y);
          cx2.font = "14px Arial";
          y+=20;
          cx2.fillText(" 自分へのスキル無効", 635, y);
          y+=20
          break;
        case 2:
          cx2.font = "bold 16px Arial";
          cx2.fillText("マナシールド"+A.length, 635, y);
          cx2.font = "14px Arial";
          y+=20;
          cx2.fillText(" 受けるダメージ減少", 635, y);
          y+=20
          break;
        case 3:
          cx2.font = "bold 16px Arial";
          cx2.fillText("ネイチャーフォース"+A.length, 635, y);
          cx2.font = "14px Arial";
          y+=20;
          cx2.fillText(" 勝利時戦闘力増加", 635, y);
          y+=20
          break;
        case 4:
          cx2.font = "bold 16px Arial";
          cx2.fillText("ナソードコア"+A.length, 635, y);
          cx2.font = "14px Arial";
          y+=20;
          cx2.fillText(" 勝利時追加ダメージ", 635, y);
          y+=20
          cx2.fillText(" 受けるダメージ無効", 635, y);
          y+=20
          break;
        case 5:
          cx2.font = "bold 16px Arial";
          cx2.fillText("咆仙経", 635, y);
          cx2.font = "14px Arial";
          y+=20;
          cx2.fillText(" リーチ時,高確率で", 635, y);
          y+=20
          cx2.fillText(" 一発ツモする.", 635, y);
          y+=20
          break;
        case 6:
          cx2.font = "bold 16px Arial";
          cx2.fillText("凍結"+A.length, 635, y);
          cx2.font = "14px Arial";
          y+=20;
          cx2.fillText(" 行動不可.", 635, y);
          y+=20
          y+=20
          break;
      }
    }
  }
  if(y==110){
    cx2.font = "bold 16px Arial";
    cx2.fillText("バフなし", 635, 110);
  }
  break;
}
};
  
      
};