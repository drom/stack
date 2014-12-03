# export VERILATOR_ROOT

VERILATOR_FLAGS = -Wall --cc --trace stack2.sv ../lib/mem2.v --exe tb.cpp

default: prep verilate compile run

prep:
	../bin/prep.js -i README.md > stack2.sv

verilate:
	$(VERILATOR_ROOT)/bin/verilator $(VERILATOR_FLAGS)

compile:
	make -j -C obj_dir/ -f Vstack2.mk Vstack2

run:
	obj_dir/Vstack2
