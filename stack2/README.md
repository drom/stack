# Stack unit (type 2)

High performance, pipelined stack unit. Using single-port memory block with 2 cycle read latency.

Module parameters:

```verilog
module stack2 #(
    parameter AW = 8,
    parameter DW = 16
)(
```
Clock and async reset

```verilog
    input clk, reset_n,
```

Data / Address interface

```verilog
    input        [AW-1:0] spin,
    input        [DW-1:0] in,
    output logic [DW-1:0] s0,
```

Stack unit can perform the following commands.

| cmd         | value | stack effect
|-------------|-------|--------------
| nop         | 000   | --
| drop        | 001   | a --
| dup         | 010   | a -- a a
| update      | 100   | a -- b
| drop update | 101   | a b -- c
| dup update  | 110   | -- a

```verilog
    input [2:0] cmd
);
```

### Block diagram

Data and address path.

![alt text](https://rawgit.com/drom/stack/master/stack2/bd.svg "pop timing diagram")

Flip-flops:

```verilog
logic [DW-1:0] s1, s2;
logic [AW-1:0] sp, spr, spw;
```

Data/Address signals:

```verilog
logic [DW-1:0] q;
logic [AW-1:0] a;
```

Control signal:

```verilog
logic s0_en, s0_sel0, s0_sel1;
logic s1_en, s1_sel0, s1_sel1;
logic s2_en, s2_sel0;
logic rden, wren;
```

Memory instance:

```verilog
mem umem (
    .clock   (clk),
    .rden    (rden),
    .wren    (wren),
	.address (sp),
	.data    (s0),
	.q       (q)
);
```

s0 register:

```verilog
always_ff @(posedge clk or negedge reset_n)
    if (~reset_n)
        s0 <= {DW{1'b0}};
    else
        if (s0_en)
            s0 <=
                s0_sel0 ? in :
                s0_sel1 ? s1 :
                q;
```

s1 register:

```verilog
always_ff @(posedge clk or negedge reset_n)
    if (~reset_n)
        s1 <= {DW{1'b0}};
    else
        if (s1_en)
            s1 <=
                s1_sel0 ? s0 :
                s1_sel1 ? s2 :
                q;
```

s2 register:

```verilog
always_ff @(posedge clk or negedge reset_n)
    if (~reset_n)
        s2 <= {DW{1'b0}};
    else
        if (s2_en)
            s2 <=
                s2_sel0 ? s1 :
                q;
```

Stack pointer logic:

```verilog
always_ff @(posedge clk or negedge reset_n)
    if (~reset_n) begin
        spr <= {AW{1'b0}};
        spw <= {AW{1'b0}};
    end else begin
        if (cmd[0]) begin
            spr <= spr - {{AW-1{1'b0}}, 1'b1};
            spw <= spr;
        end
        if (cmd[1]) begin
            spr <= spw;
            spw <= spw + {{AW-1{1'b0}}, 1'b1};
        end
    end

always_comb
    sp = cmd[0] ? spr : spw;
```

### State machine

![alt text](https://rawgit.com/drom/stack/master/stack2/fsm.svg "pop timing diagram")

[fsm.dot](fsm.dot)

`dot fsm.dot -Tsvg -ofsm.svg`

```verilog
logic [3:0] state, state_nxt;

always_ff @(posedge clk or negedge reset_n)
    if (~reset_n) state <= {4'h1};
    else          state <= state_nxt;

always_comb
    casez({state, cmd})
        // A
        7'b???1_??1: state_nxt = 4'b0010; // pop  -> B
        7'b???1_?10: state_nxt = 4'b0001; // push
        7'b???1_?00: state_nxt = 4'b0001; // nop
        // B
        7'b??10_??1: state_nxt = 4'b1000; // pop  -> D
        7'b??10_?10: state_nxt = 4'b1000; // push -> A
        7'b??10_?00: state_nxt = 4'b0100; // nop  -> C
        // C
        7'b?100_??1: state_nxt = 4'b1000; // pop  -> D
        7'b?100_?10: state_nxt = 4'b0001; // push -> A
        7'b?100_?00: state_nxt = 4'b0001; // nop  -> A
        // D
        7'b1000_??1: state_nxt = 4'b1000; // pop
        7'b1000_?10: state_nxt = 4'b0001; // push -> A
        7'b1000_?00: state_nxt = 4'b0100; // nop  -> C
        // error
        default      state_nxt = 4'bxxxx;
    endcase
```

Control signals:

```verilog
always_comb begin
```

Register `s0` takes value from `in` port for `update` commands.

Every `pop` command will change value

```verilog
    s0_en   = cmd[2] | cmd[0]; // update or pop
    s0_sel0 = cmd[2]; // in
    s0_sel1 = cmd[0]; // s1  ???
```

Unit updates register `s1` for every `push` command or in state `D`.

```verilog
    s1_en   = cmd[1] | state[3];
    s1_sel0 = cmd[1];    // s0
    s1_sel1 = ~state[3]; // s2
```

Unit updates register `s2` for every `push` command or in state `C`.

```verilog
    s2_en   = cmd[1] | state[2];
    s2_sel0 = cmd[1]; // s1
```

Unit initiate `read` transaction for every `pop` command,
and `write` transaction `push` commands not after `pop` commands.

```verilog
    rden = cmd[0];
    wren = cmd[1] & state[0];
```

```verilog
end
```

### Timing diagram for `pop` command sequences.

![alt text](https://rawgit.com/drom/stack/master/stack2/pop.svg "pop timing diagram")

In the idle state:`A` unit keeps three top elements in the flip-flops: `s0`, `s1`, `s2`.

Only `s0` is visible from outside for read / write access.

Every `pop` command initiates read transaction in to the memory block.

After single `pop` command the state machine will transition into the state:`B` then `C` and then `A`.

Any 2 Back-to-back `pop` commands will move state machine in the sate:`D`.

Any `nop` after `pop` will move state machine into state `C`.

Any two `nop` commands will move state machine back into sate `A`.



### Timing diagram for `push/pop` command mixes

![alt text](https://rawgit.com/drom/stack/master/stack2/push.svg "push/pop timing diagram")

```verilog
endmodule
```
