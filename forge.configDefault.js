module.exports = {
  "packagerConfig": {
    "name": "<Package Name>",
    "osxSign": {
      "identity": "<DEVELOPER-ID-FROM-CERT>",
      "hardened-runtime": true,
      "entitlements": "entitlements.plist",
      "entitlements-inherit": "entitlements.plist",
      "signature-flags": "library"
    },
    "osxNotarize": {
      "appleId": "<APPLE-ID>",
      "appleIdPassword": "<PERSONAL-APP-PASSWORD>"
    }
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "<APP-NAME>",
      }
    },
    {
      "name": "@electron-forge/maker-dmg",
      "config": {
        "name": "<APP-NAME>"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    }
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "<GITHUB-USER>",
          "name": "<REPO-NAME>",
        },
        "authToken": "<GITHUB-AUTH-TOKEN>",
        "prerelease": true
      }
    }
  ]
};