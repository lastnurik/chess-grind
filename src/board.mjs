import { Chess } from '../vendor/chess.js';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pieceNames = {p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};

export function boardHtml(fen, { flipped = false, selected = '', lastMove = null, hint = null, interactive = false, miniature = false } = {}) {
  const game = new Chess(fen);
  const squares = [];
  const files = flipped ? 'hgfedcba' : 'abcdefgh';
  const ranks = flipped ? '12345678' : '87654321';
  const destinations = selected ? game.moves({square:selected,verbose:true}).map(m=>m.to) : [];
  for (let row=0; row<8; row++) for (let col=0; col<8; col++) {
    const square = files[col]+ranks[row];
    const piece = game.get(square);
    const light = (square.charCodeAt(0)-97+Number(square[1]))%2===0;
    const marked = lastMove && (lastMove.from===square || lastMove.to===square);
    const label = `${square}${piece ? ` ${piece.color==='w'?'white':'black'} ${pieceNames[piece.type]}` : ''}`;
    squares.push(`<${interactive?'button':'div'} class="square ${light?'light':'dark'} ${marked?'last-move':''} ${selected===square?'selected':''} ${hint?.from===square?'hint-source':''}" ${interactive?`type="button" data-square="${square}" aria-label="${label}" ${piece?'draggable="true"':''}`:''}>${!miniature&&col===0?`<span class="rank">${ranks[row]}</span>`:''}${!miniature&&row===7?`<span class="file">${files[col]}</span>`:''}${piece?`<svg class="piece" viewBox="0 0 40 40" aria-hidden="true"><use href="./assets/pieces.svg#${piece.color}${piece.type}"/></svg>`:''}${destinations.includes(square)?`<span class="legal-dot ${piece?'capture':''}"></span>`:''}</${interactive?'button':'div'}>`);
  }
  let arrow = '';
  if (hint?.to) {
    const point = square=>[(files.indexOf(square[0])+.5)*100,(ranks.indexOf(square[1])+.5)*100];
    const [x1,y1]=point(hint.from),[x2,y2]=point(hint.to);
    arrow=`<svg class="board-arrows" viewBox="0 0 800 800" aria-hidden="true"><defs><marker id="hint-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0 10 5 0 10z" fill="#e89825"/></marker></defs><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e89825" stroke-width="17" opacity=".85" marker-end="url(#hint-arrow)"/></svg>`;
  }
  return `<div class="chessboard ${miniature?'miniature':''}" ${interactive?'aria-label="Chessboard"':''}>${squares.join('')}${arrow}</div>`;
}

export function bindBoard(container, { getGame, onSelect, onMove }) {
  let dragged = null;
  container.addEventListener('click', e=>{
    const square = e.target.closest('[data-square]')?.dataset.square;
    if(square) onSelect(square);
  });
  container.addEventListener('dragstart', e=>{
    const square = e.target.closest('[data-square]')?.dataset.square;
    if(!square || !getGame().get(square)) return e.preventDefault();
    dragged = square;
    e.dataTransfer.setData('text/plain',square);
    e.dataTransfer.effectAllowed='move';
  });
  container.addEventListener('dragover', e=>{if(e.target.closest('[data-square]')) e.preventDefault();});
  container.addEventListener('drop', e=>{
    e.preventDefault();
    const to=e.target.closest('[data-square]')?.dataset.square;
    if(dragged&&to&&dragged!==to) onMove(dragged,to);
    dragged=null;
  });
  container.addEventListener('dragend',()=>{dragged=null;});
}
