import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import util from '@ohos.util'
import { fileIo, fileUri } from '@kit.CoreFileKit';
import { getMimeType } from '../mime'
import request from '@ohos.request';
import { Mime } from '../../utils/Mime';
import { filePreview } from '@kit.PreviewKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { Want, wantConstant } from '@kit.AbilityKit';
import { http } from "@kit.NetworkKit";

interface FileInfo {
  url?: string,
  fileName?: string,
  fileType?: string,
  cache?: boolean,
  base64?: string
}

export class DocViewerTurboModule extends TurboModule {
  tempDir: string

  constructor(ctx: TurboModuleContext) {
    super(ctx)
    this.ctx = ctx
    this.createTempDir()
  }

  createTempDir() {
    const context = this.ctx.uiAbilityContext
    let filesDir = context.filesDir + `/docViewerTemp`
    this.tempDir = filesDir
    fileIo.mkdir(filesDir)
  }

  async saveBase64(base64: string, filePath: string) {
    const baseHelper = new util.Base64Helper()
    const buf = baseHelper.decodeSync(base64).buffer as ArrayBuffer
    const file = await fileIo.open(filePath, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE)
    await fileIo.write(file.fd, buf)
    fileIo.close(file)
  }

  async openDocb64(fileParams: FileInfo[], callback: Function) {
    console.log(`openDocb64 start params:${JSON.stringify(fileParams)}`)
    const { base64, fileName, fileType, cache } = fileParams[0]
    if (base64 && fileName && fileType) {
      try {
        const filePath = this.getFilePath(fileName, fileType)
        if (cache) {
          this.useCache(fileType, '', fileName, callback, async () => {
            await this.saveBase64(base64, filePath)
            this.shareFile(filePath, fileType, callback)
          })
        } else {
          await this.saveBase64(base64, filePath)
          this.shareFile(filePath, fileType, callback)
        }
      } catch (e) {
        callback(`openDocb64 execute failed`)
      }
    } else {
      callback(`Requires parameters: base64, fileName, fileType`)
    }
  }

  async openDocBinaryinUrl(fileParams: FileInfo[], callback: Function) {
    let httpRequest = http.createHttp();
    const { url, fileName, fileType, cache } = fileParams[0]
    const filePath = this.getFilePath(fileName, fileType, url);
    const chunks: ArrayBuffer[] = []; // 存储所有数据块
    try {
      if (url && fileName && fileType) {
        if (cache) {
          this.useCache(fileType, url, fileName, callback)
        } else {
          httpRequest.requestInStream(url, {
            expectDataType: http.HttpDataType.ARRAY_BUFFER,
            method: http.RequestMethod.GET, // 可选，默认为http.RequestMethod.GET。
            connectTimeout: 60000,
            readTimeout: 60000
          })
          httpRequest.on('dataReceiveProgress',(data)=>{
            const progress = data.receiveSize * 100 /data.totalSize;
            if(progress<100){
              this.ctx?.rnInstance?.emitDeviceEvent('RNDownloaderProgress',{progress});
            }
          })
          httpRequest.on('dataReceive',(buffer)=>{
            chunks.push(buffer);
          })
          httpRequest.on('dataEnd',()=>{
            this.ctx?.rnInstance?.emitDeviceEvent('RNDownloaderProgress',{progress:100});

            // 合并所有ArrayBuffer
            const totalLength = chunks.reduce((len, chunk) => len + chunk.byteLength, 0);
            const mergedBuffer = new Uint8Array(totalLength);
            let offset = 0;
            chunks.forEach(chunk => {
              mergedBuffer.set(new Uint8Array(chunk), offset);
              offset += chunk.byteLength;
            });

            // 一次性写入完整数据
            const tempFile = fileIo.openSync(filePath, 0o102);
            fileIo.writeSync(tempFile.fd, mergedBuffer.buffer);
            fileIo.closeSync(tempFile.fd);
            this.shareFile(filePath, fileType, callback);
          })
        }
      } else {
        callback(`Requires parameters: url,fileName,fileType`)
      }
    } catch (e) {
      callback(`${JSON.stringify(e)}`)
    }
  }

  async openDoc(fileParams: FileInfo[], callback: Function) {
    const { url, fileName, fileType, cache } = fileParams[0]
    try {
      if (url) {
        if (cache) {
          this.useCache(fileType, url, fileName, callback)
        } else {
          await this.download(url, fileType, fileName, callback)
        }
      } else {
        callback(`Requires parameters: url`)
      }
    } catch (e) {
      callback(`${JSON.stringify(e)}`)
    }
  }

  getFilePath(fileName: string, fileType: string, url?: string) {
    let filedDir = this.tempDir
    if (fileName) {
      return `${filedDir}/${fileName}${fileType ? '.' + fileType : ''}`
    }
    if (url) {
      const urlSplit = url?.split('/')
      const name = urlSplit[urlSplit.length - 1]
      const filePath = filedDir + `/${name?.includes('.') ? name : (fileType ? name + `.${fileType}` : '')}`
      return filePath
    }
    return ''
  }

  async useCache(fileType: string, url: string, fileName: string, callback: Function, notExistsFn?: Function) {
    const filePath = this.getFilePath(fileName, fileType, url)
    const isExists = await fileIo.access(filePath)
    if (isExists) {
      this.shareFile(filePath, fileType, callback)
    } else {
      if (notExistsFn) {
        notExistsFn()
      } else {
        this.download(url, fileType, fileName, callback)
      }
    }
  }

  async removeFile(filePath: string) {
    try {
      const isExists = await fileIo.access(filePath)
      if (isExists) {
        await fileIo.unlink(filePath)
      }
    } catch (err) {
    }
  }

  async download(url: string, fileType: string, fileName: string, callback: Function) {
    const filePath = this.getFilePath(fileName, fileType, url)
    const context = this.ctx.uiAbilityContext
    try {
      request.downloadFile(context, {
        url,
        filePath
      }).then(downloadTask => {
        downloadTask.on('complete', () => {
          this.shareFile(filePath, fileType, callback)
        })
        downloadTask.on("progress", (receivedSize: number, totalSize: number) => {
          this.ctx?.rnInstance?.emitDeviceEvent("RNDownloaderProgress", { progress: (receivedSize/totalSize) *100 })

        })
        downloadTask.on('fail', (err) => {
          this.removeFile(filePath)
          callback(`download fail:${err}`)
        })
      }).catch(err => {
        callback(`Invoke catch downloadTask failed:${JSON.stringify(err)}`)
      })
    } catch (err) {
      if (err.code === 13400002) {
        this.shareFile(filePath, fileType, callback)
      } else {
        callback(`download fail:${JSON.stringify(err)}`)
      }
    }
  }

  shareFile(filePath: string, fileType: string, callback: Function) {
    const uri = fileUri.getUriFromPath(filePath)
    this.start(uri, fileType, callback)
  }

  generatePreviewInfo(uri: string): filePreview.PreviewInfo {
    let fileName = Mime.getFileUri(uri).name;
    let fileExtention = Mime.getFileExtention(fileName);
    let mimeType = getMimeType(fileExtention);
    let previewInfo: filePreview.PreviewInfo = {
      title: fileName,
      uri: uri,
      mimeType: mimeType
    };
    return previewInfo;
  }

  start(uri: string, fileType: string, callback: Function) {
    // const context = this.ctx.uiAbilityContext
    // let fileName = Mime.getFileUri(uri).name;
    // let mimeType = getMimeType(Mime.getFileExtention(fileName));
    // let want: Want = {
    //   flags:
    //     (wantConstant.Flags.FLAG_AUTH_WRITE_URI_PERMISSION | wantConstant.Flags.FLAG_AUTH_READ_URI_PERMISSION) ,
    //   action:'ohos.want.action.viewData',
    //   uri: uri,
    //   type: mimeType
    // }
    // context.startAbility(want, (err, data) => {
    //   if (err.code !== 0) {
    //     console.log(`share file err:${JSON.stringify(err)}`)
    //     callback(`want startAbility err:${JSON.stringify(err)}`)
    //   } else {
    //     callback('', uri)
    //   }
    // })
    filePreview.canPreview(this.ctx.uiAbilityContext, uri).then((result) => {
      filePreview.openPreview(this.ctx.uiAbilityContext, this.generatePreviewInfo(uri)).then(() => {
        callback('', uri)
      }).catch((err: BusinessError) => {
        callback(`Failed to open preview, err.code = ${err.code}, err.message = ${err.message}`)
      });
    }).catch((err: BusinessError) => {
      callback(`Failed to obtain the result of whether it can be previewed, err.code = ${err.code}, err.message = ${err.message}`);
    });
  }

  onSharePreview(uri: string, write: boolean = true): Promise<void> {
    const context = this.ctx.uiAbilityContext
    let fileName = Mime.getFileUri(uri).name;
    let mimeType = getMimeType(Mime.getFileExtention(fileName));
    let want: Want = {
      // 配置被分享文件的读写权限，例如对被分享应用进行读写授权
      flags: write ?
        (wantConstant.Flags.FLAG_AUTH_WRITE_URI_PERMISSION | wantConstant.Flags.FLAG_AUTH_READ_URI_PERMISSION) :
      wantConstant.Flags.FLAG_AUTH_READ_URI_PERMISSION,
      action: 'ohos.want.action.sendData', //配置分享应用的隐式拉起规则
      uri: uri,
      type: mimeType
    }
    return context.startAbility(want);
  }
}