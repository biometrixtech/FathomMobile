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


# Renders a text based list of options that can be selected by the
# user using up, down, and enter keys and returns the chosen option.
#
#   Arguments   : list of options, maximum of 256
#                 "opt1" "opt2" ...
#   Return value: selected index(es) (0 for opt1, 1 for opt2 ...)
function select_option {

    # little helpers for terminal print control and key input
    ESC=$( printf "\033")
    cursor_blink_on()  { printf "$ESC[?25h"; }
    cursor_blink_off() { printf "$ESC[?25l"; }
    cursor_to()        { printf "$ESC[$1;${2:-1}H"; }
    print_option()     { printf "   $1 "; }
    print_selected()   { printf "  $ESC[7m $1 $ESC[27m"; }
    get_cursor_row()   { IFS=';' read -sdR -p $'\E[6n' ROW COL; echo ${ROW#*[}; }
    key_input()        { read -s -n3 key 2>/dev/null >&2
                         if [[ $key = $ESC[A ]]; then echo up;    fi
                         if [[ $key = $ESC[B ]]; then echo down;  fi
                        #  if [[ $key = $ESC[C ]]; then echo right; fi
                        #  if [[ $key = $ESC[D ]]; then echo left;  fi
                         if [[ $key = ""     ]]; then echo enter; fi; }

    # initially print empty new lines (scroll down if at bottom of screen)
    for opt; do printf "\n"; done

    # determine current screen position for overwriting the options
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - $#))

    # ensure cursor and input echoing back on upon a ctrl+c during read -s
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off

    local selected=0
    while true; do
        # print options by overwriting the last lines
        local idx=0
        for opt; do
            cursor_to $(($startrow + $idx))
            if [ $idx -eq $selected ]; then
                print_selected "$opt"
            else
                print_option "$opt"
            fi
            ((idx++))
        done

        # user key control
        case `key_input` in
            enter)
                break
                ;;
            up)
                ((selected--));
                if [ $selected -lt 0 ]; then selected=$(($# - 1)); fi
                ;;
            down)
                ((selected++));
                if [ $selected -ge $# ]; then selected=0; fi
                ;;
            # left)
            #     echo "left"
            #     ;;
            # right)
            #     echo "right"
            #     ;;
        esac
    done

    # cursor position back to normal
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on

    return $selected
}


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
            # android build tools and gradle patches
            sed -i '' 's/26.0.3/27.0.3/' ./node_modules/react-native-code-push/android/app/build.gradle
            sed -i '' 's/23.0.1/27.0.3/' ./node_modules/react-native-fabric/android/build.gradle
            sed -i '' 's/26.0.1/27.0.3/' ./node_modules/react-native-ble-manager/android/build.gradle
            sed -i '' 's/25.0.2/27.0.3/' ./node_modules/react-native-android-location-services-dialog-box/android/build.gradle
            # sed -i '' 's/23.0.1/27.0.3/' ./node_modules/react-native-svg/android/build.gradle
            sed -i '' 's/25.0.2/27.0.3/' ./node_modules/react-native-device-info/android/build.gradle
            sed -i '' 's/26.0.1/27.0.3/' ./node_modules/react-native-vector-icons/android/build.gradle
            sed -i '' 's/"26.0.3"/"27.0.3"/' ./node_modules/react-native-splash-screen/android/build.gradle
            sed -i '' 's/26.0.1/27.0.3/' ./node_modules/react-native-linear-gradient/android/build.gradle

            sed -i '' 's/compile /implementation /' ./node_modules/react-native-code-push/android/app/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-fabric/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-ble-manager/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-android-location-services-dialog-box/android/build.gradle
            # sed -i '' 's/compile /implementation /' ./node_modules/react-native-svg/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-device-info/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-vector-icons/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-splash-screen/android/build.gradle
            sed -i '' 's/compile /implementation /' ./node_modules/react-native-linear-gradient/android/build.gradle

            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-code-push/android/app/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-fabric/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-ble-manager/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-android-location-services-dialog-box/android/build.gradle
            # sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-svg/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-device-info/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-vector-icons/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-splash-screen/android/build.gradle
            sed -i '' 's/compile(/implementation(/' ./node_modules/react-native-linear-gradient/android/build.gradle

            # extra android patches
            sed -i '' 's/provided/compileOnly/' ./node_modules/react-native-linear-gradient/android/build.gradle
            sed -i '' 's/Compile/Implementation/' ./node_modules/react-native-splash-screen/android/build.gradle
            sed -i '' 's/babel\-jest/\<rootDir\>\/node_modules\/react-native\/jest\/preprocessor.js/' ./node_modules/react-native/jest-preset.json

            # should find the installed location of nvm and replace the android app build.gradle nodeExecutableAndArgs path with current machine's
            android_nvm_location=`find ~/ -name '.nvm' -type d -print -quit`
            nvm_string='/.nvm'
            android_nvm_location=${android_nvm_location%$nvm_string}
            android_nvm_location=${android_nvm_location////\\/}
            old_user=`awk -v FS="(Users\/|\/.nvm)" '{if ($2) print $2;}' ./android/app/build.gradle`
            sed -i "" "s/\/Users\/$old_user\//$android_nvm_location/" ./android/app/build.gradle

            # iOS patches
            # sed -i '' 's/<WebView/<WebView originWhitelist={["*"]}/' ./node_modules/react-native-remote-svg/SvgImage.js
            sed -i '' 's/\[SplashScreen/[RNSplashScreen/' ./node_modules/react-native-splash-screen/ios/RNSplashScreen.m
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

handleIOSVersionBump() {
    local build_location="./ios/Fathom/Info.plist"
    # build version code
    local currentBuildVersionCode=`cat $build_location | awk '/CFBundleShortVersionString/{getline; print}' | sed -e 's/^[[:space:]]*//' | awk -v FS="(\<string\>|\<\/string\>)" '{if ($2) print $2;}' | tr -d '\r'`
    # build version name
    local currentBuildVersionName=`cat $build_location | awk '/CFBundleVersion/{getline; print}' | sed -e 's/^[[:space:]]*//' | awk -v FS="(\<string\>|\<\/string\>)" '{if ($2) print $2;}' | tr -d '\r'`
    # bump version code by 1
    local newBuildVersionCode=`echo $currentBuildVersionCode 1 | awk '{print $1 + $2}'`

    echo
    read -p "${grey} Enter version name if you want to change from: $currentBuildVersionName`echo $'\n '`App version will auto bump from: $currentBuildVersionCode -> $newBuildVersionCode`echo $'\n '`Leave blank if no changes desired${normal}`echo $'\n\n '`${standout}New version:${normal} " -r
    echo
    if [ "$REPLY" == "" ]; then
        echo "Changing nothing"
    else
        # find line number to replace version code and version name
        local version_code_line_num=`grep -Fn 'CFBundleShortVersionString' $build_location | cut -d':' -f1 | awk '{print $1 + 1}'`
        local version_name_line_num=`grep -Fn 'CFBundleVersion' $build_location | cut -d':' -f1 | awk '{print $1 + 1}'`

        echo "Updating iOS version name to $REPLY and version code to $newBuildVersionCode.."
        sed -i '' "${version_code_line_num}s/$currentBuildVersionCode/$newBuildVersionCode/" $build_location
        sed -i '' "${version_name_line_num}s/$currentBuildVersionName/$REPLY/" $build_location
        echo "Done updating build versions"
    fi
}

iosBuild() {
    echo
    read -p "${grey}Choose which build type:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Staging`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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
                handleIOSVersionBump
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
                handleIOSVersionBump
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

handleAndroidVersionBump() {
    local build_location="./app/build.gradle"
    # build version code
    local currentBuildVersionCode=`cat $build_location | grep 'versionCode ' | sed -e 's/^[[:space:]]*//' | cut -d' ' -f2 | tr -d '\r'`
    # build version name
    local currentBuildVersionName=`cat $build_location | grep 'versionName ' | sed -e 's/^[[:space:]]*//' | cut -d' ' -f2 | tr -d '\"' | tr -d '\r'`
    # bump version code by 1
    local newBuildVersionCode=`echo $currentBuildVersionCode 1 | awk '{print $1 + $2}'`

    echo
    read -p "${grey} Enter version name if you want to change from: $currentBuildVersionName`echo $'\n '`App version will auto bump from: $currentBuildVersionCode -> $newBuildVersionCode`echo $'\n '`Leave blank if no changes desired${normal}`echo $'\n\n '`${standout}New version:${normal} " -r
    echo
    if [ "$REPLY" == "" ]; then
        echo "Changing nothing"
    else
        echo "Updating version name to $REPLY and version code to $newBuildVersionCode.."
        sed -i '' "s/versionCode $currentBuildVersionCode/versionCode $newBuildVersionCode/" $build_location
        sed -i '' "s/versionName \"$currentBuildVersionName/versionName \"$REPLY/" $build_location
        echo "Done updating build versions"
    fi
}

androidBuild() {
    echo
    read -p "${grey}Choose which build type:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Staging`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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
                sed -i '' 's/android\.enableAapt2\=true/android\.enableAapt2\=false/' ./gradle.properties
                handleAndroidVersionBump
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
                sed -i '' 's/android\.enableAapt2\=true/android\.enableAapt2\=false/' ./gradle.properties
                handleAndroidVersionBump
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
    read -p "${grey}Choose which OS to build:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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
    read -p "${grey}Choose which OS to push:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n '`[3]: Both`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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
    read -p "${grey}Choose which OS to promote:${normal}`echo $'\n\n '`[1]: Android`echo $'\n '`[2]: iOS`echo $'\n '`[3]: Both`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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
    read -p "${grey}Choose a codepush option:${normal}`echo $'\n\n '`[1]: Release`echo $'\n '`[2]: Promote`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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

deleteBranch() {
    echo
    echo "Deleting branch \"${1}\".."
    echo
    git push -d origin $branch_name
    git branch -D $branch_name
    echo
    echo "Done"
    echo
}

pickBranch() {
    echo
    echo "Choose which branch to delete. (Navigate with <up arrow> and <down arrow>. Press <enter> to delete)"
    echo

    local_branches=`git branch`

    options=(`echo "$local_branches" | sed 's/\* //g'`)

    # whenever I get around to selection lists for multiple branches at a time or checking if remote and local branches match up or deleting only local branches
    # remote_branches=`git branch -r`
    # options=(`echo "$local_branches $remote_branches" | sed 's/\* //g' | sed 's/\-\>//g' | sed 's/remotes\///g' | sed 's/origin\/HEAD//g'`)

    select_option "${options[@]}"
    choice=$?

    echo
    read -p "${grey}Are you sure you want to delete the \"${options[$choice]}\" branch?${normal}`echo $'\n\n '`[y]: Yes`echo $'\n '`[n]: No`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
    echo
    case "$REPLY" in
        [yY])
            deleteBranch "${options[$choice]}"
            ;;
        [nN])
            echo "Not deleting branch \"${options[$choice]}\""
            echo
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            codepush
            ;;
    esac
}

main() {
    echo
    read -p "${grey}Choose what you want to do:${normal}`echo $'\n\n '`[1]: initialize project`echo $'\n '`[2]: start packager`echo $'\n '`[3]: create release build for Android/iOS`echo $'\n '`[4]: CodePush`echo $'\n '`[5]: Delete branch`echo $'\n\n '`${standout}Enter selection:${normal} " -rn1
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
        5)
            pickBranch
            ;;
        *)
            echo "${red}Invalid selection${normal}"
            main
            ;;
    esac
}

echo "Fathom wizard"
main