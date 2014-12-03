#include "Vstack2.h"
#include "verilated.h"
#include "verilated_vcd_c.h"

int main(int argc, char **argv, char **env) {
    int i;
    int clk;
    int cmd [] = {
        0, 0, 0, 0, 0,

        6, 0, 0,
        6, 0,
        6, 6, 0, 0,
        6, 6, 0,

        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, // fill
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,

        0, 0, 0,

        // drop
        1, 0, 0,
        1, 1, 0, 0,
        1, 1, 1, 0, 0,
        1, 1, 1, 1, 0, 0,

        1, 0, 1, 0, 1, 0, 0,
        1, 1, 0, 1, 1, 0, 0,
        1, 1, 1, 0, 1, 1, 1, 0, 0,

        // dup drop
        2, 0, 0, 1, 0, 0,
        2, 0, 1, 0, 0,
        2, 1, 0, 0,

        // dup dup drop drop
        2, 2, 0, 0, 1, 1, 0, 0,
        2, 2, 0,    1, 1, 0, 0,
        2, 2,       1, 1, 0, 0,

        // dup dup dup drop drop drop
        2, 2, 2, 0, 0, 1, 1, 1, 0, 0,
        2, 2, 2, 0,    1, 1, 1, 0, 0,
        2, 2, 2,       1, 1, 1, 0, 0,

        // dup-up drop
        6, 0, 0, 1, 0, 0,
        6, 0, 1, 0, 0,
        6, 1, 0, 0,

        // dup-up dup-up drop drop
        6, 6, 0, 0, 1, 1, 0, 0,
        6, 6, 0,    1, 1, 0, 0,
        6, 6,       1, 1, 0, 0,

        // dup-up dup-up dup-up drop drop drop
        6, 6, 6, 0, 0, 1, 1, 1, 0, 0,
        6, 6, 6, 0,    1, 1, 1, 0, 0,
        6, 6, 6,       1, 1, 1, 0, 0,

        0, 0, 0, 0, 0, 0 // padding
    };

    Verilated::commandArgs(argc, argv);
    // init top verilog instance
    Vstack2* top = new Vstack2;
    // init trace dump
    Verilated::traceEverOn(true);
    VerilatedVcdC* tfp = new VerilatedVcdC;
    top->trace (tfp, 99);
    tfp->open ("stack2.vcd");
    // initialize simulation inputs
    top->clk = 1;
    top->reset_n = 0;
    top->cmd = 0;
    top->in = 0;
    // top->spin = 0;
    // run simulation for 100 clock periods
    for (i = 0; i < sizeof(cmd)/sizeof(cmd[0]); i++) {
        top->reset_n = (i > 3);
        // dump variables into VCD file and toggle clock
        for (clk=0; clk<2; clk++) {
            tfp->dump (2*i+clk);
            top->clk = !top->clk;
            top->eval ();
        }
        top->cmd = cmd[i];

        top->in = i;
        if (Verilated::gotFinish()) exit(0);
    }
    tfp->close();
    exit(0);
}
