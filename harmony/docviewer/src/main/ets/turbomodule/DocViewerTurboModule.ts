import {TurboModule, TurboModuleContext} from '@rnoh/react-native-openharmony/ts';
import Log from '../Log'
import fs from '@ohos.file.fs'
import util from '@ohos.util'
import { fileUri } from '@kit.CoreFileKit';
import { getMimeType } from '../mime'
import request from '@ohos.request';
import { wantConstant } from '@kit.AbilityKit';

interface FileInfo{
  url?: string,
  fileName?: string,
  fileType?: string,
  cache?: boolean,
  base64?: string
}

export class DocViewerTurboModule extends TurboModule{
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
    fs.mkdir(filesDir).then(() => {
      Log.debug(`mkdir succeed`)
    }).catch((err) => {
      Log.debug(`mkdir failed with error:${JSON.stringify(err)}`)
    })
  }
  async saveBase64(base64: string, filePath: string){
    Log.debug(`saveBase64 start filePath:${filePath}`)
    const baseHelper = new util.Base64Helper()
    const buf = baseHelper.decodeSync(base64).buffer as ArrayBuffer
    const file = await fs.open(filePath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
    await fs.write(file.fd, buf)
    fs.close(file)
  }
  async openDocb64(fileParams: FileInfo[], callback: Function) {
    Log.debug(`openDocb64 start params:${JSON.stringify(fileParams)}`)
    const { base64, url, fileName, fileType, cache } = fileParams[0]
    if (base64 && fileName && fileType) {
      try{
        const filePath = this.getFilePath(fileName)
        if (cache) {
          Log.debug(`try to use cache base64 file`)
          this.useCache(fileType, '', fileName, callback, async () => {
            await this.saveBase64(base64, filePath)
            this.shareFile(filePath, fileType, callback)
          })
        } else {
          await this.saveBase64(base64, filePath)
          this.shareFile(filePath, fileType, callback)
        }
      } catch (e) {
        Log.debug(`openDocb64 err：${JSON.stringify(e)}`)
        callback(`openDocb64 execute failed`)
      }
    } else {
      callback(`Requires parameters: base64, fileName, fileType`)
    }
  }
  async openDocBinaryinUrl(fileParams: FileInfo[], callback: Function) {
    Log.debug(`openDocBinaryinUrl start params:${JSON.stringify(fileParams)}`)
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
    Log.debug(`openDoc start params:${JSON.stringify(fileParams)}`)
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
      Log.debug(`getFilePath name:${name}`)
      const filePath = filedDir + `/${name}`
      return filePath
    }
    return ''
  }
  async useCache(fileType: string, url: string, fileName: string, callback: Function, notExistsFn?: Function) {
    Log.debug(`useCache start`)
    const filePath = this.getFilePath(fileName, url)
    const isExists = await fs.access(filePath)
    if (isExists) {
      Log.debug(`useCache isExists:${filePath}`)
      this.shareFile(filePath, fileType, callback)
    } else {
      if (notExistsFn) {
        notExistsFn()
      } else {
        Log.debug(`not exists ${filePath}, to download`)
        this.download(url, fileType, fileName, callback)
      }
    }
  }
  async removeFile(filePath: string) {
    try{
      const isExists = await fs.access(filePath)
      if (isExists) {
        Log.debug(`isExists ${filePath}, to remove`)
        await fs.unlink(filePath)
      }
    } catch (err) {
      Log.debug(`removeFile err:${JSON.stringify(err)}`)
    }
  }
  async download(url: string, fileType: string, fileName: string, callback: Function) {
    Log.debug(`download start url:${url}`)
    const filePath = this.getFilePath(fileName, url)
    this.removeFile(filePath)
    const context = this.ctx.uiAbilityContext
    try{
      request.downloadFile(context, {
        url,
        filePath
      }).then(downloadTask => {
        Log.debug(`downloadTask start`)
        downloadTask.on('complete', () => {
          Log.debug(`download complete:${fileName}`)
          this.shareFile(filePath, fileType, callback)
        })
        downloadTask.on('fail', () => {
          Log.debug(`download fail:${fileName}`)
          this.removeFile(filePath)
          callback(`download fail`)
        })
      }).catch(err => {
        Log.debug(`Invoke catch downloadTask failed:${JSON.stringify(err)}`)
      })
    } catch (err) {
      Log.debug(`Invoke catch downloadTask failed:${JSON.stringify(err)}`)
      if (err.code === 13400002) {
        Log.debug(`file is exists:${fileName}`)
        this.shareFile(filePath, fileType, callback)
      } else {
        callback(`download fail`)
      }
    }
  }
  shareFile(filePath: string, fileType: string, callback: Function) {
    const uri = fileUri.getUriFromPath(filePath)
    Log.debug(`shareFile uri: ${uri}, filePath: ${filePath}`)
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
    Log.debug(`share want params:${JSON.stringify(want)}`)
    context.startAbility(want, (err, data) => {
      if (err.code !== 0) {
        Log.debug(`share file err:${JSON.stringify(err)}`)
        callback(`want startAbility err:${JSON.stringify(err)}`)
      } else {
        callback('', uri)
      }
    })
  }
}