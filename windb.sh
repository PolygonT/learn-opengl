#!/bin/sh

cmake.exe --preset=default
cmake.exe --build build
./build/Debug/LearnOpenGL.exe
