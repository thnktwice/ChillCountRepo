ChillCountRepo
==============

This is the repository where all the code and assets necessary to build our prototypes for the "ChillCount" project.

It contains :
- Builds that were distributed to the beta testers (*.ipa for iOS, *-debug.apk for Android)
- Client code (Meteor cordova mobile app)
- Server code (Meteor free server)
- Arduino code used by our Ble chips (*.ino file loaded in each Arduino chip)

In order to run or modify the app, you have you use the Meteor.js framework inside the ChillCount folder :
- * meteor run * will run the app on localhost:3000
- * meteor run ios/android * will run the app on the relevant simulator
- * meteor build +settings * will allow you to build your android and ios target the deployment server 

In order to be able to load the Arduino code, you have to follow the relevant steps according to your Ble hardware.

For a Lightblue Bean for example, see their docs :
- Bean Loader to load the sketch via bluetooth
- Lightblue bean plugin to access the bluebean inside the Arduino software
- Tinsyduino to make this work

Compatible with
- Meteor version >= 0.9.4-pre1
- iPhone >= 4S (for the ble)
- Android with ble




