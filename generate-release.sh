#!/usr/bin/env bash

echo "
 *****************************
*                             * 
* BANDCOCHON MOBILE PUBLISHER * 
*                             * 
 *****************************
"

function usage { 
    echo "
generate-release.sh [OPTIONS]
options are:
    --help: display this message
    --keystore-file: The Key store file

A password will be asked
"
}

# Parse command line
case $1 in
    --help)
        usage
        exit 1
        ;;

    --keystore-file)
        if [ "$2" = "" ];
        then
            echo "Missing keystore file argument"
            exit 1
        fi
        KEYSTORE_FILE=$2
        ;;

    "")
        echo "Missing command"
        exit 1
        ;;

    *)
        echo "Unknow command"
        exit 1
        ;;
esac

# Ensure the file exists
if [ !  -f ${KEYSTORE_FILE} ];
then
    echo "The file ${KEYSTORE_FILE} doesn't exist"
    exit 1
fi

# Ensure plugins and environment
ionic cordova platform add android
if [ $? -ne 0 ];
then 
    echo "Error: Unable to continue"
    exit 1
fi 


# Build app for android and ios
PLATFORM=$(uname)

echo "Build ionic app for android in release mode"
if  [ ! -f  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ];
then
    ionic cordova build --release android
    if [ $? -ne 0 ];
    then 
        echo "Error: Unable to continue"
        exit 1
    fi 

    mv platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk bandcochon-release-unsigned.apk
    if [ $? -ne 0 ];
    then 
        echo "Error: Unable to continue"
        exit 1
    fi 

fi

if [ -f bandcochon-release-unsigned.apk ];
then
    zipalign -v -p 4 bandcochon-release-unsigned.apk bandcochon-release-unsigned-aligned.apk
    APKSIGNER=$(find $ANDROID_HOME -name apksigner)
    $APKSIGNER sign --ks ${KEYSTORE_FILE} --out bandcochon-release.apk bandcochon-release-unsigned-aligned.apk

else
    echo "Missing apk file"
    exit 1
fi

# if [ "${PLATFORM}" = "Darwin" ];
# then
#     echo "Build ionic app for iOS in release mode"
#     ionic cordova build --release ios
# fi

