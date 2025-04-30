#### 1.react-native 适配 Harmony Demo

##### 官方地址：

**https://gitcode.com/openharmony-sig/ohos_react_native/**

### 端能力详情地址

**https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/TurboModule.md**

#### 端能力 TurboModules/RTNCalculator/package.json

```json
{
  "name": "rtn-calculator",
  "version": "1.0.0",
  "description": "Add numbers with TurboModules",
  "main": "index.ts",
  "keywords": [],
  "author": "<Your Name> <your_email@your_provider.com> (https://github.com/<your_github_handle>)",
  "license": "ISC",
  "harmony": {
    "alias": "@rtn/calculator",
    "codegenConfig": [
      {
        "version": 2,
        "specPaths": ["./src/specs"]
      }
    ]
  },
  "files": ["index.ts", "src/*", "harmony.tar.gz"],
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  },
  "devDependencies": {
    "@types/react": "^18.2.47",
    "react": "18.2.0",
    "react-native": "0.72.5"
  },
  "dependencies": {}
}
```

### 1.项目根目录下执行 npm i/yarn 命令

**安装 TurboModules/RTNCalculator**

**node_modules 下可以查看**

### 2.npm run codegen /yarn codegen 命令

### 3.按照 V2 新版本端能力提供方法 配置

### 4.倘若最终报了如下错误

```CMake
 CMake Error at CMakeLists.txt:84 (target_include_directories):
  Cannot specify include directories for target "rnoh_app" which is not built
  by this project.
```

**是因为** 这两处必须一致

![alt text](image-3.png)
