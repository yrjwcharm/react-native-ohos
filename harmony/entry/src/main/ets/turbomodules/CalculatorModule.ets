// entry/src/main/ets/turbomodule/CalculatorModule.ets
import { AnyThreadTurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';

export class CalculatorModule extends AnyThreadTurboModule implements TM.RTNCalculator.Spec {
  add(a: number, b: number): Promise<number>{
    return Promise.resolve(a+b);
  }
}