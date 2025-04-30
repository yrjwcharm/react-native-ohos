// entry/src/main/ets/GeneratedPackage.ets
import { RNPackage } from '@rnoh/react-native-openharmony/ts';
import { TM } from "@rnoh/react-native-openharmony/generated/ts"
import { CalculatorModule } from './turbomodules/CalculatorModule';
import { AnyThreadTurboModule,
  AnyThreadTurboModuleContext,
  AnyThreadTurboModuleFactory } from '@rnoh/react-native-openharmony';

class GeneratedTurboModulesFactory extends AnyThreadTurboModuleFactory {
  createTurboModule(name: string): AnyThreadTurboModule | null {
    if (name === TM.RTNCalculator.NAME) {
      return new CalculatorModule(this.ctx);
    }
    return null;
  }
  hasTurboModule(name: string): boolean {
    return name === TM.RTNCalculator.NAME;
  }
}
export class GeneratedPackage extends RNPackage {
  createAnyThreadTurboModuleFactory(ctx: AnyThreadTurboModuleContext): AnyThreadTurboModuleFactory {
    return new GeneratedTurboModulesFactory(ctx);
  }
}