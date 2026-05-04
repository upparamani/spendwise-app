import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.panlabs26.spendwise',
  appName: 'SpendWise',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#0c0c0e',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    backgroundColor: '#0c0c0e',
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#0c0c0e',
      androidSplashResourceName: 'splash',
      iosSpinnerStyle: 'small',
      spinnerColor: '#c8f250',
      showSpinner: true,
      launchAutoHide: true
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#c8f250'
    }
  }
};

export default config;
