#!/bin/bash

echo "
 ___ ___   ___   __ __    ___      ____     ___  _____  ___   __ __  ____      __    ___  _____
|   |   | /   \ |  |  |  /  _]    |    \   /  _]/ ___/ /   \ |  |  ||    \    /  ]  /  _]/ ___/
| _   _ ||     ||  |  | /  [_     |  D  ) /  [_(   \_ |     ||  |  ||  D  )  /  /  /  [_(   \_ 
|  \_/  ||  O  ||  |  ||    _]    |    / |    _]\__  ||  O  ||  |  ||    /  /  /  |    _]\__  |
|   |   ||     ||  :  ||   [_     |    \ |   [_ /  \ ||     ||  :  ||    \ /   \_ |   [_ /  \ |
|   |   ||     | \   / |     |    |  .  \|     |\    ||     ||     ||  .  \\     ||     |\    |
|___|___| \___/   \_/  |_____|    |__|\_||_____| \___| \___/  \__,_||__|\_| \____||_____| \___|

"

for platform in "android" "ios"
do
	for file in ${platform}/* 
	do
		echo "Convert ${file} into ${file%.*}.png"	
		convert -flatten $file  ${file%.*}.png
	done

	for file in ${platform}/*.png
	do
		filename=$(basename -- ${file})
		echo "Move ${file} to ../resources/${file}"
		mv ${file} ../resources/${platform}/splash/${filename}
	done
done

echo 
echo "Done"

