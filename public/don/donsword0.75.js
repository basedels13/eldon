//var0.95
//フリバに魔界モード追加　デスマッチ工事中
//キル・デス情報はまだ同期していない;
//アイシャのCPUスキル後に止まることがある？

window.onload = function(){
  draw();
  };
  
  function draw(){
  var debugmode=false;  //コンソールログの表示の切り替え　リリース時にfalseに
  //自分自身の情報を入れる箱
  var IAM = {
    token: null,    // 戸別管理用のトークン
    name: null,     // 名前
    room: 0,     // ルーム 123
    mwah: 0,        // ホストでない場合に何個ずらすか
    is_join: false,  // 入室中？
    is_ready: 0 // 0 1レディ
  };
  // メンバー一覧を入れる箱
  var MEMBER = [];
  //  例：{name:"マスター",chr:0,score:50000,turnflag:0,pc:1},
  //ary.push({one: 1, two: 2, three: 3});
  var memberlist=[];
  const RoomName=[0,"room1","room2","room3"]
  var Roomlist1=[];
  var Roomlist2=[];
  var Roomlist3=[];
  function IsHost(room=1){
  //リストIDが0の人をホストとする
  switch(room){
    case 1:
    var A=Roomlist1.findIndex(value =>value.token==IAM.token);
    if(A==-1){
      console.log('roomlist1 error!');
    }else{
      if(Roomlist1[A].id==0){
        return true;
      }else{
        return false;
      }
    }
  break;
  case 2:
    var A=Roomlist2.findIndex(value =>value.token==IAM.token);
    if(A==-1){
      console.log('roomlist2 error!');
    }else{
      if(Roomlist2[A].id==0){
        return true;
      }else{
        return false;
      }
    }
  break;
  case 3:
    var A=Roomlist3.findIndex(value =>value.token==IAM.token);
    if(A==-1){
      console.log('roomlist3 error!');
    }else{
      if(Roomlist3[A].id==0){
        return true;
      }else{
        return false;
      }
    }
  break;
   default:
    console.log('IsHost error!',room)
    return false;
    break;
  }};
 
  //接続
  const socket = io();
  socket.on('connect', () => {
    console.log('connect');
  });
  /**
   * [イベント] トークンが発行されたら
   */
  socket.on("token", (data)=>{
    // トークンを保存
    IAM.token = data.token;
  });
  
  //接続人数を受け取る 変化していれば反映する
  socket.on('lobby-update',(data)=>{
    //room:Room,state:State
    RoomNum=data.room.concat();
    RoomState=data.state.concat();
    if(pagestate==6 && msgstate==0){
      cx3.fillStyle = "white";
      cx3.font = "bold 22px Arial";
      var X=80;
      var Y=130;
      for(var i=0;i<3;i++){
        cx3.clearRect(X-10,Y-20,150,100);
        cx3.fillText("人数："+RoomNum[i]+"/4", X, Y+20);
        cx3.fillText("状態："+RoomState[i], X, Y+50);
        X+=220;
      }
    }
  });
  socket.on('xxx', (data)=>{
    if(Usercount !== data.message){
    Usercount=data.message;
    if(pagestate==6 && msgstate==0){
      cx2.fillStyle = "black";
      cx2.font = "18px Arial";
      cx2.clearRect(580,530,170,20)
      cx2.fillText("現在の接続人数："+Usercount, 580, 550);
    }}
    });

  var Usercount=0;
  var RoomNum=[0,0,0];
  var RoomState=["open","open","open"];
  var mouseX;
  var mouseY;
  var Savetitle =new Array("This is savedata of <https://azurelsword.web.fc2.com/ronan.html>",0,0);
  var mute="ON"
  var alpha = 0;
  var loadstate=0;
  var Username = "player";
  var Usercrest = "称号なし";
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
    var stage = new createjs.Stage("canvas7");//Stage
    var container = new createjs.Container();
    container.x = 0;
    container.y = 0;
    stage.addChild(container); // 画面に追加
    var field = new createjs.Container();
    stage.addChild(field);
    var yakumap = new createjs.Container();
    stage.addChild(yakumap);
    var yakumap2 = new createjs.Container();
    stage.addChild(yakumap2);
    var handmap = new createjs.Container();
    stage.addChild(handmap);
    //reachhandあたりでの手札をcreateで描画してもいいかも？
    yakumap.alpha=0;
    var yakumapY=0;
    var graphics;
  graphics=new createjs.Graphics();
  graphics
    .beginRadialGradientFill(["white","orange"],[0.0,1.0],0,0,20,0,0,100)
    .drawPolyStar(0, 0, 50, 5, 0.4, -90);
  var Cstar = new createjs.Shape(graphics);
  Cstar.x=100;
  Cstar.y=225;
  stage.addChild(Cstar); // 表示リストに追加
  var tweeNstar;
  tweeNstar=createjs.Tween.get(Cstar, {loop: true})
  .to({rotation:360},1200);
  var Csquare= new createjs.Shape();
  Csquare.graphics.beginFill("white").drawRect(0,0,135,100);
  Csquare.x=10;
  Csquare.y=0;
  stage.addChild(Csquare);
  var tweeNsquare;
  tweeNsquare=createjs.Tween.get(Csquare, {loop: true})
  .to({alpha:0.5},600)
  .to({alpha:0},600)
  .to({alpha:0.5},600);
  tweeNsquare.paused=true;
  Csquare.alpha=0;
  var Clvup = new createjs.Bitmap("don/Don_fever.png");
  Clvup.alpha=0;
  stage.addChild(Clvup);

    //アップデートする
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick",function(){
        stage.update();
      });
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
  var chara =new Array(0,0,0,0,0)
  //mpmove
  var Mpai = 0;
  var CMpai;
  var Fever =0;
  //ルーム設定
  var LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サバイバル","デスマッチ"]};
  var mpmoving=false;
  var mpC=0;
  var ManaBreak=0;
  var pvpmode=0;
  var raidscore=new Array(0,0,0,0,0);//魔界ルールで使用 0->終了時 1-4 和了した人
  var drawcard;
  var Cskillprepare=[0,0,0,0,0];
  //chara0 0->cpuランダム 1->cpu決める
  //覚醒ゲージ0-30
  var DP =new Array(0,0,0,0,0)
  //バフ 1スキン 2マナシールド 3ネイチャ 4ナソコア 5やけど 6凍結 7適応力
  //11~修羅の戦で和了済みの人
  var Buff =new Array(0,[],[],[],[])
  //再発動間隔測る用の配列
  var BuffCT = [];
  var mode=0
  var musicnum=0
  var musicset=new Array(3,7,8);
  //通常時、自分の立直時、オーラス時
  var vBar=1;
  var sBar=1;
  //音量調節機能を追加
  var shiagytemp=1;
  //0->一覧 1->所持パイのみ
  var auras=0;
  //オーラスの時1　現在音楽のみに影響
  var Ronturn=[];
  //データベース
  var LPlist=new Array("一般","ヘル","ミリオネア","∞","魔界血戦")
  var musiclist=new Array("test","夜の迷宮の入口","決闘のテーマ","盲目のアストライア","The Evil Sacrifice Archenemies","Nine Jack","ロベリア","リーチっぽい音楽","狂乱のオーラス","エルの樹の麓")
  var chrlist=new Array("名無しさん","エルス","アイシャ","レナ")//,"レイヴン","エド","アラ","ラビィ")
  var chrimg_src= new Array("don/Don_chara0.png","don/Don_chara1.png","don/Don_chara2.png","don/Don_chara3.png","don/Don_chara0.png");
  var atrbute_src= new Array("don/Don_DP.png","don/Duel_mana.png","don/Duel_sun.png","don/Duel_aqua.png","don/Duel_wind.png","don/Duel_moon.png","don/Duel_gaia.png","don/Duel_heat.png","don/Don_HA.png");
  var bgimg_src=new Array(1,"don/Don_bg1.png","don/elimg2.png","don/stadium2.png");
  //説明用
  var epic_src =new Array("don/elstudio_bg1.png","don/Don_epic1.png","don/Don_epic2.png","don/Don_epic3.png","don/Don_epicline.png","don/Don_ss11.png","don/Don_epic4.png","don/Don_epic5.png");
  //裏＆ツモロンボタン
  var eltearB_src =new Array( "don/Don_img0.png","don/Don_tumoA.png","don/Don_tumoB.png","don/Don_tumoC.png","don/Don_tumoD.png");
  var eltear= new Image();
  //donpaiのidは0から始まるためそのまま
  var eltear_src = new Array("don/Don_img1.png","don/Don_img2.png","don/Don_img3.png","don/Don_img4.png","don/Don_img5.png","don/Don_img6.png","don/Don_img7.png","don/Don_img8.png","don/Don_img9.png","don/Don_img10.png",);
  eltear_src.push("don/Don_img11.png","don/Don_img12.png","don/Don_img13.png","don/Don_img14.png","don/Don_img15.png","don/Don_img16.png","don/Don_img17.png","don/Don_img18.png","don/Don_img19.png","don/Don_img20.png",);
  eltear_src.push("don/Don_img21.png","don/Don_img22.png","don/Don_img23.png","don/Don_img24.png","don/Don_img25.png","don/Don_img26.png","don/Don_img27.png","don/Don_img28.png","don/Don_img29.png","don/Don_img30.png",);
  eltear_src.push("don/Don_img31.png","don/Don_img32.png","don/Don_img33.png","don/Don_img34.png","don/Don_img35.png","don/Don_img36.png","don/Don_img37.png","don/Don_img38.png","don/Don_img39.png","don/Don_img40.png",);
  eltear_src.push("don/Don_img41.png","don/Don_img42.png","don/Don_img43.png","don/Don_img44.png","don/Don_img45.png");
  //create用
  var donpaiList=[];
  var s;
  var ary=[];
  console.log(eltear_src.length);
  //expected 45
  //バフアイコン
  var donicon=new Image();
  var donicon_src= new Array("don/Don_buff.png","don/Don_mbicon.png","don/Don_fever.png")
  var win_src= new Array("don/win1.png","don/win1.png","don/win2.png","don/win3.png","don/win4.png","don/win5.png","don/win6.png","don/wintumo.png","don/winron.png","don/winreach.png");
  var musiclistDT=[
  {title:"0",elia:"0",nod:"0"},
  {title:"夜の迷宮の入口",elia:"提供",nod:"ラビィのテーマのイメージ"},
  {title:"決闘のテーマ",elia:"提供",nod:"from Elsword music007_boss <耳コピ>"},
  {title:"盲目のアストライア",elia:"ISAo",nod:"@ DOVA-SYNDROM"},
  {title:"The Evil Sacrifice Archenemies",elia:"ISAo",nod:"@ DOVA-SYNDROM"},
  {title:"Nine Jack",elia:"まんぼう二等兵",nod:"@ DOVA-SYNDROM"},
  {title:"ロベリア",elia:"まんぼう二等兵",nod:"@ DOVA-SYNDROM"},
  {title:"リーチっぽい音楽",elia:"提供",nod:"アトラスシティーのイメージ"},
  {title:"狂乱のオーラス",elia:"提供",nod:"from Elsword music092_boss <耳コピ>"},
  {title:"エルの樹の麓",elia:"提供",nod:"from Elsword music005_stage <耳コピ>"},
  ]
  var skilltext=[{fir:"0",sec:"0",thr:"0"},
  {fir:"フレイムガイザー",sec:"FLAME GEYSER",thr:"0"},
  {fir:"メモライズ",sec:"MEMORIZE",thr:"0"},
  {fir:"フリージングアロー",sec:"FREEZING ARROW",thr:"0"},
  {fir:"グラウンドクラッシュ",sec:"GROUND CRUSH",thr:"0"},
  ]
  //name->キャラsub->職、役判定で使用　line->ライン役判定に使用 0->all　color->1234567陽水風月土火E 0->all
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
  //実績
  var achieveA=[
  {name:"始めまして～",sub:"エルドンを1回プレイする"},
  {name:"エルドンの通",sub:"エルドンを通算10回プレイする"},
  {name:"エルドンの民",sub:"エルドンを通算50回プレイする"},
  {name:"エルドンの妖精",sub:"エルドンを通算100回プレイする"},
  {name:"ロナン・エルドン",sub:"エルドンを通算179回プレイする"},
  {name:"エルドンの覇者",sub:"エルドンを通算300回プレイする"},
  {name:"地獄の生還者",sub:"半荘戦で1度もツモ・ロンせずに最後まで生存する"},
  {name:"もしかして空気？",sub:"半荘戦で1度もツモ・ロン・ポン・放銃せずに終了する"},
  {name:"スーパーソニック",sub:"半荘戦を4局以内に終了する"},
  {name:"甘美な勝利",sub:"3回以上1位になる"},
  {name:"ドカーン！",sub:"5回以上4位になる"},
  {name:"見える、見えるぞ！",sub:"半荘戦で一度も放銃せずに勝利する"},
  {name:"スケアチェイス",sub:"半荘戦で3回以上放銃する"},
  {name:"デュアルバスター",sub:"2回以上ダブル放銃する"},
  {name:"私ぶっ飛んでるの！",sub:"7回以上飛ぶ"},
  {name:"まだだ",sub:"2連荘する"},
  {name:"もう一度かかってこい",sub:"3連荘する"},
  {name:"あなたと一緒なら",sub:"3ペアを30回以上和了する"},
  {name:"突き抜ける快感",sub:"ライン通貫を10回以上和了する"},
  {name:"はじめてのツモ",sub:"1回ツモアガリする"},
  {name:"はじめてのロン",sub:"1回ロンアガリする"},
  {name:"歴戦の勇士",sub:"門前ツモを10回達成する"},
  {name:"マスターへの道",sub:"戦闘力300000を達成する"},
  {name:"マスターへの道（ヘル）",sub:"戦闘力600000を達成する"},
  {name:"ミリオネア",sub:"戦闘力1000000を達成する"},
  {name:"ダブルスラッシュ",sub:"二倍満を和了する"},
  {name:"トリプルガイザー",sub:"三倍満を和了する"},
  {name:"これで終わりだ！",sub:"数え役満を和了する"},
  {name:"渾身の一撃",sub:"150000点以上の手を和了する"},
  {name:"魂の一撃",sub:"300000点以上の手を和了する"},
  {name:"必殺の一撃",sub:"1000000点以上の手を和了する"},
  {name:"回れ！回れ！回れ！",sub:"通算30回ポンする"},
  {name:"YOUならやれるポン",sub:"通算100回ポンする"},
  {name:"変化無双",sub:"国士無双を和了する"},
  {name:"幸運の証票",sub:"天和を和了する"},
  {name:"海千山千",sub:"海底を和了する"},
  {name:"クレストコンプリート",sub:"全てのキャラ役を1回以上成立させる"},
  {name:"シナジーコンプリート",sub:"全てのシナジー役を1回以上成立させる"},
  {name:"柔軟な実績コレクター",sub:"実績を10個以上開放する"},
  {name:"強靭な実績コレクター",sub:"実績を30個以上開放する"},
  ]
  for(var i=0; i<achieveA.length;i++){
    achieveA[i].id=i;
    achieveA[i].cleared=0;
  }
  //役
  var achieveB=[
    {name:"3ペア",sub:"アガリ形"},
    {name:"1ライン通貫",sub:"アガリ形"},
    {name:"2ライン通貫",sub:"アガリ形"},
    {name:"3ライン通貫",sub:"アガリ形"},
    {name:"国士無双",sub:"アガリ形"},
    {name:"鋭さ",sub:"シナジー役",max:7},
    {name:"ナソード研究",sub:"シナジー役",max:5},
    {name:"精霊の加護",sub:"シナジー役",max:3},
    {name:"物理特化",sub:"シナジー役",max:6},
    {name:"魔法特化",sub:"シナジー役",max:5},
    {name:"貫徹する足取り",sub:"シナジー役",max:1},
    {name:"豊かな足取り",sub:"シナジー役",max:1},
    {name:"上手な足取り",sub:"シナジー役",max:1},
    {name:"敏捷さ",sub:"シナジー役",max:6},
    {name:"正義を貫徹する者",sub:"シナジー役",max:5},
    {name:"殴り合い",sub:"シナジー役",max:3},
    {name:"時空間",sub:"シナジー役",max:3},
    {name:"魔族",sub:"シナジー役",max:3},
    {name:"巨人審判者",sub:"シナジー役",max:6},
    {name:"マナ守護",sub:"シナジー役",max:3},
    {name:"探求する者",sub:"シナジー役",max:6},
    {name:"原初的な動き",sub:"シナジー役",max:3},
    {name:"渇望",sub:"シナジー役",max:7},
    {name:"属性鍛錬者",sub:"シナジー役",max:4},
    {name:"痛いから問題ない",sub:"シナジー役",max:5},
    {name:"機械工学",sub:"シナジー役",max:1},
    {name:"ラビィの友達",sub:"シナジー役",max:1},
    {name:"戦場の天使",sub:"シナジー役",max:2},
    {name:"クレストオブガイア",sub:"キャラ役"},
    {name:"クレストオブソーレス",sub:"キャラ役"},
    {name:"クレストオブベントス",sub:"キャラ役"},
    {name:"クレストオブロッソ",sub:"キャラ役"},
    {name:"クレストオブデニフ",sub:"キャラ役"},
    {name:"クレストオブハルニエ",sub:"キャラ役"},
    {name:"クレストオブアドリアン",sub:"キャラ役"},
    {name:"門前ツモ",sub:"アガリ形"},
    {name:"一発",sub:"アガリ形"},
    {name:"天和",sub:"アガリ形"},
    {name:"海底",sub:"アガリ形"},
    {name:"ツモ",sub:"その他"},
    {name:"ロン",sub:"その他"},
    {name:"放銃",sub:"その他"},
    {name:"ダブル放銃",sub:"その他"},
    {name:"飛び",sub:"その他"},
    {name:"ポン",sub:"その他"},
    {name:"満貫",sub:"その他"},
    {name:"跳満",sub:"その他"},
    {name:"二倍満",sub:"その他"},
    {name:"三倍満",sub:"その他"},
    {name:"数え役満",sub:"その他"},
  ]
    for(var i=0; i<achieveB.length;i++){
      achieveB[i].id=i;
      achieveB[i].cleared=0;
      achieveB[i].count=0;
    }
    //通算順位割合
  var winrank=[0,0,0,0,0];
  var highscore=[0,0,0,0];//0->通算プレイ回数 1->最大終了得点 2->1回の最大得点 3->連荘回数
  var scoretemp=[0,0,0,0,0,0];//0->0:escで途中抜けした1-4:順位 3->最大火力 1->連荘 245未使用
  var achievetemp=[];//name,達成回数,シナジーの場合はcountを記録
  //countミスってますがclearedに加算してください
  var achievetempB=[
    {name:"門前ツモ",count:0},
    {name:"一発",count:0},
    {name:"天和",count:0},
    {name:"海底",count:0},
    {name:"ツモ",count:0},
    {name:"ロン",count:0},
    {name:"ポン",count:0},
    {name:"放銃",count:0},
    {name:"ダブル放銃",count:0},
    {name:"飛び",count:0},
    {name:"満貫",count:0},
    {name:"跳満",count:0},
    {name:"二倍満",count:0},
    {name:"三倍満",count:0},
    {name:"数え役満",count:0},
  ];
  //achievetemp.push({name:0,cleared:0,count:0})
  
  var key27=0;//esc
  var handE1= new Image();
  var handE2= new Image();
  var handE3= new Image();
  var handE4= new Image();
  var handE5= new Image();
  var handE6= new Image();
  var handE7= new Image();
  var handE8= new Image();
  var handE9= new Image();
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
  //マナブレアイコン
  var MBicon= new Image();
  var epic= new Image();
  var zoom= new Image();
  //ツモロンボタン
  var skilltext1
  var skilltext2
  var skilltext3
  //ナビ切り替え
  var navisw=0;
  //山札と画像と手札
  var deck=[]
  //王牌
  var king=[]
  var dora=[]
  //手札.hand1[0]==-1 ron -2 tumo -3上がり判定、
  var hand1=[]
  var Chand=[];
  //create用に？
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
  //描画用
  var reachhand=[];
  //ツモロン判定用
  //cpuの思考用
  var Cpuhandtemp=[]
  var cpuwant =0;
  //ポン頻度調整用 0->全部ポン　1->ポンしない
  var tumoConfig=0;
  var Ponrate=0.4;
  //MPチャージ速度
  var mpVelocity=1;
  //初手の積み込み用
  var hand1b =new Array
  var trash1=[]
  var trash2=[]
  var trash3=[]
  var trash4=[]
  //捨て牌
  var Extrash=[]
  //除外
  //playerで使われている=>ctl[1]
  //cpuのインターバルをクリアするスイッチ
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
  var nuki =new Array(0,0,0,0,0);
  var nukiswitch =new Array(0,0,0,0,0);
  //0->抜き直後に1にして嶺上　抜き枚数チェック
  //捨て牌の座標
  var riverx=new Array(0,120,120,120,120)
  var rivery=new Array(0,400,100,200,300)
  var counter=new Array(0,0,0,0,0)
  //スペシャルスキル関連
  var skillswitch=new Array(-1,1,1,1,1)
  //1->初期　0->使用可 2->不可
  var skillusage=new Array(0,0,0,0,0)
  //ここまで局ごとに初期化=>deckh
  var skillusage2=new Array(0,-1,-1,-1,-1,0)
  //skillusage2[0][5]=>何局目か数える
  var death=[
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
  ];
  //デスマッチ用
  //kill とどめを刺した数
  //assist　最も多くのダメージを与えた人
  //Admg:0-4プレイヤーに与えたダメージ
  //Bdmg:0-4プレイヤーから受けたダメージ　死んだらリセット
  var startTime=0
  var clearTime=0
  var thinkTime=0
  var timevalue=0
  var timerw=150
  var hand1x=0
  var hand2x=0
  var hand3x=0
  var hand1y=500
  //自分の手札描画用の座標
  var size=70
  var sizey=93
  var pagestate=-1
  var msgstate=0
  var gamestate =10;
  //-1=>tumoronで使用,クリックさせたくない時 0=>クリックで1に,ゲームをしてない時 1=>game中 2=>クリックで0に,ツモのアニメーション 3=>ゲームオーバー、タイトルに戻るなどする 10=>麻雀をしていない
  var Cimage;//ツモ画面で対局画面の保存用
  var CcanvasAry=[];
  var N1;
  var N2;
  var N3;
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
  src:"don/decision9.mp3",
  volume: 0.25,
  });
  var se2 = new Howl({
    src:"don/cancel3.mp3",
        volume: 0.3,
      });
  var se3 = new Howl({
    src:"don/decision32.mp3",
        volume: 0.3,
      });
  var se4 = new Howl({
    src:"don/card-flip.mp3",
        volume: 0.3,
      });
  var se5 = new Howl({
    src:"don/decision47.mp3",
    volume: 0.2,
      });
  var se6 = new Howl({
    src:"don/news_title3.mp3",
    volume: 0.25,
    });
  var se7 = new Howl({
    src:"don/K.O..mp3",
    volume: 0.18,
    });
  var se8 = new Howl({
    src:"don/jidaigeki3.mp3",
    volume: 0.2,
    });
  var se9 = new Howl({
    src:"don/scene2.mp3",
    volume: 0.3,
    });
  var se10 = new Howl({
    src:"don/rinbell.mp3",
    volume: 0.3,
    });
  var se11 = new Howl({
    src:"don/shufflecard2.mp3",
    volume: 0.3,
    });
  var se12 = new Howl({
    src:"don/decision18.mp3",
    volume: 0.2,
    });
  const jingle =new Howl({
      src: "don/Don_jingle.mp3",
      volume: 0.3,
    });
    const jingle2 =new Howl({
      src: "don/Result_li.mp3",
      volume: 0.3,
    });
  const bgm1data ={
      src: "don/nishaint.mp3",
      loopStart: 6460,
      loopEnd: 44870,
      volume: 0.4,
    };
  const bgm2data ={
    src: "don/Duel.mp3",
    loopStart: 10200,
    loopEnd: 111250,
    volume: 0.45,
  };
  const bgm3data ={
    src: "don/Astraea.mp3",
    loopStart: 0,
    loopEnd: 98000,
    volume: 0.12,
  };
  const bgm4data ={
    src: "don/The_Evil_Sacrifice_Archenemies.mp3",
    loopStart: 0,
    loopEnd: 100000,
    volume: 0.08,
  };
  const bgm5data ={
    src: "don/Nine_Jackshort.mp3",
    loopStart: 0,
    loopEnd: 181000,
    volume: 0.1,
  };
  const bgm6data ={
    src: "don/Lobelia.mp3",
    loopStart: 0,
    loopEnd: 169000,
    volume: 0.05,
  };
  const bgm7data ={
    src: "don/Reach.mp3",
    loopStart: 6290,
    loopEnd: 74750,
    volume: 0.5,
  };
  const bgm8data ={
    src: "don/Victoria.mp3",
    loopStart: 8540,
    loopEnd: 129250,
    volume: 0.3,
  };
  const bgm9data ={
    src: "don/Sortie_Rena.mp3",
    loopStart: 10200,
    loopEnd: 171500,
    volume: 0.3,
  };
  const bgm17data ={
    src: "don/STARDUST_LEMON.mp3",
    loopStart: 33450,
    loopEnd: 163580,
    volume: 0.12,
  };
  var Bgm=new Music(bgm3data);
Bgm.on("load", () => {
    loadgraph();
  })
  var Bgm7=new Music(bgm7data);
  Bgm7.on("load", () => {
    loadgraph();
  })
  var Bgm8=new Music(bgm8data);
  Bgm8.on("load", () => {
    loadgraph();
  })
  var Bgm1=new Music(bgm1data);
  Bgm1.on("load", () => {
    loadgraph();
  })
  var Bgm2=new Music(bgm2data);
  Bgm2.on("load", () => {
    loadgraph();
  })
  var Bgm4=new Music(bgm4data);
  Bgm4.on("load", () => {
    loadgraph();
  })
  var Bgm5=new Music(bgm5data);
  Bgm5.on("load", () => {
    loadgraph();
  })
  var Bgm6=new Music(bgm6data);
  Bgm6.on("load", () => {
    loadgraph();
  })
  var Bgm9=new Music(bgm9data);
  Bgm9.on("load", () => {
    loadgraph();
  })
  var Bgm17=new Music(bgm17data);
  Bgm17.on("load", () => {
    loadgraph();
  })
  var musicnum=0
    se1.load();
    se2.load();
    se3.load();
    se4.load();
    se5.load();
    se6.load();
    se7.load();
    se8.load();
    se9.load();
    se10.load();
    se11.load();
    se12.load();
  var donX=40;
  var donY=100;
  var loadmax=80;
  
  DPimg.src=atrbute_src[0];
    DPimg.onload=function(){loadgraph();
         }
  e17.src=win_src[7]
  e17.onload=function(){loadgraph();
    e17.src=win_src[8]
  e17.onload=function(){loadgraph();
    e17.src=win_src[9]
    e17.onload=function(){loadgraph();
    }}}
  e18.src=eltearB_src[0];
  e18.onload=function(){loadgraph();
    e18.src=eltearB_src[1];
    e18.onload=function(){loadgraph();
      e18.src=eltearB_src[2];
      e18.onload=function(){loadgraph();
        e18.src=eltearB_src[3];
        e18.onload=function(){loadgraph();
          e18.src=eltearB_src[4];
          e18.onload=function(){loadgraph();
          }}}}}
  etitle.src="don/Don_title.png";
  etitle.onload=function(){loadgraph();}
  donicon.src=donicon_src[0];
  donicon.onload=function(){loadgraph();}  
  MBicon.src=donicon_src[1];
  MBicon.onload=function(){loadgraph();}
  e10.src=chrimg_src[0]
  e10.onload=function(){loadgraph();
  e10.src=chrimg_src[1]
  e10.onload=function(){loadgraph();
  e10.src=chrimg_src[2]
  e10.onload=function(){loadgraph();
  e10.src=chrimg_src[3]
  e10.onload=function(){loadgraph();
  }}}}
  BGimg.src=bgimg_src[1]
  BGimg.onload=function(){loadgraph();
  }
  epic.src=epic_src[0]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[1]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[2]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[3]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[4]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[5]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[6]
  epic.onload=function(){loadgraph();
  epic.src=epic_src[7]
  epic.onload=function(){loadgraph();
    }
  }}
  }}}}}
  eltear.src=eltear_src[0]
  eltear.onload=function(){
  cx6.drawImage(eltear,donX,donY,60,78)
  donX+=60;
  loadgraph();
  eltear.src=eltear_src[1]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[2]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[3]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[4]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[5]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[6]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[7]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[8]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX=40;
    donY+=78
  loadgraph();
  eltear.src=eltear_src[9]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[10]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  console.log("harmony!");
  eltear.src=eltear_src[11]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[12]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[13]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[14]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[15]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[16]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[17]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX=40;
    donY+=78
  loadgraph();
  console.log("critical!")
  eltear.src=eltear_src[18]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[19]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[20]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[21]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[22]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[23]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[24]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[25]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[26]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX=40;
    donY+=78
  loadgraph();
  eltear.src=eltear_src[27]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[28]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[29]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[30]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[31]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
    loadgraph();
  eltear.src=eltear_src[32]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[33]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  console.log("destroy!")
  eltear.src=eltear_src[34]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[35]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX=40;
    donY+=78
  loadgraph();
  eltear.src=eltear_src[36]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[37]
  eltear.onload=function(){
    cx6.drawImage(eltear,donX,donY,60,78)
    donX+=60;
  loadgraph();
  eltear.src=eltear_src[38]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
      donX+=60;
  loadgraph();
  eltear.src=eltear_src[39]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
      donX+=60;
  loadgraph();
  eltear.src=eltear_src[40]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
      donX+=60;
  loadgraph();
  eltear.src=eltear_src[41]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
      donX+=60;
  loadgraph();
  eltear.src=eltear_src[42]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
      donX+=60;
  loadgraph();
  eltear.src=eltear_src[43]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
      donX+=60;
  loadgraph();
  eltear.src=eltear_src[44]
    eltear.onload=function(){
      cx6.drawImage(eltear,donX,donY,60,78)
  loadgraph();
   console.log("beteran!",loadstate)
  cx6.globalAlpha=0;
  for(var i=0 ; i<45; i++){
    s = new createjs.Bitmap(eltear_src[i]);
    donpaiList.push(s);
    }; 
    }}}}}}}}}}
  }}}}}}}}}}
    }}}}}}}}}}
  }}}}}}}}}}
  }}}}}
  
  if(loadstate <loadmax){
  cx2.fillStyle = "rgb(0,0,0)";
  cx2.fillRect(0, 0, 800, 600);
  cx3.font = "24px 'Century Gothic'";
  cx3.fillStyle = "#e4e4e4";
  　cx3.fillText( "Now Loading…",300,360)
  }
  function loadgraph(){
    cx3.fillStyle = "#e4e4e4";
    var A=loadstate/loadmax*600;
      cx3.fillRect(100, 200, A, 50);
      createjs.Tween.get(Cstar)
      .to({x:A+100},300);
    loadstate+=1;
    cx3.clearRect(260,260,120,60);
    cx3.fillText( loadstate+"/"+loadmax,300,300)
    //console.log(loadstate,loadmax);
    if(loadstate>=loadmax){
      createjs.Tween.get(Cstar)
  .to({x:700},300);
      loadtitle();
    }
  }
  function load2(){
    loadstate+=1;
    //console.log(loadstate,loadmax);
  tweeNstar.paused=true;
  stage.removeChild(Cstar);
  cx3.fillStyle = "rgb(0,0,0)";
  cx3.fillRect(0, 0, 800, 600);
  cx3.fillStyle = "#007fd9";
  cx3.fillRect(100, 200, 600, 50);
  cx3.font = "24px 'Century Gothic'";
  cx3.fillStyle = "#e4e4e4";
  　cx3.fillText( "画面をクリック（音が出ます）",240,360)
  　cx3.fillText( "click to start",340,400)
  }
  function loadtitle(){
  Yakucheck();
  for(var i=0;i<6;i++){
    var A=Math.floor(Math.random()*45);
    s = new createjs.Bitmap(eltear_src[A]);
    s.x=-120;
    s.y=5;
    ary.push(s);
  };
  for(var j=0;j<6;j++){
    var A=Math.floor(Math.random()*45);
    s = new createjs.Bitmap(eltear_src[A]);
    s.x=920;
    s.y=425;
    ary.push(s);
  }
  field.addChild(ary[0]);
  field.addChild(ary[1]);
  field.addChild(ary[2]);
  field.addChild(ary[3]);
  field.addChild(ary[4]);
  field.addChild(ary[5]);
  field.addChild(ary[6]);
  field.addChild(ary[7]);
  field.addChild(ary[8]);
  field.addChild(ary[9]);
  field.addChild(ary[10]);
  field.addChild(ary[11]);
  createjs.Tween.get(ary[0])
  .to({x:35},60)
  createjs.Tween.get(ary[1])
  .to({x:156},70)
  createjs.Tween.get(ary[2])
  .to({x:277},80)
  createjs.Tween.get(ary[3])
  .to({x:398},90)
  createjs.Tween.get(ary[4])
  .to({x:519},100)
  createjs.Tween.get(ary[5])
  .to({x:640},110)
  createjs.Tween.get(ary[6])
  .to({x:640},60)
  createjs.Tween.get(ary[7])
  .to({x:519},70)
  createjs.Tween.get(ary[8])
  .to({x:398},80)
  createjs.Tween.get(ary[9])
  .to({x:277},90)
  createjs.Tween.get(ary[10])
  .to({x:156},100)
  createjs.Tween.get(ary[11])
  .to({x:35},110)
  .call(load2); 
  };
  
    canvas5.onmousemove = mouseMoveListener;
    function mouseMoveListener(e) {
      var rect = e.target.getBoundingClientRect();
      mouseX = Math.floor(e.clientX - rect.left);
      mouseY = Math.floor(e.clientY - rect.top);
      cx3.clearRect(710, 10, 80, 38);
      cx3.fillStyle = "#ffffff";
  cx3.font = "12px Arial";
  cx3.font = "12px Arial";
  cx3.fillText("SOUND", 710, 22);
  cx3.font = "Bold 24px Arial";
  cx3.fillText( mute, 730, 42);
        //カーソル
     corsor();
    }
    canvas5.addEventListener("mousedown", mouseDownHandler, false);
    canvas5.addEventListener("mouseup", mouseUpHandler, false);
    canvas5.addEventListener(`contextmenu`, contextHandler, false);
    canvas5.addEventListener("click", clickHandler, false);
  function contextHandler(e){
    //右クリック無効、右クリックでツモ切り
      e.preventDefault();
      if(tumoConfig==0){
        if(gamestate==1){
      if(opLock==0 && cLock==1 && turn ==0){
            PlayertoCpu(hand1.length-1);
          }}
      }
    };
    
  //mousedown->mouseup->clickの順番に処理される
    function mouseDownHandler(e) {
      if(debugmode){
      console.log("X座標：" + mouseX,"Y座標：" + mouseY);
      }
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
          if(gamestate==1){
            //mpチャージ
            if(cLock==1 && opLock>=0 && opLock !==2){
              mpC=-2;
              mpmoving=true;
            window.requestAnimationFrame((ts)=>mpMove(ts,mpC))
            }
          }
    };
    function mpMove(ts,start){
      //console.log(mpC);
      if(mpmoving){
        mpC+=0.4;
        //mpゲージ書く
        var x=50;
        var y=478;
        if(mpC>DP[1]){
          mpC=DP[1]
        };
        if(mpC>=0){
        cx2.fillStyle="#3d3d3d";
        cx2.clearRect(x,y,90,15);
        cx2.fillRect(x,y,90,15);
        cx2.fillStyle="#0080ff"
        cx2.fillRect(x,y,90*DP[1]/30,15);
        cx2.fillStyle="#68ceed";
        cx2.fillRect(x,y,90*DP[1]/30,5);
        cx2.fillStyle="#00ff66";
        cx2.fillRect(x,y,90*mpC/30,15);
        cx2.fillStyle="#99ed68";
        cx2.fillRect(x,y,90*mpC/30,5);
        cx2.strokeStyle="#e3e3e3"
        cx2.strokeRect(x,y,30,15);
        cx2.strokeRect(x+30,y,30,15);
        cx2.strokeRect(x+60,y,30,15);;
        };
        window.requestAnimationFrame((ts)=>mpMove(ts,mpC))
      }else{
        mpC=0;
        drawDP(1);
      }};
    function mouseUpHandler(e) {
      if(debugmode){
        console.log("mouseup");
        }
      mpmoving=false;
    };
    function clickHandler(e) {
       var rect = e.target.getBoundingClientRect();
       mouseX =  Math.floor(e.clientX - rect.left);
      mouseY =  Math.floor(e.clientY - rect.top);
      if(debugmode){console.log('click!',cLock,"msgstate",msgstate)}
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
              jingle2.volume(0);
              if(debugmode){
              console.log(cx5.globalAlpha,cLock);
                if(cLock==0){
                  cLock=1;
                }
              }
              cx5.clearRect(710, 10, 80, 38);
              cx5.globalAlpha = 1;
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
      jingle2.volume(0.3*sBar);
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
        case 7:
          Bgm =new Music(bgm7data);
          Bgm.playMusic();
          break;
        case 8:
          Bgm =new Music(bgm8data);
          Bgm.playMusic();
          break;
        case 9:
          Bgm =new Music(bgm9data);
          Bgm.playMusic();
          break;
        default:
          //Bgm =new Music(bgm17data);はbgm多重に流れる可能性あるため削除
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
    cx3.clearRect(710, 10, 80, 38);
    cx3.font = "12px Arial";
    cx3.fillText("SOUND", 710, 22);
    cx3.font = "Bold 24px Arial";
    cx3.fillText( mute, 730, 42);
          }};
  
  if(gamestate==10 && loadstate >=loadmax){
    //メニュー画面
    if(pagestate==-1){
      for(var i=0; i<12 ; i++){
        field.removeChild(ary[i]);
      }
      ary=[];
    pagestate=0;
    se6.play();
    saveUP()
    }
    Menu();
  }

  socket.on("game-ready", (data)=>{
    if(IsHost(IAM.room)){
    var N=MEMBER.findIndex(value=>value.id==data.who);
    MEMBER[N].turnflag=2;
    var M=MEMBER.filter(value=>value.turnflag==2)
    var MM=4-M.length
    cx4.clearRect(0,0,800,600)
    cx4.font = "bold 16px 'メイリオ'";
    cx4.fillStyle = "black";
    cx4.strokeStyle ="rgba(250,250,250,0.9)";
    cx4.lineWidth=5;
      cx4.strokeText("OK ("+MM+")",730,520);
      cx4.fillText("OK ("+MM+")",730,520);
    }
  });
  if(gamestate ==0){//ほんぺ
    //ニューゲーム
    cx5.globalAlpha = 1;
    //と言いたいけどダブロンがあればその処理
    if(Ronturn.length>0){
      gamestate=1;
      TumoRon(Ronturn[0],turn+1,2);
      Ronturn.shift();
      return false;
    }
    if(pvpmode==1 && IsHost(IAM.room)){
      //他のプレイヤーが準備できたら次に進む
      MEMBER[0].turnflag=2;
      var M=MEMBER.filter(value=>value.turnflag==2)
      var MM=4-M.length
      cx4.clearRect(0,0,800,600)
      cx4.font = "bold 16px 'メイリオ'";
      cx4.fillStyle = "black";
      cx4.strokeStyle ="rgba(250,250,250,0.9)";
      cx4.lineWidth=5;
      cx4.strokeText("OK ("+MM+")",730,520);
      cx4.fillText("OK ("+MM+")",730,520);
      for(var i=0;i<MEMBER.length;i++){
        if(MEMBER[i].turnflag!==2){
          console.log(MEMBER);
          return false;
        }
      }
    }
    if(pvpmode==1 && !IsHost(IAM.room)){
      //ホスト以外は待機
      gamestate =1;
        socket.emit("game_ready", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id});
      cx4.globalAlpha=1;
        cx4.fillStyle = "rgba(20,20,20,0.7)";
        cx4.fillRect(0,0,800,600)
        cx4.font = "bold 26px 'メイリオ'";
        cx4.fillStyle = "black";
        cx4.strokeStyle ="rgba(250,250,250,0.9)";
        cx4.lineWidth=5;
        cx4.strokeText("ホストを待っています…",240,200);
        cx4.fillText("ホストを待っています…",240,200);
        return false;
    };
    //一般ルール
    if(pvpmode==1){
    switch(LP_PVP.Length[0]){
      case 1:
        if(skillusage2[0]>=4){
          gameover();
          return false;
        }
        break;
      case 2:
        if(skillusage2[0]>=8){
          gameover();
          return false;
        }
        break;
    } 
    if(LP_PVP.Rule[0]==1){
    if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
      gamestate =1
      deckHandler();
      return false;
      }else{
        gameover();
        return false;
      }}else if(LP_PVP.Rule[0]==2){
        gamestate =1
        deckHandler();
        return false;
      };
      return false;
    }
    switch(LP[0]){
      case 0:
          if(skillusage2[0]>=8){
          gameover();
          return false;
        }
        if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
          gamestate =1
          deckHandler();
          return false;
          }else{
            gameover();
            return false;
          }
        break;
        case 1:
          if(skillusage2[0]>=8){
            gameover();
            return false;
          }
          if(LP[1] >0){
            gamestate =1
            deckHandler();
            return false;
            }else{
              gameover();
              return false;}
          break;
          case 2:
    //ミリオネア
      if(LP[1] >=1000000 || LP[2] >=1000000 || LP[3] >=1000000 || LP[4]>=1000000){
      gameover();
      return false;
    }else{
      gamestate =1
      deckHandler();
      return false;
    }
            break;
            case 4:
               //魔界ルール
               console.log(raidscore);
    //raidscore[0]==0 && raidscore[2] ==0 ->引き継ぎはgamestate2へ
    if(raidscore[0]==1){
      if(skillusage2[0]>=8){
        gameover();
        return false;
      }
    if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
      gamestate =1;
      raidscore[0]=0;
      deckHandler();
        }else{
      gameover();
    }
  }else{
    //結果発表へ
    if(cLock==1 || raidscore[2]==1){
    ResultPhase();
    }
  }
          break;
        default:
  //∞モード
  if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
    gamestate =1
    deckHandler();
    }else{gameover();}
          break;
    }
    }else if(gamestate ==2){//次のゲームへ
    if(pvpmode==1 && IsHost(IAM.room)){
      MEMBER[0].turnflag=1;
  for(var i=1;i<MEMBER.length;i++){
    if(MEMBER[i].pc==1 && MEMBER[i].turnflag !==2){
      MEMBER[i].turnflag=0;
    }else{
      MEMBER[i].turnflag=2;
    }
    }}
    if(LP[0]==4){
      if(raidscore[0]==0 && raidscore[2] ==0){
        cx2.clearRect(0,0,800,600);
        //引き継ぎ
        cx3.clearRect(326,348,148,142);
        cx2.putImageData(Cimage,0,0);
        gamestate=1;
        ctl=new Array(0,0,0,0,0)
        ctlerror=new Array(0,0,0,0,0)
        ponsw[0]=1;
          cx2.font = "16px 'Century Gothic'";
          cx2.strokeStyle ="white";
          cx2.fillStyle ="black";
          var Mary=[0,0,0,0,0];
          var Vmax=60;
        window.requestAnimationFrame((ts)=>scoreMove(ts))
        function scoreMove(ts,n=0){
          if(alpha>0){
            //loopanime終わるまで待機
            window.requestAnimationFrame((ts)=>scoreMove(ts,n))
            return false;
          }
          var Y=170;
          cx4.globalAlpha=1;
          cx4.font = "16px 'Century Gothic'";
          cx4.strokeStyle = 'white';
            for(var i=1;i<LPtemp.length;i++){
              if(LPtemp[i]>0){
                cx4.fillStyle ="red";
                switch(i){
                  case 1:
                    Y=470;
                    break;
                  case 2:
                    Y=170;
                    break;
                  case 3:
                    Y=270;
                    break;
                  case 4:
                    Y=370;
                    break;
                }
                cx4.strokeText("+"+LPtemp[i],165,Y)
                cx4.fillText("+"+LPtemp[i],165,Y)
              }else if(LPtemp[i]<0){
                cx4.fillStyle ="blue";
                switch(i){
                  case 1:
                    Y=470;
                    break;
                  case 2:
                    Y=170;
                    break;
                  case 3:
                    Y=270;
                    break;
                  case 4:
                    Y=370;
                    break;
                }
                cx4.strokeText(LPtemp[i],160,Y)
                cx4.fillText(LPtemp[i],160,Y)
              }
            }
          n+=1;
          var M=n/Vmax;
          if(M>1){M==1};
          for(var i=1;i<LPtemp.length;i++){
            if(LPtemp[i]!==0){
              switch(i){
                case 1:
                  Y=470;
                  break;
                case 2:
                  Y=170;
                  break;
                case 3:
                  Y=270;
                  break;
                case 4:
                  Y=370;
                  break;
              }
              Mary[i]=Math.floor(LP[i]-LPtemp[i]+(LPtemp[i]*M));
              cx2.clearRect(75,Y-20,75,23);
              cx2.strokeText(Mary[i],80,Y)
              cx2.fillText(Mary[i],80,Y)
            }
          } 
          if(n>Vmax){
            cx4.clearRect(0,0,800,600);
            cx4.globalAlpha=0;
            for(var i=1;i<LPtemp.length;i++){
              if(LPtemp[i]!==0){
                switch(i){
                  case 1:
                    Y=470;
                    break;
                  case 2:
                    Y=170;
                    break;
                  case 3:
                    Y=270;
                    break;
                  case 4:
                    Y=370;
                    break;
                }
                cx2.clearRect(75,Y-20,75,23);
                cx2.strokeText(LP[i],80,Y)
                cx2.fillText(LP[i],80,Y)
              }
            } 
            turnchecker();
          }else{
            window.requestAnimationFrame((ts)=>scoreMove(ts,n))
          }
        }
        return false;
        //turnchecker();
      }else{
        if(raidscore[2]==1){
          se10.play();
          cx1.fillStyle = "rgba(20,20,20,0.5)";
          cx1.fillRect(10,100,780,400)
          cx2.fillStyle = "white";
          cx2.font = "36px 'Century Gothic'";
          cx2.fillText("TIME UP",320,300)
          }
      }
    }
    gamestate=0;
    }else if(gamestate ==3){//タイトルへ
      if(pvpmode==1 && gamestate !==10){
        console.log('ロビーに戻る',IAM.room);
        //cx4.clearRect(0,0,800,600);
          Bgm =new Music(bgm17data);
          Bgm.playMusic();
            musicnum=17;
            gamestate=10;
            pagestate=6;
            msgstate=2;
            se2.play();
            if(!IsHost(IAM.room)){
              if(IAM.is_ready==1){IAM.is_ready=0};
            }
            socket.emit("game_over", {Token:IAM.token,room:RoomName[IAM.room],type:1});
            return false;
      }
      if(pvpmode==0){
    pagestate =0;
    gamestate=10;
      }
    console.log(pagestate)
    }else if(gamestate ==1){
      if(opLock==3){
        if(mouseX >300 && mouseY > 55 && mouseX <400 && mouseY <100){
          if(shiagytemp==0){
            shiagytemp=1;
            drawbuttom2(300,55,"所持パイ",0,100,44,1);
            yakumap.alpha=0;
            Yakucheck2(0);
            yakumap2.alpha=1;
          }else{
            shiagytemp=0;
            yakumap2.alpha=0;
            drawbuttom2(300,55,"一覧",0,100,44,1);     
            yakumap.alpha=1;    
          }
          return false;
        }
        if(mouseX >40 && mouseY > 100 && mouseX <620 && mouseY <200){
          if(shiagytemp==0){Yakucheck(180);}else{Yakucheck2(180);}
        return false;
        }
        if(mouseX >40 && mouseY > 200 && mouseX <620 && mouseY <300){
          if(shiagytemp==0){Yakucheck(90);}else{Yakucheck2(90);}
          return false;
          }
        if(mouseX >40 && mouseY > 300 && mouseX <620 && mouseY <400){
          if(shiagytemp==0){Yakucheck(-90);}else{Yakucheck2(-90);}
        return false;
        }
        if(mouseX >40 && mouseY > 400 && mouseX <620 && mouseY <480){
          if(shiagytemp==0){Yakucheck(-180);}else{Yakucheck2(-180);}
          return false;
          }
        yakumap2.removeAllChildren();
        yakumap.alpha=0;
        cx2.clearRect(300,55,100,45);
        drawbuttom2(300,10,"シナジー",0,100,44,1);
        opLock=0;
        se2.play();
        corsor();
        return false;
      }
      if(opLock==2){
        if(mouseX >460 && mouseY > 240 && mouseX <580 && mouseY <300){
          cx4.clearRect(0,0,800,600)
          opLock=0;
          se3.play();
          corsor();
        }
        //escによる終了
        if(mouseX >220 && mouseY > 240 && mouseX <340 && mouseY <300){
        se3.play();
        scoretemp[0]=-2;
        cx4.clearRect(0,0,800,600)
        opLock=0;
        if(pvpmode==1){
        cx4.globalAlpha=1;
        cx4.font = "bold 26px 'メイリオ'";
        cx4.fillStyle = "white";
        var RsString=['ルーム長がトイレに行きました','ルーム長権限が発動しました','ルーム長がゲームを終了させました'];
        var A=Math.floor(Math.random()*RsString.length);
        cx4.fillText(RsString[A],50,590);
        }
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
      if(mouseX >290 && mouseY > 10 && mouseX <400 && mouseY <55){
        //役一覧を出す
        if(cLock==1 || (pvpmode==1 && opLock>=0)){
          opLock=3;
          se4.play();
          drawbuttom2(300,10,"シナジー",1,100,44,1);
          if(shiagytemp==0){
            drawbuttom2(300,55,"一覧",0,100,44,1);     
            yakumap.alpha=1;       
          }else{
            drawbuttom2(300,55,"所持パイ",0,100,44,1);
            Yakucheck2(0);
            yakumap2.alpha=1;
          }
          cx4.clearRect(10,100,610,400)
          return false;
          }
      }
      if(mouseX >400 && mouseY > 10 && mouseX <530 && mouseY <55){
        //残パイチェック欄を押す　ゲームを進めない
        if(cLock==1 || (pvpmode==1 && opLock>=0)){
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
      if(mouseX >0 && mouseX< 100){
      if(pvpmode==0){
        if(cLock==1){
          se4.play();
          if(navisw==1){navisw=0}else{navisw=1};
        //クリックで切り替えできるように
        if(mouseY >100 && mouseY<200){Skillname(2,navisw);}
        if(mouseY >200 && mouseY<300){Skillname(3,navisw);}
        if(mouseY >300 && mouseY<400){Skillname(4,navisw);}
        if(mouseY >400 && mouseY<480){Skillname(1,navisw);}
        }
    }}
    if(cLock==3){
      //**スキルで自分のパイ選択画面
      //オールマイティは対象にできないようにする
    cx3.clearRect(0,0,800,600)
    if(mouseY >490 && mouseY < 590 && mouseX >100 && mouseX <760){
        var SX=Math.floor((mouseX+size-100)/size);
          if(mouseX >100 && mouseX <660){
            if(hand1.length>SX+1){
              if(hand1[SX] ==43 || hand1[SX] ==44){
                cLock=1;
                return false;
              }
              PlayertoCpu(SX);
            }
            if(ponsw[1]==1 && hand1.length==SX+1){
              if(hand1[SX] ==43 || hand1[SX] ==44){
                cLock=1;
                return false;
              }
              PlayertoCpu(SX);
            }
          }else if(mouseX >690 && mouseX <690+size){
            if(turn==0){
              if(hand1[hand1.length-1] ==43 || hand1[hand1.length-1] ==44){
                cLock=1;
                return false;
              }
              PlayertoCpu(hand1.length-1);
            }
          }
    }else{cLock=1}
  }else if(cLock==2){//スキル対象選択画面
    if(mouseX >0 && mouseX <150 && mouseY >100){
    if(mouseY >100 && mouseY <200){SpecialSkill(1,2)
    }else if(mouseY >200 && mouseY <300){SpecialSkill(1,3);
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
          if(pvpmode==0){SpecialSkill(1,0)};
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
    if(hand1[0] <-1){
      if(debugmode){console.log('5アガリ',han[1])}}
    }}
    if(mouseY >490 && mouseY < 590){
      if(mouseX >690 && mouseX <760){
        PlayertoCpu(hand1.length-1);
      }}
    }
    //抜き
    if(mouseY >440 && mouseY <480){
      if(mouseX >710 && mouseX <790){
        if(debugmode){console.log(nukiswitch)};
        if(nukiswitch[1]==1){
          if(pvpmode==1){
          socket.emit("nuki", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id});
          }
          cLock=0;
          console.log('操作禁止',cLock);
          NukiSkill(1);
        };
    }}
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
      };
    }}
    //アガリ
    if(hand1[0]==-3){
      if(mouseY >348 && mouseY< 490){
        if(mouseX >326 && mouseX<474){    
    if(debugmode){console.log('アガリ',han[1])}
    cx3.clearRect(326,348,148,142);
    if(pvpmode==1){
      socket.emit("tumo", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,Tumo:tumo,status:true});
      }
    TumoRon(1,0)
    }}}
    
    }//turn
    //ロンアガリ、turn0ではない
    if(hand1[0]==-2){
    if(mouseY >348 && mouseY< 490 && mouseX >326 && mouseX<474){
      if(debugmode){console.log('アガリ',han[1])}
    cx3.clearRect(326,348,148,142);
    Ronturn.push(1);
    if(pvpmode==1){
    socket.emit("ron", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:true});
    }
    }else{
      if(debugmode){console.log('ロンをスルー')}
    se3.play();
    cx3.clearRect(326,348,148,142);
    if(pvpmode==1){
    socket.emit("ron", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:false});
    }
    }
    rorder[1]=1
    hand1[0]=-1
    turn=turntemp;
    turnchecker();
    }
    //ポン
    if(ponsw[1]==1 && turn !==0){
    if(mouseY >400 && mouseY <440 && mouseX >630 && mouseX <710){
      if(debugmode){console.log(ponsw[1]);}
          Pon(1,tumotemp);
          if(pvpmode==1){
            socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:true});
            }
      }else{
        //キャンセル
        if(debugmode){console.log('ポンをスルー')}
        cLock=0;
        se3.play();
        cx2.clearRect(630,400,80,40)
        cx2.fillStyle = "rgba(20,20,20,0.5)";
        cx2.fillRect(630,400,80,40)
        ponsw[1]=pon1.length;
        ponsw[0]=1;
        turn=turntemp;
        turnchecker();
        if(pvpmode==1){
          socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:false});
          }
      }};
    }
    }//gamestate
      }
  function Menu(){
    switch(pagestate){
      case 0:
        musicnum=0;
        Bgm.stop();
        e4.src=eltearB_src[0]
        e4.onload=function(){
        pagestate=1;
            //実績解放
    var A=achieveB.findIndex(value=>value.name=="国士無双")
    if(achieveB[A].cleared>0){
      AK("変化無双");
    };
    var A=achieveB.findIndex(value=>value.name=="天和")
    if(achieveB[A].cleared>0){
      AK("幸運の証票");
    };
    var A=achieveB.findIndex(value=>value.name=="二倍満")
    if(achieveB[A].cleared>0){
      AK("ダブルスラッシュ");
    };
    var A=achieveB.findIndex(value=>value.name=="三倍満")
    if(achieveB[A].cleared>0){
      AK("トリプルガイザー");
    };
    var A=achieveB.findIndex(value=>value.name=="数え役満")
    if(achieveB[A].cleared>0){
      AK("これで終わりだ！");
    };
    var A=achieveB.findIndex(value=>value.name=="海底")
    if(achieveB[A].cleared>0){
      AK("海千山千");
    };
    var A=achieveB.findIndex(value=>value.name=="ダブル放銃")
    if(achieveB[A].cleared>=2){
      AK("デュアルバスター");
    };
    var A=achieveB.findIndex(value=>value.name=="門前ツモ")
    if(achieveB[A].cleared>=10){
      AK("歴戦の勇士");
    };
    var A=achieveB.findIndex(value=>value.name=="ツモ")
    if(achieveB[A].cleared>0){
      AK("はじめてのツモ");
    };
    var A=achieveB.findIndex(value=>value.name=="ロン")
    if(achieveB[A].cleared>0){
      AK("はじめてのロン");
    };
    var A=achieveB.findIndex(value=>value.name=="飛び")
    if(achieveB[A].cleared>=7){
      AK("私ぶっ飛んでるの！");
    };
    var A=achieveB.findIndex(value=>value.name=="ポン")
    if(achieveB[A].cleared>=30){
      AK("回れ！回れ！回れ！");
    };
    if(achieveB[A].cleared>=100){
      AK("YOUならやれるポン");
    };
    var A=achieveB.findIndex(value=>value.name=="3ペア")
    if(achieveB[A].cleared>=30){
      AK("あなたと一緒なら");
    };
    var A=achieveB.findIndex(value=>value.name=="1ライン通貫")
    var B=achieveB.findIndex(value=>value.name=="2ライン通貫")
    var C=achieveB.findIndex(value=>value.name=="3ライン通貫")
    if(achieveB[A].cleared+achieveB[B].cleared+achieveB[C].cleared>=10){
      AK("突き抜ける快感");
    };
    if(highscore[0]>0){
      AK("始めまして～");
    }
    if(highscore[0]>=10){
      AK("エルドンの通");
    }
    if(highscore[0]>=50){
      AK("エルドンの民");
    }
    if(highscore[0]>=100){
      AK("エルドンの妖精");
    }
    if(highscore[0]>=179){
      AK("ロナン・エルドン");
    }
    if(highscore[0]>=300){
      AK("エルドンの覇者");
    }
    if(highscore[1]>=300000){
      AK("マスターへの道");
    }
    if(highscore[1]>=600000){
      AK("マスターへの道（ヘル）");
    }
    if(highscore[1]>=1000000){
      AK("ミリオネア")    
    };
    if(highscore[2]>=150000){
      AK("渾身の一撃");
    }
    if(highscore[2]>=300000){
      AK("魂の一撃");
    }
    if(highscore[3]>=2){
      AK("まだだ");
    }
    if(highscore[3]>=3){
      AK("もう一度かかってこい");
    }
    var A=achieveA.filter(value=>value.cleared>0);
    if(A.length>=10){
      AK("柔軟な実績コレクター");
    }
    if(A.length>=30){
      AK("強靭な実績コレクター");
    }
    if(winrank[0]>=3){
      AK("甘美な勝利")
    }
    if(winrank[3]>=5){
      AK("ドカーン！")
    }
    cx.clearRect(0,0,800,600)
    cx1.clearRect(0,0,800,600)
    cx2.clearRect(0,0,800,600)
    cx3.clearRect(0,0,800,600)
    BGimg.src=bgimg_src[1]
    BGimg.onload=function(){
    e10.src=chrimg_src[chara[1]]
    e10.onload=function(){
      cx1.fillStyle = "rgba(0,0,0,0.8)";
      cx1.fillRect(120,95,220,60)
      if(chara[1]==1){
      cx1.drawImage(e10,500,120,215,215,120,95,60,60)
      }else{
      cx1.drawImage(e10,500,50,215,215,120,95,60,60)
      }
      cx1.font = "24px 'Century Gothic'";
      cx1.fillStyle = "white";
      cx1.fillText(Username,192,145);
      cx1.font = "14px 'Century Gothic'";
      cx1.fillText(Usercrest,182,115);
    }
    cx.drawImage(BGimg,0,0,400,300,0,0,800,600);
    cx.clearRect(0,520,800,70)
    cx.fillStyle = "rgba(20,20,20,0.7)";
    cx.fillRect(410,210,350,240)
    cx.fillStyle = "rgba(255,255,255,0.7)";
    cx1.drawImage(e4,80,80,300,400)
    cx1.drawImage(etitle,90,0,660,220)
    cx1.font = "32px 'Century Gothic'";
      cx1.fillStyle = "black";
    cx1.font = "28px 'Century Gothic'";
    cx1.fillStyle = "black";
    cx1.textAlign = "center";
    cx1.fillText( "プレイガイド",230,200)
    cx1.fillText( "フリーバトル",230,250)
    cx1.fillText( "たいせん",230,300);
    cx1.fillText( "オプション",230,350);
    cx1.fillText( "セーブ",230,400);
    cx1.fillStyle = "#ffffff";
    cx1.fillText( "戦 ★ 績",580,240);
    cx1.textAlign = "start";
    cx1.font = "22px 'Century Gothic'";
    var wT=winrank[0]+winrank[1]+winrank[2]+winrank[3]
    var winrate=0;
    if(wT>0){
      winrate=Math.floor(winrank[0]/wT*1000)/10  
    }
    cx1.fillText( "総プレイ回数："+highscore[0]+"回",420,270);
    cx1.fillText( "通算勝率："+winrate+"%",420,300);
    cx1.fillText( "最大戦闘力："+highscore[1],420,350);
    cx1.fillText( "瞬間最大火力："+highscore[2],420,380);
    var Ach=achieveA.filter(value=>value.cleared>0);
    cx1.fillText( "実績："+Ach.length+"/"+achieveA.length,420,410);
    cx1.font = "18px 'Century Gothic'";
    cx1.fillStyle = "#e8e8e8";
    cx1.fillText( "(1位："+winrank[0]+" /2位："+winrank[1]+" /3位："+winrank[2]+" /4位："+winrank[3]+")",420,320);
    zoom.src="don/zoom650.png";
    zoom.onload=function(){
      drawbuttom2(678,390," ",0,75,50)
      cx2.drawImage(zoom,705,395,40,40);
      corsor();
    }
    }}
    break;
      case 1:
        if(mouseX >80 && mouseX <380){
          if(mouseY >160 && mouseY <210){//プレイガイド
            cx2.clearRect(675,390,80,50)
            pagestate=4;
            msgstate=-1;
            se5.play();
            Menu();
          }
          if(mouseY >210 && mouseY <260){//自由
            cx2.clearRect(675,390,80,50)
            pagestate=3
            se5.play();
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
            cx2.fillText("ＣＰＵ",390,200)
            cx2.fillText("◀ "+chrlist[chara[1]],520,150);
            cx2.fillText(" ▶",670,100)
            cx2.fillText(" ▶",670,150)
            cx2.fillText("ＣＰＵスキル",390,370)
          if(skillswitch[0]==0){
            cx2.fillText("　禁止しない",540,370);
            }else if(skillswitch[0]==-1){
            cx2.fillText("✓禁止",540,370)
            cx2.fillStyle = "black";
          }
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
            //cx2.clearRect(675,390,80,50)
            se5.play();
            epic.src=epic_src[0]
            epic.onload=function(){
              cx1.fillStyle = "rgba(20,20,20,0.7)";
              cx2.clearRect(0,0,800,510)
              cx1.fillRect(0,0,800,510)
              cx1.drawImage(epic,50,50,350,460)
              cx1.drawImage(epic,400,50,350,460)
            //cx1.drawImage(e4,370,10,390,500)
            drawbuttom(690,200,"Play",0,60,40)
            drawbuttom(690,270,"Play",0,60,40)
            drawbuttom(690,340,"Play",0,60,40)
            if(mpVelocity==1){
              drawbuttom(80,310,"おそめ",1,80,40)
            }else{
              drawbuttom(80,310,"おそめ",0,80,40)
            }
            if(mpVelocity==1.5){
            drawbuttom(170,310,"ふつう",1,80,40)
            }else{
            drawbuttom(170,310,"ふつう",0,80,40)
            }
            if(mpVelocity==2){
            drawbuttom(260,310,"はやめ",1,80,40)
            }else{
            drawbuttom(260,310,"はやめ",0,80,40)
            }
            drawbuttom2(600,450,"OK",0,100,40,1)
            drawbuttom2(400,450,"デフォルトに戻す",0,180,40,1)
            cx2.fillStyle = "black";
            cx2.fillRect(360,70,2,400);
            //cx2.font = "36px 'Century Gothic'";
            //cx2.fillText("オプション",110,120)
            cx2.font = "26px 'Century Gothic'";
            cx2.fillText("ユーザー補助",60,100)
            cx2.fillText("対局設定",60,200)
            cx2.fillText("音量設定",390,100)
            cx2.fillText("対局BGM設定",390,198)
            cx2.font = "18px 'Century Gothic'";
            cx2.fillText("（注意：対局設定について）",60,420)
            cx2.fillText("「たいせん」モードでは",60,440)
            cx2.fillText("ルーム長の対局設定データが",65,460)
            cx2.fillText("全体に反映されます。",65,480)
            cx2.font = "24px 'Century Gothic'";
            if(tumoConfig==0){
              cx2.fillText("右クリック　ツモ切り",90,130);
            }else if(tumoConfig==-1){
            cx2.fillText("右クリック　何もしない",90,130);
            }
            cx2.fillText("CPUのポン頻度",100,230);
            cx2.fillText("◀",120,260)
            cx2.fillText("▶",260,260)
            var A=(1-Ponrate)*5;
            for (var i=0;i<A;i++){
              cx2.fillText("■",140+i*24,260);
            };
            cx2.fillText("MPチャージ速度",100,300);
            if(Fever==-1){
              cx2.fillText("FEVER なし",100,380);
            }else{
            cx2.fillText("FEVER あり",100,380);
            }
            cx2.fillText("BGM(0-7)",430,130)
            cx2.fillText("SE(0-7)",430,160)
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
            }}
          if(mouseY >360 && mouseY <410){//セーブ
            se5.play();
            var result = window.confirm('セーブファイルをダウンロードします！');
                if( result) {
            console.log('save');
            saveDL();
                }else{
            console.log('save cancelled');
                }
            }
          if(mouseY >260 && mouseY <310){//pvpたいせん
            cx2.clearRect(675,390,80,50)
            cx3.clearRect(675,385,80,60)
            pagestate=6;
            msgstate=-1;
            se5.play();
            socket.emit('lobby_update');
            socket.emit("join", {name:Username});
            Menu();
          }
        }
        if(mouseX >678 && mouseX <750){
          if(mouseY >390 && mouseY <440){//実績リスト
            e10.src=chrimg_src[chara[1]]
            e10.onload=function(){
            cx2.clearRect(675,390,80,50)
            cx3.clearRect(675,385,80,60)
            pagestate=5;
            msgstate=-1;
            se5.play();
            Menu();
            }
          }}
          if(mouseX >120 && mouseX <340){
            if(mouseY >95 && mouseY < 155){
              //実績リストボタンその2
              e10.src=chrimg_src[chara[1]]
              e10.onload=function(){
              cx2.clearRect(675,390,80,50)
              cx3.clearRect(675,385,80,60)
              pagestate=5;
              msgstate=-1;
              se5.play();
              Menu();
              }
            }}
        break;
        case 3:
          //フリバへ
          if(mouseX >80 && mouseX <380 && mouseY >80 && mouseY <480){
            se2.play();
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
          if(mouseX >520 && mouseX <650 && mouseY >345 && mouseY <375){
            se3.play();
            if(skillswitch[0]==0){skillswitch[0]=-1}else{skillswitch[0]=0};
            cx2.clearRect(540,340,150,35)
            cx2.font = "24px 'Century Gothic'";
            cx2.fillStyle = "black";
            if(skillswitch[0]==0){
              cx2.fillText("　禁止しない",540,370);
              }else if(skillswitch[0]==-1){
              cx2.fillText("✓禁止",540,370)
              cx2.fillStyle = "black";
              }
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
          drawbuttom2(600,450,"OK",0,100,40,1)
          drawbuttom2(400,450,"デフォルトに戻す",0,180,40,1)
          if(mouseX >600 && mouseX <700 && mouseY >450 && mouseY <490){
            //se3.play();
            if(musicnum!==0){
            musicnum=0;
            Bgm.fade(0.05*vBar, 0, 500);
            Bgm.on("fade", ()=>{
            Bgm.stop();
            });
            }
            pagestate=0;
            se2.play();
            Menu();
          }
          if(mouseX >400 && mouseX <580 && mouseY >450 && mouseY <490){
            //デフォルトに戻す
            tumoConfig=0;
            Ponrate=0.4;
            mpVelocity=1;
              se3.play();
              musicset=[3,7,8];
              if(Ponrate<0){Ponrate=0};
              //描画
              cx2.clearRect(0,0,800,510)
            drawbuttom(690,200,"Play",0,60,40)
            drawbuttom(690,270,"Play",0,60,40)
            drawbuttom(690,340,"Play",0,60,40)
            drawbuttom(80,310,"おそめ",1,80,40)
            drawbuttom(170,310,"ふつう",0,80,40)
            drawbuttom(260,310,"はやめ",0,80,40)
            drawbuttom2(600,450,"OK",0,100,40,1)
            drawbuttom2(400,450,"デフォルトに戻す",0,180,40,1)
            cx2.fillStyle = "black";
            cx2.fillRect(360,70,2,400);
            cx2.font = "26px 'Century Gothic'";
            cx2.fillText("ユーザー補助",60,100)
            cx2.fillText("対局設定",60,200)
            cx2.fillText("音量設定",390,100)
            cx2.fillText("対局BGM設定",390,198)
            cx2.font = "18px 'Century Gothic'";
            cx2.fillText("（注意：対局設定について）",60,420)
            cx2.fillText("「たいせん」モードでは",60,440)
            cx2.fillText("ルーム長の対局設定データが",65,460)
            cx2.fillText("全体に反映されます。",65,480)
            cx2.font = "24px 'Century Gothic'";
            cx2.fillText("右クリック　ツモ切り",90,130);
            cx2.fillText("CPUのポン頻度",100,230);
            cx2.fillText("◀",120,260)
            cx2.fillText("▶",260,260)
            var A=(1-Ponrate)*5;
            for (var i=0;i<A;i++){
              cx2.fillText("■",140+i*24,260);
            };
            cx2.fillText("MPチャージ速度",100,300);
            if(Fever==-1){
              cx2.fillText("FEVER なし",100,380);
            }else{
            cx2.fillText("FEVER あり",100,380);
            }
            cx2.fillText("BGM(0-7)",430,130)
            cx2.fillText("SE(0-7)",430,160)
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
          }
          if(mouseX >80 && mouseX <160 && mouseY >310 && mouseY <350){
            if(mpVelocity!==1){
            mpVelocity=1;
            se3.play();
            drawbuttom(80,310,"おそめ",1,80,40)
            drawbuttom(170,310,"ふつう",0,80,40)
            drawbuttom(260,310,"はやめ",0,80,40)
            }
          }
          if(mouseX >170 && mouseX <260 && mouseY >310 && mouseY <350){
            if(mpVelocity!==1.5){
            mpVelocity=1.5;
            se3.play();
            drawbuttom(80,310,"おそめ",0,80,40)
            drawbuttom(170,310,"ふつう",1,80,40)
            drawbuttom(260,310,"はやめ",0,80,40)
            }
          }
          if(mouseX >260 && mouseX <340 && mouseY >310 && mouseY <350){
            if(mpVelocity!==2){
            mpVelocity=2;
            se3.play();
            drawbuttom(80,310,"おそめ",0,80,40)
            drawbuttom(170,310,"ふつう",0,80,40)
            drawbuttom(260,310,"はやめ",1,80,40)
            }
          }
          if(mouseX >80 && mouseX <360 && mouseY >100 && mouseY <170){
            cx2.font = "24px 'Century Gothic'";
            cx2.fillStyle="black";
            cx2.clearRect(89,105,270,26);
            se3.play();
            if(tumoConfig==0){
              tumoConfig=-1;
                cx2.fillText("右クリック　何もしない",90,130);
              }else{
                tumoConfig=0
              cx2.fillText("右クリック　ツモ切り",90,130);
              }
          }
          if(mouseX >80 && mouseX <340 && mouseY >350 && mouseY <410){
            cx2.font = "24px 'Century Gothic'";
            cx2.fillStyle="black";
            cx2.clearRect(99,355,160,26);
            se3.play();
            if(Fever!==-1){
              Fever=-1;
                cx2.fillText("FEVER なし",100,380);
              }else{
                Fever=0
              cx2.fillText("FEVER あり",100,380);
              }
          }
          if(mouseX >110 && mouseX <150 && mouseY >230 && mouseY <270){
            //ponrate
            se3.play();
            Ponrate+=0.2;
            if(Ponrate>1){Ponrate=1};
            cx2.font = "24px 'Century Gothic'";
            cx2.fillStyle = "black";
            cx2.clearRect(140,240,120,20);
            var A=(1-Ponrate)*5;
            for (var i=0;i<A;i++){
              cx2.fillText("■",140+i*24,260);
            };
          }
          if(mouseX >250 && mouseX <300 && mouseY >230 && mouseY <270){
            se3.play();
            Ponrate-=0.2;
            if(Ponrate<0){Ponrate=0};
            cx2.font = "24px 'Century Gothic'";
            cx2.fillStyle = "black";
            cx2.clearRect(140,240,120,20);
            var A=(1-Ponrate)*5;
            for (var i=0;i<A;i++){
              cx2.fillText("■",140+i*24,260);
            };
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
            jingle2.volume(0.3*sBar);
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
            jingle2.volume(0.3*sBar);
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
              cx2.clearRect(400,240,330,30)
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
              cx2.clearRect(400,310,330,30)
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
              cx2.clearRect(400,380,330,30)
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
              cx2.clearRect(400,240,330,30)
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
              cx2.clearRect(400,310,330,30)
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
              cx2.clearRect(400,380,330,30)
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
                case 7:
                  Bgm =new Music(bgm7data);
                  Bgm.playMusic();
                break;
                case 8:
                  Bgm =new Music(bgm8data);
                  Bgm.playMusic();
                break;
                case 9:
                  Bgm =new Music(bgm9data);
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
                case 7:
                  Bgm =new Music(bgm7data);
                  Bgm.playMusic();
                break;
                case 8:
                  Bgm =new Music(bgm8data);
                  Bgm.playMusic();
                break;
                case 9:
                  Bgm =new Music(bgm9data);
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
                case 7:
                  Bgm =new Music(bgm7data);
                  Bgm.playMusic();
                break;
                case 8:
                  Bgm =new Music(bgm8data);
                  Bgm.playMusic();
                break;
                case 9:
                  Bgm =new Music(bgm9data);
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
          case 4:
            //ガイド
            if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <90){
              if(msgstate==3){
                yakumap.x-=40;
                yakumap.alpha=0;}
              pagestate=0;
              msgstate=0;
              se2.play();
              Menu();
              return false;
            }
            switch(msgstate){
              case 0:
                if(mouseX >50 && mouseX <250 && mouseY >70 && mouseY <110){
                  epic.src=epic_src[1]
                  epic.onload=function(){
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.fillStyle = "black";
                  cx2.drawImage(epic,90,55,600,450);
                  msgstate=1;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("プレイ方法を知りたいですか？", 80, 550);
                  cx2.fillText("カーソルを当ててみてください！", 80, 570);
                }}
                if(mouseX >50 && mouseX <250 && mouseY >110 && mouseY <150){
                  epic.src=epic_src[2]
                  epic.onload=function(){
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("3ペアとはなんですか？", 280, 90);
                  cx2.font = "22px 'Century Gothic'";
                  cx2.fillText("エルコレドンジャラでは9枚のパイで役を作る必要があります。", 90, 280);
                  cx2.fillText("3ペアは、3種類ある役のうち、最も基本的な役です。", 90, 310);
                  cx2.fillText("「アイシャ」「ラシェ」「エリシス」のように、", 90, 340);
                  cx2.fillText("同じキャラクターを3枚1組として、3組揃えます。", 90, 370);
                  cx2.fillText("同じキャラクターであればラインが異なっていても良いですし、", 90, 400);
                  cx2.fillText("同じパイが複数あっても構いません。", 90, 430);
                  cx2.fillText("ただし、同じキャラクターを6枚集めても、3ペアにはなりません。", 90, 460);
                  cx2.fillText("「ポン」によって効率的にペアを揃えることができます。", 90, 490);
                  cx2.drawImage(epic,0,0,600,128,90,95,600,128);
                  msgstate=2;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("3ペアは最も基本的な役です。", 80, 550);
                  cx2.fillText("同じキャラ3枚を1組として、3組を揃える必要があります。", 80, 570);
                }}
                if(mouseX >50 && mouseX <250 && mouseY >150 && mouseY <190){
                  epic.src=epic_src[2]
                  epic.onload=function(){
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("ライン通貫とはなんですか？", 260, 90);
                  cx2.font = "22px 'Century Gothic'";
                  cx2.fillText("エルコレドンジャラでは9枚のパイで役を作る必要があります。", 90, 280);
                  cx2.fillText("ライン通貫は、3ペアの次に揃えやすい役です。", 90, 310);
                  cx2.fillText("「1」「2」「3」のように、パイに書かれた数字がラインです。", 90, 340);
                  cx2.fillText("ラインが同じパイを9組揃えることでライン通貫が成立します。", 90, 370);
                  cx2.fillText("このとき、同じパイが複数あっても構いません。", 90, 400);
                  cx2.fillText("ポンの性質上、「ポン」した場合には満たせなくなります。", 90, 430);
                  cx2.drawImage(epic,0,128,600,128,90,95,600,128);
                  msgstate=2;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("ライン通貫は、同じラインのキャラを9枚揃える役です。", 80, 550);
                  cx2.fillText("手札によっては、3ペアよりも揃えやすいかもしれません。", 80, 570);
                }}
                if(mouseX >50 && mouseX <250 && mouseY >190 && mouseY <230){
                  epic.src=epic_src[4]
                  epic.onload=function(){
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.drawImage(epic,90,95,600,223);
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("国士無双とはなんですか？", 260, 90);
                  cx2.font = "22px 'Century Gothic'";
                  cx2.fillText("国士無双は、3つ目の役で、少し特殊な役です。", 90, 340);
                  cx2.fillText("「エピックライン」という各キャラごとに定められた", 90, 370);
                  cx2.fillText("パイのみを9枚集めることで成立します。", 90, 400);
                  cx2.fillText("この時、同じパイが複数含まれてはいけません。", 90, 430);
                  cx2.fillText("国士無双を揃えるとボーナスとして高得点が貰えます。", 90, 460);
                  msgstate=2;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("国士無双はエピックラインを9枚揃える特殊な役です。", 80, 550);
                  cx2.fillText("オールマイティのパイがあれば狙ってみましょう。", 80, 570);
                }}
                if(mouseX >50 && mouseX <250 && mouseY >230 && mouseY <270){
                  epic.src=epic_src[3]
                  epic.onload=function(){
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.drawImage(epic,50,0,500,526,360,55,380,400);
                  cx2.clearRect(680,50,60,40);
                  cx2.font = "32px 'Century Gothic'";
                  cx2.fillText("　×",680,80)
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("ポン", 90, 90);
                  cx2.font = "22px 'Century Gothic'";
                  cx2.fillText("ポンについて知りたいポン？", 60, 150);
                  cx2.fillText("隣のプレイヤーの捨てパイと", 60, 180);
                  cx2.fillText("同じキャラのパイが2枚以上", 60, 210);
                  cx2.fillText("あれば、捨てパイを貰う", 60, 240);
                  cx2.fillText("ことができるポン！", 60, 270);
                  cx2.fillText("ポンした後は山からパイを", 60, 300);
                  cx2.fillText("引かずに、手札のパイを1枚", 60, 330);
                  cx2.fillText("選んで捨てるポン！", 60, 360);
                  cx2.fillText("ポンすると3ペアを揃えやすく", 60, 390);
                  cx2.fillText("なるけど、その代わりに", 60, 420);
                  cx2.fillText("得点が少し減っちゃうポン…", 60, 450);
                  msgstate=2;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("1つ前のプレイヤーが捨てたパイと同じキャラのパイが。", 80, 550);
                  cx2.fillText("手元に2枚以上ある時、捨てパイを貰うことができます。", 80, 570);
                }}
                if(mouseX >50 && mouseX <250 && mouseY >270 && mouseY <310){
                  yakumap.x+=40;
                  yakumap.alpha=1;
                  //Yakucheck();
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460);
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("シナジー", 90, 90);
                  cx2.font = "20px 'Century Gothic'";
                  cx2.fillText("（枠内クリックで上下にスクロールできます）", 210, 90);
                  msgstate=3;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("和了した時に、それぞれの組み合わせの中から2枚以上所持していると", 80, 540);
                  cx2.fillText("シナジー役がつきます（ただし1枚役は1翻）。", 80, 560);
                  cx2.fillText("まずは基本役である3ペアやライン通貫を優先し、余裕があれば狙ってみましょう。", 80, 580)
                }
                if(mouseX >50 && mouseX <250 && mouseY >310 && mouseY <350){
                  epic.src=epic_src[7]
                  epic.onload=function(){
                  se4.play();
                  var X=240;
                  var Y=55;
                  var Aicon=new Image();
                  Aicon.src="don/Duel_gaia.png"
                  Aicon.onload=function(){
                    cx2.drawImage(Aicon,X,Y,40,40);
                    X+=40;
                      Aicon.src="don/Duel_heat.png"
                      Aicon.onload=function(){
                        cx2.drawImage(Aicon,X,Y,40,40);
                        X+=40;
                          Aicon.src="don/Duel_aqua.png"
                          Aicon.onload=function(){
                            cx2.drawImage(Aicon,X,Y,40,40);
                            X+=40;
                            Aicon.src="don/Duel_wind.png"
                            Aicon.onload=function(){
                              cx2.drawImage(Aicon,X,Y,40,40);
                              X+=40;
                              Aicon.src="don/Duel_sun.png"
                              Aicon.onload=function(){
                                cx2.drawImage(Aicon,X,Y,40,40);
                                X+=40;
                                Aicon.src="don/Duel_moon.png"
                                Aicon.onload=function(){
                                  cx2.drawImage(Aicon,X,Y,40,40);
                                  X+=40;
                              Aicon.src="don/Don_HA.png"
                              Aicon.onload=function(){
                                cx2.drawImage(Aicon,X,Y,40,40);
                  }}}}}}};
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.drawImage(epic,60,100,630,270);
                  cx2.clearRect(680,50,60,40);
                  cx2.font = "32px 'Century Gothic'";
                  cx2.fillText("　×",680,80)
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("クレスト", 90, 90);
                  cx2.font = "22px 'Century Gothic'";
                  msgstate=2;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("パイに描かれたマークは、それぞれの属性を示しています。", 80, 540);
                  cx2.fillText("3ペアで和了した時に、属性が同じパイを2組（6枚）所持していれば、", 80, 560);
                  cx2.fillText("クレスト役がつきます。", 80, 580);

                }}
                if(mouseX >50 && mouseX <250 && mouseY >350 && mouseY <390){
                  epic.src=epic_src[6]
                  epic.onload=function(){
                  se4.play();
                  drawbuttom(5,80,"目次")
                  cx2.clearRect(50,50,660,460);
                  cx3.clearRect(50,50,700,460)
                  cx2.drawImage(epic,340,100,400,240);
                  cx2.clearRect(680,50,60,40);
                  cx2.font = "32px 'Century Gothic'";
                  cx2.fillText("　×",680,80)
                  cx2.fillStyle = "black";
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillText("マナブレイク", 90, 90);
                  cx2.font = "22px 'Century Gothic'";
                  cx2.fillText("対局中、マウス長押しで", 60, 150);
                  cx2.fillText("自分のMPゲージが徐々に", 60, 180);
                  cx2.fillText("緑色に変わっていきます。", 60, 210);
                  cx2.fillText("MPゲージが1目盛り以上", 60, 240);
                  cx2.fillText("緑色の状態でパイを選ぶと", 60, 270);
                  cx2.fillText("マナブレイクが発動します。", 60, 300);
                  cx2.fillText("マナブレイクしたパイは", 60, 330);
                  cx2.fillText("相手プレイヤーから見えず、", 60, 360);
                  cx2.fillText("ポンやロンされません。", 60, 390);
                  cx2.fillText("リーチする時や、リーチ中でも使用できますが、", 60, 420);
                  cx2.fillText("MPを消費するので使いどころに注意しましょう。", 60, 450);
                  msgstate=2;
                  cx2.clearRect(80,530,670,70)
                  cx2.font = "18px Arial";
                  cx2.fillText("MPを消費してマナブレイクすることができます。", 80, 550);
                  cx2.fillText("ここぞという時に使いましょう。", 80, 570);
                }}
                break;
                case 3:
                  if(mouseX >0 && mouseX <60 && mouseY >80 && mouseY <120){
                    yakumap.x-=40;
                    yakumap.alpha=0;
                  }
                  if(mouseX >80 && mouseY > 100 && mouseX <640 && mouseY <200){
                    Yakucheck(180);
                    return false;
                    }
                  if(mouseX >80 && mouseY > 200 && mouseX <640 && mouseY <300){
                    Yakucheck(90);
                    return false;
                    }
                    if(mouseX >80 && mouseY > 300 && mouseX <640 && mouseY <400){
                    Yakucheck(-90);
                    return false;
                    }
                    if(mouseX >80 && mouseY > 400 && mouseX <640 && mouseY <480){
                      Yakucheck(-180);
                      return false;
                      }
              case 1:
              case 2:
                if(mouseX >0 && mouseX <60 && mouseY >80 && mouseY <120){
                  se4.play();
                  msgstate=-1;
                  Menu();
                }
                break;
                default:
                epic.src=epic_src[0]
                epic.onload=function(){
                  cx1.fillStyle = "rgba(20,20,20,0.7)";
                  cx2.clearRect(0,0,800,510)
                  cx1.fillRect(0,0,800,510)
                  cx1.drawImage(epic,50,50,350,460)
                  cx1.drawImage(epic,400,50,350,460)
                    epic.src=epic_src[5]
                    epic.onload=function(){
                      cx2.drawImage(epic,300,70,400,300)
                cx2.fillStyle = "black";
                cx2.font = "26px 'Century Gothic'";
                cx2.fillText("画面の見方",60,100)
                cx2.fillText("役/3ペア",60,140)
                cx2.fillText("役/ライン通貫",60,180)
                cx2.fillText("役/国士無双",60,220)
                cx2.fillText("ポン",60,260)
                cx2.fillText("シナジー",60,300)
                cx2.fillText("クレスト",60,340)
                cx2.fillText("マナブレイク",60,380)
                cx2.font = "32px 'Century Gothic'";
                cx2.fillText("　×",680,80)
                cx2.clearRect(80,520,670,70)
                cx2.font = "18px Arial";
                cx2.fillText("プレイガイド　9枚のパイで役を揃えるゲーム、", 80, 550);
                cx2.fillText("エルコレドンジャラのルール説明です。", 80, 570)
                msgstate=0;
                      }}
                  break;
            }
            break;
          case 5:
              //実績
            if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <100){
              if(msgstate !==-1){
              pagestate=0;
              msgstate=0;
              se2.play();
              Menu();
              }
              return false;
            }
            if(mouseX >60 && mouseX <190 && mouseY >80 && mouseY <125){
              if(msgstate>0){
              msgstate=0;
              se4.play();
              Menu();
              }
            }
            if(mouseX >60 && mouseX <190 && mouseY >125 && mouseY <170){
              if(msgstate!==1 && msgstate !==-1){
              msgstate=1;
              se4.play();
              Menu();
              }
            }
            if(mouseX >60 && mouseX <190 && mouseY >170 && mouseY <215){
              if(msgstate!==2 && msgstate !==-1){
              msgstate=2;
              se4.play();
              Menu();
              }
            }
            switch(msgstate){
              case 0:
                if(mouseX >530 && mouseX <730 && mouseY >90 && mouseY <130){
                  se3.play();
                  user = window.prompt("プレイヤー名を入力", Username);
                  if(!user ||!user.match(/\S/g)){
                    se2.play();
                    window.alert("未入力です")
                    return false;
                  }
                    let len = 0;
                    for (let i = 0; i < user.length; i++) {
                    (user[i].match(/[ -~]/)) ? len += 1 : len += 2;
                    }
                    if(len>12){
                      se2.play();
                      window.alert("長すぎる名前は嫌われます")
                      return false;
                    }
                    se3.play();
                  Username=user;
                  cx2.clearRect(530,90,200,40)
                  cx2.fillStyle = "rgba(0,0,0,0.8)";
                  cx2.fillRect(530,90,200,40)
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillStyle = "white";
                  cx2.fillText(Username,532,120);
                  }
                  if(mouseX >530 && mouseX <730 && mouseY >415 && mouseY <470){
                    se3.play();
                    chara[1]=Math.floor((mouseX-530)/50);
                  }
                e10.src=chrimg_src[chara[1]]
                e10.onload=function(){
                  cx2.clearRect(190,60,550,440)
                  cx2.drawImage(e10,400,0,350,525,530,135,200,300)
                  e11.src=chrimg_src[0];
                  e11.onload=function(){
                    cx2.drawImage(e11,500,50,200,200,530,418,50,50)
                  e11.src=chrimg_src[1];
                  e11.onload=function(){
                    cx2.drawImage(e11,500,100,200,200,580,418,50,50)
                  e11.src=chrimg_src[2];
                  e11.onload=function(){
                    cx2.drawImage(e11,500,80,200,200,630,418,50,50) 
                  e11.src=chrimg_src[3];
                  e11.onload=function(){
                    cx2.drawImage(e11,530,50,200,200,680,418,50,50)   
                  drawbuttom(60,80,"戦績",1,130,44);
                  drawbuttom(60,125,"実績リスト",0,130,44);
                  drawbuttom(60,170,"達成役一覧",0,130,44);
                  cx2.font = "32px 'Century Gothic'";
                  cx2.fillStyle = "rgba(0,0,0,0.8)";
                  cx2.fillRect(530,90,200,40)
                  cx2.fillRect(530+50*chara[1],418,50,50);
                  cx2.fillStyle = "black";
                  cx2.fillText("　×",680,80)
                  var wT=winrank[0]+winrank[1]+winrank[2]+winrank[3]
                  var winrate=0;
                  if(wT>0){
                    winrate=Math.floor(winrank[0]/wT*1000)/10  
                  }
                  cx2.font = "26px 'Century Gothic'";
                  cx2.fillStyle = "white";
                  cx2.fillText(Username,532,120);
                  var X=200;
                  cx2.font = "22px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText( "総プレイ回数："+highscore[0]+"回",X,105);
                  cx2.fillText( "通算勝率："+winrate+"%",X,135);
                  cx2.fillText( "最大戦闘力："+highscore[1],X,185);
                  cx2.fillText( "瞬間最大火力："+highscore[2],X,215);
                  cx2.font = "18px 'Century Gothic'";
                  cx2.fillText( "(1位："+winrank[0]+" /2位："+winrank[1]+" /3位："+winrank[2]+" /4位："+winrank[3]+")",X,155);
                  var achieveC=achieveB.filter(value=>value.sub=="その他");
                  X+=10;
                  var Y=250
                  cx2.fillStyle = "black"; 
                  cx2.font = "20px 'Century Gothic'";
                  cx2.fillText("最大連荘",X,Y);
                  cx2.fillText(highscore[3]+"回",X+130,Y);
                  Y+=22;
                  for(var i=0;i<achieveC.length; i++){
                      cx2.fillText(achieveC[i].name,X,Y);
                      cx2.fillText(achieveC[i].cleared+"回",X+130,Y);
                    Y+=22;
                    if(Y>=500){
                      X+=280;
                      Y=110;
                    }
                  }}}};
                  }};
                break;
              case 1:
                if(mouseX >195 && mouseX <380 && mouseY >95 && mouseY <495){
                  var I=Math.floor((mouseY-95)/20);
                  cx3.strokeRect(190,92+I*20,240,20);
                  if(achieveA[I].cleared>0 && Usercrest!==achieveA[I].name){
                    se3.play();
                    Usercrest=achieveA[I].name;
                  }else{
                    Usercrest="称号なし";
                  };
                }
                if(mouseX >475 && mouseX <660 && mouseY >95 && mouseY <495){
                  var I=Math.floor((mouseY-95)/20)+20;
                  if(I>=achieveA.length){
                    return false;
                  }
                  if(achieveA[I].cleared>0 && Usercrest!==achieveA[I].name){
                    se3.play();
                      Usercrest=achieveA[I].name;
                    }else{
                      Usercrest="称号なし";
                    };
                  }
                cx2.clearRect(190,60,550,440)
                var A=achieveA.findIndex(value=>value.name==Usercrest);
                if(A>=0){
                  if(A<20){
                    cx2.fillStyle = "rgba(0,0,0,0.3)";
                    cx2.fillRect(190,92+20*A,240,20);
                  }else{
                    cx2.fillStyle = "rgba(0,0,0,0.3)";
                    cx2.fillRect(470,92+20*(A-20),240,20);
                  }
                }
                  drawbuttom(60,80,"戦績",0,130,44);
                  drawbuttom(60,125,"実績リスト",1,130,44);
                  drawbuttom(60,170,"達成役一覧",0,130,44);
                  cx2.font = "32px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText("　×",680,80)
                  var A=achieveA.filter(value=>value.cleared>0);
                  cx2.font = "bold 20px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText("実績 "+A.length+"/"+achieveA.length,200,85) 
                  var X=200;
                  var Y=110
                  cx2.fillStyle = "black"; 
                  for(var i=0;i<achieveA.length; i++){
                    if(achieveA[i].cleared==0){
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText("？？？",X,Y);
                      //cx2.fillText(achieveC[i].count+"/"+achieveC[i].max,X+150,Y);
                    }else{
                      cx2.font = "bold 18px 'Century Gothic'";
                      cx2.fillText(achieveA[i].name,X,Y);
                      cx2.font = "18px 'Century Gothic'";
                      //cx2.fillText(achieveA[i].sub,X+150,Y);
                    }
                    Y+=20;
                    if(Y>=500){
                      X+=280;
                      Y=110;
                    }
                  }
                break;
              case 2:
                cx2.clearRect(190,60,550,440)
                  drawbuttom(60,80,"戦績",0,130,44);
                  drawbuttom(60,125,"実績リスト",0,130,44);
                  drawbuttom(60,170,"達成役一覧",1,130,44);
                  cx2.font = "32px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText("　×",680,80)
                  var achieveC=achieveB.filter(value=>value.sub=="シナジー役");
                  var A=achieveC.filter(value=>value.cleared>0);
                  cx2.font = "bold 20px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText("シナジー "+A.length+"/"+achieveC.length,200,85) 
                  var X=200;
                  var Y=110
                  for(var i=0;i<achieveC.length; i++){
                    if(achieveC[i].cleared==0){
                      cx2.fillStyle = "#8c8c8c";
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText(achieveC[i].name,X,Y);
                      cx2.fillText(achieveC[i].count+"/"+achieveC[i].max,X+150,Y);
                    }else{
                      cx2.fillStyle = "black"; 
                      cx2.font = "bold 18px 'Century Gothic'";
                      cx2.fillText(achieveC[i].name,X,Y);
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText(achieveC[i].count+"/"+achieveC[i].max+" ("+achieveC[i].cleared+")",X+150,Y);
                    }
                    Y+=20;
                    if(Y>=500){
                      X+=280;
                      Y=110;
                    }
                  }
                  var achieveD=achieveB.filter(value=>value.sub=="キャラ役");
                  var B=achieveD.filter(value=>value.cleared>0);
                  cx2.font = "bold 20px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText("クレスト "+B.length+"/"+achieveD.length,380,85) 
                  Y+=10;
                  for(var i=0;i<achieveD.length; i++){
                    if(achieveD[i].cleared==0){
                      cx2.fillStyle = "#8c8c8c";
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText(achieveD[i].name,X,Y);
                      cx2.fillText(" ("+achieveD[i].cleared+")",X+200,Y);
                    }else{
                      cx2.fillStyle = "black"; 
                      cx2.font = "bold 18px 'Century Gothic'";
                      cx2.fillText(achieveD[i].name,X,Y);
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText(" ("+achieveD[i].cleared+")",X+200,Y);
                    }
                    Y+=20;
                    if(Y>=500){
                      X+=280;
                      Y=110;
                    }
                  }
                  var achieveC=achieveB.filter(value=>value.sub=="アガリ形");
                  var A=achieveC.filter(value=>value.cleared>0);
                  cx2.font = "bold 20px 'Century Gothic'";
                  cx2.fillStyle = "black";
                  cx2.fillText("一般 "+A.length+"/"+achieveC.length,560,85) 
                  Y+=10
                  for(var i=0;i<achieveC.length; i++){
                    if(achieveC[i].cleared==0){
                      cx2.fillStyle = "#8c8c8c";
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText(achieveC[i].name,X,Y);
                      cx2.fillText(" ("+achieveC[i].cleared+")",X+200,Y);
                    }else{
                      cx2.fillStyle = "black"; 
                      cx2.font = "bold 18px 'Century Gothic'";
                      cx2.fillText(achieveC[i].name,X,Y);
                      cx2.font = "18px 'Century Gothic'";
                      cx2.fillText(" ("+achieveC[i].cleared+")",X+200,Y);
                    }
                    Y+=20;
                    if(Y>=500){
                      break;
                    }
                  }
                break;
                default:
                epic.src=epic_src[0]
                epic.onload=function(){
                  cx1.fillStyle = "rgba(20,20,20,0.7)";
                  cx2.clearRect(0,0,800,510)
                  cx1.fillRect(0,0,800,510)
                  cx1.drawImage(epic,50,50,350,460)
                  cx1.drawImage(epic,400,50,350,460)
                  drawbuttom(60,80,"戦績",0,130,44);
                  drawbuttom(60,125,"実績リスト",0,130,44);
                  drawbuttom(60,170,"達成役一覧",0,130,44);
                cx2.font = "32px 'Century Gothic'";
                cx2.fillStyle = "black";
                cx2.fillText("　×",680,80)
                cx2.clearRect(80,530,670,70)
                cx2.font = "18px Arial";
                cx2.fillText("今までの対局の記録です。", 80, 550);
                msgstate=0;
                Menu();
                      }
                  break;
            }
            break;
          case 6:
            //たいせん画面
            if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <100){
              pagestate=0;
              msgstate=0;
              se2.play();
              Menu();
              return false;
            }
            switch(msgstate){
              case 2:
                //case1は入場待機
                if(mouseX >420 && mouseX <590 && mouseY >520 && mouseY <580){
                  //Readyボタン
                  msgstate=1;
                  var roomId=RoomName[IAM.room];
                  if(IsHost(IAM.room)){
                    //他のプレイヤーが全員レディならスタート
                    socket.emit('ready_to_start',{token: IAM.token,ready:-1,room:roomId});
                  }else{
                    socket.emit('ready_to_start',{token: IAM.token,ready: IAM.is_ready,room:roomId});
                    if(IAM.is_ready==1){IAM.is_ready=0}else{IAM.is_ready=1};
                  }
                }
                if(mouseX >600 && mouseX <770 && mouseY >520 && mouseY <580){
                  //退出するボタン
                  if(IsHost(IAM.room) || IAM.is_ready==0){
                    msgstate=1;
                    se3.play();
                    var clientId=Username;
                    var clientChr=chara[1];
                    var roomId=RoomName[IAM.room];
                    //個人のルーム設定を初期化
                    LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サバイバル","デスマッチ"]};
                    socket.emit('leave_to_room',{token: IAM.token,name:clientId,chr:clientChr,room:roomId});
                  }else{
                    se3.play();
                    alert("退室する際はReady状態を解除してください。");
                    console.log('退室する際はReady状態を解除してください')
                  }
                }
                //room_config
                //LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サドンデス","デスマッチ"]};
                if(IsHost(IAM.room)){
                if(mouseX >610 && mouseX <660 && mouseY >130 && mouseY <170){
                  LP_PVP.Rule[0]-=1;
                  if(LP_PVP.Rule[0]<=0){LP_PVP.Rule[0]=LP_PVP.Rule.length-1;}
                  corsor();
                  msgstate=1;
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >740 && mouseX <790 && mouseY >130 && mouseY <170){
                  LP_PVP.Rule[0]+=1;
                  if(LP_PVP.Rule[0]>=LP_PVP.Rule.length){LP_PVP.Rule[0]=1;}
                  corsor();
                  msgstate=1;
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <660 && mouseY >200 && mouseY <240){
                  msgstate=1;
                  LP_PVP.LP[0]-=1;
                  if(LP_PVP.LP[0]<=0){LP_PVP.LP[0]=LP_PVP.LP.length-1;}
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >740 && mouseX <790 && mouseY >200 && mouseY <240){
                  msgstate=1;
                  LP_PVP.LP[0]+=1;
                  if(LP_PVP.LP[0]>=LP_PVP.LP.length){LP_PVP.LP[0]=1;}
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <660 && mouseY >270 && mouseY <310){
                  msgstate=1;
                  LP_PVP.Length[0]-=1;
                  if(LP_PVP.Length[0]<=0){LP_PVP.Length[0]=LP_PVP.Length.length-1;}
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >740 && mouseX <790 && mouseY >270 && mouseY <310){
                  msgstate=1;
                  LP_PVP.Length[0]+=1;
                  if(LP_PVP.Length[0]>=LP_PVP.Length.length){LP_PVP.Length[0]=1;}
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <660 && mouseY >340 && mouseY <380){
                  msgstate=1;
                  LP_PVP.Block[0]-=1;
                  if(LP_PVP.Block[0]<=0){LP_PVP.Block[0]=LP_PVP.Block.length-1;}
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >740 && mouseX <790 && mouseY >340 && mouseY <380){
                  msgstate=1;
                  LP_PVP.Block[0]+=1;
                  if(LP_PVP.Block[0]>=LP_PVP.Block.length){LP_PVP.Block[0]=1;}
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
              };
                break;
              case 0:
                //入場
                if(mouseX >60 && mouseX <260 && mouseY >80 && mouseY <280){
                msgstate=1;
                Nyusitu(1);  
                };
                if(mouseX >280 && mouseX <480 && mouseY >80 && mouseY <280){
                  msgstate=1;
                  Nyusitu(2);
                }
                if(mouseX >500 && mouseX <700 && mouseY >80 && mouseY <280){
                  msgstate=1;
                  Nyusitu(3);
                }
                function Nyusitu(rn=1){
                  var clientId=Username;
                  var clientCrest=Usercrest;
                  var clientChr=chara[1];
                  var roomId=RoomName[rn];
                  socket.emit('join_to_room',{token: IAM.token,name:clientId,crest:clientCrest,chr:clientChr,room:roomId});
                  cx4.globalAlpha=1;
                  se3.play();
                  cx4.fillStyle = "rgba(20,20,20,0.7)";
                  cx4.fillRect(0,0,800,600)
                  cx4.font = "bold 26px 'メイリオ'";
                  cx4.fillStyle = "black";
                  cx4.strokeStyle ="rgba(250,250,250,0.9)";
                  cx4.lineWidth=5;
                  cx4.strokeText("入室しています",240,200);
                  cx4.fillText("入室しています",240,200);   
                  }
                break;
                case -1:
                  epic.src=epic_src[0]
                  epic.onload=function(){
                    cx1.fillStyle = "rgba(20,20,20,0.7)";
                    cx.clearRect(0,520,800,70)
                    cx1.clearRect(0,0,800,600)
                    cx2.clearRect(0,0,800,600)
                    cx4.clearRect(0,0,800,600)
                    cx1.fillRect(0,0,800,510)
                    cx1.drawImage(epic,50,50,350,460)
                    cx1.drawImage(epic,400,50,350,460)
                  cx2.fillStyle = "rgba(20,20,20,0.7)";
                  cx2.fillRect(60,80,200,200)
                  cx2.fillRect(280,80,200,200)
                  cx2.fillRect(500,80,200,200)
                  drawbuttom(90,80,"ルーム1",0,130,44);
                  drawbuttom(310,80,"ルーム2",0,130,44);
                  drawbuttom(530,80,"ルーム3",0,130,44);
                cx2.font = "32px 'Century Gothic'";
                cx2.fillStyle = "black";
                cx2.fillText("　×",680,80)
                cx2.clearRect(80,530,670,70)
                cx2.font = "18px Arial";
                cx2.fillText("ルーム選択", 80, 550);
                cx2.clearRect(580,530,170,20)
                cx2.fillText("現在の接続人数："+Usercount, 580, 550);
                  cx3.fillStyle = "white";
                  cx3.font = "bold 22px Arial";
                  var X=80;
                  var Y=130;
                  for(var i=0;i<3;i++){
                    cx3.clearRect(X-10,Y-20,150,100);
                    cx3.fillText("人数："+RoomNum[i]+"/4", X, Y+20);
                    cx3.fillText("状態："+RoomState[i], X, Y+50);
                    X+=220;
                  }
                msgstate=0;
                  }; 
              break;
            }
    //ルーム関連のソケット
  //ゲームスタート
  socket.on("start-result", (data)=>{
    if(data.status){
      if(IsHost(IAM.room)){
        console.log('setupへ');
        //メンバーをコピー
        switch(IAM.room){
          case 1:
          memberlist=Roomlist1.concat();
          break;
          case 2:
            memberlist=Roomlist2.concat();
            break;
          case 3:
            memberlist=Roomlist3.concat();
            break;
        }
        timevalue=Date.now();
        Setup(1)
        msgstate=2;
        //setupへ
      }else{
        console.log('ゲームロード待機')
        msgstate=2;
        //ゲームロード待機
      }
    }else if(msgstate!==2){
      alert("未準備のプレイヤーがいます。");
      console.log('未準備のプレイヤーがいます')
      msgstate=2;
    }
  });
  //レディ
  socket.on("ready-result", (data)=>{
      console.log(data.status);
        msgstate=2;
    });
  //退室
  socket.on("leave-result", (data)=>{
    if(data.status){
      if(msgstate!==2){
      alert("退室する際はReady状態を解除してください。");
      console.log('退室する際はReady状態を解除してください')
      msgstate=2;
      }
    }else{
      msgstate=-1;
      Menu();
    }
  });
  //入室
  socket.on('room-result', (data)=>{
    if(data.status){ 
      switch(data.room){
        case 'room1':
          IAM.room=1;
          break;
          case 'room2':
            IAM.room=2;
            break;
            case 'room3':
              IAM.room=3;
              break;
              default:
                console.log('room error!',data.room);
                IAM.room=1;
                break;
      }  
      console.log('入室成功',IAM.room);
      if(msgstate!==2){
        msgstate=2;
        socket.emit('lobby_update');
      cx4.clearRect(0,0,800,600)
      };
    }else{
      console.log('入室失敗');
      cx4.clearRect(0,0,800,600);
      msgstate=-1;
      Menu();
      return false;
    }
    });
  //config
  socket.on("room-config", (data)=>{
    if(!IsHost(IAM.room)){
      console.log(data);
      LP_PVP.Length[0]=data.Length[0];
      LP_PVP.LP[0]=data.LP[0];
      LP_PVP.Block[0]=data.Block[0];
      LP_PVP.Rule[0]=data.Rule[0];
      }else{
    //Host
    if(msgstate!==2){
      msgstate=2;
      cx2.clearRect(610,80,180,300);
      cx2.fillStyle = "white";
      cx2.font = "16px 'Century Gothic'";
      cx2.textAlign = "center";
      cx2.fillText('ルーム設定',700,100);
      cx2.font = "bold 22px Arial";
      var X=700;
      var Y=130;
      cx2.fillText('ルール',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.Rule[LP_PVP.Rule[0]],X,Y);
      Y+=40;
      cx2.fillText('持ち点',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.LP[LP_PVP.LP[0]],X,Y);
      Y+=40;
      cx2.fillText('東風/半荘',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.Length[LP_PVP.Length[0]],X,Y);
      Y+=40;
      cx2.fillText('満貫打ち止め',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.Block[LP_PVP.Block[0]],X,Y);
      cx2.textAlign = "start";
      }
  }
  cx2.fillStyle = "white";
  cx2.font = "bold 30px Arial";
  cx2.clearRect(160,5,365,75);
  cx2.fillText(LP_PVP.Rule[LP_PVP.Rule[0]]+"　"+LP_PVP.Length[LP_PVP.Length[0]]+"戦",200,40);
  cx2.fillText("持ち点 "+LP_PVP.LP[LP_PVP.LP[0]]+"　"+LP_PVP.Block[LP_PVP.Block[0]],170,75);
  });
  //入室状態更新
  socket.on("room-update", (data)=>{
    if(gamestate>=0 && gamestate<=2){
      cx4.globalAlpha = 1;
      cx4.clearRect(0,0,800,600);
      cx4.font = "bold 26px 'メイリオ'";
      cx4.fillStyle = "white";
      cx4.fillText('ルーム人数が変化したため、ゲームが終了しました',50,590);
      se3.play();
      scoretemp[0]=-1;
      opLock=0;
      gameover();
    }else if(gamestate==10){
    //data.focus 0->誰かが入室してきた 1->ready 2->ゲームオーバーのあと
    if(IsHost(IAM.room && data.focus==0)){
      //ルーム設定を同期
    socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
    };
      switch(IAM.room){
        case 1:
      Roomlist1=data.list.concat();
      break;
        case 2:
      Roomlist2=data.list.concat();
      break;
        case 3:
      Roomlist3=data.list.concat();
      break;
      }
      if(data.focus !==1){
      cx.clearRect(0,520,800,70)
      cx1.fillStyle = "#001c0d";
      cx1.fillRect(0,0,800,600)
      cx2.clearRect(0,0,800,600)
      cx3.clearRect(0,0,800,600)
      cx4.clearRect(0,0,800,600)
      cx2.fillStyle = "#126e60"
      cx2.fillRect(11,100,148,300);
      cx2.fillRect(161,100,148,300);
      cx2.fillRect(311,100,148,300);
      cx2.fillRect(461,100,148,300);
      cx2.fillStyle = "white";
      cx2.font = "bold 30px Arial";
      cx2.fillText('CPU',50,270);
      cx2.fillText('CPU',200,270);
      cx2.fillText('CPU',350,270);
      cx2.fillText('CPU',500,270);
      cx2.fillText(LP_PVP.Rule[LP_PVP.Rule[0]]+"　"+LP_PVP.Length[LP_PVP.Length[0]]+"戦",200,40);
      cx2.fillText("持ち点 "+LP_PVP.LP[LP_PVP.LP[0]]+"　"+LP_PVP.Block[LP_PVP.Block[0]],170,75);
      drawbuttom(10,10,"ルーム"+IAM.room,1,30,44);
      if(data.focus==2){
        cx2.fillText('♪「STARDUST LEMON」',530,55);
        cx2.fillText('/yuhei komatsu',560,75);
      }
      if(IsHost(IAM.room)){
      cx2.textAlign = "center";
      cx2.fillText('ルーム設定',700,100);
      cx2.font = "bold 22px Arial";
      var X=700;
      var Y=130;
      cx2.fillText('ルール',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.Rule[LP_PVP.Rule[0]],X,Y);
      Y+=40;
      cx2.fillText('持ち点',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.LP[LP_PVP.LP[0]],X,Y);
      Y+=40;
      cx2.fillText('東風/半荘',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.Length[LP_PVP.Length[0]],X,Y);
      Y+=40;
      cx2.fillText('満貫打ち止め',X,Y);
      Y+=30;
      cx2.fillText("◀　　　　　▶",X,Y);
      cx2.fillText(LP_PVP.Block[LP_PVP.Block[0]],X,Y);
      cx2.textAlign = "start";
      };
    }
    if(IsHost(IAM.room)){
      //LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サドンデス","デスマッチ"]};
      drawbuttom2(420,520,"対局開始",0); 
      drawbuttom2(600,520,"退出する",0);                       
      }else{
        var A=data.list.findIndex(value=>value.token==IAM.token);
        if(A==-1){
          console.log('token error',A);
          A=0;
        }
        if(A>0 && data.list[A].ready){
      drawbuttom2(420,520,"Quit",0);
      drawbuttom2(600,520,"退出する",1);
        }else if(A>0){
      drawbuttom2(420,520,"Ready",0);
      drawbuttom2(600,520,"退出する",0);
        }
      }
      cx4.fillStyle='orange';
      drawstar(20,125);
      cx2.fillStyle = "white";
      switch(data.list.length){
        case 1:
        cx2.clearRect(10,100,150,400)
          cx2.font = "14px Arial";
          cx2.fillText(data.list[0].crest, 10, 425);
          cx2.font = "bold 24px Arial";
          cx2.fillText(data.list[0].name, 10, 450);
          cx2.fillStyle = "orange";
          cx2.font = "bold 26px Arial";
          cx2.fillText("ルーム長", 40, 480);
        e10.src=chrimg_src[data.list[0].chr]
        e10.onload=function(){
      cx2.drawImage(e10,400,0,300,600,10,100,150,300)
        }
          break;
        case 2:
          cx2.clearRect(10,100,300,400);
          cx2.font = "14px Arial";
          cx2.fillText(data.list[0].crest, 10, 425);
          cx2.fillText(data.list[1].crest, 160, 425);
          cx2.font = "bold 24px Arial";
          cx2.fillText(data.list[0].name, 10, 450);
          cx2.fillText(data.list[1].name, 160, 450);
          cx2.fillStyle = "orange";
          cx2.font = "bold 26px Arial";
          cx2.fillText("ルーム長", 40, 480);
          if(data.list[1].ready){
            cx2.fillText("READY", 190, 480);
          }
        e10.src=chrimg_src[data.list[0].chr]
        e10.onload=function(){
        cx2.drawImage(e10,400,0,300,600,10,100,150,300)
          e10.src=chrimg_src[data.list[1].chr]
          e10.onload=function(){
          cx2.drawImage(e10,400,0,300,600,160,100,150,300)
        }}
          break;
        case 3:
          cx2.clearRect(10,100,450,400);
          cx2.font = "14px Arial";
          cx2.fillText(data.list[0].crest, 10, 425);
          cx2.fillText(data.list[1].crest, 160, 425);
          cx2.fillText(data.list[2].crest, 310, 425);
          cx2.font = "bold 24px Arial";
          cx2.fillText(data.list[0].name, 10, 450);
          cx2.fillText(data.list[1].name, 160, 450);
          cx2.fillText(data.list[2].name, 310, 450);
          cx2.fillStyle = "orange";
          cx2.font = "bold 26px Arial";
          cx2.fillText("ルーム長", 40, 480);
          if(data.list[1].ready){
            cx2.fillText("READY", 190, 480);
          };
          if(data.list[2].ready){
            cx2.fillText("READY", 340, 480);
          }
        e10.src=chrimg_src[data.list[0].chr]
        e10.onload=function(){
        cx2.drawImage(e10,400,0,300,600,10,100,150,300)
          e10.src=chrimg_src[data.list[1].chr]
          e10.onload=function(){
          cx2.drawImage(e10,400,0,300,600,160,100,150,300)
          e10.src=chrimg_src[data.list[2].chr]
          e10.onload=function(){
          cx2.drawImage(e10,400,0,300,600,310,100,150,300)
        }}}
          break;
        case 4:
          cx2.clearRect(10,100,600,400);
          cx2.font = "14px Arial";
          cx2.fillText(data.list[0].crest, 10, 425);
          cx2.fillText(data.list[1].crest, 160, 425);
          cx2.fillText(data.list[2].crest, 310, 425);
          cx2.fillText(data.list[3].crest, 460, 425);
          cx2.font = "bold 24px Arial";
          cx2.fillText(data.list[0].name, 10, 450);
          cx2.fillText(data.list[1].name, 160, 450);
          cx2.fillText(data.list[2].name, 310, 450);
          cx2.fillText(data.list[3].name, 460, 450);
          cx2.fillStyle = "orange";
          cx2.font = "bold 26px Arial";
          cx2.fillText("ルーム長", 40, 480);
          if(data.list[1].ready){
            cx2.fillText("READY", 190, 480);
          };
          if(data.list[2].ready){
            cx2.fillText("READY", 340, 480);
          }
          if(data.list[3].ready){
            cx2.fillText("READY", 490, 480);
          }
        e10.src=chrimg_src[data.list[0].chr]
        e10.onload=function(){
        cx2.drawImage(e10,400,0,300,600,10,100,150,300)
          e10.src=chrimg_src[data.list[1].chr]
          e10.onload=function(){
          cx2.drawImage(e10,400,0,300,600,160,100,150,300)
          e10.src=chrimg_src[data.list[2].chr]
          e10.onload=function(){
          cx2.drawImage(e10,400,0,300,600,310,100,150,300)
          e10.src=chrimg_src[data.list[3].chr]
          e10.onload=function(){
          cx2.drawImage(e10,400,0,300,600,460,100,150,300)
        }}}}
          break;
      }
    console.log('room updated')
  }
  });
   break;
    }
  }
  window.addEventListener("keyup", keyupHandler, false);
    function keyupHandler(e) {
    if(e.keyCode==27){
    key27=0;//esc
    }}
    window.addEventListener("keydown", keyDownHandler, false);
    function keyDownHandler(e) {
      if(e.keyCode==27 && key27==0){
        key27=1;
        if(pvpmode==1){
          if(IsHost(IAM.room)){
//対局を止める
if(opLock==0 && gamestate ==1){
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
  }
          }
        }else{
        //対局を止める
        if(opLock==0 && gamestate ==1){
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
      }
  var yakumapYmax;
  function Yakucheck2(move=0){
    //現在所持しているものを表示
    if(move!==0){
    //上下移動
    yakumapY+=move;
    if(yakumapY<=-yakumapYmax){yakumapY=0;}
    if(yakumapY>0){yakumapY=-yakumapYmax+60;}
    createjs.Tween.get(yakumap2, {override: true})
    .to({y: yakumapY}, 200, createjs.Ease.cubicInOut);
    return false;
  }
    //一覧表示
    yakumap2.removeAllChildren();
    var rect = new createjs.Shape();
    rect.graphics
            .beginFill("rgba(20,20,20,0.7)")
            .drawRect(40, 100, 580, 2800);
    yakumap2.addChild(rect);
    var shapeMask = new createjs.Shape();
  shapeMask.graphics
          .beginFill("gold")
          .drawRect(40, 100, 620, 390);
  var Sinagy=[
    {id:"鋭さ",chr:[12,24,33,39,7,28,38]},
    {id:"物理特化",chr:[27,36,5,8,35,41]},
    {id:"魔法特化",chr:[24,1,10,16,31]},
    {id:"敏捷さ",chr:[6,9,36,16,40,2]},
    {id:"殴り合い",chr:[24,33,10]},
    {id:"時空間",chr:[5,26,32]},
    {id:"精霊の加護",chr:[6,7,8]},
    {id:"魔族",chr:[27,28,29]},
    {id:"ナソード研究",chr:[12,13,14,24,42]},
    {id:"原初的な動き",chr:[0,9,21]},
    {id:"マナ守護",chr:[4,34,20]},
    {id:"属性鍛錬者",chr:[3,15,1,22]},
    {id:"巨人審判者",chr:[39,30,37,2,11,17]},
    {id:"探求する者",chr:[3,13,25,37,17,42]},
    {id:"渇望",chr:[4,19,31,23,26,29,32]},
    {id:"正義を貫徹する者",chr:[0,15,18,21,30]},
    {id:"痛いから問題ない",chr:[31,34,11,23,38]},
    {id:"戦場の天使",chr:[14,41]},
    {id:"貫徹する足取り",chr:[18]},
    {id:"豊かな足取り",chr:[19]},
    {id:"上手な足取り",chr:[20]},
    {id:"ラビィの友達",chr:[35]},
    {id:"機械工学",chr:[42]},
  ]
  var t;
  var s;
  var X
  var Y=120;
  var Ary=hand1.concat(pon1);
  function getIsDuplicate(arr1, arr2) {
    return [...arr1, ...arr2].filter(item => arr1.includes(item) && arr2.includes(item)).length > 0
  }
  for(var i=0; i<Sinagy.length; i++){
  //一つでも所持していればGO
  if(getIsDuplicate(Ary,Sinagy[i].chr)){
  X=110;
  t= new createjs.Text(Sinagy[i].id, "bold 16px Arial", "white");
  t.x=X-40;
  t.y=Y;
  yakumap2.addChild(t);
  Y+=20;
  for(var j=0; j<Sinagy[i].chr.length ; j++){
    s= new createjs.Bitmap(eltear_src[Sinagy[i].chr[j]]);
    s.scaleX=1/2;
    s.scaleY=1/2;
    s.x=X+50;
    s.y=Y;
    var A=Ary.findIndex(value=>value==Sinagy[i].chr[j]);
    if(A==-1){
      s.filters = [new createjs.ColorFilter(0.3, 1, 1, 0.3)];
      s.cache(0,0,120,156);
        }
    yakumap2.addChild(s);
    X+=65; 
      }
  Y+=95;
  }};
  t= new createjs.Text("↑ TOP ↑", "22px Arial", "white");
  t.x=270;
  t.y=Y+20;
  console.log(Y);
  yakumapYmax=Y-270;
  yakumap2.addChild(t);
  // マスクを適用する
  yakumap2.mask = shapeMask;
  }
  //シナジー改善案
  function Yakucheck(move=0){
        if(move!==0){
        //上下移動
        yakumapY+=move;
        if(yakumapY<=-2420){yakumapY=0;}
        if(yakumapY>0){yakumapY=-2360;}
        createjs.Tween.get(yakumap, {override: true})
        .to({y: yakumapY}, 200, createjs.Ease.cubicInOut);
        return false;
      }
        //一覧表示
        var rect = new createjs.Shape();
        rect.graphics
                .beginFill("rgba(20,20,20,0.7)")
                .drawRect(40, 100, 660, 2800);
        yakumap.addChild(rect);
        var shapeMask = new createjs.Shape();
      shapeMask.graphics
              .beginFill("gold")
              .drawRect(40, 100, 660, 390);
      var Sinagy=[
        {id:"鋭さ",chr:[12,24,33,39,7,28,38]},
        {id:"物理特化",chr:[27,36,5,8,35,41]},
        {id:"魔法特化",chr:[24,1,10,16,31]},
        {id:"敏捷さ",chr:[6,9,36,16,40,2]},
        {id:"殴り合い",chr:[24,33,10]},
        {id:"時空間",chr:[5,26,32]},
        {id:"精霊の加護",chr:[6,7,8]},
        {id:"魔族",chr:[27,28,29]},
        {id:"ナソード研究",chr:[12,13,14,24,42]},
        {id:"原初的な動き",chr:[0,9,21]},
        {id:"マナ守護",chr:[4,34,20]},
        {id:"属性鍛錬者",chr:[3,15,1,22]},
        {id:"巨人審判者",chr:[39,30,37,2,11,17]},
        {id:"探求する者",chr:[3,13,25,37,17,42]},
        {id:"渇望",chr:[4,19,31,23,26,29,32]},
        {id:"正義を貫徹する者",chr:[0,15,18,21,30]},
        {id:"痛いから問題ない",chr:[31,34,11,23,38]},
        {id:"戦場の天使",chr:[14,41]},
        {id:"貫徹する足取り",chr:[18]},
        {id:"豊かな足取り",chr:[19]},
        {id:"上手な足取り",chr:[20]},
        {id:"ラビィの友達",chr:[35]},
        {id:"機械工学",chr:[42]},
      ]
      var t;
      var s;
      var X
      var Y=120;
      for(var i=0; i<Sinagy.length; i++){
      X=110;
      t= new createjs.Text(Sinagy[i].id, "bold 16px Arial", "white");
      t.x=X-40;
      t.y=Y;
      yakumap.addChild(t);
      Y+=20;
      for(var j=0; j<Sinagy[i].chr.length ; j++){
        s= new createjs.Bitmap(eltear_src[Sinagy[i].chr[j]]);
        s.scaleX=1/2;
        s.scaleY=1/2;
        s.x=X-40;
        s.y=Y;
        yakumap.addChild(s);
        X+=65;
      };
      Y+=95;
      };
      t= new createjs.Text("↑ TOP ↑", "22px Arial", "white");
      t.x=X+120;
      t.y=Y+20;
      yakumap.addChild(t);
      // マスクを適用する
      yakumap.mask = shapeMask;
      }
  function Remaincheck(num=-1){
    //残パイ
    //num -1->リスト n~->指定パイのチェック
    var RemainPack=deck.concat(king);
    RemainPack=RemainPack.concat(hand2);
    RemainPack=RemainPack.concat(hand3);
    RemainPack=RemainPack.concat(hand4);
    RemainPack=RemainPack.concat(Extrash);
    switch(num){
      case -1:
        cx4.fillStyle = "rgba(20,20,20,0.7)";
        for(var i=0;i<45;i++){
          var X=Math.floor(i%9);
          var Y=Math.floor(i/9);
          var A=RemainPack.filter(value=>value==i)
          if(A.length){
            cx4.font = "26px Bold Arial";
            cx4.lineWidth=3;
            cx4.fillStyle = "black";
            cx4.strokeStyle ="rgba(250,250,250,0.9)";
            cx4.strokeText(A.length,60+60*X,150+78*Y)
            cx4.fillText(A.length,60+60*X,150+78*Y)
          }else{
            cx4.fillStyle = "rgba(20,20,20,0.7)";
            cx4.fillRect(40+60*X,100+78*Y,60,78)
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
    drawbuttom2(300,10,"シナジー",0,100,44,1);
    drawbuttom(400,10,"残パイリスト",0,130,44);
  }}
  function compareFunc(a,b){return a-b;}
  function compareFuncID(a,b){return(a.id - b.id);}  
  function compareFunc2(a,b){return(a.elia - b.elia);}  
  function compareFunc3(a,b){
    if(a>=42){return 1}else{return a%3-b%3;}}
  function AK(name){
    //実績系のなにか
      var A=achieveA.findIndex(value=>value.name==name);
      if(A!==-1){
        if(achieveA[A].cleared==0){
          achieveA[A].cleared=1;
        }
      }
    }
    function deckHandlerP(){
          //ホスト配牌
          if(IsHost(IAM.room)){
            //ホストで初期化するもの
            deck=[]
            hand1=[]
            hand2=[]
            hand3=[]
            hand4=[]
            for(var i =0; i<43; i++){
            deck.push(i);
            deck.push(i);
            }
            deck.push(43);
            deck.push(44);
            if(debugmode){console.log(deck.length);}
            //expected88
            //山シャッフル
            shuffle();
            //初手積み込み
            if(debugmode){console.log(parent);}
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
            if(debugmode){
            console.log(king);//嶺上牌
            console.log(hand1);//自分の手札
            console.log(hand2);
            console.log(hand3);
            console.log(hand4);
            }
            socket.emit("deck_handler",{room:RoomName[IAM.room],Deck:deck,Hand:{hand1,hand2,hand3,hand4},King:king,MPV:mpVelocity,PON:Ponrate,FEV:Fever} );
          };
      //ゲームスタート時の配牌と画面
      cx.clearRect(0,0,800,600)
      cx1.clearRect(0,0,800,600)
      cx2.clearRect(0,0,800,600)
      cx3.clearRect(0,0,800,600)
      cx4.clearRect(0,0,800,600)
      alpha=1
      //背景
      if(LP[0]==4){
        cx.drawImage(BGimg,0,300,400,300,0,0,800,600);
      }else{
      cx.drawImage(BGimg,0,0,400,300,0,0,800,600);
      }
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
      if(LP_PVP.Length[0]==1 && skillusage2[0]==4){
        cx1.fillText("オーラス"+(skillusage2[5]),10,88);
        auras=1;
      }else if(LP_PVP.Length[0]==2 && skillusage2[0]==8){
        cx1.fillText("オーラス"+(skillusage2[5]),10,88);
        auras=1;
      }else{cx1.fillText("第"+(skillusage2[0])+"局 "+(skillusage2[5])+"本場",10,88);
           }
           if(Fever>=0){
           cx1.font = "18px 'Century Gothic'";
           cx1.fillText("FEVER",160,84);
            var x=220;
            var y=68;
            cx1.fillStyle="#3d3d3d";
            cx1.clearRect(x,y,90,15);
            cx1.fillRect(x,y,90,15);
            cx1.fillStyle="#00ff66";
            cx1.fillRect(x,y,30*Fever,15);
            cx1.fillStyle="#99ed68";
            cx1.fillRect(x,y,30*Fever,5);;
            cx1.strokeStyle="#e3e3e3"
            cx1.strokeRect(x,y,30,15);
            cx1.strokeRect(x+30,y,30,15);
            cx1.strokeRect(x+60,y,30,15);;
            cx1.fillStyle ="white";
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
        case 7:
          Bgm =new Music(bgm7data);
          Bgm.playMusic();
        break;
        case 8:
          Bgm =new Music(bgm8data);
          Bgm.playMusic();
        break;
        case 9:
          Bgm =new Music(bgm9data);
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
      case 7:
        Bgm =new Music(bgm7data);
        Bgm.playMusic();
      break;
      case 8:
        Bgm =new Music(bgm8data);
        Bgm.playMusic();
      break;
      case 9:
        Bgm =new Music(bgm9data);
        Bgm.playMusic();
        break;
      default:
        console.log(musicnum,'bgm error!')
        Bgm.stop();
    }}};
      cx1.font = "16px 'Century Gothic'";
      cx1.fillText("ポン",640,425)
      cx1.fillText("リーチ",640,465)
      cx1.fillText("スキル",720,425)
      cx1.fillText("抜き",720,465)
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
      cx2.font = "16px 'Century Gothic'";
      if(LP[0]>=6 && LP[0]<10){
      cx2.fillStyle ="white";
      cx2.strokeStyle = '#eb5600';
      }else{
      cx2.fillStyle ="black";
      cx2.strokeStyle = 'white';
      }
      for(var i=1; i<skillswitch.length;i++){
        skillswitch[i]=1;
        }
        skillusage=new Array(0,0,0,0,0)
      if(LP_PVP.Rule[0]==2){
      for(var i=1; i<5 ; i++){//復活
        if(LP[i]<0){
        skillusage2[i]-=1;
        if(skillusage2[i] <=-1){
          LP[i]=75000;
          for (var I=0;I<4;I++){
            if(I!==i){
            death[i-1].Bdmg[i-1]+=death[i-1].Bdmg[I];
            death[i-1].Bdmg[I]=0;
            }
          }
        }}
          }}
      cx1.lineWidth = 3;
      cx1.lineJoin = 'round';
      cx2.lineWidth = 3;
      cx2.lineJoin = 'round';
      parentY =170
      cx2.strokeText(LP[2],80,parentY)
      cx2.fillText(LP[2],80,parentY)
      parentY +=100
      cx2.strokeText(LP[3],80,parentY)
      cx2.fillText(LP[3],80,parentY)
      parentY +=100
      cx2.strokeText(LP[4],80,parentY)
      cx2.fillText(LP[4],80,parentY)
      parentY +=100
      cx2.strokeText(LP[1],80,parentY)
      cx2.fillText(LP[1],80,parentY)
      parentY +=100
      cx1.font = "bold 16px 'Century Gothic'";
      cx1.fillStyle ="black";
      cx1.strokeStyle = 'white';
      cx1.lineWidth = 3;
      cx1.lineJoin = 'round';
        var y=125
        if(MEMBER[1].pc==0){cx1.fillStyle = 'black';}else{cx1.fillStyle = 'darkred';}
        cx1.strokeText(MEMBER[1].name,40, y);
        cx1.fillText(MEMBER[1].name,40, y);
        y+=100;
        if(MEMBER[2].pc==0){cx1.fillStyle = 'black';}else{cx1.fillStyle = 'darkred';}
        cx1.strokeText(MEMBER[2].name,40, y);
        cx1.fillText(MEMBER[2].name,40, y);
        y+=100;
        if(MEMBER[3].pc==0){cx1.fillStyle = 'black';}else{cx1.fillStyle = 'darkred';}
        cx1.strokeText(MEMBER[3].name,40, y);
        cx1.fillText(MEMBER[3].name,40, y);
        y+=100;
        if(MEMBER[0].pc==0){cx1.fillStyle = 'black';}else{cx1.fillStyle = 'darkred';}
        cx1.strokeText(MEMBER[0].name,40, y);
        cx1.fillText(MEMBER[0].name,40, y);
      cx1.font = "18px 'Century Gothic'";
      cx1.fillStyle ="white";
      cx1.strokeStyle ="#d92100"
      parentY =25+100*parent
      if(parent==0){parentY=425};
      cx1.strokeText("親",10,parentY)
      cx1.fillText("親",10,parentY)
      parentY -=8
      cx1.beginPath () ;
      cx1.arc( 20, parentY, 16, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
      cx1.strokeStyle = "red" ;
      cx1.lineWidth = 2 ;
      cx1.stroke();
      cx2.fillStyle = "rgba(20,20,20,0.5)";
      cx2.fillRect(630,400,160,80)
      //初期化
      dora=[];
      handtemp=[]
      tumotemp=0;
      cpuwant =0
      Ronturn=[];
      trash1=[]
      trash2=[]
      trash3=[]
      trash4=[]
      Extrash=[];
      c1=0
      opLock=0;
      raidscore=[0,0,0,0,0];
      //ポンポポン
      ponsw=[0,0,0,0,0]
      poncpu=[0,Ponrate,Ponrate,Ponrate,Ponrate]
      pon1=[];
      pon2=[];
      pon3=[];
      pon4=[];
      ctl=new Array(0,0,2,2,2)
      ctlerror=new Array(0,0,0,0,0)
      cLock = 0;
      //clock0->反応させない　1以上->操作を許可 2->リーチからのパイ切り？ 3->スキルキーからのパイ切り
      han =new Array(0,0,0,0,0)
      reach =new Array(0,0,0,0,0)
      nuki =new Array(0,0,0,0,0);
      nukiswitch =new Array(0,0,0,0,0);
      ippatu =new Array(0,0,0,0,0)
      rorder =new Array(0,0,0,0,0)
      porder =new Array(0,0,0,0,0)
      for(var i=1; i<5;i++){
      if(LP[i]<=0){rorder[i]=2}else{rorder[i]=0}
      }
      counter=new Array(0,0,0,0,0)
      riverx=new Array(0,120,120,120,120)
      rivery=new Array(0,400,100,200,300)
      drawDP(1)
      drawDP(2)
      drawDP(3)
      drawDP(4)
      Buff =new Array(0,[],[],[],[])
      if(LP[0]==4){
        var K=5-skillusage2[0];
        if(K>0){;
      for (var i=1;i<Buff.length;i++){
        for(var j=0;j<K;j++){
      Buff[i].push(7);
      }}}
    }
      Buffdraw();
    //playmaker
    dora.push(king[0])
    if(debugmode){console.log(dora)}
    dorax=60
    if(Fever>=3){
      console.log('fever!',Fever);
      Clvup.alpha=0;
      Clvup.x=-400;
      Clvup.y=0;
      se12.play();
      createjs.Tween.get(Clvup)
      .to({x:40,alpha:1},200)
      .to({alpha:0},300)
      .to({alpha:1},300)
      .to({alpha:0},100)
      .to({alpha:1},100)
      .to({alpha:0},100)
      .to({alpha:1},100)
      .to({alpha:0},100)
      .to({alpha:1},100)
      .to({alpha:0},100)
      .to({alpha:1},100)
      .to({scaleX:1.5,scaleY:1.5,x:-120,y:-10},300,createjs.Ease.backOut)
      .to({scaleX:1,scaleY:1,x:800,y:0,alpha:0},200,createjs.Ease.cubicIn)
      .call(feverTime);
function feverTime (){
  var DD=dora[dora.length-1]+1
  if(DD>=45){DD=0;}
  e7.src=eltear_src[DD]
e7.onload=function(){
cx1.drawImage(e7,dorax,10,33,43.5)
      dora.push(king[1]);
    var DD=dora[dora.length-1]+1
    if(DD>=45){DD=0;}
    e7.src=eltear_src[DD]
  e7.onload=function(){
  dorax+=40
  cx1.drawImage(e7,dorax,10,33,43.5)
  dora.push(king[2]);
  var DD=dora[dora.length-1]+1
  if(DD>=45){DD=0;}
  e7.src=eltear_src[DD]
e7.onload=function(){
dorax+=40
cx1.drawImage(e7,dorax,10,33,43.5)
dora.push(king[3]);
var DD=dora[dora.length-1]+1
if(DD>=45){DD=0;}
e7.src=eltear_src[DD]
e7.onload=function(){
dorax+=40
cx1.drawImage(e7,dorax,10,33,43.5)
    Fever=0;
    handgraph(-1,1);
    decklength();  
}}}}
};
    }else{
      handgraph(-1,1);
      decklength();
    }
      //player1();
      turn =parent
      for(var i=0;i<MEMBER.length;i++){
        MEMBER[i].turnflag=0;
      };
      MEMBER[parent].turnflag=1;
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      parent +=1
      if(parent ==4){parent =0}
      ctl[turn+1]=0
      }}}}
      };
  
      function deckHandler(){
        //ゲームスタート時の配牌と画面
        if(pvpmode==1){
          deckHandlerP();
          return false;
        }
        cx.clearRect(0,0,800,600)
        cx1.clearRect(0,0,800,600)
        cx2.clearRect(0,0,800,600)
        cx3.clearRect(0,0,800,600)
        cx4.clearRect(0,0,800,600)
        alpha=1
        //背景
        if(LP[0]==4){
        cx.drawImage(BGimg,0,300,400,300,0,0,800,600);
        }else{
        cx.drawImage(BGimg,0,0,400,300,0,0,800,600);
        }
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
        //}else if(LP[0]==2 && skillusage2[0]==16){
          //cx1.fillText("オーラス"+(skillusage2[5]),10,88);
          //auras=1;
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
          case 7:
            Bgm =new Music(bgm7data);
            Bgm.playMusic();
          break;
          case 8:
            Bgm =new Music(bgm8data);
            Bgm.playMusic();
          break;
          case 9:
            Bgm =new Music(bgm9data);
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
        case 7:
          Bgm =new Music(bgm7data);
          Bgm.playMusic();
        break;
        case 8:
          Bgm =new Music(bgm8data);
          Bgm.playMusic();
        break;
        case 9:
          Bgm =new Music(bgm9data);
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
        cx1.fillText("抜き",720,465)
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
        cx2.font = "16px 'Century Gothic'";
        if(LP[0]>=6 && LP[0]<10){
        cx2.fillStyle ="white";
        cx2.strokeStyle = '#eb5600';
        }else{
        cx2.fillStyle ="black";
        cx2.strokeStyle = 'white';
        }
        for(var i=1; i<skillswitch.length;i++){
          skillswitch[i]=1;
          }
          skillusage=new Array(0,0,0,0,0)
        if(LP[0]==2){
        for(var i=1; i<5 ; i++){//復活
          if(LP[i]<0){
          skillusage2[i]-=1;
          if(skillusage2[i] <=-1){
            LP[i]=75000;
          }}
            }}
        cx1.lineWidth = 3;
        cx1.lineJoin = 'round';
        cx2.lineWidth = 3;
        cx2.lineJoin = 'round';
        parentY =170
        cx2.strokeText(LP[2],80,parentY)
        cx2.fillText(LP[2],80,parentY)
        parentY +=100
        cx2.strokeText(LP[3],80,parentY)
        cx2.fillText(LP[3],80,parentY)
        parentY +=100
        cx2.strokeText(LP[4],80,parentY)
        cx2.fillText(LP[4],80,parentY)
        parentY +=100
        cx2.strokeText(LP[1],80,parentY)
        cx2.fillText(LP[1],80,parentY)
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
        cx1.stroke();
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
        Extrash=[];
        c1=0
        opLock=0;
        raidscore=[0,0,0,0,0];
        //ポンポポン
        ponsw=[0,0,0,0,0]
        poncpu=[0,Ponrate,Ponrate,Ponrate,Ponrate]
        pon1=[];
        pon2=[];
        pon3=[];
        pon4=[];
        ctl=new Array(0,0,2,2,2)
        ctlerror=new Array(0,0,0,0,0)
        cLock = 0;
        //clock0->反応させない　1以上->操作を許可 2->リーチからのパイ切り？ 3->スキルキーからのパイ切り
        han =new Array(0,0,0,0,0)
        reach =new Array(0,0,0,0,0)
        nuki =new Array(0,0,0,0,0);
        nukiswitch =new Array(0,0,0,0,0);
        ippatu =new Array(0,0,0,0,0)
        rorder =new Array(0,0,0,0,0)
        porder =new Array(0,0,0,0,0)
        for(var i=1; i<5;i++){
        if(LP[i]<=0){rorder[i]=2}else{rorder[i]=0}
        }
        counter=new Array(0,0,0,0,0)
        riverx=new Array(0,120,120,120,120)
        rivery=new Array(0,400,100,200,300)
        //DP =new Array(0,0,0,0,0)
        drawDP(1)
        drawDP(2)
        drawDP(3)
        drawDP(4)
        Buff =new Array(0,[],[],[],[])
        if(LP[0]==4){
          var K=5-skillusage2[0];
          if(K>0){;
        for (var i=1;i<Buff.length;i++){
          for(var j=0;j<K;j++){
        Buff[i].push(7);
        }}}
      }
        Buffdraw();
        for(var i =0; i<43; i++){
        deck.push(i);
        deck.push(i);
        }
        deck.push(43);
        deck.push(44);
        if(debugmode){console.log(deck.length);}
        //expected88
        //山シャッフル
        shuffle();
        //初手積み込み
        if(debugmode){console.log(parent);}
        if(chara[1]==3 && parent==2){
          console.log("NF 1")
          for(var i=0;i<5;i++){
          var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
          var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand1.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[2]==3 && parent==3){
          console.log("NF 2")
          for(var i=0;i<5;i++){
            var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
            var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand2.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[3]==3 && parent==0){
          console.log("NF 3")
          for(var i=0;i<5;i++){
            var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
            var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand3.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[4]==3 && parent==1){
          console.log("NF 4")
          for(var i=0;i<5;i++){
            var A=deck.findIndex(value=>(value>=6 && value<=8)||(value>=39 && value<=42))
            var B=[1,0.9,0.6,0.3,0.2];
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
        if(debugmode){
          console.log(king);//嶺上牌
        console.log(hand1);//自分の手札
        console.log(hand2);
        console.log(hand3);
        console.log(hand4);
        }
        dora.push(king[0])
        if(debugmode){console.log(dora)}
      dorax=60
      handgraph(-1,1);
      decklength();
      turn =parent
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      parent +=1
      if(parent ==4){parent =0}
      ctl[turn+1]=0;
        }}}}
  };
      function Buffdraw(){
      console.log('Buffdraw')
     //バフアイコンを描画する
     //どうせ大したことなさそうなので全員描画
     var x=[0,120,120,120,120];
     var y=[0,430,130,230,330];
     for(var i=1;i<5;i++){
      //x=[0,120,120,120,120];
     cx2.clearRect(0,y[i],150,20);
    if(LP[i]<0){
        cx2.drawImage(donicon,150,0,30,30,x[i],y[i],20,20);
        x[i]-=20;
    }
     if(Buff[i].length>0){
    var A=Buff[i].filter(value=>value==1);
    var B=Buff[i].filter(value=>value==2);
    var C=Buff[i].filter(value=>value==3);
    var D=Buff[i].filter(value=>value==4);
    var E=Buff[i].filter(value=>value==5);
    var F=Buff[i].filter(value=>value==6);
    var G=Buff[i].filter(value=>value==11);
    var H=Buff[i].filter(value=>value==7);
    if(G.length>0){
      cx2.drawImage(donicon,150,0,30,30,x[i],y[i],20,20);
      x[i]-=20;
    };
    if(H.length>0){
      cx2.drawImage(donicon,210,0,30,30,x[i],y[i],20,20);
      cx2.font = "8px Arial";
      cx2.fillStyle = "white";
      cx2.fillText(H.length, x[i]+12,y[i]+20);
      x[i]-=20;
    };
        if(A.length>0){
        cx2.drawImage(donicon,0,0,30,30,x[i],y[i],20,20);
        cx2.font = "8px Arial";
        cx2.fillStyle = "white";
        cx2.fillText(A.length, x[i]+12,y[i]+20);
        x[i]-=20;
      };
          if(B.length>0){
          cx2.drawImage(donicon,90,0,30,30,x[i],y[i],20,20);
          cx2.font = "8px Arial";
          cx2.fillStyle = "white";
          cx2.fillText(B.length, x[i]+12,y[i]+20);
          x[i]-=20;
        };
            if(C.length>0){
            cx2.drawImage(donicon,60,0,30,30,x[i],y[i],20,20);
            cx2.font = "8px Arial";
            cx2.fillStyle = "white";
            cx2.fillText(C.length, x[i]+12,y[i]+20);
            x[i]-=20;
          };
          if(D.length>0){
            cx2.drawImage(donicon,180,0,30,30,x[i],y[i],20,20);
            cx2.font = "8px Arial";
            cx2.fillStyle = "white";
            cx2.fillText(D.length, x[i]+12,y[i]+20);
            x[i]-=20;
          };
            if(E.length>0){
            cx2.drawImage(donicon,120,0,30,30,x[i],y[i],20,20);
            cx2.font = "8px Arial";
            cx2.fillStyle = "white";
            cx2.fillText(E.length, x[i]+12,y[i]+20);
            x[i]-=20;
          };
            if(F.length>0){
            cx2.drawImage(donicon,30,0,30,30,x[i],y[i],20,20);
            cx2.font = "8px Arial";
            cx2.fillStyle = "white";
            cx2.fillText(F.length, x[i]+12,y[i]+20);
            x[i]-=20;
          };
    }};
    };
    socket.on("deck-length", (data)=>{
      if(IAM.token!== data.Token){
        deck=data.Deck.concat();
        decklength();
      };
      });
    socket.on("tumo-pai", (data)=>{
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        tumo2=data.Tumo;
        TumoRon(N,0);
      };
      });
    socket.on("ron-pai", (data)=>{
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        if(debugmode){console.log('ron-pai',N);}
      if(data.status){
        Ronturn.push(N);
      };
      rorder[N]=1;
      switch(N){
        case 2:
          hand2[0]=-1;
          break;
        case 3:
          hand3[0]=-1;
          break;
        case 4:
          hand4[0]=-1;
          break;
        default:
          hand1[0]=-1;
          break;
      }
      turn=turntemp;
      turnchecker();
      }
    });
    socket.on("pon-pai", (data)=>{
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        if(debugmode){console.log('pon-pai',N,data.status);}
      if(data.status){
        Pon(N,tumotemp);
      }else{
        switch(N){
          case 2:
            ponsw[N]=pon2.length;
            break;
          case 3:
            ponsw[N]=pon3.length;
            break;
          case 4:
            ponsw[N]=pon4.length;
            break;
          default:
            ponsw[N]=pon2.length;
            break;
        }
        ponsw[0]=1;
        turnchecker();
      }
      }
    });
      function turnchecker(){
        console.log('turncheckerP'+turn,ponsw[0])
      //pvpmode1の場合、ホストだけでチェックを行い、
      //プレイヤーのロン・ポン判定はそのプレイヤーになすりつける
      //CPUはロンできる時は必ずロンするため無視
      //CPUのポンはランダム要素があるためホスト側で決定する
        if(nuki[0]>0){
          var Fr1=Buff[1].findIndex(value=>value==6 || value==11);
          var Fr2=Buff[2].findIndex(value=>value==6 || value==11);
          var Fr3=Buff[3].findIndex(value=>value==6 || value==11);
          var Fr4=Buff[4].findIndex(value=>value==6 || value==11);
          if(rorder[1] !==2){
          if(rorder[1]==0 && turn !==0 && Fr1==-1 && ManaBreak==0){ron(1)};
          if(rorder[2]==0 && turn !==1 && Fr2==-1 && ManaBreak==0){ron(2)}
          if(rorder[3]==0 && turn !==2 && Fr3==-1 && ManaBreak==0){ron(3)}
          if(rorder[4]==0 && turn !==3 && Fr4==-1 && ManaBreak==0){ron(4)}
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
          //ron(2)
          turntemp=turn
          turn=5
          if(pvpmode==1 && MEMBER[1].pc==1){
            console.log('player2 waiting');
          }else{
          cpu(2);
          }
          }else if(hand3[0]==-2){
          //ron(3)
          turntemp=turn
          turn=6
          if(pvpmode==1 && MEMBER[2].pc==1){
            console.log('player3 waiting');
          }else{
          cpu(3);
          }
          }else if(hand4[0]==-2){
          //ron(4)
          turntemp=turn
          turn=7
          if(pvpmode==1 && MEMBER[3].pc==1){
            console.log('player3 waiting');
          }else{
          cpu(4);
          }
          }else{
              //ロン処理
            if(Ronturn.length>0){
              setTimeout(function(){
                TumoRon(Ronturn[0],turn+1);
                Ronturn.shift();
                }, 550);
              return false;
            }
            //ターンを回す
          turn =nuki[0]-1;
          if(pvpmode==1){
            if(nuki[0]==0){
            for(var i=0;i<MEMBER.length;i++){
              MEMBER[i].turnflag=0;
            }
            MEMBER[turn].turnflag=1;
          }}
          console.log(turn,Ronturn)
          Buffdraw();
          turnrole();
          }
          return false;
        }
        //捨て牌で誰も上がらないならターンを回す
        //ロン＞ポン
        //だれもロンしないなら隣の人がポンするか判定
        var Fr1=Buff[1].findIndex(value=>value==6 || value==11);
        var Fr2=Buff[2].findIndex(value=>value==6 || value==11);
        var Fr3=Buff[3].findIndex(value=>value==6 || value==11);
        var Fr4=Buff[4].findIndex(value=>value==6 || value==11);
        if(rorder[1] !==2){
        if(rorder[1]==0 && turn !==0 && Fr1==-1 && ManaBreak==0){ron(1)};
        if(rorder[2]==0 && turn !==1 && Fr2==-1 && ManaBreak==0){ron(2)}
        if(rorder[3]==0 && turn !==2 && Fr3==-1 && ManaBreak==0){ron(3)}
        if(rorder[4]==0 && turn !==3 && Fr4==-1 && ManaBreak==0){ron(4)}
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
        //ron(2)
        turntemp=turn
        turn=5
        if(pvpmode==1 && MEMBER[1].pc==1){
          console.log('player2 waiting');
        }else{
        cpu(2);
        }
        }else if(hand3[0]==-2){
        //ron(3)
        turntemp=turn
        turn=6
        if(pvpmode==1 && MEMBER[2].pc==1){
          console.log('player3 waiting');
        }else{
        cpu(3);
        }
        }else if(hand4[0]==-2){
        //ron(4)
        turntemp=turn
        turn=7
        if(pvpmode==1 && MEMBER[3].pc==1){
          console.log('player3 waiting');
        }else{
        cpu(4);
        }
        }else{
          //ロン処理
          if(Ronturn.length>0){
            setTimeout(function(){
              TumoRon(Ronturn[0],turn+1);
              Ronturn.shift();
              }, 550);
            return false;
          }
          //次の人のポンへ
          if(turn==0 && ponsw[0]==0 && Fr2==-1 && LP[2]>=0 && ManaBreak==0){
          //可能な限りポン->ライン揃えに行く場合はポンしない
            if(Pon(2)){
              if(pvpmode==1){
                if(MEMBER[1].pc==1){
                console.log('player waiting');
                return false;
              }else if(IsHost(IAM.room)){
                var R=Math.random();
                if(R>poncpu[2]){
                    socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[1].id,status:true});
                    Pon(2,tumotemp);
                return false;
              }else{
                  socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[1].id,status:false});
                ponsw[2]=pon2.length;
              }}else{
                return false;
              }
            }else{
              var R=Math.random();
              if(R>poncpu[2]){
              Pon(2,tumotemp);
              return false;
            }else{
              ponsw[2]=pon2.length;
            }
          }}
          };
          if(turn==1 && ponsw[0]==0 && Fr3==-1 && LP[3]>=0 && ManaBreak==0){
            if(Pon(3)){
              if(pvpmode==1){
                if(MEMBER[2].pc==1){
                console.log('player waiting');
                return false;
              }else if(IsHost(IAM.room)){
                var R=Math.random();
                if(R>poncpu[3]){
                  Pon(3,tumotemp);
                    socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[2].id,status:true});
                return false;
              }else{
                  socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[2].id,status:false});
                ponsw[3]=pon3.length;
              }}else{
              return false;
              }
              }else{
              var R=Math.random();
              if(R>poncpu[3]){
              Pon(3,tumotemp);
              return false;
            }else{
              ponsw[3]=pon3.length;
            }
            }}
          }
          if(turn==2 && ponsw[0]==0 && Fr4==-1 && LP[4]>=0 && ManaBreak==0){
            if(Pon(4)){
              if(pvpmode==1){
                if(MEMBER[3].pc==1){
                console.log('player waiting');
                return false;
              }else if(IsHost(IAM.room)){
                var R=Math.random();
                if(R>poncpu[4]){
                  Pon(4,tumotemp);
                    socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[3].id,status:true});
                return false;
              }else{
                  socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[3].id,status:false});
                ponsw[4]=pon4.length;
              }}else{
              return false;
              }
              }else{
              var R=Math.random();
              if(R>poncpu[4]){
              Pon(4,tumotemp);
              return false;
            }else{
              ponsw[4]=pon4.length;
            }
            }}
          }
          if(turn==3 && ponsw[0]==0 && Fr1==-1 && LP[1]>=0 && ManaBreak==0){
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
          if(pvpmode==1){
          if(IsHost(IAM.room)){
            socket.emit("ryukyoku", {Token:IAM.token,room:RoomName[IAM.room]});
            ryukyoku();
        };
      }else{
        ryukyoku();
      }
        }else{
        //飛んだ人を飛ばす
        turn +=1;
        if(ManaBreak>0){
          ManaBreak=0};
        switch(turn){
          case 1:
            var Freeze=Buff[2].filter(value=>value==6 || value==11)
            if(Freeze.length>0 || LP[2]<0){
              var F=Buff[2].findIndex(value=>value==6)
              if(F!==-1){
              Buff[2].splice(F,1)
              }
              turn+=1;ctl[3]=0;
              Freeze=Buff[3].filter(value=>value==6 || value==11)
              if(Freeze.length>0 || LP[3]<0){
                var F=Buff[3].findIndex(value=>value==6)
                if(F!==-1){
                Buff[3].splice(F,1)
                }
                turn+=1;ctl[4]=0;
                Freeze=Buff[4].filter(value=>value==6 || value==11)
                if(Freeze.length>0 || LP[4]<0){
                  var F=Buff[4].findIndex(value=>value==6)
                  if(F!==-1){
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
            var Freeze=Buff[3].filter(value=>value==6 || value==11)
            if(Freeze.length>0 || LP[3]<0){
              var F=Buff[3].findIndex(value=>value==6)
              if(F!==-1){
              Buff[3].splice(F,1)
              }
              turn+=1;ctl[4]=0;
              Freeze=Buff[4].filter(value=>value==6 || value==11)
              if(Freeze.length>0 || LP[4]<0){
                var F=Buff[4].findIndex(value=>value==6)
                if(F!==-1){
                Buff[4].splice(F,1)
                }
                turn=0
              Freeze=Buff[1].filter(value=>value==6 || value==11)
              if(Freeze.length>0 || LP[1]<0){
                var F=Buff[1].findIndex(value=>value==6)
                if(F!==-1){
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
            var Freeze=Buff[4].filter(value=>value==6 || value==11)
            if(Freeze.length>0 || LP[4]<0){
              var F=Buff[4].findIndex(value=>value==6)
              if(F!==-1){
              Buff[4].splice(F,1)
              }
              turn=0;
              Freeze=Buff[1].filter(value=>value==6 || value==11)
              if(Freeze.length>0 || LP[1]<0){
                var F=Buff[1].findIndex(value=>value==6)
                if(F!==-1){
                Buff[1].splice(F,1)
                }
                turn+=1;ctl[2]=0;
                Freeze=Buff[2].filter(value=>value==6 || value==11)
            if(Freeze.length>0 || LP[2]<0){
              var F=Buff[2].findIndex(value=>value==6)
              if(F!==-1){
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
              var Freeze=Buff[1].filter(value=>value==6 || value==11)
              if(Freeze.length>0 || LP[1]<0){
                var F=Buff[1].findIndex(value=>value==6)
                if(F!==-1){
                Buff[1].splice(F,1)
                }
                turn+=1;ctl[2]=0;
                Freeze=Buff[2].filter(value=>value==6 || value==11)
            if(Freeze.length>0 || LP[2]<0){
              var F=Buff[2].findIndex(value=>value==6)
              if(F!==-1){
              Buff[2].splice(F,1)
              }
              turn+=1;ctl[3]=0;
              Freeze=Buff[3].filter(value=>value==6 || value==11)
            if(Freeze.length>0 || LP[3]<0){
              var F=Buff[3].findIndex(value=>value==6)
              if(F!==-1){
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
        if(pvpmode==1){
          for(var i=0;i<MEMBER.length;i++){
            MEMBER[i].turnflag=0;
          }
          MEMBER[turn].turnflag=1;
        }
        console.log(turn,Ronturn)
        Buffdraw();
        turnrole();
        }
        }}
  
      socket.on("throwed-pai", (data)=>{
        if(debugmode){console.log('throwed-pai',data,IAM.mwah);}
        //非送信者なら2行目の内容を更新する
        //"throwed_pai",{Num:1,Player:1,Token:IAM.token,
        //Tumotemp:tumotemp,Reach:reach,Ippatu:ippatu});
        if(IAM.token!== data.Token){
          var I=MEMBER.findIndex(value=>value.token==data.Token);
          nuki[0]=data.Nuki[0];
          ManaBreak=data.mb;
          switch(I){
            case 3:
              hand1=data.Hand.hand2.concat();
              hand2=data.Hand.hand3.concat();
              hand3=data.Hand.hand4.concat();
              hand4=data.Hand.hand1.concat();
              for(var i=1;i<4;i++){
                reach[i]=data.Reach[i+1];
                DP[i]=data.Dp[i+1];
                ippatu[i]=data.Ippatu[i+1];
                nuki[i]=data.Nuki[i+1];
              }
              reach[4]=data.Reach[1];
              DP[4]=data.Dp[1];
              ippatu[4]=data.Ippatu[1];
              nuki[4]=data.Nuki[1];
              break;
            case 2:
              hand1=data.Hand.hand3.concat();
              hand2=data.Hand.hand4.concat();
              hand3=data.Hand.hand1.concat();
              hand4=data.Hand.hand2.concat();
              for(var i=1;i<3;i++){
                reach[i]=data.Reach[i+2];
                reach[i+2]=data.Reach[i];
                DP[i]=data.Dp[i+2];
                DP[i+2]=data.Dp[i];
                nuki[i]=data.Nuki[i+2];
                nuki[i+2]=data.Nuki[i];
                ippatu[i]=data.Ippatu[i+2];
                ippatu[i+2]=data.Ippatu[i];
              }
              break;
            case 1:
              hand1=data.Hand.hand4.concat();
              hand2=data.Hand.hand1.concat();
              hand3=data.Hand.hand2.concat();
              hand4=data.Hand.hand3.concat();
              for(var i=2;i<5;i++){
                reach[i]=data.Reach[i-1];
                DP[i]=data.Dp[i-1];
                ippatu[i]=data.Ippatu[i-1];
                nuki[i]=data.Nuki[i-1];
              }
              reach[1]=data.Reach[4];
              DP[1]=data.Dp[4];
              ippatu[1]=data.Ippatu[4];
              nuki[1]=data.Nuki[4];
              break;
            default:
              console.log('member error',I)
                hand1=data.Hand.hand1.concat();
                hand2=data.Hand.hand2.concat();
                hand3=data.Hand.hand3.concat();
                hand4=data.Hand.hand4.concat();
                reach=data.Reach.concat();
                DP=data.Dp.concat();
                ippatu=data.Ippatu.concat();
                nuki=data.Nuki.concat();
                break;
          }
        };
        var N=1+MEMBER.findIndex(value=>value.id==data.who)
        tumotemp=data.Tumotemp;
        if(N>4){N-=4};
    //manabreak
    if(ManaBreak>0){
      e15.src=chrimg_src[chara[N]]
      e15.onload=function(){
        var B=450;
        switch(N){
          case 2:
            B=150;
            break;
          case 3:
            B=250;
            break;
          case 4:
            B=350;
            break;
        }
        console.log(N,B);
      loopX=0
      loopX2=0;
      alpha=1;
      se12.play();
      window.requestAnimationFrame((ts)=>ManaAnimation(ts,0,B));
      };
    }else{
        handgraph(data.Num,N);
    };
    function ManaAnimation(ts,A=0,B=100){
        cx4.globalAlpha = alpha;
        A+=1;
        loopX+=3
        loopX2+=50
        var x=loopX*4
        var xx=loopX*3
        if(xx>50){xx=50};
        if(x>=800){loopX=0}
        if(loopX2>=150){loopX2=150}
        cx4.clearRect(0,0,800,600)
        cx4.fillStyle = "#001c0d";
        cx4.fillRect(0,B-xx,200,xx*2);
        cx4.drawImage(e15,400,200-xx,300,xx*2,loopX2-250,B-xx,300,xx*2)
        cx4.strokeStyle = "white";
        cx4.lineWidth = 5;
        cx4.beginPath();
        cx4.moveTo(0,B-xx);
        cx4.lineTo(200,B-xx);
        cx4.stroke();
        cx4.beginPath();
        cx4.moveTo(0,B+xx);
        cx4.lineTo(200,B+xx);
        cx4.stroke();
        cx4.drawImage(MBicon,160,B-100,200,100);
        if(alpha>0){
        if(A<45){window.requestAnimationFrame((ts)=>ManaAnimation(ts,A,B));}else{
        alpha -=0.1
        window.requestAnimationFrame((ts)=>ManaAnimation(ts,A,B));}
        }else if(alpha <=0){
        cx4.clearRect(0,0,800,600);
        cx4.globalAlpha = 1;
        handgraph(data.Num,N);
        }
      };  
      })
  function handgraph(num,player){
    console.log('handgraph',num,player,tumotemp)
      if(num>0){
      //e5を使って捨て牌の描写してアガリ判定後ターンを進める
      se4.play();
      //ポン、カンしたパイかく
      //マナブレパイを塗りつぶす
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
      if(chara[player]==3 && pvpmode==0){
        if((tumotemp>=6 && tumotemp<=8)||(tumotemp>=39 && tumotemp<=42)){
          var MS=Buff[player].filter(value=>value==2)
          if(MS.length<3){Buff[player].push(3)}
        };
        }
      if(chara[player]==2 && pvpmode==0){
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
      if(ManaBreak==1){
        if(player==1){
      cx1.fillStyle = "rgba(20,20,20,0.5)";
        }else{
      cx1.fillStyle = "rgba(20,20,20,1)";
      Extrash.push(tumotemp);
        }
      cx1.fillRect(riverx[player],rivery[player],33,43.5)
      cx1.fillStyle = "darkred";
      cx1.font = "bold 26px 'Century Gothic'";
      cx1.fillText("X",riverx[player]+5,rivery[player]+35);
      }
      cx1.translate(-10.5+riverx[player], 33+rivery[player])
      cx1.rotate(-90 * Math.PI / 180);
      cx1.translate(-riverx[player], -rivery[player])
      counter[player] +=1;
      if(player==parent){DP[player] +=mpVelocity*1.2}else{DP[player] +=mpVelocity};
      if(DP[player]>30){DP[player]=30}
      drawDP(player);
      console.log(player)
      if(chara[player]==1 && pvpmode==0){Buff[player].push(1)};
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
          case 7:
            Bgm =new Music(bgm7data);
            Bgm.playMusic();
          break;
          case 8:
            Bgm =new Music(bgm8data);
            Bgm.playMusic();
          break;
          case 9:
            Bgm =new Music(bgm9data);
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
      if(ManaBreak==1){
      if(player==1){
        cx1.fillStyle = "rgba(20,20,20,0.5)";
          }else{
        cx1.fillStyle = "rgba(20,20,20,1)";
        Extrash.push(tumotemp);
          }
          cx1.fillRect(riverx[player],rivery[player],33,43.5)
          cx1.fillStyle = "darkred";
          cx1.font = "bold 26px 'Century Gothic'";
          cx1.fillText("X",riverx[player]+5,rivery[player]+35);
          }
      counter[player] +=1
      if(player==parent){DP[player] +=mpVelocity*1.2}else{DP[player] +=mpVelocity};
      if(DP[player]>30){DP[player]=30}
      drawDP(player);
      turnchecker();
      }}
      }
      if(num ==0){
      reachhand=[];
      var ponnum=pon1.length;
      reachhand=hand1.concat(pon1);
      var H=reachhand.findIndex(value=>value==100);
      if(H !==-1){
      reachhand.splice(H,1)
      }
      console.log(reachhand,ponnum)
      //handE1-handE9　reachhandをポン時に出した方が計算量減るかモ
      hand1x =100
      hand2x =hand1x+size*3
      hand3x =hand2x+size*3
      var h=1
      var c=4
      var d=7
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
      if(H ==-1){
        handE9.src=eltear_src[reachhand[9]]
        handE9.onload=function(){
          cx3.clearRect(hand1x+size*8,499,size,110)
          if(pon1.length>0){
            //一番右のポン
            if(ponsw[1]==1){
          cx1.clearRect(590,450,33,43.5)
          cx1.drawImage(handE9,590,450,33,43.5);
          cx1.fillStyle = "rgba(20,20,20,0.2)";
          cx1.fillRect(590,450,33,43.5)
            }
        }else{
          handE9.src=eltear_src[hand1[hand1.length-1]]
          handE9.onload=function(){
          //たぶんこ↑こ↓出番ない
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
          if(ponsw[1]==1){
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
          if(ponsw[1]==1){
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
          if(ponsw[1]==1){
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
          if(ponsw[1]==1){
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
          if(ponsw[1]==1){
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
          if(ponsw[1]==1){
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
          if(ponsw[1]==1){
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
        console.log(hand1);
        hand1x =100
        hand2x =hand1x+size*3
        hand3x =hand2x+size*3
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
  function Setup(pvp=0){
    //デュエル開始の宣言をする pvp時1に
    if(pvp==0){
      pvpmode=0;
      se1.play();
    }else{
        if(pvpmode!==1){
          pvpmode=1;
          se1.play();
      }};
    console.log('Setup',pvp);//socketで飛ばすとなんか3回くらい呼び出される
    navisw=0;
    if(Fever!==-1){Fever=0};
    DP =new Array(0,0,0,0,0)
    skillusage2=new Array(0,-1,-1,-1,-1,0)
    death=[
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    ];
    scoretemp=[0,0,0,0,0,0]
    achievetemp=[];
    for(var i=0 ; i<achievetempB.length; i++){
      achievetempB[i].count=0;
    }
    BGimg.src=bgimg_src[bgimg_src[0]]
    BGimg.onload=function(){
    if(pvp==0){parent= Math.floor(Math.random()*4);
    switch(LP[0]){
      case 0:
        for(var i=1;i<LP.length;i++){LP[i]=150000}
        break;
      case 1:
        for(var i=1;i<LP.length;i++){LP[i]=300000}
        mode=1;
        break;
      case 2:
        for(var i=1;i<LP.length;i++){LP[i]=100000}
        mode=1;
        break;
      case 4:
        for(var i=1;i<LP.length;i++){LP[i]=150000}
        break;
      default:
        mode=1;
      }
    }
    if(pvp==1){
      switch(LP_PVP.LP[0]){
        case 1:
          for(var i=1;i<LP.length;i++){LP[i]=75000}
          break;
        case 2:
          for(var i=1;i<LP.length;i++){LP[i]=150000}
          break;
        case 3:
          for(var i=1;i<LP.length;i++){LP[i]=300000}
          break;
        }
      if(LP_PVP.Block[0]==2){mode=1;}else{mode=0};
      }
      if(pvp==1 && !IsHost(IAM.room)){return false};
      if(pvp==1 && IsHost(IAM.room)){
        parent= Math.floor(Math.random()*4);
        MEMBER=[];
        //メンバーに追加
        //console.log(memberlist[0])
        //Room1.push({id:0,token:data.token,name:data.name, chr:data.chr, ready:false});
        for(var i=0; i<memberlist.length; i++){
          chara[i+1]=memberlist[i].chr
          MEMBER.push({id:memberlist[i].id,token:memberlist[i].token,name:memberlist[i].name,chr:memberlist[i].chr,score:LP[i+1],turnflag:0,pc:1});
        };
        //CPUを追加
        var A=MEMBER.length;
        if(A<4){
        for(var i=A; i<4; i++){
          var R=Math.floor(Math.random()*chrlist.length)
        //chara[i]=R;
        chara[i+1]=i;
            MEMBER.push({id:MEMBER.length,token:0,name:"CPU"+i,chr:chara[i+1],score:LP[i+1],turnflag:0,pc:0});
          };
        }
        function shuffleM(){
          for(var i =MEMBER.length-1; i>1 ; i--){
          var r =1+Math.floor(Math.random()*(i));
          var temp = MEMBER[i];
          MEMBER[i] = MEMBER[r]
          MEMBER[r] = temp
        }};
        shuffleM();
        MEMBER[parent].turnflag=1;
        console.log(MEMBER);
        socket.emit("setup_member", {member:MEMBER,room:RoomName[IAM.room]});
      return true;
      };
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
    socket.on("member",(data)=>{
      //メンバーをコピー
      if(!IsHost(IAM.room)){
        //console.log(data);
      Setup(1);
      //グローバルリストをこのプレイヤーが0番目になるようにメンバーに貼りつけ
      console.log(data);
      var chrtemp=[];
      chrtemp=data.concat(data);
      var A=data.findIndex(value=>value.token==IAM.token);
      IAM.mwah=A;
      if(IAM.mwah==-1){
        console.log('mwah error!');
        IAM.mwah=0;
      }
      chrtemp=chrtemp.splice(A,4);
      MEMBER=chrtemp.concat();
      }
      for(var i=1;i<5 ; i++){
      chara[i]=MEMBER[i-1].chr;
      }
      console.log(chara);
      parent=MEMBER.findIndex(value=>value.turnflag==1);
      gamestate =1
      if( mute=="ON" ){
        Bgm.playMusic();
        }
    if(IsHost(IAM.room)){
      console.log('setup for pvp')
      deckHandler();
    }
    });
    socket.on("deck-handler", (data)=>{
      if(!IsHost(IAM.room)){
        console.log('setup for pvp')
        //ホストが決めたデッキ・手札をコピー
        //socket.emit("deck_handler",{Deck:deck,Hand:{hand1,hand2,hand3,hand4},King:king} );
        console.log(data);
      deck=data.Deck.concat();
      king=data.King.concat();
      var I=IAM.mwah;
      //console.log(data.Hand.hand1)
      console.log(I)
      hand1=[]
      hand2=[]
      hand3=[]
      hand4=[]
      switch(I){
        case 0:
          hand1=data.Hand.hand1.concat();
          hand2=data.Hand.hand2.concat();
          hand3=data.Hand.hand3.concat();
          hand4=data.Hand.hand4.concat();
          break;
        case 1:
          hand1=data.Hand.hand2.concat();
          hand2=data.Hand.hand3.concat();
          hand3=data.Hand.hand4.concat();
          hand4=data.Hand.hand1.concat();
          break;
        case 2:
          hand1=data.Hand.hand3.concat();
          hand2=data.Hand.hand4.concat();
          hand3=data.Hand.hand1.concat();
          hand4=data.Hand.hand2.concat();
          break;
        case 3:
          hand1=data.Hand.hand4.concat();
          hand2=data.Hand.hand1.concat();
          hand3=data.Hand.hand2.concat();
          hand4=data.Hand.hand3.concat();
          break;
      }
      mpVelocity=data.MPV;
      Ponrate=data.PON;
      Fever=data.FEV
      console.log(king);//嶺上牌
      console.log(hand1);//自分の手札
      console.log(hand2);
      console.log(hand3);
      console.log(hand4);
      deckHandler();
      }
        })
  
  function PlayertoCpu(num){
    //ノーテンリーチ禁止
  if(reach[1]==2 && reach[0]==1){
    return false;
  }
  if(cLock==3){
    SpecialSkill(1,num);
  return false;
  };
  if(mpC>=10){
    //マナブレイク
    DP[1]-=mpC;
    drawDP(1);
    ManaBreak=Math.floor(mpC/10);
  }
  cLock=0;
  console.log('操作禁止',cLock);
  //切った後の整列描画と自分の捨て牌リスト
  if(ponsw[1]==1){ponsw[1]=pon1.length;}
  tumotemp=hand1[num]
  hand1[num]=hand1[hand1.length-1]
  hand1[hand1.length-1]=100
  if(debugmode){console.log(tumotemp,hand1.length-1,hand1[num],hand1[hand1.length-1])};
  if(turn ==0 && ctl[1]==0){
  if(ippatu[1]==1){ippatu[1]=2}
  if(nuki[0]==5){nuki[0]=0};
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
  trash1.push(tumotemp);
  ctl[2]=0
  handgraph(0,1)  
  //ボタンとカーソルを消す
  cx3.clearRect(326,348,148,142);
  cx3.clearRect(630,400,160,80)
  cx3.clearRect(200,370,360,120);
  if(hand1[0] ==-3){
    hand1[0]=-1}
  if(reach[1] ==0 || reach[1] ==1){
  reach[1]=0;
  cx2.clearRect(630,440,80,40)
  cx2.fillStyle = "rgba(20,20,20,0.5)";
  cx2.fillRect(630,440,80,40)
  }
  if(nukiswitch[1]>0){
    nukiswitch[1]=0;
      cx2.clearRect(710,440,80,40)
      cx2.fillStyle = "rgba(20,20,20,0.5)";
      cx2.fillRect(710,440,80,40)
  }
  if(chara[1]!==0){
    //スキル欄
  cx2.clearRect(710,400,80,40)
  cx2.fillStyle = "rgba(20,20,20,0.5)";
  cx2.fillRect(710,400,80,40)
  }
  if(pvpmode==1){
    //必要な情報をポイする
    socket.emit("throwed_pai",{Num:1,Player:1,who:MEMBER[0].id,Token:IAM.token,room:RoomName[IAM.room],Tumotemp:tumotemp,Reach:reach,Ippatu:ippatu,Nuki:nuki,Dp:DP,mb:ManaBreak,Hand:{hand1,hand2,hand3,hand4}});
  }else{
        //manabreak
        if(ManaBreak>0){
          e15.src=chrimg_src[chara[1]]
          e15.onload=function(){
            var B=450;
          loopX=0
          loopX2=0;
          alpha=1;
          se12.play();
          window.requestAnimationFrame((ts)=>ManaAnimation(ts,0,B));
          };
        }else{
            handgraph(1,1);
        };
        function ManaAnimation(ts,A=0,B=100){
            cx4.globalAlpha = alpha;
            A+=1;
            loopX+=3
            loopX2+=50
            var x=loopX*4
            var xx=loopX*3
            if(xx>50){xx=50};
            if(x>=800){loopX=0}
            if(loopX2>=150){loopX2=150}
            cx4.clearRect(0,0,800,600)
            cx4.fillStyle = "#001c0d";
            cx4.fillRect(0,B-xx,200,xx*2);
            cx4.drawImage(e15,400,200-xx,300,xx*2,loopX2-250,B-xx,300,xx*2)
            cx4.strokeStyle = "white";
            cx4.lineWidth = 5;
            cx4.beginPath();
            cx4.moveTo(0,B-xx);
            cx4.lineTo(200,B-xx);
            cx4.stroke();
            cx4.beginPath();
            cx4.moveTo(0,B+xx);
            cx4.lineTo(200,B+xx);
            cx4.stroke();
            cx4.drawImage(MBicon,160,B-100,200,100);
            if(alpha>0){
            if(A<45){window.requestAnimationFrame((ts)=>ManaAnimation(ts,A,B));}else{
            alpha -=0.1
            window.requestAnimationFrame((ts)=>ManaAnimation(ts,A,B));}
            }else if(alpha <=0){
            cx4.clearRect(0,0,800,600);
            cx4.globalAlpha = 1;
            handgraph(1,1);
            }
          };  
  }
  };
  
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
  PlayertoCpu(hand1.length-1);}
  }}
  
    function turnrole(){
      console.log('turnrole',pvpmode,turn)
      //pvpmode==1の時はタイマーを使わない
      if(pvpmode==1){
        var P=MEMBER.findIndex(value=>value.turnflag==1);
        console.log(ctl,P);
        if(P==-1){
          console.log('flag error!')
          P=0;
        }
        turn=P;
        console.log(P,IAM.mwah,turn);
        //ponsw[0]=0;
        tweeNsquare.paused=false;
      switch(turn){ 
        case 0:
          player1();
          Csquare.y=400;
          break;
        case 1:
        case 2:
        case 3:
          Csquare.y=100*turn;
          if(MEMBER[turn].pc==0 && IsHost(IAM.room)){
            ctl[turn+1]=0;
            var Cpu =setTimeout(function(){
              cpu(turn+1);
              if(ctl[turn+1]>=1){clearTimeout(Cpu)};
              }, 250);
          }
          break;
      }     
        return false;
      }
      ponsw[0]=0;
      switch(turn){
        case 0:
          var Player1 =setInterval(function(){
            player1();
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
    if(ponsw[1]==1){
      //疲れたのでポン後は別の場所にしますわ
      //100var PE=hand1.findIndex(value=>value==100);hand1.splice(PE,1);
      judge(1);
      //リーチ判定だけ
      if(deck.length==0 && reach[1]!==3){reach[1]=0};
      if(reach[1] ==1){
        se1.play();
        drawbuttom(630,440,"リーチ")};
      if(chara[1] !==0 && skillswitch[1]==0 && pvpmode==0){
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
    if(deck.length<=0){
      console.log('deckerror');
      if(pvpmode==1){
        //error？
        socket.emit("ryukyoku", {Token:IAM.token,room:RoomName[IAM.room]});
      };    
    ryukyoku();
    }else{
    ctl[1]=1
    tumo =deck.shift();
    var PE=hand1.findIndex(value=>value==100);
    hand1[PE]=tumo;
    if(pvpmode==1){
      socket.emit("deck_length",{Token:IAM.token,room:RoomName[IAM.room],Deck:deck});
    }
    decklength();
    drawcard= new createjs.Bitmap(eltear_src[tumo]);
    drawcard.alpha=0;
    drawcard.x=690;
    drawcard.y=470;
    drawcard.scaleX=7/12;
    drawcard.scaleY=31/52;
    field.addChild(drawcard);
    createjs.Tween.get(drawcard)
      .to({alpha: 1,y:500},300)
      .call(drawstep);
  function drawstep(){
    eltear.src=eltear_src[tumo]
    eltear.onload=function(){
    cx2.clearRect(690,500,size,sizey)
    cx2.drawImage(eltear,690,500,size,sizey);
    field.removeChild(drawcard);
    if(reach[1] <3){
      //スキル
      if(skillswitch[1]==1 & cLock !==3){
        switch(chara[1]){
          case 1:
        if(DP[1]>=20){
          skillswitch[1]=0       
        }
          break;
          case 2:
        if(skillusage2[1]==-1 && DP[1]>=10){
          skillswitch[1]=0       
        }else if(skillusage2[1]>-1){
          skillswitch[1]=0;
        }
          break;
          case 3:
        if(DP[1]>=20){
          skillswitch[1]=0;    
        }
          break;
          default:
          break;
        }
      }
      if(chara[1] !==0 && skillswitch[1]==0 && pvpmode==0){
        //cx2.clearRect(710,400,80,40)
        drawbuttom(710,400,"スキル");
      }
      var A=hand1.findIndex(value => value==42);
      if(A!==-1 && deck.length > 0){
        nukiswitch[1]=1;
        se1.play();
        drawbuttom(710,440,"抜き")
      }
      }
    if(nuki[0]==1){nuki[0]=5};
    if(judge(1)){hand1[0]=-3};
    if(deck.length==0 && reach[1]!==3){reach[1]=0};
    if(reach[1] ==1){
      if(nukiswitch[1]!==1){se1.play()};//SE同時に鳴らないように
      drawbuttom(630,440,"リーチ")};
    if(reach[1]==3 && tumo ==42 && deck.length > 0){
      nukiswitch[1]=1;
      se1.play();
        drawbuttom(710,440,"抜き")
      }
    if(hand1[0]==-3){
      se6.play();
      e18.src=eltearB_src[1];
      e18.onload=function(){
        e19.src=eltearB_src[2];
        e19.onload=function(){
      cx3.drawImage(e18,326,348,148,142)
      }}
    };
    setTimeout(()=>{
      cLock=1;
      corsor();
      console.log('操作可',cLock)
      },100)
    }
  }
    }
    }};
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
            if(pvpmode==1 && IsHost(IAM.room)){
              socket.emit("ryukyoku", {Token:IAM.token,room:RoomName[IAM.room]});
          };    
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
        if(pvpmode==1){
          socket.emit("deck_length",{Token:IAM.token,room:RoomName[IAM.room],Deck:deck});
        }
          decklength();
          if(skillswitch[chr]==1 && skillswitch[0] !==-1){
            switch(chara[chr]){
              case 1:
            if(DP[chr]>=20){
              skillswitch[chr]=0       
            }
              break;
              case 2:
            if(skillusage2[chr]==-1 && DP[chr]>=10){
              skillswitch[chr]=0       
            }else if(skillusage2[chr]>-1){
              skillswitch[chr]=0;
            }
              break;
              case 3:
            if(DP[chr]>=20){
              skillswitch[chr]=0;    
            }
              break;
              default:
              break;
            }
  
          }
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
          if(reach[chr]==3 || deck.length==0 || counter[chr]==0){//流す理由が無い、つも
          console.log('cp',chr,'ツモ',han[chr])
          ctl[chr]=2
          TumoRon(chr,0)
          if(pvpmode==1){
            socket.emit("tumo", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[chr-1].id,Tumo:tumo2,status:true});
            }
          return false;
          }}
          if(Cpuhandtemp[0]==-1){
            if(ippatu[chr]==1){ippatu[chr]=2}
            }
            ctl[chr]=2
            cpu(chr);
            }else if(ctl[chr]==2){
            cpuplay(chr);
            }
     }};
  
     function cpuskill(chr){
      console.log(chr,reach)
      if(pvpmode==1){return false};
      if(reach[chr]==1 && skillswitch[chr]==0){//スキルを使用するかここで決める
        switch(chara[chr]){
          case 1://エ
                    //ponしてればLP25000加算 リーチで50000加算 LPでヘイト
                    var ary=[0,0,0,0];
                    var LPrank=[
                      {chara:1, elia:LP[1], pon:ponsw[1], reach:reach[1]},
                      {chara:2, elia:LP[2], pon:ponsw[2], reach:reach[2]},
                      {chara:3, elia:LP[3], pon:ponsw[3], reach:reach[3]},
                      {chara:4, elia:LP[4], pon:ponsw[4], reach:reach[4]},
                        ]
                        for(var i=0;i<4;i++){
                          if(LPrank[i].reach==3){LPrank[i].elia+=50000};
                          LPrank[i].elia+=25000*(LPrank[i].pon/3);
                        }
                        LPrank.sort(compareFunc2);
            if(LPrank[3].chara ==chr){
              SpecialSkill(chr,LPrank[2].chara);
              }else{
              SpecialSkill(chr,LPrank[3].chara);
              }
              return true;
            break;
          case 2:
            //ア//メモライズ
            console.log(skillusage2[chr],r4);
        if(skillusage2[chr]>-1){
          SpecialSkill(chr,r4);
          return true;
      }else if((Cpuhandtemp[r4]>=3 && Cpuhandtemp[r4]<=5)||(Cpuhandtemp[r4]>=15 && Cpuhandtemp[r4]<=17)){
        SpecialSkill(chr,r4);
        return true;
      }else{
        return false;
      }
            break;
          case 3:
            //LPでヘイト リーチで50000加算
            var LPrank=[
              {chara:1, elia:LP[1], reach:reach[1]},
              {chara:2, elia:LP[2], reach:reach[2]},
              {chara:3, elia:LP[3], reach:reach[3]},
              {chara:4, elia:LP[4], reach:reach[4]},
                ]
                for(var i=0;i<4;i++){
                  if(LPrank[i].reach==3){LPrank[i].elia+=50000};
                }
              LPrank.sort(compareFunc2);
              if(LPrank[3].chara ==chr){
              SpecialSkill(chr,1);
              }else{
            SpecialSkill(chr,LPrank[3].chara);
              }
            return true;
            break;
          default:
            return false;
            break;
        }
      }else{return false};
    }
    function cpuplay(chr){
    //思考ルーチンに従い牌をきる
    console.log('cpuplay',chr,ctl[chr])
    if(ctl[chr] ==2){
      r4=-1;
      ctl[chr]=3;
      if(reach[chr]==3){r4=Cpuhandtemp.length-1}else{
        Cpuhandtemp.sort(compareFunc);//これいるのか分からんが
        r4 =Cputumo(chr);//時間がかかるとしたらcputumoのこの部分
      }
    }
    if(ctl[chr]==3 && gamestate==1){
      if(r4==-1){
      console.log('waitcpu play',chr,ctl[chr]);
      setTimeout(()=>{
        cpuplay(chr);
        },100)
        return false;
      }else{
      if(!cpuskill(chr)){
        ctl[chr]=4;
      };
        }
      }
      if(ctl[chr]==4){
        //切る
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
        if(pvpmode==1){
          //必要な情報をポイする
          socket.emit("throwed_pai",{Num:r4,Player:chr,who:MEMBER[chr-1].id,Token:IAM.token,room:RoomName[IAM.room],Tumotemp:tumotemp,Reach:reach,Ippatu:ippatu,Nuki:nuki,Dp:DP,mb:ManaBreak,Hand:{hand1,hand2,hand3,hand4}});
        }else{
        handgraph(r4,chr)
        }
      }
    //ctlerror[chr]=0;
    };
      
    function Cputumo(player,type=0){
      //type：未使用
      startTime = Date.now()
      reach[player]=1;
      //poncpu[player]=Ponrate;
    //敵の思考ルーチン
    var cputumo =Cpuhandtemp.length-1;//何番目を切るのかを返す
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
    console.log(keyj2.length);//expected 1~5
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
                  //if(reach[player]==1){reach[player]=2};
                  cputumo=1+Math.floor(Math.random()*9);
                  end=1;
              }
              if(keyj2.length==3){
                //ここにいる？
                if(Line["1"]==1 || Line["2"]==1 || Line["3"]==1 || Line["4"]==1){
                  console.log('line reach')
                  //if(reach[player]==1){reach[player]=2};
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
                    console.log('line error')
                    reach[player]=1;
                    cputumo=1+Math.floor(Math.random()*9)
                  }
                  end=1;
                };
              }
              break;
            default:
               //0line->undefined
              if(keyj2.length==1){
                console.log('line tumo')
                //if(reach[player]==1){reach[player]=2};
                cputumo=1+Math.floor(Math.random()*9)
                end=1;
              }
              if(keyj2.length==2){
                if(Line[keyj2[0]]==1 || Line[keyj2[1]]==1){
                  console.log('line reach')
                  //if(reach[player]==1){reach[player]=2};
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
          if(reach[player]==1){reach[player]=2};
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
      //1つのライン5枚以上あればラインを狙いに行き,ponRateの確率でポンしない
      //ライン条件該当しないなら（オールマイティ以外の）1枚しか持っていないキャラを優先して切る
      //↑2つに該当しなければ（オールマイティ以外の）ランダムに切る
      var resultF=Object.keys(Line).find((key)=>Line[key]>5);//->あればlineが帰ってくる
      //console.log(resultF);
      //var resultG =[];for( const [key,value] of Object.entries(Line)){resultG.push(key,value);}console.log(resultG);//[key,value,key,value...]の配列ができる
      if(ponsw[player]<3 && resultF !==undefined){
        var resultFF=Object.keys(Line).find((key)=>Line[key]==5);//->あればlineが帰ってくる
        if(resultFF !==undefined){
          if(ponsw[player]<3){poncpu[player]=Ponrate};
        }else{
        if(ponsw[player]<3){poncpu[player]=1};
        }
        resultF-=1;
        var E=Cpuhandtemp.filter(value=>value==42 || (value>=0 &&value<42 && value%3!==resultF));
        console.log(E);
        //E=[]となると無限ループ？
        if(E.length==0){
          console.log('E.error!',cputumo)
          cputumo =1+ Math.floor(Math.random()*(Cpuhandtemp.length-1));
          return cputumo;
        }
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
    }else if(type==1){
      //ランダムに切るだけ
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
          if(debugmode){
            console.log(Count);
            console.log(Line);
          }
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
      if(debugmode){
      console.log(HH,handtemp)
      };
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
    
    function TumoRon(player,num,dub=1){
      //上がった画面描画～次のゲーム,num=0→ツモ,1~→ロン dubダブロン用
      console.log("tumoron",player,num,ctl)
      console.log(ponsw[player])
      if(LP[0]==4){
        //魔界ルール
        //ロンなら塗りつぶす
        if(num>=1){
        cx1.fillStyle = "rgba(200,0,0,0.5)";
          if(ippatu[num]==1){
          cx1.fillRect(riverx[num]-10.5,rivery[num]+10.5,43.5,33)
          }else{
          cx1.fillRect(riverx[num],rivery[num],33,43.5)
          }
        };
        Cimage = cx2.getImageData(0, 0, 800, 600);
      };
      se7.play();
      cLock=0
      gamestate=-1
      if(Fever!==-1){Fever+=1};
      var vichand=[]
      var ponf=0
      if(player ==1){
        handtemp = hand1.concat();
        var T=handtemp.splice(9,1);
        handtemp=handtemp.concat(pon1);
        handtemp.sort(compareFunc);
        handtemp=handtemp.concat(T);
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
      fu =60;
      var B=Buff[player].filter(value=>value==7);
      if(B.length>0){
      fu-=10*B.length;
      }
      if(Astyle=="3ペア"){
        fu-=10*ponf;
      }
      if(Astyle=="国士無双"){
        han[player]+=6;
      }
      if(num==0 && ponsw[player] ==0){han[player] +=1}//門前ツモ
      han[player]+=nuki[player];
      if(nuki[0]>0){han[player]+=1}//嶺上
      if(ippatu[player]==1){han[player] +=1}
      if(counter[player] ==0 && num==0){han[player] +=4}//天和 4翻
      if(deck.length ==0){han[player] +=1};//海底
      if(ponsw[player] >0){han[player] -=2};//鳴き
      var doracheck =Doracheck(player);
      function Doracheck(player){
        var result =0
        if(reach[player]==3 && dub==1 && LP[0]!==4){
          dora.push(king[6]);
          var DD=dora[dora.length-1]+1
          if(DD>=45){DD=0;}
          e7.src=eltear_src[DD]
        e7.onload=function(){
        dorax+=40
        cx1.drawImage(e7,dorax,10,33,43.5)
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
      //描画
      e15.src=chrimg_src[chara[player]]
      e15.onload=function(){
      if(num==0){e16.src=win_src[7]}else{e16.src=win_src[8]}
      e16.onload=function(){
      cx2.clearRect(10,100,780,400)
      cx2.drawImage(e15,10,10,780,400,10,100,780,400)
      cx2.drawImage(e16,0,230,297,234)
      var i=1
      var hai=vichand[i];
      console.log(hai);
      var haix =15
      var haiy =120
      cx2.fillStyle = "rgba(15,15,15,0.6)";
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
      function PB(name,count=1,pc=0){
        //pc->1なら自分以外がアガリの場合にも考慮する
        if(player==1 || pc==1){
        var A=achievetempB.findIndex(value=>value.name==name);
        if(A==-1){
          console.log('PB error',name,count)
          return false;      
        }
        achievetempB[A].count+=count;
        }};
      haiy=250
      cx2.font = "20px 'Century Gothic'";
      cx2.fillStyle ="white";
      haix=30
      console.log(Astyle);
      cx2.fillText(Astyle,haix,haiy)
      haiy +=35
      if(counter[player] ==0){
        if(num==0){cx2.fillText('天和 4翻',haix,haiy)}
        PB("天和");
        haiy +=25
        }
        if(Astyle=="国士無双"){
          cx2.fillText('国士無双 6翻',haix,haiy)
          PB("国士無双");
          haiy +=25
        }
      if(nuki[0]>0){
        if(num==0){
          cx2.fillText('嶺上開花 1翻',haix,haiy)
      }else{
          cx2.fillText('槍槓 1翻',haix,haiy);
      }
        haiy +=25
      }
      if(num==0 && ponsw[player]==0){
      cx2.fillText('門前ツモ 1翻',haix,haiy)
      PB("門前ツモ");
      haiy +=25}
      if(ippatu[player]==1){
      cx2.fillText('一発 1翻',haix,haiy)
      PB("一発");
      haiy +=25
      }
      if(deck.length ==0){
      cx2.fillText('海底 1翻',haix,haiy)
      PB("海底");
      haiy +=25
      }
      if(doracheck>0){
        cx2.fillText('ドラ '+doracheck+'翻',haix,haiy)
        haiy +=25
        }
      if(nuki[player]>0){
        cx2.fillText('抜き '+nuki[player]+'翻',haix,haiy)
        haiy +=25
      };
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
      cx2.fillText(han[player]+"翻",530,360)
      cx2.font = "28px 'Century Gothic'";
      if(mode==0){
      if(rootscore==220000){
      cx2.fillStyle ="red";
      cx2.fillText("数え役満",630,360);
      PB("数え役満");}
      if(rootscore==150000){
      cx2.fillStyle ="red";
      cx2.fillText("三倍満",630,360);
      PB("三倍満");}
      if(rootscore==100000){
      cx2.fillStyle ="red";
      cx2.fillText("二倍満",630,360);
      PB("二倍満");}
      if(rootscore==75000){
      cx2.fillStyle ="red";
      cx2.fillText("跳満",630,360);
      PB("跳満");}
      if(rootscore==50000){
      cx2.fillStyle ="red";
      cx2.fillText("満貫",630,360);
      PB("満貫");}
      }
      //cx2.font = "28px 'Century Gothic'";
      cx2.strokeStyle ="#ff4c38";
      cx2.lineWidth = 5;
      cx2.lineJoin = 'round';
      cx2.fillStyle ="white";
      cx2.strokeText("　　　 "+score,530,400)
      cx2.fillText("戦闘力 "+score,530,400)
      cx2.font = "24px 'Century Gothic'";
      cx2.fillStyle ="white";
      if(pvpmode==1){
        var x=30;
        var y=430
        for(var i=0;i<MEMBER.length;i++){
        cx2.fillText(MEMBER[i].name, x, y);
        x+=200;
        };
  }else{
      cx2.fillText(Username,30,430)
        cx2.fillText("ＣＰＵ１",230,430)
          cx2.fillText("ＣＰＵ２",430,430)
            cx2.fillText("ＣＰＵ３",630,430)
  }
      cx2.fillText(chrlist[chara[1]],30,460)
      cx2.fillText(LPtemp[1],30,490)
      cx2.fillText(chrlist[chara[2]],230,460)
      cx2.fillText(LPtemp[2],230,490)
      cx2.fillText(chrlist[chara[3]],430,460)
      cx2.fillText(LPtemp[3],430,490)
      cx2.fillText(chrlist[chara[4]],630,460)
      cx2.fillText(LPtemp[4],630,490)
      //実績
      if(player==1){
        var A=achievetemp.findIndex(value=>value.name==Astyle)
        if(A==-1){
        achievetemp.push({name:Astyle,cleared:1,count:0})
        }else{
          achievetemp[A].cleared+=1;
        }
        if(num==0){PB("ツモ");}else{PB("ロン");};
        if(score>scoretemp[3]){scoretemp[3]=score};
      }else{
        if(num==1){
          PB("放銃",1,1);
        if(dub==2){
          PB('ダブル放銃',1,1)
        }};
      }
      if(LP[1]<=0){PB("飛び",1,1)};
      PB("ポン",ponsw[1]/3,1);
      yakumap2.alpha=0;
      cx4.clearRect(0,0,800,600)
      opLock=-1;
      tweeNsquare.paused=true;
      Csquare.alpha=0;
      gamestate =2
      if(LP[0]==4){
        //10,100,780,400
        switch(raidscore[1]){
          case 0:
            N1= cx2.getImageData(10, 100, 780, 400);
            break;
          case 1:
            N2= cx2.getImageData(10, 100, 780, 400);
            break;
          case 2:
            N3= cx2.getImageData(10, 100, 780, 400);
            break;
        }
        Buff[player].push(11);
        raidscore[1]+=1;
        if(raidscore[1]>=3){
          raidscore[2]=1;
        };
        if(LP[1]<0 || LP[2]<0 || LP[3]<0 || LP[4]<0){
          raidscore[2]=1;
        };
        cx2.clearRect(10,100,780,400);
      }
      loopX=0
      loopX2=0;
      alpha=1;
        window.requestAnimationFrame((ts)=>LoopAnimation(ts))}
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
      fu-=10*(All.length)
      var Wind=Buff[player].filter(value=>value==3);
      if(Wind.length){
        fu+=10*Wind.length;
      }
      if(fu<20){fu=20};
      if(han[player]<=0){han[player]=1};
      var h=han[player]+2
      var hellhan=0
      hellhan=fu*3*(h*2+h*h*h/2)
      //hellhan=fu*3*(1+h+(h*h)/2+(h*h*h)/6)
      hellhan=200*Math.ceil(hellhan/100)
      console.log(fu,hellhan)
      return hellhan
      };
  
    function Scorepay(player,parentS,num){
      //type0 通常 type1 サバイバル（予定）
      if(LP[0]!==4 && player ==parentS){
        //連荘
      score =rootscore *1.5
      skillusage2[0]-=1;
      skillusage2[5]+=1
      if(player==1){
        if(skillusage2[5]>scoretemp[1]){
          scoretemp[1]+=1;
        }};
      if(parent ==0){parent =3}else{parent -=1}
      }else{
      score=rootscore
      skillusage2[5]=0
      }
      //支払いしないならここまで
      if(LP[0] !==3){
      LPtemp=[0,0,0,0,0]
      if(num >0){//ロン
        if(pvpmode==0 ||(pvpmode==1 && LP_PVP.Rule[0]==1)){
        LPtemp[player]+=score;
      }
        var MS=Buff[num].filter(value=>value==2);
        if(MS.length){
          LPtemp[num]+=Math.floor(score*(MS.length)/10);
        }
      LPtemp[num]-=score
      if(LP_PVP.Rule[0]==2){
        death[player-1].Admg[num-1]+=score;
        death[num-1].Bdmg[player-1]+=score;
      }
      }
      if(num ==0){
      if(player==parentS){//おやつも
      for(var i=1;i<LP.length;i++){
      if(i==player){
        if(pvpmode==0 ||(pvpmode==1 && LP_PVP.Rule[0]==1)){
          LPtemp[i]+=score;
        }
      }else{
        LPtemp[i]-=score/3;
        var MS=Buff[i].filter(value=>value==2);
        if(MS.length){
          LPtemp[i]+=Math.floor((score/3)*(MS.length)/10);
        }
        if(LP_PVP.Rule[0]==2){
          death[i-1].Bdmg[player-1]+=score/3;
        }
      }
      if(LP_PVP.Rule[0]==2){
        death[player-1].Admg[player-1]+=score;
      }
      }}
      if(player!==parentS){//こつも
      for(var i=1;i<LP.length;i++){
      if(i==player){
        if(pvpmode==0 ||(pvpmode==1 && LP_PVP.Rule[0]==1)){
          LPtemp[i]+=score;
          if(LP_PVP.Rule[0]==2){
            death[player-1].Admg[player-1]+=score;
          }
        }
      }else if(i==parentS){LPtemp[i]-=score/2;
      var MS=Buff[i].filter(value=>value==2);
      if(MS.length){
        LPtemp[i]+=Math.floor((score/2)*(MS.length)/10);
      }
      if(LP_PVP.Rule[0]==2){
        death[i-1].Bdmg[player-1]+=score/2;
      }
      }else{LPtemp[i]-=score/4
      var MS=Buff[i].filter(value=>value==2);
      if(MS.length){
        LPtemp[i]+=Math.floor((score/4)*(MS.length)/10);
      }
      if(LP_PVP.Rule[0]==2){
        death[i-1].Bdmg[player-1]+=score/4;
      }
    }
      }
      }}
      for(var i=1; i<LP.length;i++){
      LP[i]+=LPtemp[i]
      if(LP[i]<0){
        if(chara[i]==4 && LP[i]!==1)
        //飛び
        if(skillusage2[i]==-1){
          skillusage2[i]=1;
        }
        if(LP_PVP.Rule[0]==2){
          //キルアシ
          var As=death[i-1].Bdmg.concat();
          var Bs=maxIndex1(As);
          function maxIndex1(a) {
            let index = 0
            let value = -Infinity
            for (let i = 0, l = a.length; i < l; i++) {
              if (value < a[i]) {
                value = a[i]
                index = i
              }
            }
            return index
          }
          console.log(As,Bs);
          death[i-1].death+=1;
          death[player-1].kill+=1;
          death[Bs].assist+=1;
        }
      }
      }
      console.log(death);
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
                  result=keyj2[1]+"ライン通貫"
                    return result;
                }
                break;
              default:
                 //0line->undefined
                if(keyj2.length==1){
                  console.log('line tumo')
                  result=keyj2[0]+"ライン通貫"
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
          function PA(name,count){
            if(player==1){
              var A=achievetemp.findIndex(value=>value.name==name);
              if(A==-1){
                achievetemp.push({name:name,cleared:1,count:count})
              }else{
                if(count>achievetemp[A].count){
                  achievetemp[A].count=count;                
                }
                achievetemp[A].cleared+=1;
              }
            }
          }
          nodpair1=handtemp.findIndex(value=>value==18);
          if(nodpair1 !==-1){
            resultA[0]+=1;
            PA("貫徹する足取り",1);
            resultA.push("貫徹する足取り1/1 1翻")}
            nodpair1=handtemp.findIndex(value=>value==19);
            if(nodpair1 !==-1){
              resultA[0]+=1
              PA("豊かな足取り",1);
              resultA.push("豊かな足取り1/1 1翻")}
              nodpair1=handtemp.findIndex(value=>value==20);
              if(nodpair1 !==-1){
                resultA[0]+=1
                PA("上手な足取り",1);
                resultA.push("上手な足取り1/1 1翻")}
        nodpair1=handtemp.findIndex(value=>value==35);
        if(nodpair1 !==-1){
          resultA[0]+=1
          PA("ラビィの友達",1);
          resultA.push("ラビィの友達1/1 1翻")}
        nodpair1=handtemp.findIndex(value=>value==42);
        if(nodpair1 !==-1){
          resultA[0]+=1
          PA("機械工学",1);        
          resultA.push("機械工学1/1 1翻")}
        nodpair1=handtemp.findIndex(value=>value==14);
        nodpair2=handtemp.findIndex(value=>value==41);
        if(nodpair1 !==-1 && nodpair2 !==-1 ){
          resultA[0]+=1
          PA("戦場の天使",2);   
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
          PA("痛いから問題ない",nodpair2.length);   
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
          PA("属性鍛錬者",nodpair2.length);  
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
          PA("渇望",nodpair2.length);  
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
          PA("原初的な動き",nodpair2.length);  
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
          PA("探求する者",nodpair2.length);  
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
          PA("マナ守護",nodpair2.length); 
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
          PA("巨人審判者",nodpair2.length);         
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
          PA("魔族",nodpair2.length);       
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
            PA("精霊の加護",nodpair2.length); 
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
              PA("ナソード研究",nodpair2.length);           
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
          PA("時空間",nodpair2.length);   
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
          PA("殴り合い",nodpair2.length);   
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
          PA("正義を貫徹する者",nodpair2.length);   
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
          PA("敏捷さ",nodpair2.length);   
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
          PA("魔法特化",nodpair2.length);   
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
          PA("物理特化",nodpair2.length); 
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
            PA("鋭さ",nodpair2.length); 
            resultA.push("鋭さ"+nodpair2.length+"/"+nodpair1.length+" "+B+"翻")}
            //属性枠
            nodpair1=handtemp.filter(value=>value>=0 && value<=2);
            nodpair2=handtemp.filter(value=>value>=9 && value<=11);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
            PA("クレストオブソーレス",1); 
              resultA.push("クレストオブソーレス 1翻")}
            nodpair1=handtemp.filter(value=>value>=3 && value<=5);
            nodpair2=handtemp.filter(value=>value>=15 && value<=17);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
              PA("クレストオブデニフ",1); 
              resultA.push("クレストオブデニフ 1翻")}
            nodpair1=handtemp.filter(value=>value>=6 && value<=8);
            nodpair2=handtemp.filter(value=>value>=39 && value<=42);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
              PA("クレストオブベントス",1); 
              resultA.push("クレストオブベントス 1翻")}
            nodpair1=handtemp.filter(value=>value>=12 && value<=14);
            nodpair2=handtemp.filter(value=>value>=24 && value<=26);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
              PA("クレストオブアドリアン",1); 
              resultA.push("クレストオブアドリアン 1翻")}
            nodpair1=handtemp.filter(value=>value>=21 && value<=23);
            nodpair2=handtemp.filter(value=>value>=27 && value<=29);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
              PA("クレストオブロッソ",1); 
              resultA.push("クレストオブロッソ 1翻")}
            nodpair1=handtemp.filter(value=>value>=18 && value<=20);
            nodpair2=handtemp.filter(value=>value>=33 && value<=35);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
              PA("クレストオブガイア",1); 
              resultA.push("クレストオブガイア 1翻")}
            nodpair1=handtemp.filter(value=>value>=30 && value<=32);
            nodpair2=handtemp.filter(value=>value>=36 && value<=38);
            if(nodpair1.length==3 && nodpair2.length==3){
              resultA[0]+=1
              PA("クレストオブハルニエ",1); 
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
            if(nodpair2.length>=3 || nodpair2.length==nodpair1.length){
              cx2.fillStyle = "#ff4c38";
            }else if(nodpair2.length >=2){
              cx2.fillStyle = "#388eff";
            }else{cx2.fillStyle = "white";}
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
                  var resultF=Object.keys(Count).find((key)=>Count[key]==2);
                  //->あればキャラ名が帰ってくる
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
          };
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
          if(Kreach==0 && KKreach==0){
              //国士
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
    socket.on("ryukyoku", (data)=>{
      if(IAM.token!==data.Token){
        ryukyoku();
      }
    });
    function ryukyoku(){
      //emit
      if(pvpmode==1){
      tweeNsquare.paused=true;
      Csquare.alpha=0;
      if(IsHost(IAM.room)){
        MEMBER[0].turnflag=1;
    for(var i=1;i<MEMBER.length;i++){
      if(MEMBER[i].pc==1 && MEMBER[i].turnflag !==2){
        MEMBER[i].turnflag=0;
      }else{
        MEMBER[i].turnflag=2;
      }
    }}
    }
    yakumap2.alpha=0;
    cx4.clearRect(0,0,800,600)
    opLock=-1;
    se10.play();
    cx1.fillStyle = "rgba(20,20,20,0.5)";
    cx1.fillRect(10,100,780,400)
    cx2.fillStyle = "white";
    cx2.font = "36px 'Century Gothic'";
    cx2.fillText("流局",390,300)
    if(LP[0]!==4){
    if(parent ==0){parent =3}else{parent -=1}
    skillusage2[0]-=1;
    skillusage2[5]+=1;
    }
    for(var i=1 ;i<5; i++){
    ctl[i]=2;
  }
    cLock=0;
    gamestate=0;
    console.log('流局',ctl)
    if(LP[0]==4){
      raidscore[2]=1;
      if(raidscore[0]==0){raidscore[0]=2};
      ResultPhase();
        //以降resultphaseは↑のほうで呼び出し
      return false;
    };
    }

    function ResultPhase(){
      //ccanvasに保存した画像を順に見せる
      cLock=0;
      console.log('操作禁止',cLock);
      if(raidscore[2]==1){
        //はじめて
        raidscore[2]=2;
        msgstate=0;
        cLock=1;
        return;
      }
      console.log('resultphase',raidscore);
      console.log(msgstate);
      if(raidscore[1]<=msgstate){
        raidscore[0]=1;
        CcanvasAry=[];
        return false;
      }
      //ツモ画面を順番に表示するのみ
      //cx1.fillStyle='black';
      //cx1.fillRect(10,100,780,400);
      alpha=1;
      var X=100;
      var V=20;
      var G=0.3;
      cx1.clearRect(0,100,800,400);
      cx4.globalAlpha=1;
      cx4.fillStyle='black';
      window.requestAnimationFrame((ts)=>Step1(ts))
      function Step1(ts,N=0){
        alpha-=0.05;
        cx4.globalAlpha=alpha;
        cx4.clearRect(0,100,800,400);
        cx4.fillRect(0,100,800,400);
        V+=G;
        if(V>=100){V=100}
        switch(msgstate){
          case 0:
            X-=V;
            if(X<=10){
            X=10;
            N=1;
            };
            cx2.clearRect(0,100,800,400);
            cx2.putImageData(N1,X,100);
            break;
          case 1:
            if(X>10){X=10}
            X-=V*2;
            if(X<=-770){
              X=-770;
              N=1;
            };
            cx2.clearRect(0,100,800,400);
            cx2.putImageData(N1,X,100);
            cx2.putImageData(N2,X+780,100);
            break;
          case 2:
            if(X>10){X=10}
            X-=V*2;
            if(X<=-770){
              X=-770;
              N=1;
            };
            cx2.clearRect(0,100,800,400);
            cx2.putImageData(N2,X,100);
            cx2.putImageData(N3,X+780,100);
            break;
          default:
            console.log(msgstate);
            return false;
        }
        if(alpha>0 && N==0){
          window.requestAnimationFrame((ts)=>Step1(ts,N))
        }else{
      cx4.clearRect(0,0,800,600);
      cx4.globalAlpha=1;
      msgstate+=1;
      cLock=1;
    }
      }
    }
    function corsor(){
      if(gamestate==10){
        switch(pagestate){
          case 1:
            //usercrest
              if(mouseX >70 && mouseX <390){
            if(mouseY >80 && mouseY < 500){
        cx2.clearRect(80,90,300,330)
        cx2.strokeStyle ='orange'
        cx2.lineWidth = 2;
        cx2.fillStyle = "black";
        cx2.font = "18px Arial";
            }}
              if(mouseX >120 && mouseX <340){
            if(mouseY >95 && mouseY < 155){
        cx2.clearRect(80,530,670,70)
        cx2.strokeRect(120,95,220,60)
        cx2.fillText("あなたのプロフィールです。", 80, 550);
        cx2.fillText("クリックで詳細表示。", 80, 570);
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
        cx2.fillText("一般・ヘルでは全員が親を2回行うか誰かの戦闘力が0になると終了です。", 80, 570);
            }
            if(mouseY >260 && mouseY < 310){
        cx2.clearRect(80,530,670,70)
        cx2.strokeRect(86,261,288,48)
        cx2.fillText("たいせん　他のプレイヤーとドンジャラをします。", 80, 550);
            }
            if(mouseY >310 && mouseY < 360){
        cx2.clearRect(80,530,670,70)
        cx2.strokeRect(86,311,288,48)
        cx2.fillText("オプション　対局の設定や音楽の設定ができます。", 80, 550);
            }
            if(mouseY >360 && mouseY < 410){
        cx2.clearRect(80,530,670,70)
        cx2.strokeRect(86,361,288,48)
        cx2.fillText("セーブ　現在のプレイ状況をjsonファイルに出力します。", 80, 550);
        cx2.fillText("（※クリック後、OKを選択するとjsonファイルをダウンロード）", 80, 570);
            }}
            if(mouseX >410 && mouseX <760){
              if(mouseY >210 && mouseY < 450){
                cx2.clearRect(80,530,670,70)
                cx3.clearRect(675,385,100,60)
                cx2.lineWidth = 2;
                cx2.fillStyle = "black";
                cx2.font = "18px Arial";
                cx2.fillText("戦績　対局の記録です。", 80, 550);
                cx2.fillText("詳細をクリックすると達成役一覧などを表示します。", 80, 570)
              }}
              if(mouseX >678 && mouseX <752 && mouseY >390 && mouseY <440){
                cx3.strokeStyle ='orange'
                cx3.lineWidth = 2;
                cx3.strokeRect(676,388,78,52)
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
            cx3.strokeRect(470,410,170,60)
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
          switch(LP[0]){
            case 0:
            cx2.fillText(LPlist[LP[0]]+"：持ち点150,000の半荘戦です。満貫ブロックが適応されます。", 80, 550);
            cx2.fillText("誰かの戦闘力が0になるとその時点で試合終了となります。", 80, 570);
            break;
            case 1:
              cx2.fillText(LPlist[LP[0]]+"：持ち点300,000の半荘戦です。満貫ブロックが適応されません。", 80, 550);
              cx2.fillText("誰かの戦闘力が0になっても試合を続行します。", 80, 570);
            break;
            case 2:
              cx2.fillText(LPlist[LP[0]]+"：持ち点100,000で、誰かが戦闘力1,000,000に到達するまで続きます。", 80, 550);
              cx2.fillText("戦闘力が0になったプレイヤーは時間経過で復活します。", 80, 570);
            break;
            case 3:
              cx2.fillText(LPlist[LP[0]]+"：自由に打ち続けるモードです。Escキーでタイトル画面に戻れます。", 80, 550);
            break;
            case 4:
              cx2.fillText(LPlist[LP[0]]+"：4人中3人が和了するか、山がなくなるまで対局が続きます。", 80, 550);
              cx2.fillText("※βテスト中/予期しないバグが起こる可能性があります。", 80, 570);
              break;
          }
        }
        if(mouseX >520 && mouseX <650 && mouseY >175 && mouseY <205){
          cx2.clearRect(80,530,670,70)
          cx2.fillText("CPUのキャラクター設定です。", 80, 550);
          cx2.fillText("おまかせにするとランダムに決定されます。", 80, 570);
        }
        if(mouseX >520 && mouseX <650 && mouseY >345 && mouseY <375){
          cx2.clearRect(80,530,670,70)
          cx2.fillText("CPUのアクティブスキルの設定です。", 80, 550);
          cx2.fillText("禁止するとCPUはスキルを使用しません（パッシブスキルは適用される）", 80, 570);
        }
            break;
          case 2:
            //オプション
            cx3.clearRect(360,70,400,440)
            //cx2.clearRect(80,150,300,270)
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
            if(mouseX >50 && mouseX <360 && mouseY >100 && mouseY <170){
              cx2.clearRect(80,530,670,70)
              cx2.fillText("対局中に画面内を右クリックした時の操作を", 80, 550);
              cx2.fillText("切り替えることができます。", 80, 570);
            }
            if(mouseX >50 && mouseX <300 && mouseY >200 && mouseY <260){
              cx2.clearRect(80,530,670,70)
              cx2.fillText("CPUのポンのしやすさを調節します。", 80, 550);
              cx2.fillText("右に行くほどCPUがポンしやすくなるようです。", 80, 570);
            }
            if(mouseX >50 && mouseX <350 && mouseY >260 && mouseY <350){
              cx2.clearRect(80,530,670,70)
              cx2.fillText("パイを切った時にMPが溜まる速度です。", 80, 550);
            }
            if(mouseX >50 && mouseX <350 && mouseY >350 && mouseY <400){
              cx2.clearRect(80,530,670,70)
              cx2.fillText("（たいせんモードのみ）ありにすると特定のタイミングでFEVERが発生します。", 80, 550);
              cx2.fillText("現在のFEVER効果：ドラ3枚追加（効果は予告なく変わる場合があります）", 80, 570);
            }
            if(mouseX >600 && mouseX <700 && mouseY >450 && mouseY <490){
              cx3.strokeRect(600,450,100,40)
              cx2.clearRect(80,530,670,70)
              cx2.fillText("現在の設定を反映して戻ります。", 80, 550);
            }
            if(mouseX >400 && mouseX <580 && mouseY >450 && mouseY <490){
              cx3.strokeRect(400,450,180,40)
              cx2.clearRect(80,530,670,70)
              cx2.fillText("オプションを初回起動時の設定に戻します。", 80, 550);
              cx2.fillText("※『音量設定』のみ初期化されません。", 80, 570);
            }
          break;
          case 4:
            //プレイガイド
            cx3.clearRect(50,50,700,460)
            cx3.strokeStyle ='orange'
            cx3.lineWidth = 2;
            cx2.fillStyle = "black";
            cx2.font = "18px Arial";
            cx3.font = "24px 'Century Gothic'";
            cx3.fillStyle = "orange";
            if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <90){
              cx3.strokeRect(710,55,30,30)
            }
            switch(msgstate){
              case 0:
                if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <90){
                  cx3.strokeRect(710,55,30,30)
                }
                if(mouseX >50 && mouseX <250 && mouseY >70 && mouseY <110){
                  cx3.strokeRect(52,70,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >110 && mouseY <150){
                  cx3.strokeRect(52,110,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >150 && mouseY <190){
                  cx3.strokeRect(52,150,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >190 && mouseY <230){
                  cx3.strokeRect(52,190,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >230 && mouseY <270){
                  cx3.strokeRect(52,230,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >270 && mouseY <310){
                  cx3.strokeRect(52,270,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >310 && mouseY <350){
                  cx3.strokeRect(52,310,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >350 && mouseY <390){
                  cx3.strokeRect(52,350,200,40)
                }
                break;
              case 1:
                if(mouseX >90 && mouseX <200 && mouseY >60 && mouseY <100){
                  cx3.strokeRect(375,263,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("ここにはドラパイが1枚表示されます。", 80, 550);
                  cx2.fillText("ドラと同じパイを持っていると、いいことが……？", 80, 570);
                }
                if(mouseX >85 && mouseX <200 && mouseY >120 && mouseY <420){
                  cx3.strokeRect(375,193,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("数字は各プレイヤーの持ち点です。ゲーム中にカーソルを当てると、", 80, 550);
                  cx2.fillText("情報欄にそのプレイヤーのバフ状況が表示されます。", 80, 570);
                }
                if(mouseX >160 && mouseX <670 && mouseY >420 && mouseY <505){
                  cx3.strokeRect(375,168,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("これは何でしょう？　そう、あなたの手札のパイです！", 80, 550);
                  cx2.fillText("自分の番になったらこの中から1枚選んで捨てましょう。", 80, 570);
                }
                if(mouseX >200 && mouseX <370 && mouseY >120 && mouseY <420){
                  cx3.strokeRect(375,310,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("これは各プレイヤーが場に捨てたパイです。", 80, 550);
                  cx2.fillText("山札にどんなパイが眠っているのか想像してみてください。", 80, 570);
                }
                if(mouseX >560 && mouseX <690 && mouseY >350 && mouseY <420){
                  cx3.strokeRect(375,240,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("ゲーム中にポン、スキル、リーチのコマンドを使うことができます。", 80, 550);
                  cx2.fillText("あと1つで役が揃うならリーチボタンを押してみましょう。", 80, 570);
                }
                if(mouseX >560 && mouseX <690 && mouseY >60 && mouseY <330){
                  cx3.strokeRect(375,216,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("情報欄には、現在カーソルを合わせているパイや", 80, 550);
                  cx2.fillText("プレイヤーに関する内容が表示されます。", 80, 570);
                }
                if(mouseX >390 && mouseX <560 && mouseY >60 && mouseY <100){
                  cx3.strokeRect(375,287,170,20)
                  cx2.clearRect(80,530,670,70)
                  cx2.fillText("山札の残りのパイが0になると引き分けです！", 80, 550);
                  cx2.fillText("残パイリストにはまだ捨てられていないパイが表示されます。", 80, 570);
                }
                break;
  
            }
          break;
          case 5:
            //実績
            cx3.clearRect(50,50,700,460)
            cx3.strokeStyle ='orange'
            cx3.lineWidth = 2;
            cx2.fillStyle = "black";
            cx2.font = "18px Arial";
            cx3.font = "24px 'Century Gothic'";
            cx3.fillStyle = "orange";
                if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <90){
                  cx3.strokeRect(710,55,30,30)
                }
            switch(msgstate){
              case 0:
                if(mouseX >530 && mouseX <730 && mouseY >90 && mouseY <130){
                  cx3.strokeRect(530,90,200,40)
                }
                if(mouseX >530 && mouseX <730 && mouseY >418 && mouseY <468){
                  var A=Math.floor((mouseX-530)/50);
                  cx3.strokeRect(530+50*A,418,50,50);
                }
                break;
              case 1:
              if(mouseX >195 && mouseX <380 && mouseY >95 && mouseY <495){
                var I=Math.floor((mouseY-95)/20);
                cx3.strokeRect(190,92+I*20,240,20);
                if(achieveA[I].cleared>0){
                cx2.clearRect(80,530,670,70)
                cx2.fillText(achieveA[I].name, 80, 550);
                cx2.fillText(achieveA[I].sub, 80, 570);  
                }
              }
              if(mouseX >475 && mouseX <660 && mouseY >95 && mouseY <495){
                var I=Math.floor((mouseY-95)/20);
                cx3.strokeRect(470,92+I*20,240,20);
                if(I>=achieveA.length){
                  return false;
                }
                if(achieveA[I+20].cleared>0){
                cx2.clearRect(80,530,670,70)
                cx2.fillText(achieveA[I+20].name, 80, 550);
                cx2.fillText(achieveA[I+20].sub, 80, 570);  
                }
              }
                break;
            }
          break;
          case 6:
            //たいせん
            switch(msgstate){
              case 2:
                cx2.fillStyle = "white";
                cx2.font = "18px Arial";
                var elskunn=[
                  {name:"サバイバル　一般的な麻雀のようなルールです。",sub:"誰かが飛ぶかオーラス終了時までドンジャラを",suburb:"します。持ち点が多いほど高順位です。"},
                  {name:"デスマッチ　和了しても自分の持ち点は増えず、",sub:"誰かが飛んでも試合が続きます。",suburb:"（飛んだプレイヤーは2局後に75000点で復活）"},
                  {name:"持ち点　ゲーム開始時の持ち点です。",sub:"※得点基準参考：親が満貫の場合、75000点"},
                  {name:"対局数の設定　東風では最大4局まで、",sub:"半荘では最大8局までドンジャラが続きます。"},
                  {name:"満貫打ち止め　満貫ブロックの有無の設定です。",sub:"「なし」にすると高得点が出やすくなります。"},
                ];
                if(mouseX >160 && mouseX <330 && mouseY >0 && mouseY <45){
                  cx2.clearRect(10,521,400,70)
                  if(LP_PVP.Rule[0]==1){
                  cx2.fillText(elskunn[0].name, 20, 540);
                  cx2.fillText(elskunn[0].sub, 20, 560); 
                  cx2.fillText(elskunn[0].suburb, 20, 580); 
                  }else{
                  cx2.fillText(elskunn[1].name, 20, 540);
                  cx2.fillText(elskunn[1].sub, 20, 560); 
                  cx2.fillText(elskunn[1].suburb, 20, 580);  
                  }                  
                }
                if(mouseX >340 && mouseX <460 && mouseY >0 && mouseY <45){
                  cx2.clearRect(10,521,400,70);
                  cx2.fillText(elskunn[3].name, 20, 550);
                  cx2.fillText(elskunn[3].sub, 20, 570); 
                }
                if(mouseX >160 && mouseX <360 && mouseY >45 && mouseY <80){
                  cx2.clearRect(10,521,400,70);
                  cx2.fillText(elskunn[2].name, 20, 550);
                  cx2.fillText(elskunn[2].sub, 20, 570); 
                }
                if(mouseX >360 && mouseX <530 && mouseY >45 && mouseY <80){
                  cx2.clearRect(10,521,400,70);
                  cx2.fillText(elskunn[4].name, 20, 550);
                  cx2.fillText(elskunn[4].sub, 20, 570); 
                }
                if(IsHost(IAM.room)){
                  if(mouseX >610 && mouseX <790 && mouseY >100 && mouseY <170){
                    cx2.clearRect(10,521,400,70)
                    if(LP_PVP.Rule[0]==1){
                    cx2.fillText(elskunn[0].name, 20, 540);
                    cx2.fillText(elskunn[0].sub, 20, 560); 
                    cx2.fillText(elskunn[0].suburb, 20, 580); 
                    }else{
                    cx2.fillText(elskunn[1].name, 20, 540);
                    cx2.fillText(elskunn[1].sub, 20, 560); 
                    cx2.fillText(elskunn[1].suburb, 20, 580);  
                    }
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >180 && mouseY <240){
                    cx2.clearRect(10,521,400,70);
                    cx2.fillText(elskunn[2].name, 20, 550);
                    cx2.fillText(elskunn[2].sub, 20, 570); 
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >250 && mouseY <310){
                    cx2.clearRect(10,521,400,70);
                    cx2.fillText(elskunn[3].name, 20, 550);
                    cx2.fillText(elskunn[3].sub, 20, 570); 
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >310 && mouseY <390){
                    cx2.clearRect(10,521,400,70);
                    cx2.fillText(elskunn[4].name, 20, 550);
                    cx2.fillText(elskunn[4].sub, 20, 570); 
                  }
                } 
              break;      
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
          if(skillswitch[1]==0 && pvpmode==0){
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
      if(mouseX >690 && mouseX <690+size && mouseY >470 && mouseY < 590){
        cx3.clearRect(95,490,700,100)
        cx3.strokeRect(690,500,size,sizey)
        }
      }
      if(nukiswitch[1]>0){
        if(mouseY >430 && mouseY< 490){
          if(mouseX >700 && mouseX<800){
          cx3.clearRect(4,490,762,110)
          cx3.clearRect(710,440,80,40)
          }}
        if(mouseY >440 && mouseY <480){
          if(mouseX >710 && mouseX <790){
          cx3.strokeStyle ='yellow'
          cx3.lineWidth = 2;
          cx3.strokeRect(711,441,78,38)
          }}
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
            if(pvpmode==1){
      Skillname(1);
            };
    }}
        if(mouseX >0 && mouseX< 100){
          if(pvpmode==1){
            if(mouseY >100 && mouseY<200){Skillname(2,1);}
            if(mouseY >200 && mouseY<300){Skillname(3,1);}
            if(mouseY >300 && mouseY<400){Skillname(4,1);}
            if(mouseY >400 && mouseY<480){Skillname(1,1);}
          }else{
          if(mouseY >100 && mouseY<200){Skillname(2,navisw);}
          if(mouseY >200 && mouseY<300){Skillname(3,navisw);}
          if(mouseY >300 && mouseY<400){Skillname(4,navisw);}
          if(mouseY >400 && mouseY<480){Skillname(1,navisw);}
          }
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
            };
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
      function drawDP(p=1){
        console.log(DP[p]);
        //mpゲージ書く
        var x=50;
        var y=478;
        switch(p){
          case 1:
             break;
             case 2:
              y-=300;
              break;
              case 3:
                y-=200;
                break;
                case 4:
                  y-=100;
                  break;
           
        }
        cx2.fillStyle="#3d3d3d";
        cx2.clearRect(x,y,90,15);
        cx2.fillRect(x,y,90,15);
        cx2.fillStyle="#0080ff"
        cx2.fillRect(x,y,90*DP[p]/30,15);
        cx2.fillStyle="#68ceed";
        cx2.fillRect(x,y,90*DP[p]/30,5);
        cx2.strokeStyle="#e3e3e3"
        cx2.strokeRect(x,y,30,15);
        cx2.strokeRect(x+30,y,30,15);
        cx2.strokeRect(x+60,y,30,15);;
      }
      function drawbuttom(x,y,word,type=0,w=80,z=40){
        //type->活性化時
        cx2.lineWidth = 2;
        if(type==0){
        cx2.strokeStyle="#68ceed";//水色
        cx2.fillStyle="#0080ff"//蒼
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
        function drawbuttom2(x,y,word,type=0,w=170,z=60,R=0){
          //オレンジボタン Rを大きくすると文字の大きさを小さくします
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
          if(R==0){
          cx2.font = "32px 'Century Gothic'";
          cx2.fillText(word,x+20,y+45)
          }else if(R==1){
            cx2.font = "16px 'Century Gothic'";
            cx2.fillText(word,x+20,y+25)
          }
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
      cx4.clearRect(0,0,800,600);
      cx4.globalAlpha = 1;
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
        if(pvpmode==1){
          Csquare.y=400;
          for(var i=0;i<MEMBER.length;i++){
            MEMBER[i].turnflag=0;
          }
          MEMBER[turn].turnflag=1;
        }
        player1();
        break;
        default:
          if(pvpmode==1){
            turn=B-1;
              for(var i=0;i<MEMBER.length;i++){
                MEMBER[i].turnflag=0;
              }
              MEMBER[turn].turnflag=1;
              turnrole();
          }else{
          turn=B-1;
          cpu(B);
          }
          break;
      }
      }
    };
  function NukiAnimation(ts,A=0,B){
      //Ponからコピー
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
        var Reachtext='抜き'
        cx4.strokeText(Reachtext,50,300);
        cx4.fillText(Reachtext,50,300);
        cx4.rotate(15*Math.PI/180);
        if(alpha>0){
        if(A<30){window.requestAnimationFrame((ts)=>NukiAnimation(ts,A,B));}else{
        alpha -=0.1
        window.requestAnimationFrame((ts)=>NukiAnimation(ts,A,B));}
        }else if(alpha <=0){
        cx4.clearRect(0,0,800,600);cx4.globalAlpha = 1;
        console.log(B)
        NukiSkill(B,1);
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
  if(ctlswitch>1){
    ctl[ctlswitch]=4
    cpuplay(ctlswitch);
  };
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
        if(target>1){
        cLock=0;
        console.log('操作禁止')
        switch(target){
          case 2:
          case 3:
          case 4:
          var Skin=Buff[target].findIndex(value=>value==1);
          if(Skin ==-1){
            Buff[target].push(5,5,5,5,5)
            Buffdraw(target);
            console.log(Buff[target]);
            DP[player]-=20;
            drawDP(player);
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
        cx4.globalAlpha=1
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
            console.log('cpu skill')
              if(player!==target && target!==100){
              var Skin=Buff[target].findIndex(value=>value==1);
              if(Skin ==-1){
                Buff[target].push(5,5,5,5,5)
                Buffdraw(target);
                console.log(Buff[target]);
                DP[player]-=20;
                drawDP(player);
              }
            }else if(target==100){
              console.log(ctlswitch);
              //スキル演出中
              if(ctlswitch!==5){
                setTimeout(function(){
                  SpecialSkill(player,target)
                  }, 550);
              }
              return false;
            }
            e17.src=chrimg_src[p]
            e17.onload=function(){
            alpha=2;
            cx4.globalAlpha=1
            loopX=0;
            loopX2=0;
            ctlswitch=player
            skilltext1=skilltext[p].fir
            skilltext2=skilltext[p].sec
            skilltext3=skilltext[p].thr
            window.requestAnimationFrame((ts)=>SkillAnimation(ts));
            se12.play();
            skillusage[player]+=1
            skillswitch[player]=2
            SpecialSkill(player,100);
            //player1();
            }
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
        }else{
          Cskillprepare[3]=hand1[target];
          Cskillprepare[4]=skillusage2[player];
          hand1[target]=skillusage2[player]}
      }else{
        //メモライズしてから切る
      if(target>=100){ 
        if(ctlswitch==5){ 
        cLock=1;
        skillusage2[player]=hand1[target-100];
        var SX=hand1.findIndex(value=>value==skillusage2[player])
        DP[player]-=10;
        drawDP(player);
        PlayertoCpu(SX);
      }else{
        setTimeout(function(){
          SpecialSkill(player,target)
          }, 550);
        }
        return false;
      }
      }
      alpha=2;
      cx4.globalAlpha=1
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
      if(skillusage2[player]>-1){
        //メモライズしたパイに変える
        if(target>=100){ 
          if(ctlswitch==5){ 
        skillusage2[player]=-1;
      }else{
        setTimeout(function(){
          SpecialSkill(player,target)
          }, 550);
        }
        return false;
      }else{
        Cskillprepare[3]=Cpuhandtemp[target];
        Cskillprepare[4]=skillusage2[player];
        Cpuhandtemp[target]=skillusage2[player];
        skillusage[player]+=1;
      }
      }else{
        //メモライズしてから切る
        if(target>=100){ 
          if(ctlswitch==5){ 
        skillusage2[player]=Cpuhandtemp[target-100];
        var SX=Cpuhandtemp[target]
        DP[player]-=10;
        drawDP(player);
      }else{
        setTimeout(function(){
          SpecialSkill(player,target)
          }, 550);
        }
        return false;
      }
      }
      alpha=2;
      cx4.globalAlpha=1
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
      skillswitch[player]=1
      if(skillusage[player]>=2){skillswitch[player]=2}
      target+=100;
      SpecialSkill(player,target);
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
          Buff[target].push(6,6,6)
          Buffdraw(target);
          console.log(Buff[target]);
          DP[player]-=20;
          drawDP(player);
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
      cx4.globalAlpha=1
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
          console.log('cpu skill')
            if(player!==target && target!==100){
            var Skin=Buff[target].findIndex(value=>value==1);
            if(Skin ==-1){
              Buff[target].push(6,6,6)
              Buffdraw(target);
              console.log(Buff[target]);
              DP[player]-=20;
              drawDP(player);
            }
          }else if(target==100){
            console.log(ctlswitch);
            //スキル演出中
            if(ctlswitch!==5){
              setTimeout(function(){
                SpecialSkill(player,target)
                }, 550);
            }
            return false;
          }
          e17.src=chrimg_src[p]
          e17.onload=function(){
          alpha=2;
          cx4.globalAlpha=1
          loopX=0;
          loopX2=0;
          ctlswitch=player
          skilltext1=skilltext[p].fir
          skilltext2=skilltext[p].sec
          skilltext3=skilltext[p].thr
          window.requestAnimationFrame((ts)=>SkillAnimation(ts));
          se12.play();
          skillusage[player]+=1
          skillswitch[player]=2
          SpecialSkill(player,100);
          //player1();
          }
      }
      }
    }
    }//specialskill
   
  
  socket.on("nuki-pai", (data)=>{
    //非送信者なら抜きのアニメーションを表示する
    if(IAM.token!==data.Token){
      var N=1+MEMBER.findIndex(value=>value.id==data.who);
      nuki[N]+=1;
      nuki[0]=N;
      NukiSkill(N,2);
    }
  });
  function NukiSkill(player,n=0){
  //42を切ったあと、もう一度自分のターンとなる
  //nアニメ回した後に行う処理
  console.log('Nukiskill',player,n);
  if(nukiswitch[player]==0 && n !==2){
    console.log('おまじない')
    return false;
  }
  if(n==0 || n==2){
    //まずアニメーションへ
    loopX=0
    loopX2=0;
    alpha=1;
    cx2.clearRect(630,400,80,40)
    cx2.fillStyle = "rgba(20,20,20,0.5)";
    cx2.fillRect(630,400,80,40)
    e15.src=chrimg_src[chara[player]]
    e15.onload=function(){
      se8.play();
      window.requestAnimationFrame((ts)=>NukiAnimation(ts,0,player))
  }
  }else{
  switch(player){
    case 1:
    var N=hand1.findIndex(value=>value==42);
    //reach[1]=0;
    nuki[1]+=1;
    nuki[0]=player;
    PlayertoCpu(N);
      break;
  }
  }};
  socket.on("game-over", (data)=>{
    if(IAM.token!==data.Token){
      if(data.scoretemp==-1){
        scoretemp[0]=-1;
      }
      if(data.scoretemp==-2){
        scoretemp[0]=-1;
        cx4.globalAlpha=1;
        cx4.font = "bold 26px 'メイリオ'";
        cx4.fillStyle = "white";
        var RsString=['ルーム長がトイレに行きました','ルーム長権限が発動しました','ルーム長がゲームを終了させました'];
        var A=Math.floor(Math.random()*RsString.length);
        cx4.fillText(RsString[A],50,590);
      }
      gameover();
    }
  });
  function gameover(){//けっかはっぴょぉうする
    if(pvpmode==1){
      cx4.clearRect(0,0,800,500);
      jingle2.seek(1);
      jingle2.play();
      tweeNsquare.paused=true;
      Csquare.alpha=0;
      if(IsHost(IAM.room)){
        socket.emit("game_over", {Token:IAM.token,room:RoomName[IAM.room],type:0,scoretemp:scoretemp[0]});
      }
    }
    musicnum=0;
    Bgm.fade(0.05*vBar, 0, 1000);
    Bgm.on("fade", ()=>{
    Bgm.stop();
    });
            //ユーザー名をcpu2とかにされたらたまらんので
    var LPresult=[
      {pc:"Player", token:0, chara:chara[1], elia:LP[1]},
      {pc:"CPU2", token:0, chara:chara[2], elia:LP[2]},
      {pc:"CPU3", token:0, chara:chara[3], elia:LP[3]},
      {pc:"CPU1", token:0, chara:chara[4], elia:LP[4]},
        ]
      if(pvpmode==1){
        for(var i=0; i<LPresult.length;i++){
          LPresult[i].pc=MEMBER[i].name;
          LPresult[i].token=MEMBER[i].token
        }
      }
    LPresult.sort(compareFunc2);
    console.log(LPresult)
    var RankingStr=["1st","2nd","3rd","4th"];
    if(LPresult[3].elia==LPresult[2].elia){
      RankingStr[1]=RankingStr[0];
    }
    if(LPresult[2].elia==LPresult[1].elia){
      RankingStr[2]=RankingStr[1];
    }
    if(LPresult[1].elia==LPresult[0].elia){
      RankingStr[3]=RankingStr[2];
    }
    gamestate=3;
    cx1.fillStyle = "#001c0d";
    cx1.fillRect(0,0,800,600)
    cx2.clearRect(0,0,800,600)
    e10.src=chrimg_src[LPresult[3].chara]
      e10.onload=function(){
    cx2.drawImage(e10,0,0,800,600,100,50,600,450)
    e10.src=chrimg_src[LPresult[2].chara]
      e10.onload=function(){
        if(LPresult[2].chara==1){
          cx1.drawImage(e10,500,120,215,215,50,201,60,60)
          }else{
          cx1.drawImage(e10,500,50,215,215,50,201,60,60)
          }
    e10.src=chrimg_src[LPresult[1].chara]
      e10.onload=function(){
        if(LPresult[1].chara==1){
          cx1.drawImage(e10,500,120,215,215,50,301,60,60)
          }else{
          cx1.drawImage(e10,500,50,215,215,50,301,60,60)
          }
    e10.src=chrimg_src[LPresult[0].chara]
      e10.onload=function(){
        if(LPresult[0].chara==1){
          cx1.drawImage(e10,500,120,215,215,50,401,60,60)
          }else{
          cx1.drawImage(e10,500,50,215,215,50,401,60,60)
          }
    cx2.font = "bold 45px Arial";
    cx2.fillStyle = "white";
    cx2.fillText("終　局", 350, 48);
    cx2.font = "bold 40px Arial";
    cx2.fillText(RankingStr[0], 50, 100);
    cx2.font = "bold 32px Arial";
    cx2.fillText(RankingStr[1], 50, 200);
    cx2.fillText(RankingStr[2], 50, 300);
    cx2.fillText(RankingStr[3], 50, 400);
    cx2.font = "26px Arial";
    cx2.fillText("クリックで進む", 50, 550);
    //1位
    cx2.font = "bold 30px Arial";
    cx2.fillText(LPresult[3].pc, 120, 130);
    cx2.font = "bold 26px Arial";
    cx2.fillText(LPresult[2].pc, 120, 230);
    cx2.fillText(LPresult[1].pc, 120, 330);
    cx2.fillText(LPresult[0].pc, 120, 430);
  cx2.font = "bold 28px Arial";
  cx2.fillText(LPresult[3].elia, 120, 160);
  cx2.font = "bold 24px Arial";
  cx2.fillText(LPresult[2].elia, 120, 260);
  cx2.fillText(LPresult[1].elia, 120, 360);
  cx2.fillText(LPresult[0].elia, 120, 460);
      if(scoretemp[0]>=0){
        var A;
        if(pvpmode==1){
          //tokenで判別
          A=3-LPresult.findIndex(value=>value.token==IAM.token);
          //RankingStr=["1st","2nd","3rd","4th"];
        }else{
          A=3-LPresult.findIndex(value=>value.pc=="Player");         
        }
        console.log(A);
        if(A==4){
          console.log('token error!',LPresult);
          A=0;
        }
        switch(RankingStr[A]){
          case "1st":
            scoretemp[0]=0;
            break;
          case "2nd":
            scoretemp[0]=1;
            break;
          case "3rd":
            scoretemp[0]=2;
            break;
          case "4th":
            scoretemp[0]=3;
            break;
          default:
            break;
        };
        highscore[0]+=1;
      //スコア更新
      console.log(scoretemp,achievetemp,achievetempB)
        if(scoretemp[1]>highscore[3]){highscore[3]=scoretemp[1];};
        if(LP[1]>highscore[1]){highscore[1]=LP[1]};
        //if(LP[1]<=0){};
        winrank[scoretemp[0]]+=1;
        if(scoretemp[3]>highscore[2]){highscore[2]=scoretemp[3]};
        for(var i=0;i<achievetemp.length;i++){
            var A=achieveB.findIndex(value=>value.name==achievetemp[i].name);
            achieveB[A].cleared+=achievetemp[i].cleared;
            if(achievetemp[i].count>achieveB[A].count){achieveB[A].count=achievetemp[i].count};
        }
        for(var i=0;i<achievetempB.length;i++){
          if(achievetempB[i].count>0){
            var A=achieveB.findIndex(value=>value.name==achievetempB[i].name);
            if(A==-1){
              console.log('achieveB.error,', achievetempB[i].name)
            }else{
            achieveB[A].cleared+=achievetempB[i].count;
            }
          }
        }
        var T=achievetempB.findIndex(value=>value.name=="ツモ");
        var S=achievetempB.findIndex(value=>value.name=="ロン");
        var R=achievetempB.findIndex(value=>value.name=="ポン");
        var U=achievetempB.findIndex(value=>value.name=="放銃");
      if(scoretemp[0]==0 && achievetempB[U].count==0){
        AK("見える、見えるぞ！")
      }
      if(achievetempB[U].count>=3){
        AK("スケアチェイス")
      }
      if(achievetempB[R].count==0 && achievetempB[U].count==0){
        AK("もしかして空気？")
      }
      if(achievetempB[T].count==0 && achievetempB[S].count==0 && skillusage2[0]>=8){
        AK("地獄の生還者");
      }
      if(skillusage2[0]<=4){
        AK("スーパーソニック")    
      }
      var A=achieveB.filter(value=>value.sub=="シナジー役");
      var B=A.findIndex(value=>value.cleared==0);
      if(B ==-1){
        AK("シナジーコンプリート")
      };
      var A=achieveB.filter(value=>value.sub=="キャラ役");
      var B=A.findIndex(value=>value.cleared==0);
      if(B ==-1){
        AK("クレストコンプリート")
      };
    };
        }
        }}}
    }//
        
  function Skillname(player,num=0){
    //num 0->キャラ情報　1->バフ情報
  cx2.font = "bold 18px Arial";
  if(LP[player]>0){
  cx2.fillStyle = "white";
  }else{
  cx2.fillStyle = "#ff4c38";
  }
  cx2.clearRect(630,10,160,310)
  var p=chara[player]
  if(pvpmode==1){
        if(IsHost(IAM.room)){
        cx2.fillText("★"+MEMBER[player-1].name, 635, 58);
        }else{
        cx2.fillText(MEMBER[player-1].name, 635, 58);
        }
  }else{
  switch(player){
    case 1:
      cx2.fillText(Username, 635, 58);
      break;
      case 2:
        cx2.fillText("CPU1", 635, 58);
        break;
        case 3:
          cx2.fillText("CPU2", 635, 58);
          break;
          case 4:
            cx2.fillText("CPU3", 635, 58);
            break;            
  }}
  cx2.fillText(chrlist[p], 635, 80);
  cx2.fillStyle = "white";
  switch(num){
    case 0:
      drawbuttom(635,10,"スキル",1,60,20)
    if(p==1){
      cx2.font = "bold 16px Arial";
      cx2.fillText("ストーンスキン", 635, 110);
      cx2.font = "14px Arial";
      cx2.fillText("・リーチしている間,", 635, 130);
      cx2.fillText("他のスキルの効果を", 635, 150);
      cx2.fillText("受けない。", 635, 170);
      cx2.font = "bold 16px Arial";
      cx2.fillText("フレイムガイザー", 635, 190);
      cx2.font = "13px Arial";
      cx2.fillText("MP消費:2ゲージ", 635, 210);
      cx2.fillText("対象:プレイヤー1人", 635, 230);
      cx2.fillText("効果:対象を5巡の間", 635, 250);
      cx2.fillText("「火傷」状態にする.", 635, 270);
      }else if(p==2){
        var MS=Buff[player].filter(value=>value==2)
        if(!MS.length){MS=[]};
      cx2.font = "bold 16px Arial";
      cx2.fillText("マナシールド", 635, 110);
      cx2.font = "14px Arial";
      cx2.fillText("・水パイを捨てる度に", 635, 130);
      cx2.fillText("マナシールドを張る." ,635, 150);
      cx2.font = "bold 16px Arial";
      cx2.fillText("メモライズ", 635, 170);
      cx2.font = "14px Arial";
      cx2.fillText("対象:手札のパイ1つ", 635, 190);
      cx2.fillText("(オールマイティ以外)", 635, 210);
      if(skillusage2[player]==-1){
        cx2.fillText("効果：①MPを1ゲージ", 635, 230);
        cx2.fillText("消費し,対象のパイを", 635, 250);
        cx2.fillText("メモしてから切る.", 635, 270);
        cx2.fillText("メモしたパイは,", 635, 290);
        cx2.fillText("いつでも思い出せる.", 635, 310);
      }else{
      cx2.fillText("効果：②対象のパイを", 635, 230);
      cx2.fillText("メモしたパイに変える.", 635, 250);
      cx2.font = "bold 14px Arial";
      cx2.fillText(donpai[skillusage2[player]].name, 640, 270);
      cx2.fillText(donpai[skillusage2[player]].sub, 640, 290);

      }
      }else if(p==3){
      cx2.font = "bold 15px Arial";
      cx2.fillText("ネイチャーフォース", 635, 110);
      cx2.font = "14px Arial";
      cx2.fillText("・風パイを切る度に", 635, 130);
      cx2.fillText("NFバフを得る.", 635, 150);
      cx2.fillText("・強靭番の時,風パイ", 635, 170);
      cx2.fillText("が初手で入りやすい.", 635, 190);
      cx2.font = "bold 15px Arial";
      cx2.fillText("フリージングアロー", 635, 210);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:2ゲージ", 635, 230);
      cx2.fillText("対象:他のプレイヤー1人", 635, 250);
      cx2.fillText("効果:対象を3巡の間", 635, 270);
      cx2.fillText("「凍結」状態にする.", 635, 290);
      }else if(p==4){
      cx2.font = "bold 15px Arial";
      cx2.fillText("ナソードコア", 635, 110);
      cx2.font = "14px Arial";
      cx2.fillText("・太陽パイを切る度に", 635, 130);
      cx2.fillText("ナソードコアを生成する.", 635, 150);
      cx2.fillText("・ナソードコアがある時,", 635, 170);
      cx2.fillText("致死ダメージを受けても", 635, 190);
      cx2.fillText("1度だけ食いしばる.", 635, 210);
      cx2.font = "bold 15px Arial";
      cx2.fillText("グラウンドクラッシャー", 635, 230);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:3ゲージ", 635, 250);
      cx2.fillText("対象:全体", 635, 270);
      cx2.fillText("効果:台パンにより", 635, 290);
      cx2.fillText("この局を流局にする.", 635, 310);
      }else{
      cx2.font = "bold 16px Arial";
      cx2.fillText("パッシブスキル", 635, 110);
      cx2.font = "14px Arial";
      cx2.fillText("　なし", 635, 130);
      cx2.font = "bold 16px Arial";
      cx2.fillText("アクティブスキル", 635, 190);
      cx2.font = "14px Arial";
      cx2.fillText("　なし", 635, 210);
      }
    break;
   default:
    //Buff
    drawbuttom(635,10,"バフ",1,50,20)
    var y=110;
    if(LP[player]<0){
      cx2.font = "bold 20px Arial";
      cx2.fillText("戦闘不可", 635, y);
      cx2.font = "14px Arial";
      y+=20;
      var T=1+skillusage2[player]
      cx2.fillText(" "+T+"局後に復活", 635, y);
      y+=22
    }
    for(var i=1;i<12;i++){
      var A=Buff[player].filter(value=>value==i)
      if(A.length>0){
        switch(i){
          case 1:
            cx2.font = "bold 16px Arial";
            cx2.fillText("ストーンスキン", 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 自分へのスキル無効", 635, y);
            y+=22
            break;
          case 2:
            cx2.font = "bold 16px Arial";
            cx2.fillText("マナシールド"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 受けるダメージ減少", 635, y);
            y+=22
            break;
          case 3:
            cx2.font = "bold 16px Arial";
            cx2.fillText("ネイチャーフォース"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 勝利時戦闘力増加", 635, y);
            y+=22
            break;
          case 4:
            cx2.font = "bold 16px Arial";
            cx2.fillText("ナソードコア"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 勝利時追加ダメージ", 635, y);
            y+=20
            cx2.fillText(" 1度だけ,致死ダメージ", 635, y);
            y+=20
            cx2.fillText(" を受けた時食いしばり", 635, y);
            y+=22
            break;
          case 5:
            cx2.font = "bold 16px Arial";
            cx2.fillText("火傷", 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" ポン不可", 635, y);
            y+=22
            break;
          case 6:
            cx2.font = "bold 16px Arial";
            cx2.fillText("凍結"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 行動不可.", 635, y);
            y+=22
            break;
          case 7:
            cx2.font = "bold 16px Arial";
            cx2.fillText("環境　魔界"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 戦闘力が減少する.", 635, y);
            y+=20;
            cx2.fillText(" 徐々に適応していく.", 635, y);
            y+=22
            break;
          case 11:
            cx2.font = "bold 16px Arial";
            cx2.fillText("再結集のための休息", 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 次の局まで待機.", 635, y);
            y+=22
            break;
          default:
            break;
        }
      }
    }
    break;
  }
  };
    //セーブ&ロード
  function saveDL(){//*
    var json_obj = {
      "Title": Savetitle[0],
      "Name": Username,
      "Crest": Usercrest,
      "Chara":chara,
      "Volume":vBar,
      "SEVolume":sBar,
      "Config":musicset,
      "Rank":winrank,
      "AchieveA":achieveA,
      "AchieveB":achieveB,
      "Highscore":highscore,
      "MPV":mpVelocity,
      "tumoCon":tumoConfig,
      "PON":Ponrate,
      "FEV":Fever,
    }
    console.log(json_obj)
    var write_json=JSON.stringify(json_obj);
    var blob=new Blob([write_json],{type: 'application/json'});
    var a =document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download='eldon_save.json';
    a.click();
    URL.revokeObjectURL(a.href);
    alert("【セーブデータ】\nファイル名／「eldon_save.json」\n保存方法／ファイルの中身や拡張子は変更しないでください。\n※セーブデータを読み込む際は、メニュー画面の状態で、画面枠外下部に記載の『ファイル選択』ボタンから、ダウンロードしたファイルを選んでくださいね。");
    }
    function saveUP(){
    var data; // 読込むデータ
    var button_read=document.createElement('input');
    button_read.setAttribute('type', 'file');
    // 参照要素を取得
    var sp2 = document.getElementById("child")
    // 親要素を取得
    var parentDiv = sp2.parentNode
    // 新しい要素を sp2 の手前に挿入
    parentDiv.insertBefore(button_read, sp2)
    //ボタン追加ここまで

    button_read.addEventListener("change" , function(){
        if(!(button_read.value)) return; // ファイルが選択されない場合
        var file_list=button_read.files;
        if(!file_list) return; // ファイルリストが選択されない場合
        var file=file_list[0];
        if(!file) return; // ファイルが無い場合
        if(pagestate!==1){
          alert("❌　セーブデータはメイン画面の状態で読み込んでください");
          button_read.value = "";
          return;
        }
        var file_reader=new FileReader();
        file_reader.readAsText(file);
        file_reader.onload=function(){
        if(file_reader.result.slice(1, 74)=='"Title":"This is savedata of <https://azurelsword.web.fc2.com/ronan.html>'){ // .jsonの確認
    data=JSON.parse(file_reader.result); // 読込んでdataを上書き
    sp2.innerHTML = "<h1>Welcome Back!</h1>"
    //各々グローバル変数に代入していく
    Username=data.Name
    Usercrest=data.Crest
    chara=data.Chara.concat();
    musicset=data.Config.concat();
    vBar=data.Volume;
    sBar=data.SEVolume;
    winrank=data.Rank.concat();
    mpVelocity=data.MPV;
    tumoConfig=data.tumoCon;
    Ponrate=data.PON;
    Fever=data.FEV;
    //追加データ部分　undefinedなら初期値にしておく
    if (mpVelocity === void 0) {
      mpVelocity=1;
    }
    if (tumoConfig === void 0) {
      tumoConfig=0;
    }
    if (Fever === void 0) {
      Fever=0;
    }
    if (Ponrate === void 0) {
      Ponrate=0.4;
    }
    //achieveA=data.AchieveA.concat();
    //dataにある分だけ上書き
    for(var i=0; i<data.AchieveA.length; i++){
      A=achieveA.findIndex(value=>value.name==data.AchieveA[i].name);
      if(A!==-1){
        achieveA[A].cleared=data.AchieveA[i].cleared;
      }
    }
    achieveB=data.AchieveB.concat();
    highscore=data.Highscore.concat();
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
      jingle.volume(0.3*sBar);
      jingle2.volume(0.3*sBar);
      jingle.seek(1);
      jingle.play();
      alert("✅「"+Username+"」さんの　セーブデータを読込みました。");
    console.log(Username,musicset);
    pagestate=0;
    Menu();
    }  
    else{
        alert("❌　ファイルが異なります。");
        button_read.value = "";
    }}});
    }
        
  };