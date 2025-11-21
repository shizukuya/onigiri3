import { TestIds } from 'react-native-google-mobile-ads';

// Production IDs from README.md
const PRODUCTION_IDS = {
    ANDROID: {
        BANNER: 'ca-app-pub-5081824799734894/6956713636',
        REWARDED: 'ca-app-pub-5081824799734894/1695706143',
    },
    IOS: {
        BANNER: 'ca-app-pub-5081824799734894/2785426531',
        REWARDED: 'ca-app-pub-5081824799734894/3687444668',
    },
};

// Development IDs (from README.md, but usually TestIds are safer for dev)
// Using TestIds for development to avoid policy violations unless explicitly testing real ads
const DEV_IDS = {
    ANDROID: {
        BANNER: 'ca-app-pub-3940256099942544/9214589741', // Test Banner
        REWARDED: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded
    },
    IOS: {
        BANNER: 'ca-app-pub-3940256099942544/2435281174', // Test Banner
        REWARDED: 'ca-app-pub-3940256099942544/1712485313', // Test Rewarded
    },
};

// Helper to select ID based on platform and environment
import { Platform } from 'react-native';

const isDev = __DEV__;

export const AdMobConfig = {
    bannerAdUnitId: Platform.select({
        ios: isDev ? TestIds.BANNER : PRODUCTION_IDS.IOS.BANNER,
        android: isDev ? TestIds.BANNER : PRODUCTION_IDS.ANDROID.BANNER,
        default: TestIds.BANNER,
    }),
    rewardedAdUnitId: Platform.select({
        ios: isDev ? TestIds.REWARDED : PRODUCTION_IDS.IOS.REWARDED,
        android: isDev ? TestIds.REWARDED : PRODUCTION_IDS.ANDROID.REWARDED,
        default: TestIds.REWARDED,
    }),
};
