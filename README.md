# DRAW_SIMPLE
Very easy, simple software for creating drawings, generated in HTML Canvas.
The target was to make it as keyboard reliable as possible, so we can quickly switch between features with one hand clicking the keys,
while the other does the work with the mouse, so we can create some kind of an art and quickly deploy it to the file.

# Instructions
## Shortcuts
### ESC
* breaks current drawing (before putting it onto canvas)
### SHIFT
* when held, it inverts colors
### CTRL
* (line) when held while drawing lines we can fix it to 0 deg, 45 deg, 90 deg and so on
* (rectangle,triangle) when held it fixes the shapes to be equilateral
* (draw) when held, it allows you to make curved line (just 'pull' your drawing while holding it to curve it)
### MOUSEWHEEL
* increases/decreases drawing width (except while holding ctrl - to allow website size change)
### RMB
* (shapes) draws with secondary color background
* (draw, line) inverts color
### KEYS
#### 1-7 
* changes drawing mode (respectively to its interface position)
#### S
* saves picture (floppy disk icon does the same)
#### Q,W,E
* opens color inputs (respectively: first color (left-top), second color (right-top), background color (bottom))
#### R
* switches first and second color pernamently
#### Z / Y
* undo / redo (up to 14 changes back)

## Color picker
* LMB - changes first color, RMB - second color; background is ignored (it should take black (#000000) color)
## Downloading image
* To save it click 's' or floppy disk icon. 
* Background is ignored, as preffered extension is PNG so it should be transparent.


# VERSION
Latest stable version: v2.0 (24-02-2019)

# CHANGE LOGS
v2.0 is first public version of the app.
The app was originaly published [here](https://bitbucket.org/tuvrai/draw_simple/src/master/), now it's on gh.

# FUTURE
I think the project can be extended in the future as i have ideas for new features.
The target is to create software with many features, yet very easy to use because of keyboard binds and clear, basic interface

I'm also open for every suggestion. 

# CREDITS
## Author: Tuvrai
#### And... big thanks for 'passive' help from this sources:
* [Marcin Domański's tutorial](http://kursjs.pl/kurs/canvas/canvas-paint.php)
* [Rishabh's decent articles series](http://codetheory.in/creating-a-paint-application-with-html5-canvas/)
* [Icons of interface features](https://material.io/tools)
Therefore i obviously cannot take all the credit for this app, but its main purpose was to learn js anyway.


# LICENSE
MIT
