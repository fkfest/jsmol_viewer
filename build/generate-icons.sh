#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p build/icons

# Generate PNG icons in different sizes
for size in 16 32 48 64 128 256 512; do
  inkscape -w $size -h $size build/icon_benzene_simple.svg -o "build/icons/${size}x${size}.png"
done

# For Linux .ico file
convert build/icons/256x256.png build/icon.ico

# For macOS .icns file (if needed)
png2icns build/icon.icns build/icons/16x16.png build/icons/32x32.png build/icons/128x128.png build/icons/256x256.png build/icons/512x512.png