// Stack testbench model
(function (len) {
    'use strict';
    var i, cmd, clk, top, inp, stack = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    clk = {name: 'clk', wave: 'p.'};
    cmd = {name: 'cmd', wave: '=',  data: '-'};
    inp = {name: 'inp', wave: '=',  data: '0', val: 4};
    top = {name: 'top', wave: '==', data: '8 8'};

    for (i = 0; i < len; i++) {
        clk.wave += '.';
        top.wave += '=';
        switch(Math.round(3 * Math.random())) {
          case 0:
            cmd.wave += '='; cmd.data += ' -';
            inp.wave += 'x';
            break;
          case 1:
            cmd.wave += '3'; cmd.data += ' pop';
            inp.wave += 'x';
            stack.pop();
            break;
          default:
            cmd.wave += '4'; cmd.data += ' push';
            inp.val = Math.round(99 * Math.random());
            stack.push(inp.val);
            inp.wave += '='; inp.data += ' ' + inp.val;

        }
        top.data += ' ' + stack[stack.length - 1];
    }
    cmd.wave += '='; cmd.data += ' -';
    inp.wave += 'x';

    return {signal: [clk, cmd, inp, top]};
})(16)
