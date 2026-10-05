/* ShivTrix Play realtime game-state renderer patch
   GitHub Pages + PeerJS/WebRTC only.
   The network layer already broadcasts room snapshots. This file makes every
   game renderer consume room.state so remote actions are visible on clients.
*/
(function(){
  const $ = window.$ || (id => document.getElementById(id));
  const esc = window.esc || (s => String(s ?? ''));
  const now = window.now || (() => Date.now());

  function stateFor(id){
    return (window.room && window.room.state && window.room.state[id]) || {};
  }

  function renderHighCard(m){
    const s=stateFor('higher');
    const card=s.card ?? '—';
    const who=s.by ? (window.playerName ? window.playerName(s.by) : 'Player') : '';
    m.innerHTML=`<div><div id="cardValue" class="result">${esc(card)}</div><button class="btn primary" onclick="dealHighCard()">Deal High Card</button><div id="gameResult" class="result">${s.card!=null ? (who ? esc(who)+' dealt '+esc(card) : '🃏 Card dealt') : 'Waiting...'}</div></div>`;
  }

  function renderDice(m){
    const s=stateFor('dice');
    const who=s.by ? (window.playerName ? window.playerName(s.by) : 'Player') : '';
    m.innerHTML=`<div><button class="btn primary" onclick="rollRoomDice()">🎲 Roll D6</button><div id="gameResult" class="result">${s.last!=null ? '🎲 '+esc(s.last)+(who?' • '+esc(who):'') : '—'}</div></div>`;
  }

  function renderParty(m,id){
    const s=stateFor(id);
    const n=s.n;
    let text='—';
    if(n!=null) text=id==='inout' ? (n%2?'🔵 IN':'🔴 OUT') : 'Round '+n;
    if(id==='inout' && s.result) text='Result: '+esc(s.result);
    const who=s.by ? (window.playerName ? window.playerName(s.by) : 'Player') : '';
    m.innerHTML=`<div><div class="game-icon">${id==='inout'?'🔴':'🎮'}</div><div id="gameResult" class="result">${text}</div><button class="btn primary" onclick="partyRound('${id}')">Start Round</button>${who?`<div class="muted">Last action by ${esc(who)}</div>`:''}</div>`;
  }

  function renderInOut(m){
    const s=stateFor('inout');
    const bets=s.bets||{};
    const mine=bets[window.me?.id];
    const result=s.result ? 'Result: '+s.result : (mine ? 'Your pick: '+mine : 'IN / OUT');
    m.innerHTML=`<div><div id="ioResult" class="result">${esc(result)}</div><p class="muted">Virtual chips only.</p><div class="actions"><button class="btn primary" onclick="io('IN')">🔵 IN</button><button class="btn danger" onclick="io('OUT')">🔴 OUT</button><button class="btn" onclick="ioResolve()">🎲 Resolve</button></div></div>`;
  }

  function renderTTT(m){
    const s=stateFor('ttt');
    const board=Array.isArray(s.board)?s.board:Array(9).fill('');
    window.tttb=board.slice();
    m.innerHTML='<div><div class="game-board ttt">'+board.map((v,i)=>`<button class="cell" onclick="ttt(${i},this)">${esc(v||'')}</button>`).join('')+'</div><div id="gameStatus" class="result">'+(s.at?'Live board':'Your turn')+'</div></div>';
  }

  function renderGamePatched(id,m){
    if(id==='patti') return window.renderPatti(m);
    if(id==='inout') return renderInOut(m);
    if(id==='higher') return renderHighCard(m);
    if(id==='dice') return renderDice(m);
    if(id==='ttt') return renderTTT(m);
    if(id==='reaction'){
      m.innerHTML=`<button id="reactGame" class="btn primary" onclick="reactionGame()">START</button><div id="gameResult" class="result">—</div>`;
      return;
    }
    if(id==='memory'){
      m.innerHTML=`<div id="memSeq" class="result">Press start</div><button class="btn primary" onclick="memoryGame()">Start sequence</button>`;
      return;
    }
    return renderParty(m,id);
  }

  // Preserve the original implementation for Patti and the other existing UI.
  window.renderGame=renderGamePatched;

  // Make local game actions immediately use the authoritative room state after
  // the host broadcasts a snapshot.
  const originalApplyClientEvent=window.applyClientEvent;
  window.applyClientEvent=function(ev){
    if(typeof originalApplyClientEvent==='function') originalApplyClientEvent(ev);
    if(ev && ev.kind==='game' && window.room) {
      try { window.renderRoom(); } catch(e) { console.warn('game refresh',e); }
    }
  };

  // Add a small visible sync marker without changing the existing design.
  window.__shivtrixRealtimePatch=true;
})();
