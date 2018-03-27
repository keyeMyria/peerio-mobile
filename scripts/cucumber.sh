#!/bin/bash


RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
BRIGHT=`tput bold`
R=`tput sgr0`

info() {
  echo -e "${BRIGHT}$1${R}"
}

error() {
  echo -e "${BRIGHT}$1${R}"
}

wait() {
  echo -e "💤  ${BRIGHT}$1${R}"
}

check() {
  echo "${GREEN}✔ $1${R}"
}

wait "checking test environment"

source env.sh

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        echo "Linux..."
        ;;
    Darwin*)    
        echo "Mac..."
        brew install ideviceinstaller
        brew install carthage
        brew upgrade carthage
        npm install -g ios-deploy
        ;;
esac


unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     
        echo "Linux..."
        npm run build-android-debug
        ;;
    Darwin*)    
        info 'Mac...'
        info 'Killing running simulators'
        killall -9 Simulator && check 'done'
        wait 'Unbooting booted simulators'
        xcrun simctl list devices | grep -i "booted" | grep -Eo "\([A-F0-9-]+\)" | tr -d '()' | xargs xcrun simctl shutdown
        SIM_UDID=`xcrun instruments -s | grep -E "$PEERIO_IOS_SIM \($PEERIO_IOS_VERSION.*\)" | grep -o "\[.*\]" | tr -d '[]' | head -1`
        info "Looking for simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
        if [ -z $"$SIM_UDID" ]; then
          error "Could not find simulator: $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION)"
          echo "Available simulators:"
          xcrun instruments -s
          exit 1
        fi
        check "found $PEERIO_IOS_SIM ($PEERIO_IOS_VERSION) $SIM_UDID$"
        SIM_LOG="$HOME/Library/Logs/CoreSimulator/$SIM_UDID/system.log"
        check "logs ${SIM_LOG}"
        wait 'Booting selected simulator' && check 'simulator booted'
        xcrun simctl boot $SIM_UDID
        wait 'Uninstalling app booted simulators'
        xcrun simctl uninstall $SIM_UDID com.peerio && check 'app uninstalled'
        ;;
esac

adb shell pm uninstall com.peerio.app
if [ `adb shell "if [ -e /sdcard/DCIM/Camera/androidTestImage.png ]; then echo 1; fi"` ]
then
echo "Device already has image"
else
echo "Pushing image to device"
adb push test/assets/androidTestImage.png /sdcard/DCIM/Camera/androidTestImage.png
adb reboot
fi

./node_modules/.bin/appium > ./appium.log 2> ./appium.log &
APPIUM_PID=$!

trap "exit" INT TERM
trap "kill -9 $APPIUM_PID" EXIT
sleep 1

wait "Waiting appium to launch on 4723..."

while ! nc -z localhost 4723; do   
  sleep 0.1
done

check "appium launched"

rm -rf test/reports/result
mkdir -p test/reports/result

cucumberjs test/spec -r test/code -f node_modules/cucumber-pretty -f json:test/reports/result/result-ios.json --world-parameters "{\"platform\": \"ios\"}"
cucumberjs test/spec -r test/code -f node_modules/cucumber-pretty -f json:test/reports/result/result-android.json --world-parameters "{\"platform\": \"android\"}"

node test/reports/generate-report.js