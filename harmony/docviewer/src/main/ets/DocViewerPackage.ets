// entry/src/main/ets/GeneratedPackage.ets
import { RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type {
  TurboModule,
  TurboModuleContext
} from '@rnoh/react-native-openharmony/ts';
import { DocViewerTurboModule } from './turbomodule/DocViewerTurboModule';
import { TM } from './generated';

class GeneratedTurboModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === TM.RNDocViewer.NAME) {
      return new DocViewerTurboModule(this.ctx);
    }
    return null;
  }
  hasTurboModule(name: string): boolean {
    return name === TM.RNDocViewer.NAME;
  }
}
export class DocViewerPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new GeneratedTurboModulesFactory(ctx);
  }
}