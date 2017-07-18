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

        nvmrc=`cat .nvmrc`
        [ -e ~/.nvm/nvm.sh ] && . ~/.nvm/nvm.sh || {
            echo "nvm does not exist, installing";
            curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
            [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
            . ~/.nvm/nvm.sh
        }
        nvm install $nvmrc
        cd ..
        cd FathomMobile

        pod=$(which pod)
        [ ${#pod} == 0 ] && {
            echo "cocoapods does not exist, installing";
            export GEM_HOME=$HOME/.gem
            export PATH=$GEM_HOME/bin:$PATH
            gem install cocoapods
        } || continue


        echo "☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️️☁️☁️☁️☁️☁️☁️☁️☁️☁️️️️️️️"
        echo "🚀\t${green}✔︎${normal} ${yellow}Xcode installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${blue}yarn installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${magenta}Homebrew installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${cyan}watchman installed${normal}\t🚀"
        echo "🚀\t${green}✔︎${normal} ${white}nvm installed${normal}\t\t🚀"
        echo "🚀\t${green}✔︎${normal} ${grey}cocoapods installed${normal}\t🚀"
        echo "🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊"

        watchman watch-del-all
        lsof -P | grep ':8081' | grep 'node' | awk '{print $2}' | tail -n 1 | xargs kill -9
        rm -rf node_modules
        rm yarn.lock
        yarn
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-google-analytics-bridge/android/build.gradle
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-code-push/android/app/build.gradle
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-fabric/android/build.gradle
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-vector-icons/android/build.gradle
        sed -i '' 's/24.0.2/25.0.0/' ./node_modules/react-native-ble-manager/android/build.gradle
        sed -i '' 's/23.0.1/25.0.0/' ./node_modules/react-native-network-info/android/build.gradle
        cd ios/
        pod install
        cd ..
        
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
    cd ios
    xcodebuild clean -workspace Fathom.xcworkspace -scheme Fathom
    xcodebuild archive -workspace Fathom.xcworkspace -scheme Fathom
    cd ..
}

androidBuild() {
    cd android
    ./gradlew assembleRelease
    cd ..
    # cd app/build/outputs/apk
    echo "Release apk located at 'android/app/build/outputs/apk/' as app-release_#.apk"
    # adb install app-release*.apk
    # cd ../../../../../
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

main() {
    echo
    read -p "${grey}Choose what you want to do:${normal}`echo $'\n\n '`[1]: initialize project`echo $'\n '`[2]: start packager`echo $'\n '`[3]: create release build for Android/iOS`echo $'\n\n '`${standout}Enter selection:${normal} " -n 1 -r
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
        *)
            echo "${red}Invalid selection${normal}"
            main
            ;;
    esac
}

echo "Fathom wizard"
main