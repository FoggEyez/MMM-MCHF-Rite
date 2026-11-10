# MMM-MischiefHolidayAccents

Seasonal decorations and frost that adapt to your mirror modules.

Part of [Mirror Mischief](https://github.com/FoggEyez/Mirror-Mischief). Install and configure manually, or use the optional companion.

![MMM-MischiefHolidayAccents rendered example](docs/screenshot.png)

Screenshot uses the actual module renderer in an isolated preview. Network/health/economy readings are labelled synthetic demonstration data, not live readings.

## Install

Requires a working MagicMirror² installation, Node.js 22 or newer, and a current browser. Development baseline: MagicMirror² 2.38.0 API. Physical-device compatibility of this newly packaged version remains to be verified; see VALIDATION.md.

```sh
cd ~/MagicMirror/modules
git clone https://github.com/FoggEyez/MMM-MischiefHolidayAccents.git
```

No npm runtime dependencies or install scripts. No extra services are required.

Add this to the modules array in config/config.js, then restart MagicMirror²:

```js
{
  module: "MMM-MischiefHolidayAccents",
  position: "fullscreen_above",
  config: {}
}
```

## Customize

`holidayMode` accepts auto, off, christmas, newyear, valentine, stpatrick, easter, memorial, independence, labor, halloween, veterans or thanksgiving. Automatic dates use a US-oriented holiday calendar; select individual themes manually elsewhere. `timeZone` is an IANA zone or an empty string for the mirror system zone. `decorationSelectors` is a list of CSS selectors for non-Christmas decorations. `frostTargets` is an optional list of Christmas target profiles: {name,selector,index,edge,roots,depth,fern,icicles,delay}; edge is top, bottom, left or right. An empty list uses generic weather/calendar/network/music defaults. Choose installed modules you actually use. The private owner preview-file watcher is omitted; preview a season by changing holidayMode. Keep to one instance.

All supported settings are visible as literal defaults for generated settings editors.

| Setting | Default | Type |
| --- | --- | --- |
| decorationSelectors | `[".weather",".calendar",".MMM-OnSpotify",".lc-card",".hc-card"]` | array |
| frostTargets | `[]` | array |
| holidayMode | `"auto"` | string |
| timeZone | `""` | string |
| decorOpacity | `55` | number |
| motifSize | `54` | number |
| particleCount | `8` | number |
| motionDuration | `45` | number |
| showCornerDecorations | `true` | boolean |
| showClockAccents | `true` | boolean |
| showDrift | `true` | boolean |
| showFrost | `true` | boolean |
| frostStrength | `68` | number |
| breezeEveryMinutes | `4` | number |

## Mirror Mischief companion

Part of [Mirror Mischief](https://github.com/FoggEyez/Mirror-Mischief), a companion designed to make module installation, settings and layout easier. See [MIRROR-MISCHIEF.md](MIRROR-MISCHIEF.md) for setup and availability.

In Mirror Mischief, choose Install from a link, paste this repository URL, then open Module settings. Set your preferences and position, save and run Check setup. The repository folder, JavaScript entry and Module.register name match exactly. companion.json describes supported placement and dependencies; the current companion reads defaults from JavaScript, not this manifest. One instance per mirror is supported in this release; helpers share one configuration per module. For renamed legacy modules, install this version turned off first and disable the legacy counterpart before enabling it. Moon and Quotes retain their existing names: back up and review any local changes before updating their existing folders. No automatic config migration or removal occurs. Ordinary MagicMirror² configuration works without the companion.

## APIs, privacy and cost

None. Local decorative calendar and artwork; no accounts, calendar access or external requests.

No telemetry or analytics is added by Mischief. Keep private configuration, tokens and collector snapshots outside this repository.

## Update or remove

Review CHANGELOG.md, back up your private config and local customizations, then run git pull --ff-only inside this module folder and restart MagicMirror². To remove, disable/remove its config entry and restart; retain the folder for rollback or uninstall it using your companion. Never overwrite private configuration from an example.

## Development and support

Run npm ci and npm test. See CONTRIBUTING.md and VALIDATION.md. Report reproducible issues through this repository's Issues tab; remove secrets and private addresses.

## Credits and license

Original Mischief seasonal geometry and styling. The bundled frost atlas was AI generated for this project and is used as a material reference; no third-party character art is included.

Original Mischief code: MIT, Copyright 2026 FoggEyez. Third-party licenses and data credits remain applicable; see THIRD_PARTY_NOTICES.md.
