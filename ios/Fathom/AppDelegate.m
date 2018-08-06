/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <asl.h>
#import <React/RCTLog.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif
#import "RNSplashScreen.h"
#import <React/RCTPushNotificationManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Fabric with:@[[Crashlytics class]]];
  RCTSetLogThreshold(RCTLogLevelInfo);
  RCTSetLogFunction(CrashlyticsReactLogFunction);

  NSURL *jsCodeLocation;


#ifdef DEBUG
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.12:8081/index.bundle?platform=ios&dev=true"];
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

#else
    jsCodeLocation = [CodePush bundleURL];
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation
                                            moduleProvider:nil
                                             launchOptions:launchOptions];
#if RCT_DEV
  [bridge moduleForClass:[RCTDevLoadingView class]];
#endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                      moduleName:@"Fathom"
                                               initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  /**
   * Custom
   * Get launch image - saves annoying white flash
   */
//  UIImageView *launchScreenView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"LaunchScreen"]]; // Image named "LaunchScreen"
//  launchScreenView.frame = self.window.bounds;
//  
//  launchScreenView.contentMode = UIViewContentModeScaleAspectFill;
//  rootView.loadingView = launchScreenView;

  [RNSplashScreen show];
  return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                               RCTLogLevel level,
                                               __unused RCTLogSource source,
                                               NSString *fileName,
                                               NSNumber *lineNumber,
                                               NSString *message
                                               )
{
  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);

#ifdef DEBUG
  fprintf(stderr, "%s\n", log.UTF8String);
  fflush(stderr);
#else
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
#endif

  int aslLevel;
  switch(level) {
    case RCTLogLevelTrace:
      aslLevel = ASL_LEVEL_DEBUG;
      break;
    case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
    case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
    case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
    case RCTLogLevelFatal:
      aslLevel = ASL_LEVEL_CRIT;
      break;
  }
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);


};

@end
