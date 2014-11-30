module stack2 #(
    parameter AW = 8,
    parameter DW = 16
)(

    input clk, reset_n,

    input        [AW-1:0] spin,
    input        [DW-1:0] in,
    output logic [DW-1:0] s0,

    input [2:0] cmd
);

logic [DW-1:0] s1, s2;
logic [AW-1:0] sp, spr, spw;

logic [DW-1:0] q;
logic [AW-1:0] a;

logic s0_en, s0_sel0, s0_sel1;
logic s1_en, s1_sel0, s1_sel1;
logic s2_en, s2_sel0;
logic rden, wren;

mem umem (
    .clock   (clk),
    .rden    (rden),
    .wren    (wren),
	.address (sp),
	.data    (s0),
	.q       (q)
);

always_ff @(posedge clk or negedge reset_n)
    if (~reset_n)
        s0 <= {DW{1'b0}};
    else
        if (s0_en)
            s0 <=
                s0_sel0 ? in :
                s0_sel1 ? s1 :
                q;

always_ff @(posedge clk or negedge reset_n)
    if (~reset_n)
        s1 <= {DW{1'b0}};
    else
        if (s1_en)
            s1 <=
                s1_sel0 ? s0 :
                s1_sel1 ? s2 :
                q;

always_ff @(posedge clk or negedge reset_n)
    if (~reset_n)
        s2 <= {DW{1'b0}};
    else
        if (s2_en)
            s2 <=
                s2_sel0 ? s1 :
                q;

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

always_comb begin

    s0_en   = cmd[2] | cmd[0]; // update or pop
    s0_sel0 = cmd[2]; // in
    s0_sel1 = cmd[0]; // s1  ???

    s1_en   = cmd[1] | state[3];
    s1_sel0 = cmd[1];    // s0
    s1_sel1 = ~state[3]; // s2

    s2_en   = cmd[1] | state[2];
    s2_sel0 = cmd[1]; // s1

    rden = cmd[0];
    wren = cmd[1] & state[0];

end

endmodule

