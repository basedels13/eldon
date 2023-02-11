const express =require("express");
const app  = express();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);
const crypto = require('crypto');
//接続人数
var iCountUser=0;
// トークンを作成する際の秘密鍵
const SECRET_TOKEN = "abcdefghijklmn12345";
// チャット参加者一覧
const MEMBER = {};
  // ↑以下のような内容のデータが入る
  //   "socket.id": {token:"abcd", name:"foo"},
  //   "socket.id": {token:"efgh", name:"bar"}
//ルーム
var Room1=[];
  // ↑以下のような内容のデータが入る
  //  0: {id: 0, name: 'player', chr: 0}
  //  1: {id: 1, name: 'player', chr: 0}
var turnG=0;
var turnroleG=[0,0,0,0,0]
  //だれのターンか
  //各プレイヤーの状況を1-4で管理

/**
 * "/"にアクセスがあったらindex.htmlを返却
 */
app.use(express.static("public"));

app.get("/", (req, res)=>{
//res.render("index",{text: "NodejsとExpress"});
  res.status(500).json({msg:"エラー 500"});
});

/**
 * [イベント] ユーザーが接続
 */
io.on("connection", (socket)=>{
 //ログインユーザ
 var token;
  iCountUser+=1;
  console.log('someone connected');
  io.emit('xxx', { message: iCountUser });
  (()=>{
    // トークンを作成
    token = makeToken(socket.id);
    // ユーザーリストに追加
    MEMBER[socket.id] = {token: token, name:null};
    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();
   
 //入場
 socket.on("join", (data)=>{
     //--------------------------
    // トークンが正しければ
    //--------------------------
    if( authToken(socket.id, data.token) ){
      // 入室OK + 現在の入室者一覧を通知
      const memberlist = getMemberList();
      io.to(socket.id).emit("join-result", {status: true, list: memberlist});

    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else{
      // 本人にNG通知
      io.to(socket.id).emit("join-result", {status: false});
    }
 });
 //ルーム入場
 socket.on("join_to_room", (data)=>{
  //人数オーバーの話はとりあえず考えないことにする
  //console.log('message', data.name,data.chr);
    //--------------------------
    // トークンが正しければ
    //--------------------------
    if( authToken(socket.id, data.token) ){
    // 入室OK
    // メンバー一覧に追加
  MEMBER[socket.id].name = data.name;
  socket.join(data.room);
   Room1.push({id:0,token:data.token,name:data.name, chr:data.chr, ready:false});
   //idを振り直す
   for (var i=0; i<Room1.length;i++){
    Room1[i].id=i;
   }
    console.log(Room1);
    io.to(socket.id).emit("room-result", {status: true, list: Room1});
    io.to('room1').emit("room-update", {status: true, list: Room1});
  //console.log(Room1);
}else{
  //--------------------------
  // トークンが誤っていた場合
  //--------------------------

  // 本人にNG通知
  io.to(socket.id).emit("room-result", {status: false});
}
});
//Ready
socket.on("ready_to_start", (data)=>{
switch(data.room){
  case 'room1':
switch(data.ready){
  case -1:
    //host
    for(var i=1;i<Room1.length;i++){
      if(!Room1[i].ready){
        io.to(socket.id).emit("start-result", {status: false});
        return false;
      }
    }
    io.to('room1').emit("start-result", {status: true});
    break;
  case 0:
    var A=Room1.findIndex(value=>value.token==data.token);
    if(A==-1){
      console.log('token error!');
    }else{
      Room1[A].ready=true;
      io.to(socket.id).emit("ready-result", {status: true});
      io.to('room1').emit("room-update", {status: true, list: Room1});   
    }
    break;
  case 1:
    var A=Room1.findIndex(value=>value.token==data.token);
    if(A==-1){
      console.log('token error!');
    }else{
      Room1[A].ready=false;
      io.to(socket.id).emit("ready-result", {status: false});
      io.to('room1').emit("room-update", {status: true, list: Room1});   
    }
    break;
};
break;
};
});
 //ルーム退出
 socket.on("leave_to_room", (data)=>{
  console.log('leave', data.name,data.chr);
  socket.leave(data.room);
  Roomleave(1,data.token);
});
 //接続切れイベントを設定
  socket.on("disconnect", function () {
      iCountUser-=1;
      console.log(token);
      console.log('someone disconnected');  
      //メンバーから削除
      Roomleave(1,token);
      delete MEMBER[socket.id]; 
      io.emit('xxx', { message: iCountUser });
  });

    // Clientにメッセージを送信
    //setInterval(() => {
      //socket.emit('xxx', { message: iCountUser });
      //io.to('room1').emit("room-update", {status: true, list: Room1});
    //}, 1000);
});

//socket.emit⇒その人だけにお返事
//io.emit⇒全員にお返事
//io.to('room')⇒roomの人にお返事

/**
 * ←デプロイ後のポートを任せる/→3000番でサーバを起動する
 */
http.listen(process.env.PORT || 3000, ()=>{
  console.log("listening on *:3000");
});

function makeToken(id){
  const str = "aqwsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
};
function authToken(socketid, token){
  return(
    (socketid in MEMBER) && (token === MEMBER[socketid].token)
  );
};
function getMemberList(){
  const list = [];
  for( let key in MEMBER ){
    const cur = MEMBER[key];
    if( cur.name !== null ){
      list.push({token:cur.count, name:cur.name});
    }
  }
  return(list);
};
function Roomleave(room=1,tokenV){
  //トークン同じ人をルームのリストから削除
  switch(room){
    case 1:
      var A=Room1.findIndex(value=>value.token==tokenV);
      if(A==-1){
        console.log('token error!');
        return false;
      }else{
       Room1.splice(A,1);
      }
          //idを振り直す
          for (var i=0; i<Room1.length;i++){
            Room1[i].id=i;
           }
        console.log(Room1);   
        io.to('room1').emit("room-update", {status: true, list: Room1});   
      break;
    //2,3工事中
  }
}
