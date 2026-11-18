#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

extern "C" {

    void _triggerImpactHaptic(int type) {
        if (@available(iOS 13.0, *)) {
            dispatch_async(dispatch_get_main_queue(), ^{
                UIImpactFeedbackStyle style = UIImpactFeedbackStyleLight;
                switch (type) {
                    case 0: style = UIImpactFeedbackStyleLight; break;
                    case 1: style = UIImpactFeedbackStyleMedium; break;
                    case 2: style = UIImpactFeedbackStyleHeavy; break;
                    case 3: style = UIImpactFeedbackStyleRigid; break;
                    case 4: style = UIImpactFeedbackStyleSoft; break;
                    default: style = UIImpactFeedbackStyleLight; break;
                }
                UIImpactFeedbackGenerator *generator = [[UIImpactFeedbackGenerator alloc] initWithStyle:style];
                [generator prepare];
                [generator impactOccurred];
            });
        }
    }

    void _triggerNotificationHaptic(int type) {
        if (@available(iOS 10.0, *)) {
            dispatch_async(dispatch_get_main_queue(), ^{
                UINotificationFeedbackType notifType = UINotificationFeedbackTypeSuccess;
                switch (type) {
                    case 0: notifType = UINotificationFeedbackTypeSuccess; break;
                    case 1: notifType = UINotificationFeedbackTypeWarning; break;
                    case 2: notifType = UINotificationFeedbackTypeError; break;
                    default: notifType = UINotificationFeedbackTypeSuccess; break;
                }
                UINotificationFeedbackGenerator *generator = [[UINotificationFeedbackGenerator alloc] init];
                [generator prepare];
                [generator notificationOccurred:notifType];
            });
        }
    }

    void _triggerSelectionHaptic() {
        if (@available(iOS 10.0, *)) {
            dispatch_async(dispatch_get_main_queue(), ^{
                UISelectionFeedbackGenerator *generator = [[UISelectionFeedbackGenerator alloc] init];
                [generator prepare];
                [generator selectionChanged];
            });
        }
    }
}
