import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '../generated/ts';
import { fileIo, fileUri } from '@kit.CoreFileKit';
import { util } from '@kit.ArkTS';
import { wantConstant } from '@kit.AbilityKit';
import { getMimeType } from '../mime';
import request from '@ohos.request';
interface FileInfo{
  url?: string,
  fileName?: string,
  fileType?: string,
  cache?: boolean,
  base64?: string
}

export class DocViewerModule extends TurboModule implements TM.RNDocViewer.Spec {
  tempDir: string
  constructor(ctx: TurboModuleContext) {
    super(ctx)
    this.ctx = ctx
    this.createTempDir()
  }
  createTempDir() {
    const context = this.ctx.uiAbilityContext
    let filesDir = context.tempDir + `/docViewerTemp`
    this.tempDir = filesDir
    fileIo.mkdir(filesDir).then(() => {
    }).catch((err) => {
    })
  }
  async saveBase64(base64: string, filePath: string){
    const baseHelper = new util.Base64Helper()
    const buf = baseHelper.decodeSync(base64).buffer as ArrayBuffer
    const file = await fileIo.open(filePath, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE)
    await fileIo.write(file.fd, buf)
    fileIo.close(file)
  }
  async openDocb64(fileParams: FileInfo[], callback: Function) {
    const { base64, url, fileName, fileType, cache } = fileParams[0]
    if (base64 && fileName && fileType) {
      try{
        const filePath = this.getFilePath(fileName)
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
    const { url, fileName, fileType, cache } = fileParams[0]
    try{
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
  async openDoc(fileParams: FileInfo[], callback: Function) {
    const { url, fileName, fileType, cache } = fileParams[0]
    try{
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
  getFilePath(fileName: string, url?: string) {
    const context = this.ctx.uiAbilityContext
    let filedDir = this.tempDir
    if (fileName) {
      return `${filedDir}/${fileName}`
    }
    if (url) {
      const urlSplit = url?.split('/')
      const name = urlSplit[urlSplit.length - 1]
      const filePath = filedDir + `/${name}`
      return filePath
    }
    return ''
  }
  async useCache(fileType: string, url: string, fileName: string, callback: Function, notExistsFn?: Function) {
    const filePath = this.getFilePath(fileName, url)
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
    try{
      const isExists = await fileIo.access(filePath)
      if (isExists) {
        await fileIo.unlink(filePath)
      }
    } catch (err) {
    }
  }
  async download(url: string, fileType: string, fileName: string, callback: Function) {
    const filePath = this.getFilePath(fileName, url)
    this.removeFile(filePath)
    const context = this.ctx.uiAbilityContext
    try{
      request.downloadFile(context, {
        url,
        filePath
      }).then(downloadTask => {
        downloadTask.on('complete', () => {
          this.shareFile(filePath, fileType, callback)
        })
        downloadTask.on('fail', () => {
          this.removeFile(filePath)
          callback(`download fail`)
        })
      }).catch(err => {
      })
    } catch (err) {
      if (err.code === 13400002) {
        this.shareFile(filePath, fileType, callback)
      } else {
        callback(`download fail`)
      }
    }
  }
  shareFile(filePath: string, fileType: string, callback: Function) {
    const uri = fileUri.getUriFromPath(filePath)
    this.start(uri, fileType, callback)
  }
  start(uri: string, fileType: string, callback: Function) {
    const mimeType = getMimeType(fileType)
    const want = {
      flags: wantConstant.Flags.FLAG_AUTH_WRITE_URI_PERMISSION | wantConstant.Flags.FLAG_AUTH_READ_URI_PERMISSION,
      action: 'ohos.want.action.viewData',
      uri,
      type: mimeType
    }
    const context = this.ctx.uiAbilityContext
    context.startAbility(want, (err, data) => {
      if (err.code !== 0) {
        callback(`want startAbility err:${JSON.stringify(err)}`)
      } else {
        callback('', uri)
      }
    })
  }
}