cd android
./gradlew assembleRelease
cd ..
# cd app/build/outputs/apk
echo "Release apk located at 'android/app/build/outputs/apk/' as app-release_#.apk"
# adb install app-release*.apk
# cd ../../../../../