module mem (address, clock, data, rden, wren, q);

input [7:0] address;
input clock;
input [15:0] data;
input rden;
input wren;
output [15:0] q;

reg [15:0] mem [0:255];

reg [15:0] q, q1;

always @(posedge clock) begin
    if (wren)
        mem[address] <= data;

    if (rden)
        q1 <= mem[address];

    q <= q1;
end

endmodule
