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
    cd ios/
    pod install
    cd ..
    
    echo "Everything checked, installed, and prepared.\nAttempting to start packager.."
else
    echo "${red}Error: Xcode does not exist in Applications folder, please download and install it${normal}"
fi