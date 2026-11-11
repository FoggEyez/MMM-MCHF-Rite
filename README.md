# Mischief Rite · MMM-MCHF-Rite

**A scene builder for celebrations, traditions and remembrance. MCHF means Mischief.** Design detailed seasonal artwork around your own modules, add personal occasions and protect the areas you want to keep clear.

Part of [Mirror Mischief](https://github.com/FoggEyez/Mirror-Mischief). Use ordinary manual configuration or the optional companion; no companion account or public installer is required to run Rite.

![Mischief Rite Scene Studio](docs/screenshot.png)

## Install and open Scene Studio

Requires MagicMirror² 2.38.0 or newer, Node.js 22 or newer and a current browser. No npm runtime dependencies, API keys, weather feeds, video generation or external artwork services.

```sh
cd ~/MagicMirror/modules
git clone https://github.com/FoggEyez/MMM-MCHF-Rite.git
```

Add to your `config/config.js` modules array, then restart MagicMirror²:

```js
{
  module: 'MMM-MCHF-Rite',
  position: 'fullscreen_above',
  animateIn: 'fadeIn',
  config: {sceneMode: 'manual', activeScene: 'winter-glass'}
}
```

Open `/modules/MMM-MCHF-Rite/builder/index.html` on your normal mirror address, or open `builder/index.html` locally. Customize a scene, preview it, then copy/download the generated config entry. In an updated Mirror Mischief companion, use **Mischief Rite → Scene Studio → Save to mirror**. Its public installer is not yet released; manual use works independently.

## What makes Rite different

- Detailed local crystal frost, engraved ornaments and botanical artwork attached to selected module edges.
- Dedicated Christmas, Halloween, Easter, New Year and restrained Veterans Day scenes.
- Your own annual or one-time occasions, priorities and date ranges.
- Per-target effects, colors, motion, strength and clear areas, using the real renderer in the editor preview.
- Shareable scene presets that omit personal schedules and quiet hours.
- Cached procedural drawing with CSS growth/thaw, sway, glows and drifting details; system reduced-motion support and quiet hours.

These features are independently implemented, not a claim that no other module offers similar capabilities. This is a public preview; physical-device performance still needs broader verification.

## Settings

| Setting | Default | Meaning |
| --- | --- | --- |
| sceneMode | calendar | calendar, manual or off |
| activeScene | winter-glass | Scene ID used in manual mode |
| useBuiltInCalendar | true | Optional US-oriented holiday calendar |
| timeZone | empty | IANA timezone, or the mirror's system timezone |
| motion | auto | auto, gentle or still; system reduced motion takes priority |
| readabilityPadding | 24 | Transparent centre padding for frost, 0–80 pixels |
| quietHours | disabled, 22:00–07:00, still | Hold artwork still or turn it off |
| targets | Weather, Calendar, Clock | Array of `{name,selector,index,enabled,effect,edge,strength}` |
| clearZones | [] | Clear rectangles `{name,enabled,x,y,width,height}` in screen percentages |
| occasions | [] | `{name,enabled,date,endDate,scene,priority}`; MM-DD yearly or YYYY-MM-DD once |
| scenes | 10 built-in presets | Editable scene objects; full fields are documented in the studio guide and literal module defaults |
| holidayMode | auto | Legacy override; prefer the new scene/calendar controls |

See **[SCENE-STUDIO.md](SCENE-STUDIO.md)** for manual examples, every scene field, valid effects, scheduling, preview semantics, sharing and migration. No automatic scene appears on an ordinary day without an occasion; select manual mode for an always-on scene. Veterans/Remembrance artwork is still and particle-free by default. This module is a transparent overlay, so it does not apply opaque card-background presets.

## Credits, support and updates

Original Mischief vector/canvas code and geometry, MIT. No third-party image, generated video, sound or external scene service is needed. The older frost material/renderer may remain as legacy source but is not loaded by Rite. Report bugs with your platform, MagicMirror version and a minimal configuration without personal details.

Run `npm ci` and `npm test`. See [VALIDATION.md](VALIDATION.md). Back up settings/customizations before `git pull --ff-only`; restart the mirror afterwards. To stop Rite, disable/remove its configuration entry. Older MMM-MischiefHolidayAccents installations require coordinated folder and config-name migration; preserve the old folder for rollback. See the studio guide.

## Help and troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common states and setup checks. [Open an issue](https://github.com/FoggEyez/MMM-MCHF-Rite/issues) with a minimal configuration that has secrets removed.
