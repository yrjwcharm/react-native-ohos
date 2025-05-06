package com.awesomeproject;


import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NativeCalculatorModule extends ReactContextBaseJavaModule {
    public NativeCalculatorModule(ReactApplicationContext context) {
            super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "RTNCalculator";
    }
    @ReactMethod
    public void add(int a, int b, Promise promise) {
       promise.resolve(a+b);
    }
}
