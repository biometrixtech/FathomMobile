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

initialize() {
    echo "Checking installation.."

    xcode=`ls /Applications/Xcode*.app 2>/dev/null | wc -l`
    if [ $xcode != 0 ]
    then
        yarn=$(which yarn)
        [ ${#yarn} == 0 ] && { echo "yarn does not exist, installing"; curl -o- -L https://yarnpkg.com/install.sh | bash; } || continue
        
        brew=$(which brew)
        [ ${#brew} == 0 ] && { echo "Homebrew does not exist, installing"; /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"; } || continue

        watchman=$(which watchman)
        [ ${#watchman} == 0 ] && { echo "watchman does not exist, installing"; brew install watchman; } || continue

        # nvmrc=`cat .nvmrc`
        # [ -e ~/.nvm/nvm.sh ] && . ~/.nvm/nvm.sh || {
        #     echo "nvm does not exist, installing";
        #     curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
        #     export NVM_DIR="$HOME/.nvm"
        #     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        #     [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
        #     . ~/.nvm/nvm.sh
        # }
        # nvm install $nvmrc
        # cd ..
        # cd FathomMobile

        # pod=$(which pod)
        # [ ${#pod} == 0 ] && {
        #     echo "cocoapods does not exist, installing";
        #     export GEM_HOME=$HOME/.gem
        #     export PATH=$GEM_HOME/bin:$PATH
        #     gem install cocoapods
        # } || continue


        echo "☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️️☁️☁️☁️☁️☁️☁️☁️☁️☁️️️️️️️"
        echo "🚀\t${green}✔︎${normal} ${yellow}Xcode installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${blue}yarn installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${magenta}Homebrew installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${cyan}watchman installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${white}nvm installed${normal}\t\t🚀"
        # echo "🚀\t${green}✔︎${normal} ${grey}cocoapods installed${normal}\t🚀"
        echo "🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊"

        watchman watch-del-all
        lsof -P | grep ':8081' | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
        rm -rf yarn.lock node_modules
        yarn
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-google-analytics-bridge/android/build.gradle
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-code-push/android/app/build.gradle
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-fabric/android/build.gradle
        sed -i '' 's/24.0.2/25.0.0/' ./node_modules/react-native-ble-manager/android/build.gradle
        sed -i '' 's/#import <RCTAnimation\/RCTValueAnimatedNode.h>/#import "RCTValueAnimatedNode.h"/' ./node_modules/react-native/Libraries/NativeAnimation/RCTNativeAnimatedNodesManager.h
        sed -i '' 's/ length]/ pathLength]/' ./node_modules/react-native-svg/ios/Text/RNSVGTSpan.m
        # [ -d "./node_modules/react-native/third-party" ] && {
        #     cd node_modules/react-native/third-party/glog-0.3.4
        #     ../../scripts/ios-configure-glog.sh                 
        #     cd ../../../../
        # } || continue
        # cd ios/
        # pod install
        # cd ..
        
        echo "Everything checked, installed, and prepared.\nPackager ready to be started"
    else
        echo "${red}Error: Xcode does not exist in Applications folder, please download and install it${normal}"
    fi
}

start() {
    watchman watch-del-all
    lsof -P | grep ':8081' | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
    npm run start -- --reset-cache
}

iosBuild() {
    echo
    read -p "${grey}Choose which build type:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Staging`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            cd ios
            xcodebuild clean -project Fathom.xcodeproj -scheme Fathom -configuration Release
            xcodebuild archive -project Fathom.xcodeproj -scheme Fathom -configuration Release
            cd ..
            ;;
        2)
            cd ios
            xcodebuild clean -project Fathom.xcodeproj -scheme Fathom -configuration Staging
            xcodebuild archive -project Fathom.xcodeproj -scheme Fathom -configuration Staging
            cd ..
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
            cd android
            ./gradlew clean assembleRelease
            cd ..
            echo "Release apk located at ${standout}'android/app/build/outputs/apk/'${normal} as ${standout}fathom-release#.apk${normal}"
            open android/app/build/outputs/apk/
            ;;
        2)
            cd android
            ./gradlew clean assembleReleaseStaging
            cd ..
            echo "Release apk located at ${standout}'android/app/build/outputs/apk/'${normal} as ${standout}fathom-releaseStaging#.apk${normal}"
            open android/app/build/outputs/apk/
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
    echo
    read -p "${grey}Choose which OS to push:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n '`[3]: Both`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
    echo
    case "$REPLY" in
        1)
            code-push release-react FathomAI-Android android
            ;;
        2)
            code-push release-react FathomAI-iOS ios
            ;;
        3)
            code-push release-react FathomAI-Android android
            code-push release-react FathomAI-iOS ios
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
    read -p "${grey}Choose which OS to push:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Promote`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
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
    read -p "${grey}Choose what you want to do:${normal}`echo $'\n\n '`[1]: initialize project`echo $'\n '`[2]: start packager`echo $'\n '`[3]: create release build for Android/iOS`echo $'\n '`[4]: Code Push`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
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