#### 1.react-native  适配Harmony Demo

##### 官方地址：

**https://gitcode.com/openharmony-sig/ohos_react_native/**


### 端能力详情地址

**https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/TurboModule.md**

![alt text](image-1.png)
![alt text](image.png)

#### 端能力TurboModules/RTNCalculator/package.json

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
          "specPaths": [
            "./src/specs"
          ]
        }
      ]
    },
    "files": [
      "index.ts",
      "src/*",
      "harmony.tar.gz"
    ],
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