# Stack unit (type 2)

High performance, pipelined stack unit.

Using single-port memory block with 2 cycle read latency.


### Block diagram (Data/Address path only)

![alt text](https://rawgit.com/drom/stack/master/stack2/bd.svg "pop timing diagram")

### State machine

![alt text](https://rawgit.com/drom/stack/master/stack2/fsm.svg "pop timing diagram")

[fsm.dot](fsm.dot)

`dot fsm.dot -Tsvg -ofsm.svg`


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
