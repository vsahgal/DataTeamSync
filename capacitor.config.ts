import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zoyashower.app',
  appName: "Zoya's Shower",
  webDir: 'dist/public',
  server: {
    // Uncomment this for testing on a device
    // url: 'http://your-ip-address:5173',
    // cleartext: true
  }
};

export default config;
