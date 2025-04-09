# Building Zoya\`s Shower iOS App
This guide explains how to build and run the Zoya\`s Shower app on an iOS device.

## Prerequisites

- A Mac computer (required for building iOS apps)
- Xcode installed (latest version recommended)
- CocoaPods installed
- An Apple Developer account

## Building the App

1. Install Xcode on your Mac
2. Get the source code
3. Run `npm run build`
4. Run `npx cap sync ios`
5. Run `npx cap open ios`
6. Configure signing in Xcode
7. Build and run on a device or simulator

## App Store Distribution

1. Create an App Store Connect entry for your app
2. In Xcode, choose "Product" > "Archive"
3. Follow the distribution process in Xcode

## Troubleshooting

- App shows a blank screen: Run `npx cap sync ios` again
- Build errors: Ensure Xcode is up to date
- Signing issues: Check Apple Developer account settings
