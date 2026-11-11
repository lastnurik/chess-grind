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
    squares.push(`<${interactive?'button':'div'} class="square ${light?'light':'dark'} ${marked?'last-move':''} ${selected===square?'selected':''} ${hint?.from===square?'hint-source':''}" ${interactive?`type="button" data-square="${square}" aria-label="${label}" draggable="false"`:''}>${!miniature&&col===0?`<span class="rank">${ranks[row]}</span>`:''}${!miniature&&row===7?`<span class="file">${files[col]}</span>`:''}${piece?`<svg class="piece" viewBox="0 0 40 40" aria-hidden="true"><use href="./assets/pieces.svg#${piece.color}${piece.type}"/></svg>`:''}${destinations.includes(square)?`<span class="legal-dot ${piece?'capture':''}"></span>`:''}</${interactive?'button':'div'}>`);
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
  let drag = null, suppressClick = false;
  const squareAt = target => {
    const square = target?.closest('[data-square]');
    return square && container.contains(square) ? square : null;
  };
  function resetDrag() {
    const previous = drag;
    drag = null;
    if (!previous) return;
    previous.piece.style.transform = '';
    previous.source.classList.remove('dragging');
    if (container.hasPointerCapture(previous.id)) container.releasePointerCapture(previous.id);
    suppressClick = previous.moved;
  }
  container.addEventListener('click', e => {
    if (suppressClick && e.detail !== 0) {
      suppressClick = false;
      e.preventDefault();
      return;
    }
    const square = squareAt(e.target)?.dataset.square;
    if (square) onSelect(square);
  });
  // Native dragging creates a browser image preview instead of moving the piece.
  container.addEventListener('dragstart', e => e.preventDefault());
  container.addEventListener('pointerdown', e => {
    if (drag || !e.isPrimary || e.button !== 0) return;
    suppressClick = false;
    const source = squareAt(e.target), game = getGame();
    if (!source || game.get(source.dataset.square)?.color !== game.turn()) return;
    const piece = source.querySelector('.piece');
    if (!piece) return;
    drag = { id: e.pointerId, source, piece, from: source.dataset.square,
      x: e.clientX, y: e.clientY, fen: game.fen(), moved: false };
    container.setPointerCapture(e.pointerId);
  });
  container.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    if (getGame().fen() !== drag.fen) return resetDrag();
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    e.preventDefault();
    drag.source.classList.add('dragging');
    drag.piece.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  container.addEventListener('pointerup', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const { from, fen, moved } = drag;
    const to = squareAt(container.ownerDocument.elementFromPoint(e.clientX, e.clientY))?.dataset.square;
    resetDrag();
    suppressClick = true;
    if (getGame().fen() !== fen) return;
    if (!moved) onSelect(from);
    else if (to && to !== from) onMove(from, to);
  });
  for (const type of ['pointercancel', 'lostpointercapture']) {
    container.addEventListener(type, e => { if (drag?.id === e.pointerId) resetDrag(); });
  }
}
