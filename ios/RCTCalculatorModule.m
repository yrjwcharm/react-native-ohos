//
//  RCTCalculatorModule.m
//  AwesomeProject
//
//  Created by 闫瑞锋 on 2025/5/6.
//

#import "RCTCalculatorModule.h"

@implementation RCTCalculatorModule
RCT_EXPORT_MODULE(RTNCalculator);

RCT_EXPORT_METHOD(add:(NSInteger)a b:(NSInteger)b resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSInteger result = a + b;
  if (result > 0) {
    resolve(@(result));
  } else {
    NSError *error = [NSError errorWithDomain:@"com.example.error" code:1001 userInfo:@{NSLocalizedDescriptionKey: @"Result is negative"}];
    reject(@"no_result", @"There was no result", error);
  }
}

@end
