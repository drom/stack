// mixed push/pop case
{signal:[
  {name: 'clk',    wave: 'p.P..p.P..p'},
  {name: 'cmd',    wave: '=434=.334=.', data: '- push pop push - pop pop push -'},
  {name: 'state',  wave: '=..==..===.', data: 'A B A B D A'},
  {},
  {name: 'nxtsel', wave: '=====....==', data: 's1 in s1 in s1 in s1'},
  {name: 'nxt',    wave: '=4=4=...4=.', data: '8 10 9 x10 9 x9'},
  {name: 's0',     wave: '=.434=.334=', data: '9 10 9 x10 x10 9 8 x9 x9'},
  {name: 's1',     wave: '=.434=.3=..', data: '8 9 8 9 9 8 8'},
  {name: 's2',     wave: '=.4=.....3=', data: '7 8 8 7 7'},
  {},
  {name: 're',     wave: '0.10..110..'},
  {name: 'we',     wave: '01000.0000.'},
  {name: 'a',      wave: 'x43x..33x..', data: 'a7 a7 a7 a6'},
  {name: 'ar',     wave: 'x.43x..33x.', data: 'a7 a7 a7 a6'},
  {name: 'q',      wave: 'x...5x..35x', data: '7 7 6'},
  {name: 'd',      wave: 'x4x........', data: '7 7'},
]}
