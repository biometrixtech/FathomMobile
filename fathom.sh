#check if stdout is a terminal...
if test -t 1; then

    # see if it supports colors...
    ncolors=$(tput colors)

    if test -n "$ncolors" && test $ncolors -ge 8; then
        bold="$(tput bold)"
        underline="$(tput smul)"
        standout="$(tput smso)"
        normal="$(tput sgr0)"
        black="$(tput setaf 0)"
        red="$(tput setaf 1)"
        green="$(tput setaf 2)"
        yellow="$(tput setaf 3)"
        blue="$(tput setaf 4)"
        magenta="$(tput setaf 5)"
        cyan="$(tput setaf 6)"
        white="$(tput setaf 7)"
        grey="$(tput setaf 8)"
    fi
fi

# install_java() {
#     current_location=`pwd`
#     cd ~/Downloads
#     curl -v -j -k -L -H "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u171-b11/512cd62ec5174c3487ac17c61aaa89e8/jdk-8u171-macosx-x64.dmg > jdk-8u171-macosx-x64.dmg
#     hdiutil attach jdk-8u171-macosx-x64.dmg
#     sudo installer -pkg /Volumes/JDK\ 8\ Update\ 171/JDK\ 8\ Update\ 171.pkg -target /
#     diskutil umount /Volumes/JDK\ 8\ Update\ 171
#     rm jdk-8u171-macosx-x64.dmg
#     cd $current_location
# }

# install_android_studio() {
#     current_location=`pwd`
#     cd ~/Downloads
#     curl -v -j -k -L -H "" https://dl.google.com/dl/android/studio/install/3.1.2.0/android-studio-ide-173.4720617-mac.dmg > android-studio-ide-173.4720617-mac.dmg
#     hdiutil attach android-studio-ide-173.4720617-mac.dmg
#     mv /Volumes/Android\ Studio\ 3.1.2/Android\ Studio.app /Applications/
#     diskutil umount /Volumes/Android\ Studio\ 3.1.2/Android\ Studio.app
#     rm android-studio-ide-173.4720617-mac.dmg
#     cd $current_location
# }

# install_android_sdk_manager_cli() {
#     current_location=`pwd`
#     cd ~/Downloads
#     curl -v -j -k -L -H "" https://dl.google.com/android/repository/sdk-tools-darwin-3859397.zip > sdk-tools-darwin-3859387.zip
#     unzip -a sdk-tools-darwin-3859387.zip
#     rm sdk-tools-darwin-3859387.zip
#     cd $current_location
# }

initialize() {
    echo "Checking installation.."

    if [ -d ~/.nvm ]
    then
        xcode=`ls /Applications/Xcode*.app 2>/dev/null | wc -l`
        if [ $xcode != 0 ]
        then
            brew=$(which brew)
            [ ${#brew} == 0 ] && { echo "Homebrew does not exist, installing"; /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"; } || continue
            
            yarn=$(which yarn)
            [ ${#yarn} == 0 ] && { echo "yarn does not exist, installing"; brew install yarn --without-node; } || continue
            # [ ${#yarn} == 0 ] && { echo "yarn does not exist, installing"; curl -o- -L https://yarnpkg.com/install.sh | bash; } || continue

            watchman=$(which watchman)
            [ ${#watchman} == 0 ] && { echo "watchman does not exist, installing"; brew install watchman; } || continue

            unset PREFIX
            [ -s ~/.nvm/nvm.sh ] && continue || {
                echo "nvm does not exist, installing";
                curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
                [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
            }
            . ~/.nvm/nvm.sh
            nvmrc=`cat .nvmrc`
            nvm_res=`nvm ls | grep "$nvmrc"`
            if [ "$nvm_res" != "" ]
            then
                nvm use
            else
                nvm install
            fi


            echo "☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️️☁️☁️☁️☁️☁️☁️☁️☁️☁️️️️️️️"
            echo "🚀\t${green}✔︎${normal} ${yellow}Xcode installed${normal}\t🚀"
            echo "🚀\t${green}✔︎${normal} ${blue}yarn installed${normal}\t🚀"
            echo "🚀\t${green}✔︎${normal} ${magenta}Homebrew installed${normal}\t🚀"
            echo "🚀\t${green}✔︎${normal} ${cyan}watchman installed${normal}\t🚀"
            echo "🚀\t${green}✔︎${normal} ${white}nvm installed${normal}\t\t🚀"
            echo "🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊"

            watchman watch-del-all
            # lsof -P | grep ':8081' | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
            lsof -i tcp:8081 | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
            lsof -i tcp:3000 | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
            rm -rf node_modules/ yarn.lock
            yarn
            sed -i '' 's/23.0.1/27.0.3/' ./node_modules/react-native-code-push/android/app/build.gradle
            sed -i '' 's/23.0.1/27.0.3/' ./node_modules/react-native-fabric/android/build.gradle
            sed -i '' 's/26.0.1/27.0.3/' ./node_modules/react-native-ble-manager/android/build.gradle
            sed -i '' 's/25.0.2/27.0.3/' ./node_modules/react-native-android-location-services-dialog-box/android/build.gradle
            # sed -i '' 's/23.0.1/27.0.3/' ./node_modules/react-native-svg/android/build.gradle
            sed -i '' 's/25.0.2/27.0.3/' ./node_modules/react-native-device-info/android/build.gradle
            sed -i '' 's/26.0.1/27.0.3/' ./node_modules/react-native-vector-icons/android/build.gradle

            sed -i '' 's/compile /implementation /' ./node_modules/react-native-code-push/android/app/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-fabric/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-ble-manager/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-android-location-services-dialog-box/android/build.gradle
            # sed -i '' 's/compile /implementation /' ./node_modules/react-native-svg/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-device-info/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-vector-icons/android/build.gradle

            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-code-push/android/app/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-fabric/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-ble-manager/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-android-location-services-dialog-box/android/build.gradle
            # sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-svg/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-device-info/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-vector-icons/android/build.gradle

            # should find the installed location of nvm and replace the android app build.gradle nodeExecutableAndArgs path with current machine's
            android_nvm_location=`find ~/ -name '.nvm' -type d -print -quit`
            nvm_string='/.nvm'
            android_nvm_location=${android_nvm_location%$nvm_string}
            android_nvm_location=${android_nvm_location////\\/}
            old_user=`awk -v FS="(Users\/|\/.nvm)" '{if ($2) print $2;}' ./android/app/build.gradle`
            sed -i "" "s/\/Users\/$old_user\//$android_nvm_location/" ./android/app/build.gradle

            sed -i '' 's/#import <RCTAnimation\/RCTValueAnimatedNode.h>/#import "RCTValueAnimatedNode.h"/' ./node_modules/react-native/Libraries/NativeAnimation/RCTNativeAnimatedNodesManager.h
            # sed -i '' 's/ length]/ pathLength]/' ./node_modules/react-native-svg/ios/Text/RNSVGTSpan.m
            [ -d "./node_modules/react-native/third-party" ] && {
                cd node_modules/react-native/third-party/glog-0.3.4
                ../../scripts/ios-configure-glog.sh                 
                cd ../../../../
            } || continue

            # replacing xcode IP with your current computer IP
            currentip=`grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' ./ios/Fathom/AppDelegate.m`
            newip=$(for i in `ifconfig -l `; do ipconfig getifaddr $i ; done)
            if [ ! -z "$newip" -a "$newip" != "" -a ! -z "$currentip" -a "$currentip" != "" ]; then
                sed -i '' "s/$currentip/$newip/" ./ios/Fathom/AppDelegate.m
            else
                echo "${red}IP Replacement failed because file IP or current IP not found.${normal}"
            fi
            
            echo "Everything checked, installed, and prepared.\nPackager ready to be started.\nRunning unit tests.."
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed.${normal}"
            else
                echo "Unit testing passed."
            fi
        else
            echo "${red}Error: Xcode does not exist in Applications folder, please download and install it${normal}"
        fi
    else
        echo "${red}Error: nvm does not exist, please see README about installing${normal}"
    fi
}

start() {
    watchman watch-del-all
    lsof -i tcp:8081 | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
    npm run start -- --reset-cache
}

iosBuild() {
    echo
    read -p "${grey}Choose which build type:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Staging`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                cd ios
                xcodebuild clean -project Fathom.xcodeproj -scheme Fathom -configuration Release
                xcodebuild archive -project Fathom.xcodeproj -scheme Fathom -configuration Release
                cd ..
            fi
            ;;
        2)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                cd ios
                xcodebuild clean -project Fathom.xcodeproj -scheme Fathom -configuration Staging
                xcodebuild archive -project Fathom.xcodeproj -scheme Fathom -configuration Staging
                cd ..
            fi
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            iosBuild
            ;;
    esac
}

androidBuild() {
    echo
    read -p "${grey}Choose which build type:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Staging`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                cd android
                ./gradlew clean assembleRelease
                cd ..
                echo "Release apk located at ${standout}'android/app/build/outputs/apk/'${normal} as ${standout}fathom-release#.apk${normal}"
                open android/app/build/outputs/apk/
            fi
            ;;
        2)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                cd android
                ./gradlew clean assembleReleaseStaging
                cd ..
                echo "Release apk located at ${standout}'android/app/build/outputs/apk/'${normal} as ${standout}fathom-releaseStaging#.apk${normal}"
                open android/app/build/outputs/apk/
            fi
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            androidBuild
            ;;
    esac
    # adb install app-release*.apk
}

build() {
    echo
    read -p "${grey}Choose which OS to build:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            androidBuild
            ;;
        2)
            iosBuild
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            build
            ;;
    esac
}

codepushRelease() {
    # install code push cli first
    echo
    read -p "${grey}Choose which OS to push:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n '`[3]: Both`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                code-push release-react FathomAI-Android android
            fi
            ;;
        2)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                code-push release-react FathomAI-iOS ios
            fi
            ;;
        3)
            yarn test
            testValue=$?
            if [ $testValue -ne 0 ]; then
                echo "${red}Unit testing failed, not proceeding.${normal}"
            else
                echo "Unit testing passed, proceeding.."
                code-push release-react FathomAI-Android android
                code-push release-react FathomAI-iOS ios
            fi
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            codepushRelease
            ;;
    esac
}

codepushPromote() {
    echo
    read -p "${grey}Choose which OS to promote:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n '`[3]: Both`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            code-push promote FathomAI-Android Staging Production -t '*'
            ;;
        2)
            code-push promote FathomAI-iOS Staging Production -t '*'
            ;;
        3)
            code-push promote FathomAI-Android Staging Production -t '*'
            code-push promote FathomAI-iOS Staging Production -t '*'
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            codepushPromote
            ;;
    esac
}

codepush() {
    echo
    read -p "${grey}Choose a codepush option:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Promote`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            codepushRelease
            ;;
        2)
            codepushPromote
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            codepush
            ;;
    esac
}

main() {
    echo
    read -p "${grey}Choose what you want to do:${normal}`echo $'\n\n '`[1]: initialize project`echo $'\n '`[2]: start packager`echo $'\n '`[3]: create release build for Android/iOS`echo $'\n '`[4]: CodePush`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            initialize
            ;;
        2)
            start
            ;;
        3)
            build
            ;;
        4)
            codepush
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            main
            ;;
    esac
}

echo "Fathom wizard"
main