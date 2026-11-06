import { strategyDefinitions } from './strategy.mjs';

const line = (title, pgn, notes = {}) => ({ title, pgn, notes });
const definitions = [{
  id: 'italian', title: 'The Italian Game', side: 'w', match: /^Italian Game/,
  description: 'Develop with purpose, challenge the center, and understand the tactical pressure on f7.',
  intro: 'Welcome to the Italian Game. We begin with e4, Nf3 and Bc4: a central foothold, a developed knight, and pressure on f7. Against ...Bc5 we can prepare d4 with c3; against the Two Knights, Ng5 creates a concrete tactical question. Develop quickly, castle, and open the center only when your pieces can use it.',
  plans: ['Prepare c3 and d4 to challenge the center.', 'Castle before opening files around your own king.', 'Treat Ng5 against the Two Knights as a calculation, not a universal setup.'],
  lines: [line('Giuoco Piano: central expansion', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. O-O', {
    0: 'Take space in the center and release the bishop on f1.',
    2: 'Develop with tempo against e5. A central target makes this more useful than an aimless knight move.',
    4: 'The bishop eyes f7, which is defended only by the king. This pressure matters when the center opens.',
    6: 'c3 supports d4. We spend a tempo on a pawn because a broad center will give our pieces room.',
    8: 'Strike at e5 while the bishop is active. Calculate the check on b4 before committing.',
    10: 'Recapture toward the center; the two central pawns gain space but must be supported.',
    12: 'Meet the check by developing a piece rather than giving up the central plan.',
    18: 'Castle into safety and connect the rooks. The opening has achieved development and central activity.'
  })]
},
{
  id: 'ruy-lopez', title: 'Ruy Lopez', side: 'w', match: /^Ruy Lopez/,
  description: 'Build pressure on e5, preserve the bishop pair, and prepare a supported central break.',
  intro: 'The Spanish bishop questions the defender of e5 rather than winning that pawn immediately. In the closed main line, castle, place a rook on e1 and prepare c3 followed by d4. The light-squared bishop is often an attacking asset: keeping it is usually worth a retreat. Watch for Black’s freeing ...d5 break.',
  plans: ['Prepare c3 and d4 after castling.', 'Re1 supports e4 and creates a square for the knight route Nb1–d2–f1.', 'Respect ...d5: central counterplay can arrive before a kingside attack.'],
  lines: [line('Closed Spanish: the main structure', '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3', {4: 'Pinning the c6 knight increases pressure on e5. Nxe5 is not automatically safe: ...Qd4 can recover the pawn in many early lines.', 10: 'The rook supports e4 and prepares central play. This is a useful improving move before committing the d-pawn.', 14: 'c3 supports the coming d4 break and leaves c2 as a retreat square for the bishop.', 16: 'h3 prevents ...Bg4, keeping the knight free to support d4.'})]
},
{
  id: 'london', title: 'London System', side: 'w', match: /London System/,
  description: 'A reliable setup with clear development, central tension and a useful kingside attacking plan.',
  intro: 'The London develops the dark-squared bishop before e3 closes its diagonal. The familiar formation is useful, but it is not a script: ...c5 attacks your center and ...Qb6 can target b2. Finish development, choose a safe king square, and look for Ne5 only when the center is secure.',
  plans: ['Bring the bishop outside the pawn chain before e3.', 'Use c3 and Nbd2 to support d4 and the e4 break.', 'Answer pressure on b2 concretely; never ignore ...Qb6.'],
  lines: [line('Classical London: sound development', '1. d4 d5 2. Nf3 Nf6 3. Bf4 e6 4. e3 Bd6 5. Bg3 O-O 6. Bd3 c5 7. c3 Nc6 8. Nbd2', {4: 'Develop the bishop before playing e3. Outside the chain it influences e5 and can support a later attack.', 8: 'Preserving the bishop keeps control of e5; exchanging on d6 is also a strategic choice, not a forced response.', 12: 'c3 reinforces d4 against ...c5. The center must survive before you turn toward the king.', 14: 'Nbd2 supports e4 without obstructing the c-pawn, which already protects d4.'})]
},
{
  id: 'fried-liver', title: 'Fried Liver Attack', side: 'w', match: /Fried Liver|Lolli Attack/,
  description: 'Calculate a forcing attack on f7 and learn why king safety matters more than material.',
  intro: 'The Fried Liver is a concrete response to the risky ...Nxd5 in the Two Knights Defense. Nxf7 sacrifices a knight to draw the king out. You must follow with checks and rapid development. Black can choose the more resilient ...Na5 instead of taking on d5, so this attack is a punishment branch, not a forced win against the Two Knights.',
  plans: ['Use Ng5 to create pressure on f7.', 'After Nxf7, bring the queen with check and develop the b1 knight.', 'Do not sacrifice from memory when Black chooses a different defense.'],
  lines: [line('The knight sacrifice: forcing the king out', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Ke6 8. Nc3', {6: 'Ng5 threatens f7 twice. Black must react in the center; this is a sharp line rather than quiet development.', 10: 'The sacrifice pulls the king onto an exposed square. The compensation comes from tempo and activity, so calculate the follow-up.', 12: 'Check first: it gives Black no quiet move to complete development.', 14: 'Bring another attacker while threatening the knight on d5. An attack needs more pieces, not just more queen moves.'})]
},
{
  id: 'vienna', title: 'Vienna Gambit', side: 'w', match: /^Vienna/,
  description: 'Challenge e5 with f4, then turn the central tension into rapid piece development.',
  intro: 'The Vienna begins by defending e4 with Nc3. Against ...Nf6, f4 challenges Black’s central pawn. The critical reply ...d5 strikes back in the center; you should expect it rather than hope for a passive defense. Develop Nf3, secure the king, and use open files only after your pieces are ready.',
  plans: ['Use f4 to challenge e5, accepting that it weakens your own king.', 'Meet ...d5 with concrete central calculation.', 'Develop quickly instead of trying to keep every gambit pawn.'],
  lines: [line('The critical ...d5 counterstrike', '1. e4 e5 2. Nc3 Nf6 3. f4 d5 4. fxe5 Nxe4 5. Nf3 Be7 6. d4 O-O 7. Bd3 Nxc3 8. bxc3', {4: 'f4 asks a central question but loosens the king. The move is justified by activity, not by permanent pawn safety.', 8: 'Develop and control e5. Chasing the e4 knight before mobilizing can waste valuable time.', 10: 'd4 strengthens the center while clearing the bishop on c1.', 14: 'The doubled c-pawns support d4 and open the b-file; structural damage must be weighed against activity.'})]
},
{
  id: 'caro-kann', title: 'Caro-Kann Defense', side: 'b', match: /^Caro-Kann Defense/,
  description: 'Build a solid center, free the light-squared bishop, then challenge White’s space.',
  intro: 'The Caro-Kann prepares ...d5 with ...c6. In the Advance Variation, developing the c8 bishop before ...e6 avoids locking it behind the pawn chain. White has extra space, so Black should seek a well-timed ...c5 or ...f6 break rather than wait passively. Sound structure still requires active piece play.',
  plans: ['Develop the c8 bishop before ...e6 when the position permits.', 'Challenge d4 with ...c5 after securing the center.', 'Trade pieces carefully: space matters less as pieces disappear.'],
  lines: [line('Advance: bishop out, then central break', '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. O-O Nc6', {1: '...c6 supports ...d5 without immediately blocking the c8 bishop.', 5: 'Get the bishop outside the pawn chain before ...e6. That is the strategic point of this move order.', 9: 'Challenge the base of the pawn chain on d4. Black needs this central activity to counter White’s extra space.', 11: 'The knight adds pressure to d4 and completes a natural development route.'})]
},
{
  id: 'french', title: 'French Defense', side: 'b', match: /^French Defense/,
  description: 'Attack the base of White’s pawn chain and coordinate both central pawn breaks.',
  intro: 'The French fixes the central structure early. After e5, White has kingside space while Black attacks d4 with ...c5. The c8 bishop can be restricted, so development must be coordinated with pawn breaks. ...Qb6 and ...Nc6 increase pressure on d4; ...f6 attacks the chain’s head when the king is ready for the consequences.',
  plans: ['Attack d4 with ...c5, ...Nc6 and sometimes ...Qb6.', 'Prepare ...f6 instead of making it automatically.', 'Give the c8 bishop a job through ...Bd7, an exchange, or a favorable opening of the center.'],
  lines: [line('Advance: pressure on d4', '1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 5. Nf3 Qb6 6. a3 Nh6 7. b4 cxd4 8. cxd4 Nf5', {5: 'Hit the base of the pawn chain. If d4 weakens, e5 can become harder to maintain.', 9: 'The queen attacks d4 and b2, forcing White to defend concretely.', 11: 'The knight heads for f5, where it adds pressure to d4 without being blocked by e5.', 15: 'The knight reaches an active square. The point of the unusual route was pressure, not development for its own sake.'})]
},
{
  id: 'scandinavian', title: 'Scandinavian Defense', side: 'b', match: /^Scandinavian Defense/,
  description: 'Resolve the center early, then compensate for queen tempi with simple development.',
  intro: 'The Scandinavian challenges e4 immediately. After ...Qxd5, Nc3 gains a tempo on the queen, so Black must choose a safe queen square and develop efficiently. In the ...Qa5 structure, ...c6 stabilizes d5 and creates a retreat along the diagonal. Avoid repeated queen adventures while the minor pieces remain at home.',
  plans: ['Give the queen a safe retreat after ...Qa5.', 'Develop the light-squared bishop before ...e6 if possible.', 'Use ...c6 to reinforce the center, then finish kingside development.'],
  lines: [line('...Qa5: develop behind the queen', '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d4 Nf6 5. Nf3 c6 6. Bc4 Bf5 7. Bd2 e6', {3: 'Recover the pawn. Nc3 will gain a tempo, so plan the queen retreat in advance.', 5: 'The queen steps away from the developing knight while retaining diagonal pressure.', 9: '...c6 supports central squares and gives the queen a safer route back.', 11: 'Develop this bishop before ...e6 limits its diagonal. Do not spend more queen tempi without a concrete reason.'})]
},
{
  id: 'sicilian-najdorf', title: 'Sicilian Najdorf', side: 'b', match: /Sicilian Defense: Najdorf/,
  description: 'Keep central flexibility and create queenside counterplay in an unbalanced Sicilian.',
  intro: 'The Najdorf’s ...a6 controls b5 and keeps several central setups available. After ...e5, the d5 square becomes a lasting strategic concern, while Black gains space and active piece squares. White often attacks the kingside, so Black needs concrete queenside and central play. A pawn storm is no substitute for checking the center.',
  plans: ['Use ...a6 to control b5 and prepare queenside expansion.', 'After ...e5, watch the d5 outpost and the backward d6 pawn.', 'Counter a flank attack by calculating central breaks and queenside activity.'],
  lines: [line('English Attack: ...e5 structure', '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O', {1: 'An asymmetric central challenge creates an open c-file for later counterplay.', 9: 'Control b5 and prepare ...b5 without committing the e-pawn yet.', 11: 'Gain central space and dislodge the knight, but accept that d5 becomes a sensitive square.', 13: 'Develop toward active central squares and support the coming queenside play.'})]
},
{
  id: 'sicilian-kan', title: 'Sicilian Kan', side: 'b', match: /Sicilian Defense: (?:Kan|Paulsen)/,
  description: 'A flexible ...e6 and ...a6 system built around development and central restraint.',
  intro: 'The Kan delays the b8 knight and keeps a flexible pawn structure. ...a6 stops Nb5 and supports later ...b5. The dark-squared bishop may develop actively to c5 before retreating, while ...d6 stabilizes the center. White can build a Maroczy bind with c4; Black then needs patient piece activity and carefully prepared pawn breaks.',
  plans: ['Keep the b8 knight flexible until White’s setup is clear.', 'Challenge central space with well-prepared ...d5 or ...b5.', 'Against c4, avoid exchanging into a passive position without counterplay.'],
  lines: [line('Active bishop and a flexible center', '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Bd3 Bc5 6. Nb3 Be7 7. O-O d6 8. c4 Nf6', {3: '...e6 keeps the d5 break available and frees the f8 bishop.', 7: 'Stop Nb5 and prepare queenside expansion while keeping the knight on b8 flexible.', 9: 'Develop actively with a threat against d4, asking White to choose a knight retreat.', 13: 'Support e5 and complete the central shelter before the remaining pieces emerge.'})]
},
{
  id: 'sicilian-dragon', title: 'Sicilian Dragon', side: 'b', match: /Sicilian Defense: (?:Dragon|Accelerated Dragon|Hyperaccelerated Dragon)/,
  description: 'Use the long diagonal and open c-file while racing White’s kingside attack.',
  intro: 'The Dragon bishop belongs on g7, where it influences the long diagonal and often the queenside. In the Yugoslav Attack, White castles long and advances kingside pawns; Black seeks open lines against the other king. Every tempo can matter. Before launching a race, calculate whether a central ...d5 break changes the whole position.',
  plans: ['Activate the g7 bishop and the c-file rooks.', 'Calculate ...d5 whenever it can be achieved safely.', 'When kings castle on opposite wings, value open files and tempi over pawn counting.'],
  lines: [line('Yugoslav Attack: opposite-wing plans', '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7', {9: 'Prepare the bishop’s long diagonal. It becomes a defender of your king as well as an attacker.', 11: 'The bishop pressures the center and queenside from g7.', 15: 'Develop and add pressure to d4. Central counterplay can be stronger than an automatic pawn storm.', 17: 'The bishop connects the rooks and supports queenside coordination.'})]
},
{
  id: 'queens-gambit', title: "Queen’s Gambit", side: 'w', match: /^Queen's Gambit/,
  description: 'Challenge d5, develop actively and learn the plans behind central pawn structures.',
  intro: 'The Queen’s Gambit uses c4 to challenge d5 without moving the e-pawn too early. In the declined structures, development and the timing of central exchanges determine the middlegame. Bg5 can pin the f6 knight, while e3 and Bd3 coordinate the bishops. Do not release central tension without knowing which pawn structure you want.',
  plans: ['Use c4 to challenge d5 and create central tension.', 'Finish development before deciding between exchanges and e4.', 'After structural changes, identify the resulting weak pawns and open files.'],
  lines: [line('Declined: classical development', '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7 7. Rc1 c6 8. Bd3 dxc4 9. Bxc4 Nd5', {2: 'Challenge the d5 pawn from the flank. The aim is central influence, not merely a sacrificed c-pawn.', 6: 'Pin the defender of d5 and increase the pressure on Black’s central structure.', 12: 'A rook on the c-file becomes useful when central exchanges open it.', 16: 'Recapture while developing the bishop actively. White’s pieces are ready to fight for the center.'})]
},
{
  id: 'kings-indian', title: "King’s Indian Defense", side: 'b', match: /^King's Indian Defense/,
  description: 'Allow a broad center, then challenge it with pawn breaks and active pieces.',
  intro: 'The King’s Indian gives White central space while Black develops behind a fianchetto. That space must be challenged: ...e5 or ...c5 is the strategic foundation. In a closed center, Black may prepare ...f5 and a kingside attack, while White advances on the queenside. The center must be stable before the king’s pawn shield is moved.',
  plans: ['Challenge White’s center with ...e5 or ...c5.', 'After d5 closes the center, identify the correct wing for counterplay.', 'Prepare ...f5 with pieces and king safety in mind.'],
  lines: [line('Classical: closing the center', '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7', {5: 'Develop the bishop on the long diagonal before the center is challenged.', 11: 'Strike at the center. Giving White space only makes sense if you can attack the pawn mass.', 13: 'The knight supports central pressure and invites White to make a structural decision.', 15: 'The center is closed, so the knight relocates. Black can consider ...Nd7 and ...f5, but must calculate the timing.'})]
},
{
  id: 'english', title: 'English Opening', side: 'w', match: /^English Opening/,
  description: 'Control the center from the flank, fianchetto and choose the central structure you want.',
  intro: 'The English controls d5 with c4 while keeping the d- and e-pawns flexible. A fianchetto on g2 pressures the long diagonal. Against ...e5 and ...d5, central exchanges can produce reversed Sicilian structures. Flexibility is useful only when you eventually choose a clear plan: central expansion, queenside space, or pressure on d5.',
  plans: ['Combine c4, Nc3 and Bg2 to influence d5.', 'Keep central pawn moves flexible until Black reveals the structure.', 'Develop quickly when ...d5 opens the center.'],
  lines: [line('Four Knights fianchetto structure', '1. c4 e5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Nb6 6. Nf3 Nc6 7. O-O Be7', {0: 'Control d5 from the flank while preserving central flexibility.', 4: 'Prepare the bishop on g2. Its diagonal gives White a long-term central target.', 6: 'Exchange to clarify the center before Black gains too much space.', 8: 'The bishop supports central pressure without needing another pawn move.'})]
},
{
  id: 'jobava', title: 'Jobava London', side: 'w', match: /Jobava|Rapport-Jobava/,
  description: 'Develop actively with Nc3 and Bf4, then choose a concrete central or kingside plan.',
  intro: 'The Jobava combines Nc3 with Bf4, often creating the threat of Nb5 against c7. Black can usually meet that threat if alert, so White still needs sound development. Because Nc3 blocks the c-pawn, an e4 break can be more natural than the ordinary London’s c3 setup. React to ...c5 rather than following a fixed pattern.',
  plans: ['Use Nc3 and Bf4 actively without assuming Nb5 wins material.', 'Prepare e4 when the center supports it.', 'If ...Bb4 pins the knight, resolve development and king safety before attacking.'],
  lines: [line('Meeting the ...Bb4 pin', '1. d4 d5 2. Nc3 Nf6 3. Bf4 e6 4. e3 Bb4 5. Nge2 O-O 6. a3 Be7 7. h3', {2: 'Develop toward e4. The knight blocks the c-pawn, so this is not the ordinary c3 London structure.', 4: 'The bishop and knight can pressure c7 through Nb5, but Black has defensive resources.', 8: 'Develop without obstructing the f-pawn and support the pinned knight.', 10: 'Ask the bishop to decide. White can then complete development or prepare e4.'})]
},
{
  id: 'evans', title: 'Evans Gambit', side: 'w', match: /Evans Gambit/,
  description: 'Trade a wing pawn for central tempi and learn to keep the initiative moving.',
  intro: 'The Evans Gambit offers b4 to draw the bishop away and gain tempi with c3 and d4. The pawn investment is useful only if White develops rapidly and opens lines. Black can return material to catch up, so avoid measuring success by whether the pawn is recovered immediately. King safety and central activity are the real goals.',
  plans: ['Gain central tempi through b4, c3 and d4.', 'Castle before using the open center to attack.', 'If Black returns material, preserve activity rather than forcing an unsound attack.'],
  lines: [line('Building the central initiative', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O Nge7 8. cxd4 d5 9. exd5 Nxd5', {6: 'Offer a wing pawn to gain time against the bishop and accelerate central expansion.', 8: 'Attack the bishop while preparing d4: one pawn move achieves two concrete tasks.', 12: 'Castle rather than hurry to regain material. Development is the compensation for the pawn.', 14: 'The recapture builds a central pawn duo and opens lines for the bishops.'})]
},
{
  id: 'scotch', title: 'Scotch Game', side: 'w', match: /^Scotch Game|Scotch Gambit/,
  description: 'Open the center early and make active development count from move three.',
  intro: 'The Scotch challenges e5 with d4 before developing the f1 bishop. Central exchanges produce open lines and immediate piece contact. After Nxd4, Black can attack the knight with ...Bc5 or ...Nf6, so White should develop with threats in mind. The open position rewards activity but also makes careless queen or pawn moves easier to punish.',
  plans: ['Open the center with d4 while both sides are still developing.', 'Develop the c1 bishop actively to support the d4 knight.', 'Castle promptly in the open position.'],
  lines: [line('Classical: hold the knight and develop', '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6 6. c3 Nge7 7. Bc4 O-O', {4: 'Challenge the center before the bishop commits to a square.', 8: 'Support d4 by developing a piece. Black’s pressure should be met through coordination.', 10: 'Reinforce d4 and give the knight a central base.', 12: 'Develop with pressure on f7, preparing to castle in the open position.'})]
},
{
  id: 'kings-gambit', title: "King’s Gambit", side: 'w', match: /^King's Gambit/,
  description: 'Explore a sharp pawn sacrifice, open files and the cost of weakened king safety.',
  intro: 'The King’s Gambit offers f4 to remove Black’s e-pawn and open the f-file. It is a sharp practical weapon, not a promise of objective advantage. Black’s ...g5 can hold the extra pawn while loosening the kingside. White must develop quickly and calculate king safety carefully; every additional pawn sacrifice needs a concrete justification.',
  plans: ['Use rapid development to justify the pawn sacrifice.', 'Treat the weakened e1–h4 diagonal as a tactical concern.', 'Calculate before adding another sacrifice against ...g5.'],
  lines: [line('Kieseritzky structure: activity versus material', '1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 Nf6 6. Bc4 d5 7. exd5 Bd6 8. d4 Nh5 9. Nc3', {2: 'Challenge e5 and offer a pawn for open lines. The king becomes more exposed, so speed matters.', 6: 'Attack the pawn chain instead of allowing ...g5 to consolidate without a cost.', 10: 'Develop toward f7 and prepare to move the king out of the center.', 14: 'Support the central knight and give the bishop on c1 room to develop.'})]
},
{
  id: 'counter-london', title: 'Counter the London', side: 'b', match: /London System/,
  description: 'Challenge d4 with ...c5 and make White answer concrete queenside pressure.',
  intro: 'Against the London, Black should challenge the central setup rather than mirror it passively. ...c5 attacks d4, and ...Qb6 can ask a direct question about b2. White has several sound replies, so these moves create pressure rather than refute the opening. Develop naturally and be ready to change plans if White plays c4 or e4.',
  plans: ['Challenge d4 with ...c5 before White gets a free kingside setup.', 'Use ...Qb6 to pressure b2 only when the queen is safe.', 'Meet exchanges by developing and maintaining central influence.'],
  lines: [line('Central challenge and queen pressure', '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3 Nc6 5. Nf3 Qb6 6. Qb3 c4 7. Qc2 g6', {5: 'Challenge d4 immediately. White must now attend to the center rather than play a setup without opposition.', 9: 'Pressure b2 and d4 at once. Check tactical queen traps before grabbing a pawn.', 11: 'Gain space with tempo against the queen, accepting that the d5 pawn becomes the base of a fixed chain.', 13: 'Prepare the bishop on g7 to influence the center from a different diagonal.'})]
},
{
  id: 'nimzo-indian', title: 'Nimzo-Indian Defense', side: 'b', match: /^Nimzo-Indian Defense/,
  description: 'Fight for e4, use the pin on c3 and balance bishop-pair concessions against structure.',
  intro: 'The Nimzo-Indian controls e4 through pieces rather than a central pawn advance. ...Bb4 pins the c3 knight and may double White’s c-pawns. Giving up a bishop has a cost: Black needs central control, targets or development in return. The right pawn break depends on whether White chooses e3, Qc2, a3 or another setup.',
  plans: ['Control e4 with ...Nf6 and the c3 pin.', 'Trade on c3 only when the structural or dynamic return makes sense.', 'Challenge the center with ...d5 or ...c5 and complete development.'],
  lines: [line('Rubinstein: central development', '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O Nc6', {5: 'Pin the knight that supports e4. Black restrains the center without committing the d-pawn yet.', 9: 'Challenge d4 and claim central space before White can advance freely.', 11: 'Increase pressure against d4 with another pawn lever.', 13: 'Develop toward the central targets and connect the remaining pieces.'})]
},
{
  id: 'slav', title: 'Slav Defense', side: 'b', match: /^(?:Semi-)?Slav Defense/,
  description: 'Support d5 with ...c6 while retaining an active future for the light-squared bishop.',
  intro: 'The Slav uses ...c6 to reinforce d5 without blocking the c8 bishop. In the main line Black may capture on c4 and ask White to spend a tempo recovering the pawn. Development and the timing of ...e6 matter: if the bishop is still on c8, the resulting position has different plans from the pure Slav.',
  plans: ['Support d5 while keeping the c8 bishop flexible.', 'Do not try to hold c4 at the cost of development.', 'Prepare the freeing ...c5 or ...e5 break once the pieces are ready.'],
  lines: [line('Main line: bishop outside the chain', '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5 6. e3 e6 7. Bxc4 Bb4 8. O-O O-O', {3: 'Reinforce d5 without closing the light-squared bishop’s diagonal.', 7: 'Clarify central tension. Black expects White to recover the pawn while gaining useful development tempi.', 9: 'Develop outside the future ...e6 pawn chain.', 13: 'Pinning the c3 knight increases pressure on the central squares before Black castles.'})]
},
{
  id: 'petrov', title: 'Petrov Defense', side: 'b', match: /^Petrov's Defense/,
  description: 'Counterattack e4, neutralize early threats and develop into a balanced open center.',
  intro: 'The Petrov answers an attack on e5 with a counterattack on e4. In the main line, Black first drives the e5 knight back with ...d6 before recovering the pawn. The resulting symmetry does not remove tactical danger: open files and development still matter. Central ...d5 and active bishops give Black a sound game.',
  plans: ['Play ...d6 before recapturing e4 in the main line.', 'Use ...d5 to establish a central foothold.', 'Develop actively even when the pawn structure looks symmetrical.'],
  lines: [line('Classical: central equality', '1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Bd6 7. O-O O-O', {3: 'Counterattack e4 instead of defending e5 passively.', 5: 'Drive the advanced knight back before recovering the central pawn.', 7: 'Now recapture e4. Move order matters: premature recapture can expose tactical problems.', 9: 'Support the knight and build a firm central base.', 11: 'Develop actively toward the opposing king before castling.'})]
},
{
  id: 'catalan', title: 'Catalan Opening', side: 'w', match: /^Catalan Opening/,
  description: 'Combine a queen-pawn center with long-diagonal pressure and lasting positional targets.',
  intro: 'The Catalan combines d4 and c4 with a bishop on g2. That bishop can pressure the queenside even when the center is temporarily closed. If Black takes on c4, recover the pawn efficiently or demonstrate compensation through activity. Patient pressure is useful only if your pieces can enter the position when lines open.',
  plans: ['Coordinate Bg2 with the d4 and c4 center.', 'After ...dxc4, recover the pawn without losing development.', 'Use the c-file and long diagonal after central exchanges.'],
  lines: [line('Closed Catalan: long-term pressure', '1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7 5. Nf3 O-O 6. O-O Nbd7 7. Qc2 c6', {4: 'Choose a fianchetto to pressure the center and queenside from g2.', 6: 'The bishop may look restrained now, but central exchanges can make its diagonal powerful.', 12: 'The queen supports central play and prepares to recover c4 in some variations.'})]
},
{
  id: 'reti', title: 'Réti Opening', side: 'w', match: /^Réti Opening|King's Indian Attack/,
  description: 'Develop flexibly and challenge Black’s center with pieces and timely pawn breaks.',
  intro: 'The Réti develops Nf3 without immediately committing a central pawn. After ...d5, c4 challenges the center from the flank. A kingside fianchetto supports central pressure while White chooses the best moment for d4 or e4. If Black gains space with ...d4, use that advance as a target rather than assume it is a weakness.',
  plans: ['Use Nf3 and c4 to challenge the central dark squares.', 'Complete the fianchetto before choosing a central pawn break.', 'Against ...d4, seek well-prepared e3 or b4 counterplay.'],
  lines: [line('Advance structure: flexible development', '1. Nf3 d5 2. c4 d4 3. g3 Nc6 4. Bg2 e5 5. O-O Nf6 6. d3', {2: 'Ask Black to decide how the central pawn is supported.', 4: 'Prepare long-diagonal pressure instead of rushing to attack the pawn mass.', 8: 'Castle so that the central counterplay does not leave your king exposed.', 10: 'Stabilize central squares and free the c1 bishop; prepare a break rather than pushing at random.'})]
}

];

function movesFromPgn(pgn) {
  return pgn.replace(/\d+\.(?:\.\.)?/g, ' ').trim().split(/\s+/).filter(Boolean);
}

function parseLine(course, entry, index) {
  return { id: `${course.id}-${index + 1}`, title: entry.title, moves: movesFromPgn(entry.pgn), notes: { 0: course.intro, ...entry.notes }, ...(entry.fen ? { fen: entry.fen } : {}) };
}

export function buildCourses(openings = []) {
  return [...definitions, ...strategyDefinitions].map(definition => {
    const entries = [...definition.lines];
    const seen = new Set(entries.map(entry => movesFromPgn(entry.pgn).join(' ')));
    for (const opening of openings) {
      if (!definition.match || !definition.match.test(opening.name)) continue;
      const moves = movesFromPgn(opening.pgn);
      const key = moves.join(' ');
      if (moves.length < 6 || seen.has(key)) continue;
      seen.add(key);
      entries.push({ title: opening.name.replace(/^[^:]+: /, ''), pgn: opening.pgn, notes: {} });
    }
    const { match, ...course } = definition;
    return { ...course, category: definition.category || 'opening', previewPly: 6,
      lines: entries.map((entry, index) => parseLine(definition, entry, index)) };
  });
}
