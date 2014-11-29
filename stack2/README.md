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
Control signals:


| cmd | value | description
|-----|-------|----
| nop | 0     | no operation
| pop | 1     | pop single element from the stack
| push| 2     | push value into the stack


```verilog
    input [1:0] cmd,
```
Data / Address interface

```verilog
    input        [AW-1:0] spin,
    input        [DW-1:0] in,
    output logic [DW-1:0] s0
);
```

### Block diagram

Data and address path.

![alt text](https://rawgit.com/drom/stack/master/stack2/bd.svg "pop timing diagram")

Flip-flops:

```verilog
logic [DW-1:0] s1, s2;
logic [AW-1:0] spr, spw;
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
```

Memory instance:

```verilog
mem mem (
    .clk(clk),
    .reset_n(reset_n),
    .d(s0),
    .a(a),
    .q(q)
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
    if (~reset_n)
        spr <= {AW{1'b0}};
        spw <= {AW{1'b0}};
    else begin
        if (cmd == 2'b01) begin
            spr <= spr - {{AW-1{1'b0}}, 1'b1};
            spw <= spr;
        end
        if (cmd == 2'b10) begin
            spr <= spw;
            spw <= spw + {{AW-1{1'b0}}, 1'b1};
        end
    end
```

### State machine

![alt text](https://rawgit.com/drom/stack/master/stack2/fsm.svg "pop timing diagram")

[fsm.dot](fsm.dot)

`dot fsm.dot -Tsvg -ofsm.svg`

```verilog
logic [3:0] state, state_nxt;

always_ff @(posedge clk or ngedge reset_n)
    if (~reset_n) state <= {4'h1};
    else          state <= state_nxt;

alwasy_comb
    casez ({state, cmd})
        // A
        6'b0001_00: state_nxt = 4'b0001; // nop
        6'b0001_01: state_nxt = 4'b0010; // pop  -> B
        6'b0001_01: state_nxt = 4'b0001; // push
        // B
        6'b0010_00: state_nxt = 4'b0100; // nop  -> C
        6'b0010_01: state_nxt = 4'b1000; // pop  -> D
        6'b0010_10: state_nxt = 4'b1000; // push -> A
        // C
        6'b0100_00: state_nxt = 4'b0001; // nop  -> A
        6'b0100_01: state_nxt = 4'b1000; // pop  -> D
        6'b0100_10: state_nxt = 4'b0001; // push -> A
        // D
        6'b1000_00: state_nxt = 4'b0100; // nop  -> C
        6'b1000_01: state_nxt = 4'b1000; // pop
        6'b1000_10: state_nxt = 4'b0001; // push -> A
        // error
        default:    state_nxt = 4'bxxxx;
    endcase
```

Control signals:

```verilog
always_comb begin

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
