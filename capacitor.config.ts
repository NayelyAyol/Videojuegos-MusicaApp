import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "io.ionic.starter",
  "appName": "MusicaApp",
  "webDir": "www",
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "backgroundColor": "#7c3aed"
    }
  }
}

export default config;
