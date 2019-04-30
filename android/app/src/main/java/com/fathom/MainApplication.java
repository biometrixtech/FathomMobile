package com.fathom;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import it.innove.BleManagerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.zmxv.RNSound.RNSoundPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.reactlibrary.RNWifiPackage;
import com.ijzerenhein.magicmove.ReactMagicMovePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new AsyncStoragePackage(),
                new NetInfoPackage(),
                new LottiePackage(),
                new VectorIconsPackage(),
                new LocationServicesDialogBoxPackage(),
                new BleManagerPackage(),
                new RNDeviceInfo(),
                new RNCWebViewPackage(),
                new GoogleAnalyticsBridgePackage(),
                new KCKeepAwakePackage(),
                new RNSoundPackage(),
                new SplashScreenReactPackage(),
                new ReactVideoPackage(),
                new LinearGradientPackage(),
                new ReactNativePushNotificationPackage(),
                new FabricPackage(),
                new RNWifiPackage(),
                new ReactMagicMovePackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
        SoLoader.init(this, /* native exopackage */ false);
    }
}
