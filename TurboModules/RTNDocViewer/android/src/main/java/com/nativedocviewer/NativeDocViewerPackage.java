package com.nativedocviewer;

import androidx.annotation.NonNull;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NativeDocViewerPackage extends TurboReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals(NativeDocViewerModule.NAME)) {
            return new NativeDocViewerModule(reactContext);
        } else {
            return null;
        }
    }
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                Map<String, ReactModuleInfo> map = new HashMap<>();
                map.put(NativeDocViewerModule.NAME,
                        new ReactModuleInfo(
                        NativeDocViewerModule.NAME,       // name
                        NativeDocViewerModule.NAME,       // className
                        false, // canOverrideExistingModule
                        false,
                        true,
                        false, // isCXXModule
                        true   // isTurboModule
                ));
                return map;
            }
        };
    }
}