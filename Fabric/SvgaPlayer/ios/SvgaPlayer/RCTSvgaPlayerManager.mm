#import <React/RCTLog.h>
#import <React/RCTUIManager.h>
#import <React/RCTViewManager.h>


@interface RCTSvgaPlayerManager : RCTViewManager
@end

@implementation RCTSvgaPlayerManager

RCT_EXPORT_MODULE(RCTSvgaPlayer)

RCT_EXPORT_VIEW_PROPERTY(source, NSString)

@end
