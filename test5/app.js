/* ShivTrix Play - SIMPLE GitHub Pages realtime layer
   Transport: PeerJS CDN -> PeerJS public signalling -> WebRTC DataChannel
   No Firebase / Node / PHP / database.
*/
(function(){
  const $=window.$;
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const prefix='shivtrix-room-';
  const state={peer:null,hostConn:null,connections:new Map(),retry:null,attempts:0};

  function code(){let s='';for(let i=0;i<8;i++)s+=alphabet[Math.floor(Math.random()*alphabet.length)];return s}
  function norm(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8)}
  function hostId(c){return prefix+norm(c).toLowerCase()}
  function closePeer(){clearTimeout(state.retry);state.connections.forEach(c=>{try{c.close()}catch{}});state.connections.clear();try{state.peer&&state.peer.destroy()}catch{}state.peer=null;state.hostConn=null}
  function peerStart(id){
    return new Promise((resolve,reject)=>{
      if(!window.Peer){reject(new Error('PeerJS CDN did not load'));return}
      closePeer();
      let done=false;
      const p=new Peer(id===null?undefined:id);state.peer=p;window.peer=p;
      const timer=setTimeout(()=>{if(!done){done=true;try{p.destroy()}catch{};reject(new Error('Signalling timeout'))}},15000);
      p.on('open',()=>{if(done)return;done=true;clearTimeout(timer);resolve(p.id)})
      p.on('connection',c=>{if(window.isHost)setupHost(c);else try{c.close()}catch{}})
      p.on('error',e=>{console.error('PeerJS:',e);if(!done){done=true;clearTimeout(timer);try{p.destroy()}catch{};reject(e)}else if(e.type==='network'){window.toast('Signalling reconnecting…')}})
      p.on('disconnected',()=>{try{p.reconnect()}catch{}})
    })
  }
  function setup(c,hostSide){
    c.on('open',()=>{
      state.connections.set(c.peer,c);c.__last=Date.now();
      if(hostSide) send(c,{t:'snapshot',room:window.room,chat:window.chat||[]});
      else send(c,{t:'join',player:{id:window.me.id,name:window.me.name}});
      window.renderRoom();
    });
    c.on('data',m=>packet(c,m));
    c.on('close',()=>lost(c.peer));
    c.on('error',()=>lost(c.peer));
  }
  function setupHost(c){setup(c,true)}
  function send(c,m){try{if(c&&c.open)c.send(m)}catch(e){console.warn(e)}}
  function broadcast(m,except){state.connections.forEach((c,id)=>{if(id!==except)send(c,m)})}
  function lost(id){state.connections.delete(id);if(window.isHost){const p=window.room?.players?.find(x=>x.id===id);if(p){p.online=false;window.room.version=(window.room.version||0)+1;broadcast({t:'snapshot',room:window.room,chat:window.chat||[]});window.renderRoom()}}else if(window.hostConn?.peer===id){window.hostConn=null;retryJoin()}}

  function retryJoin(){
    clearTimeout(state.retry);
    if(window.isHost||!state.peer||state.peer.destroyed)return;
    state.attempts++;
    if(state.attempts>12){window.toast('Room connection failed. Check the 8-character code and try again.');return}
    const c=state.peer.connect(hostId(window.roomCode),{reliable:true});window.hostConn=c;
    let opened=false;
    c.on('open',()=>{opened=true;state.attempts=0;setup(c,false)});
    c.on('error',()=>{if(!opened){try{c.close()}catch{};state.retry=setTimeout(retryJoin,1200)}});
    c.on('close',()=>{if(!opened)state.retry=setTimeout(retryJoin,1200)});
  }

  function packet(c,m){
    if(!m||!m.t)return;
    if(window.isHost){
      if(m.t==='join'){
        const p=m.player;if(!p)return;
        let old=window.room.players.find(x=>x.id===p.id);
        if(old){old.name=p.name;old.online=true}else{
          if(window.room.players.length>=window.room.maxPlayers){send(c,{t:'error',msg:'Room is full'});return}
          window.room.players.push({id:p.id,name:p.name||'Player',online:true,owner:false,joinedAt:Date.now(),chips:1000});
          window.room.credits[p.id]=1000;
          window.chat.push({id:crypto.randomUUID(),playerId:'system',name:'SYSTEM',text:(p.name||'Player')+' joined',at:Date.now()});
        }
        broadcast({t:'snapshot',room:window.room,chat:window.chat});window.renderRoom();
      } else if(m.t==='event') hostEvent(m.event,c.peer);
    }else{
      if(m.t==='snapshot'){
        window.room=m.room;window.roomCode=m.room.code;window.chat=m.chat||[];window.isHost=(window.room.hostId===window.me.id);window.renderRoom();if(window.syncMusicFromRoom)window.syncMusicFromRoom();
      } else if(m.t==='chat'){window.chat.push(m.message);window.renderChat()}
      else if(m.t==='error')window.toast(m.msg||'Room error')
    }
  }

  function hostEvent(ev,from){
    if(!ev)return;
    if(ev.kind==='chat'){
      const m={id:crypto.randomUUID(),playerId:from,name:(window.room.players.find(p=>p.id===from)?.name||'Player'),text:String(ev.text||'').slice(0,300),at:Date.now()};
      window.chat.push(m);broadcast({t:'chat',message:m});window.renderChat();return;
    }
    if(ev.kind==='music'){
      if(from!==window.room.hostId)return;
      window.room.music=ev.music;broadcast({t:'snapshot',room:window.room,chat:window.chat});window.syncMusicFromRoom();return;
    }
    if(ev.kind==='credit'){
      const p=window.room.players.find(x=>x.id===from);if(!p)return;p.chips=Math.max(0,(p.chips||0)+Math.max(-1000,Math.min(1000,Number(ev.amount)||0)));window.room.credits[from]=p.chips;
    }
    if(ev.kind==='game')window.room.state[ev.game]=ev.state;
    window.room.version=(window.room.version||0)+1;
    broadcast({t:'snapshot',room:window.room,chat:window.chat});
    window.renderRoom();
  }

  window.startPeer=async function(id){return peerStart(id)};
  window.cleanupPeer=closePeer;
  window.broadcast=function(m){broadcast(m)};
  window.send=function(c,m){send(c,m)};
  window.connectToHost=retryJoin;
  window.setupConn=function(c){setup(c,false)};
  window.sendEvent=function(ev){
    ev.playerId=window.me.id;
    if(window.isHost)hostEvent(ev,window.me.id);
    else if(state.hostConn?.open)send(state.hostConn,{t:'event',event:ev});
    else window.toast('Not connected to room');
  };

  window.createRoom=async function(){
    window.me.name=$('createPlayer').value.trim()||window.me.name;localStorage.setItem(window.STORE+':name',window.me.name);
    for(let n=0;n<8;n++){
      const c=code();window.roomCode=c;window.room=window.defaultRoom(c,$('createName').value.trim()||'Live Room',$('createGame').value,+$('createPlayers').value);window.room.adminToken=crypto.randomUUID().replaceAll('-','').slice(0,16).toUpperCase();window.isHost=true;
      try{await peerStart(hostId(c));break}catch(e){if(n===7){window.isHost=false;window.toast('Signalling server unavailable. Refresh and try again.');return}}
    }
    window.chat=[];window.saveLocalRoom?.();window.closeModal();document.querySelector('[data-page="rooms"]').click();window.toast('Room '+window.roomCode+' created');window.renderRoom();
  };

  window.joinRoom=async function(){
    const c=norm($('joinCode').value);if(!/^[A-Z0-9]{8}$/.test(c)){window.toast('Enter exactly 8 letters/numbers');return}
    window.me.name=$('joinPlayer').value.trim()||window.me.name;localStorage.setItem(window.STORE+':name',window.me.name);window.roomCode=c;window.isHost=false;window.room=null;state.attempts=0;
    try{await peerStart(null);window.closeModal();document.querySelector('[data-page="rooms"]').click();window.toast('Connecting to '+c+'…');retryJoin()}catch(e){console.error(e);window.toast('Could not start realtime connection. Check internet/CDN access.')}
  };

  // Game rendering: always render the shared room.state received from the host.
  window.renderHighCard=function(m){
    const s=window.room?.state?.higher||{};
    m.innerHTML=`<div><div id="cardValue" class="result">${s.card??'—'}</div><button class="btn primary" onclick="dealHighCard()">Deal High Card</button><div id="gameResult" class="result">${s.card?(s.card>=11?'👑 High Card!':'🃏 Card dealt'):'Waiting...'}</div></div>`;
  };
  window.dealHighCard=function(){const c=Math.floor(Math.random()*13)+1;window.sendEvent({kind:'game',game:'higher',state:{card:c,by:window.me.id,at:Date.now()}})};
  window.renderInOut=function(m){const s=window.room?.state?.inout||{bets:{}};m.innerHTML=`<div><div id="ioResult" class="result">${s.result||'IN / OUT'}</div><p class="muted">Your pick: ${s.bets?.[window.me.id]||'—'}</p><div class="actions"><button class="btn primary" onclick="io('IN')">🔵 IN</button><button class="btn danger" onclick="io('OUT')">🔴 OUT</button><button class="btn" onclick="ioResolve()">🎲 Resolve</button></div></div>`};
  window.io=function(c){const s=structuredClone(window.room?.state?.inout||{bets:{}});s.bets=s.bets||{};s.bets[window.me.id]=c;window.sendEvent({kind:'game',game:'inout',state:s})};
  window.ioResolve=function(){if(!window.isHost)return window.toast('Only host resolves');const s=structuredClone(window.room?.state?.inout||{bets:{}});s.result=Math.random()<.5?'IN':'OUT';s.at=Date.now();window.sendEvent({kind:'game',game:'inout',state:s})};

  // Re-render room game when any snapshot arrives.
  const oldRenderRoom=window.renderRoom;
  window.renderRoom=function(){oldRenderRoom();const mount=$('roomGame');if(mount&&window.room)window.renderGame(window.room.game,mount)};
})();
