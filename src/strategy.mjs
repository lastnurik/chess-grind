// Original practice examples. FENs are reached by legal standard-opening sequences.
// These lessons illustrate concepts; the opponent moves are illustrative, not forced.
export const strategyDefinitions = [
  {
    id: 'strategy-central-breaks', title: 'Strategy: Central Pawn Breaks', side: 'w', category: 'strategy',
    description: 'Recognize when a supported pawn break can transform space into active pieces.',
    intro: 'A pawn break changes the structure rather than merely gaining territory. Here c3 supports d4, the bishops can use open diagonals, and the center is ready to be challenged. Calculate captures and checks before opening it. The goal is a position where your pieces become more active after the exchanges.',
    plans: ['Prepare the break with enough pawn and piece support.', 'Calculate forcing replies before changing the structure.', 'Use the opened files after the break rather than immediately starting a second plan.'],
    lines: [{ title: 'Italian center: supported d4', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5',
      pgn: 'd4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 O-O O-O d5 exd5 Nxd5',
      notes: {
        0: 'The break is ready: c3 supports d4 and the bishop on c4 can use an open center. First check the forcing ...Bb4+ reply, then challenge e5.',
        2: 'Recapture toward the center to gain space. The d4 pawn controls e5 and c5, but space is useful only when it supports piece activity.',
        4: 'Develop a piece to answer the check. Blocking with a useful developing move keeps the central plan intact.',
        6: 'Recapture with the undeveloped knight. The pieces are cooperating; now secure the king before more central files open.',
        8: 'Castle. The structure has opened, so king safety becomes urgent. Your next decisions should focus on active files and central targets.',
        10: 'Clarify the new central tension. Black’s ...d5 is a healthy counterbreak, so recognize that the position has changed from a one-sided space advantage to active central play.'
      }
    }]
  },
  {
    id: 'strategy-development', title: 'Strategy: Development & Initiative', side: 'w', category: 'strategy',
    description: 'Use the famous Opera Game position to turn a lead in development into forcing play.',
    intro: 'In this historical position from Morphy’s Opera Game, White’s pieces are active while Black’s king is still in the center. A development lead is temporary: waiting lets the opponent catch up. The sequence demonstrates how opening lines and bringing the last rook into play can matter more than holding material.',
    plans: ['Open lines while the enemy king remains in the center.', 'Bring undeveloped heavy pieces into the attack with tempo.', 'Calculate every forcing sacrifice; an attractive pattern alone is not enough.'],
    lines: [{ title: 'Opera Game: open lines, then coordinate', fen: 'rn2kb1r/p3qppp/2p2n2/1p2p1B1/2B1P3/1QN5/PPP2PPP/R3K2R w KQkq - 0 10',
      pgn: 'Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#',
      notes: {
        0: 'White has a development lead and Black’s king is exposed. Nxb5 opens lines rather than preserving every piece; calculate the bishop check after ...cxb5.',
        2: 'The bishop enters with check, so Black cannot use a quiet move to finish development. Forcing tempi keep the initiative alive.',
        4: 'Castle long to bring the a1 rook onto the open d-file. This move improves king safety and adds an attacker at the same time.',
        6: 'Remove the defender on d7. The sacrifice is concrete: the other rook can occupy d1 after the exchange.',
        8: 'Bring the last rook into play. The attack now uses the open file with all available force instead of relying on the queen alone.',
        10: 'Remove another defender with check. Before sacrificing material, account for every legal response.',
        12: 'The queen sacrifice deflects the knight from d7 to b8, clearing the d-file so the rook can invade d8 with mate.',
        14: 'The coordinated attack finishes on the open file. The lesson is the sequence of useful forcing moves that made the final pattern possible.'
      }
    }]
  },
  {
    id: 'strategy-carlsbad', title: 'Strategy: The Minority Attack', side: 'w', category: 'strategy',
    description: 'Create a lasting queenside target in the Carlsbad pawn structure.',
    intro: 'The Carlsbad structure gives White a smaller queenside pawn group facing Black’s larger one. Advancing b4–b5 can provoke exchanges that leave a backward c-pawn. The aim is a target, not a quick pawn race. Keep the center under control and watch for Black’s kingside counterplay while the queenside plan unfolds.',
    plans: ['Prepare b4–b5 with rooks and supporting pawns.', 'Exchange to create a weak c6 pawn or an open file.', 'Check the center and king before committing to a flank plan.'],
    lines: [{ title: 'Carlsbad: b4–b5 creates a target', fen: 'r1bqrnk1/pp3ppp/2pb1n2/3p2B1/3P4/2NBPN2/PPQ2PPP/1R3RK1 w - - 2 12',
      pgn: 'b4 a6 a4 Ng6 b5 axb5 axb5 h6 Bxf6 Qxf6 bxc6 bxc6',
      notes: {
        0: 'Begin the minority attack. The b-pawn advances toward the larger opposing pawn group to provoke structural weaknesses rather than simply gain space.',
        2: 'Support b5 with a4. White’s rook is already behind the b-pawn, so the flank operation has enough support.',
        4: 'Challenge c6 and a6. The central d4 pawn must remain secure while White spends time on the queenside.',
        6: 'Recapture with the a-pawn to maintain the pressure on c6 and keep the b-file open for the rook.',
        8: 'Resolve the attacked bishop before continuing. Strategic plans must yield to immediate threats.',
        10: 'Exchange on c6 to leave a potential backward pawn. The next phase is to pressure the target; creating a weakness is only the first half of the plan.'
      }
    }]
  },
  {
    id: 'strategy-isolani', title: 'Strategy: The Isolated Queen’s Pawn', side: 'w', category: 'strategy',
    description: 'Use active pieces and attacking squares to compensate for an isolated d-pawn.',
    intro: 'White’s isolated d4 pawn grants space and useful squares, but it may become a target after exchanges. The side with the isolani usually values active pieces and attacking chances; the defender often wants a blockade and simplification. Here White develops, occupies the c-file and builds a queen-and-bishop battery. These are plans, not a forced win.',
    plans: ['Use the e5 and c5 outposts supported by d4.', 'Keep enough pieces for activity and a possible d5 break.', 'Avoid passive exchanges that leave only the isolated pawn’s weakness.'],
    lines: [{ title: 'Panov structure: activity before simplification', fen: 'r1bq1rk1/pp2bppp/2n1pn2/8/3P4/2NB1N2/PP3PPP/R1BQR1K1 w - - 6 11',
      pgn: 'Be3 b6 Rc1 Bb7 Bb1 Rc8 Qd3 g6 Ne5',
      notes: {
        0: 'Develop the remaining bishop while supporting d4. The isolani is strongest when its space helps active pieces coordinate.',
        2: 'Occupy the open c-file. Active rooks give White a reason to keep pieces rather than drift toward a passive ending.',
        4: 'The bishop retreats onto the b1–h7 diagonal. The retreat is purposeful: Qd3 can create a battery toward the king.',
        6: 'Build the battery, making Black consider h7. A strategic threat can provoke pawn moves that create new weak squares.',
        8: 'Use the central outpost supported by d4. A well-placed piece demonstrates the isolani’s dynamic value, while the pawn’s long-term weakness still remains.'
      }
    }]
  },
  {
    id: 'strategy-fianchetto', title: 'Strategy: Fianchetto & Pawn Chains', side: 'b', category: 'strategy',
    description: 'Connect a fianchetto setup to the central break and the correct wing for counterplay.',
    intro: 'A fianchetto is a piece arrangement, not a complete strategy. In the King’s Indian structure, Black must challenge White’s broad center. After ...e5 and d5 close the center, the pawn chains point the armies toward different wings. Black can prepare ...f5, but only after accounting for central stability and the king’s defensive needs.',
    plans: ['Challenge the broad center with ...e5.', 'Relocate blocked pieces before launching pawn play.', 'Use the closed center to justify ...f5 while monitoring king safety.'],
    lines: [{ title: 'Closed King’s Indian: prepare the kingside break', fen: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ - 3 6',
      pgn: 'e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3 f5 f3 f4',
      notes: {
        0: 'Challenge the center. Without a pawn break, White’s space could simply grow while the g7 bishop remains restricted.',
        2: 'Develop with pressure on d4 and ask White to clarify the central structure.',
        4: 'The center is now closed. Relocate the knight rather than leave it attacked, preparing coordination for kingside play.',
        6: 'Clear the f-file pawn’s route and support the coming break. The preparation makes ...f5 more than a hopeful pawn push.',
        8: 'Play the thematic break. A closed center gives Black time for kingside action, but calculate captures before advancing.',
        10: 'Gain space and restrict the opposing pieces. Black’s attack must now be supported by piece play; more pawn moves alone will not finish the job.'
      }
    }]
  }
];
