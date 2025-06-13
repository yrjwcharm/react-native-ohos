import { SvgaPlayerPackage } from '@react-native-ohos/react-native-svga-player';
import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SvgaPlayerPackage(ctx)
  ];
}