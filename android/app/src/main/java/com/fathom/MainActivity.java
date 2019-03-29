package com.fathom;

import com.facebook.common.logging.FLog;
import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Fathom";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
        // Fabrics
        Fabric.with(this, new Crashlytics());
        FLog.setLoggingDelegate(ReactNativeFabricLogger.getInstance());
    }

    // my new code here
    @Override
    protected void onPause() {
        SplashScreen.hide(this);
        super.onPause();
    }
}
