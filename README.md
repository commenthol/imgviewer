# imgviewer

A simple image viewer for local photos to display in a browser.

## usage

1. Copy all `index*.*` files into the directory of your images.

2. Run the bash script from a terminal `bash index-files.sh`  
   This creates the file `index-files.js`...

3. Open `index.html` in a browser.

4. Navigate with <kbd>space</kbd> or <kbd>→</kbd>

## supported keyevents

|                key                | meaning                    |
| :-------------------------------: | -------------------------- |
| <kbd>space</kbd> or <kbd>→</kbd>  | next image                 |
|           <kbd>←</kbd>            | previous image             |
|   <kbd>ctrl</kbd> <kbd>→</kbd>    | next 10th image            |
|   <kbd>ctrl</kbd> <kbd>←</kbd>    | previous 10th image        |
|           <kbd>r</kbd>            | random mode for next image |
|           <kbd>f</kbd>            | fullscreen                 |
|           <kbd>i</kbd>            | show image info            |
|  <kbd>q</kbd> or <kbd>esc</kbd>   | hide image                 |

## license

[Unlicense](https://unlicense.org/)
