/**
 * Copyright (c) 2024 Huawei Technologies Co., Ltd.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree.
 */

import { RNOHContext, RNViewBase } from '@rnoh/react-native-openharmony';
import { SvgaPlayerV2, SvgaController } from '@tb-open/svga';
import { BusinessError } from '@kit.BasicServicesKit';
import { fileIo } from '@kit.CoreFileKit';
import { common } from '@kit.AbilityKit';
import { RNC } from '../generated';

@Component
export struct SvgaPlayerView {
  public static readonly NAME = RNC.SvgaPlayerView.NAME;
  private controller: SvgaController = new SvgaController({
    loops: Infinity, // 播放3次
    fillMode: 'forwards', // 播放结束后停留在最后一帧
    pageUpdateMode: 'pause', // 页面切换时暂停动画
    autoRelease: true, // 页面销毁时自动释放资源
    clearsAfterStop: true        // 停止播放后清理资源
  });
  public ctx!: RNOHContext;
  public tag: number = 0;
  @State descriptorWrapper: RNC.SvgaPlayerView.DescriptorWrapper = {} as RNC.SvgaPlayerView.DescriptorWrapper;
  @State url: ResourceStr = '';
  private eventEmitter: RNC.SvgaPlayerView.EventEmitter | undefined = undefined;
  private cleanUpCallbacks: (() => void)[] = [];

  aboutToAppear() {
    this.eventEmitter = new RNC.SvgaPlayerView.EventEmitter(this.ctx.rnInstance, this.tag);
    this.onDescriptorWrapperChange(this.ctx.descriptorRegistry.findDescriptorWrapperByTag<RNC.SvgaPlayerView.DescriptorWrapper>(this.tag)!);
    this.cleanUpCallbacks.push(this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (descriptor) => {
        this.onDescriptorWrapperChange(new RNC.SvgaPlayerView.DescriptorWrapper(descriptor));
      }
    ))
    const receiver:RNC.SvgaPlayerView.CommandReceiver = new RNC.SvgaPlayerView.CommandReceiver(this.ctx.componentCommandReceiver,
      this.tag)
    this.cleanUpCallbacks.push(receiver.subscribe("load", (params) => {
      this.controller.load(params[0],true);
    }))
    this.cleanUpCallbacks.push(receiver.subscribe("startAnimation", () => {
      this.controller.startAnimation();
    }))
    this.cleanUpCallbacks.push(receiver.subscribe("pauseAnimation", () => {
      this.controller.pauseAnimation();
    }))
    this.cleanUpCallbacks.push(receiver.subscribe("stopAnimation", () => {
      this.controller.stopAnimation(true);
    }))
    this.cleanUpCallbacks.push(receiver.subscribe("stepToFrame", (params) => {
      this.controller.stepToFrame(params[0],params[1]);
    }))
    this.cleanUpCallbacks.push(receiver.subscribe("stepToPercentage", (params) => {
      this.controller.stepToPercentage(params[0],params[1]);
    }))
    // 播放完成回调
   this. controller.onFinished(() => {
      console.info('动画播放完成');
      this.eventEmitter?.emit('finished',{} as Record<string,Object>);
    });

    // 帧变化回调
   this. controller.onFrame((frame) => {
      console.info(`当前帧: ${frame}`);
     this.eventEmitter?.emit('frame',{
       value:frame
     });

   });

    // 进度变化回调
    this.controller.onPercentage((percent) => {
      console.info(`当前进度: ${percent * 100}%`);
      this.eventEmitter?.emit('percentage',{
        value:percent
      });
    });
  }

  private onDescriptorWrapperChange(descriptorWrapper: RNC.SvgaPlayerView.DescriptorWrapper) {
    this.descriptorWrapper = descriptorWrapper;
    // this.data = [];
    // const data = this.descriptorWrapper.props.data;
    // const value = this.descriptorWrapper.props.value;
    // for (const item of data) {
    //   this.data.push(
    //     new SelectItems(item.id, item.text, value.includes(item.id))
    //   )
    // }
    let source = this.descriptorWrapper.props.source;
    if (source.startsWith("http") || source.startsWith("https")) {
      this.url =source;
    } else {
      this.onCopyRawFileToLocal(source);
    }
  }

  aboutToDisappear() {
    this.cleanUpCallbacks.forEach(cb => cb());
    this.controller.release();
  }
  onCopyRawFileToLocal = (fileName:string)=>{
    let context = getContext(this) as common.UIAbilityContext; // 获取设备A的UIAbilityContext信息
    try {
      let val: Uint8Array = context.resourceManager.getRawFileContentSync(fileName);
      let pathDir: string = context.filesDir; // /data/storage/el2/base/haps/entry/files
      // 待拷贝文件沙箱路径
      let filePath: string = pathDir + '/'+fileName;
      // 若文件不存在，则创建文件。
      let file = fileIo.openSync(filePath, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);
      let writeLen = fileIo.writeSync(file.fd, val.buffer as ArrayBuffer);
      fileIo.closeSync(file);
      this.url = context.filesDir +'/'+fileName;
    } catch (error) {
      let code = (error as BusinessError).code;
      let message = (error as BusinessError).message;
    }

  }


  build() {
    RNViewBase({ ctx: this.ctx, tag: this.tag }) {
      // 声明式UI 2.0版本组件
      SvgaPlayerV2({
        url:  this.url,
        controller: this.controller
      })
      // Button("确定")
      //   .onClick(() => {
      //     const value = this.data
      //       .filter((item: SelectItems) => item.selected)
      //       .map((item: SelectItems) => item.id)
      //     // 发送事件方式[1]
      //     // this.ctx.rnInstance.emitComponentEvent(this.tag, "change", { value })
      //     // 发送事件方式[2]
      //     this.eventEmitter!.emit("change", {
      //       value,
      //     })
      //   })
    }
  }
}