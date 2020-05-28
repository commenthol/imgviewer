#!/bin/bash

f=index-files.js

echo "const files = \`" > $f
find . -type f \( -iname "*.gif" -o -iname "*.jpg" -o -iname "*.png" -o -iname "*.webp" \) >> $f
echo "\`" >> $f
