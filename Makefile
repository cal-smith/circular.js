SHELL := /bin/bash

ugly := uglifyjs
source := $(wildcard lib/*.js)
build  := build/reallyawesome.min.js

.PHONY: all clean

all: $(source) $(build)

$(build): $(source)
	mkdir build/
	$(ugly) $(source) -cmo $(build)

clean:
	rm -rf build