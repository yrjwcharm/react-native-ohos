
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import { AnyThreadTurboModule } from '@rnoh/react-native-openharmony';

export class CalculatorModule extends AnyThreadTurboModule implements TM.RTNCalculator.Spec {
  add(a: number, b: number): Promise<number>{
    return Promise.resolve(a+b);
  }
}