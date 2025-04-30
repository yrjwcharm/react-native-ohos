import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony/ts';
import { GeneratedPackage } from './GeneratedPackage';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new GeneratedPackage(ctx)
  ];
}