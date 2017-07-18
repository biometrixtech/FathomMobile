cd ios
xcodebuild clean -workspace Fathom.xcworkspace -scheme Fathom
xcodebuild archive -workspace Fathom.xcworkspace -scheme Fathom
cd ..