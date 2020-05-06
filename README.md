## WordPress Starter Plugin - React

A WordPress Plugin Starter featuring React, Webpack, Typescript and Docker for a full development stack.

## Description

This is a starting point for someone who wants to develop a new Plugin for WordPress using React, Typescript and Webpack. It uses Docker for a quick and easy WordPress development stack.

What makes this so great? With a simple `docker-compose up -d --build` command, you have a full WordPress instance running, with a plugin ready to be activated through the admin dashboard, AND, you can build a public, or admin (private) pages using React.

dist: folder that contains all the src code compiled and ready for WordPress to run a plugin.
src: folder that contains php code for the server side, and code that is compiled into client side code thanks to Webpack.

## License

The MIT License

Copyright (c) 2018-2020 Drew Gauderman. https://dpg.host

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
