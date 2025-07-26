import {
  DescriptorWrapperFactoryByDescriptorType,
  DescriptorWrapperFactoryByDescriptorTypeCtx, RNPackage} from "@rnoh/react-native-openharmony";
import { RNC, TM } from "./generated";

export class  SvgaPlayerPackage extends  RNPackage{
  createDescriptorWrapperFactoryByDescriptorType(ctx: DescriptorWrapperFactoryByDescriptorTypeCtx): DescriptorWrapperFactoryByDescriptorType {
    return {
      'SvgaPlayerView': (ctx) => new RNC.SvgaPlayerView.DescriptorWrapper(ctx.descriptor)
    }
  }
}
