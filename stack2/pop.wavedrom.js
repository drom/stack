// pop cases
{signal:[
  {name: 'clk',    wave: 'p.Pp..P..p..PpPp..'},
  {name: 'cmd',    wave: '232..3332..3232...', data: '- pop - pop pop pop - pop - pop -'},
  {name: 'state',  wave: '=.===.==.==.=====.', data: 'A B C A B D C A B C D C A'},
  {},
  {name: 'nxtsel', wave: '=......=.=........', data: 's1 q s1'},
  {name: 'nxt',    wave: '=.=...===...=.=...', data: '8 7 6 5 4 3 2'},
  {name: 's0',     wave: '=.3=..333=..3=3=..', data: '9 8 8 7 6 5 5 4 4 3 3'},
  {name: 's1',     wave: '=.3=..3=.3=.3=3=..', data: '8 7 7 6 6 4 4 3 3 2 2'},
  {name: 's2',     wave: '=...3=....3=....3=', data: '7 6 6 3 3 1 1'},
  {},
  {name: 're',     wave: '010..1..0..1010...'},
  {name: 'we',     wave: '0.................'},
  {name: 'a',      wave: 'x3x..333x..3x3x...', data: 'a6 a5 a4 a3 a2 a1'},
  {name: 'q',      wave: 'x..3x..333x..3x3x.', data: '6 5 4 3 2 1'},
  {name: 'd',      wave: 'x.................'},
]}
