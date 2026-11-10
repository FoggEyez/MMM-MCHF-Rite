# Mischief Rite · Scene Studio

**MCHF = Mischief. Rite means celebration, tradition and remembrance.**

Rite draws original local vector ornaments, botanical details and crystal frost around your modules. There are no video assets, AI-service calls, OpenArt or VideoGen dependencies. Detailed frost is cached at each target size; CSS animates growth/thaw, sway, light and drift. This avoids continuously redrawing every crystal in JavaScript. Actual performance depends on the mirror and configured scene; no measured Raspberry Pi frame-rate claim is made.

## Open the builder

After installing the module, open `/modules/MMM-MCHF-Rite/builder/index.html` at your normal MagicMirror² address. You can also open `builder/index.html` locally; no account or companion is needed. The preview displays an example mirror and maps up to four target entries to example cards; it is not a screenshot of your physical mirror.

In an updated Mirror Mischief companion, select **Mischief Rite → Scene Studio**. Changes remain in preview until **Save to mirror**. The save preserves placement and enabled/disabled state, rejects stale settings, creates a private restore point, and uses the existing transactional restart/rollback path. Save or discard other unsaved changes before opening the studio. The companion itself is optional; its public installer is not yet released.

## Three ways to customize

- **Look:** choose/copy a preset, change colors, treatment, ornament, particles, strength, drift time and motion. Scene names are editable; scene IDs are stable configuration references.
- **Modules:** add target CSS selectors, occurrence (zero is the first match), edge, effect and strength. Select `inherit` to follow the scene. Add percentage-based clear rectangles to exclude all effects from important areas. Frost also clears a padded centre independently of its colors.
- **Calendar:** choose manual, calendar or off. Add annual `MM-DD` or one-time `YYYY-MM-DD` occasions, date ranges, scenes and priorities. Disable the optional US calendar for a household-only schedule. Set an IANA timezone or use the mirror's system timezone. Quiet hours can hold artwork still or turn scenes off, including intervals crossing midnight. Equal quiet-hour start/end means the whole day.

Built-in scenes include **Winter Glass** for Christmas, **Halloween Night**, **Easter Garden**, **New Year**, and **Remembrance** for Veterans Day/Memorial Day, plus botanical, celebration and night presets. Remembrance is deliberately still with no drifting particles. Automatic dates follow the built-in US-oriented holiday windows; personal occasions take precedence, highest priority first. Equal priorities keep list order. No occasion on an ordinary day means no automatic scene. Use manual mode to show a scene every day.

The selected-scene preview deliberately ignores the schedule and quiet hours. Turn on **Test calendar rules** to see the result for the preview date/time in the configured timezone. The footer states the saved mode so previewing an effect is not confused with activating it. Impossible local times during a daylight-saving change are rejected.

## Manual configuration

```js
{
  module: 'MMM-MCHF-Rite',
  position: 'fullscreen_above',
  animateIn: 'fadeIn',
  config: {
    sceneMode: 'manual',
    activeScene: 'winter-glass',
    motion: 'gentle',
    targets: [
      {name: 'Weather', selector: '.weather', index: 0,
       enabled: true, effect: 'frost', edge: 'top', strength: 85},
      {name: 'Calendar', selector: '.calendar', index: 0,
       enabled: true, effect: 'garland', edge: 'bottom', strength: 70}
    ],
    clearZones: [{name: 'Centre', enabled: true, x: 30, y: 35, width: 40, height: 20}]
  }
}
```

To use personal occasions, set `sceneMode: 'calendar'` and add, for example:

```js
useBuiltInCalendar: false,
occasions: [
  {name: 'My celebration', enabled: true, date: '06-15', endDate: '06-15',
   scene: 'celebration', priority: 50}
],
quietHours: {enabled: true, start: '22:00', end: '07:00', mode: 'still'}
```

`scenes` is an array of editable preset objects. Arrays replace the defaults; if editing a scene manually, copy the full list from Scene Studio's configuration output and modify it, or import/export the selected scene preset through the builder. Scene fields: `id`, `name`, `theme`, `color`, `accentColor`, `effect`, `ornament`, `particle`, `strength`, `particleCount`, `speed`. Effects: frost, garland, glow, ornament, none. Particles: snow, leaf, petal, spark, confetti, none. Colors are six-digit hex. The generated module defaults contain the complete data contract and all built-in scenes.

Limits: 24 scenes, 24 targets, 50 occasions, 16 clear zones. Strength is 0–100, particles 0–24, speed 12–120 seconds, readability padding 0–80 pixels. Selectors are matched locally; invalid or missing targets produce no decoration. Reduced-motion preferences force still artwork. Hidden/suspended pages pause CSS animations and stop layout scheduling.

## Sharing and privacy

**Share scene** exports artwork and target choices only. It leaves out occasions, quiet hours, clear areas and preview dates. Import merges a selected scene while keeping the current schedule. The full manual config entry includes personal occasions, so keep it in your normal protected configuration backup. No browser draft is silently persisted or sent to a cloud service. Unsaved changes prompt before closing.

## Older names and settings

The repository was previously MMM-MischiefHolidayAccents. GitHub redirects preserve old links, but an existing installation's folder and config entry do not rename themselves. Back up the old folder/settings, install `MMM-MCHF-Rite` as a separate folder, use the new configuration, and disable the legacy decoration module before enabling Rite. Keep the old folder for rollback. `holidayMode: auto/off/a built-in holiday` remains a legacy override; Scene Studio resets that override to auto when saving. Older decorationSelectors/frostTargets and numeric legacy styling fields should be re-created as new targets/scenes rather than assumed to migrate automatically.

## Separate weather module

[Mischief Atmos](https://github.com/FoggEyez/MMM-MCHF-Atmos) handles current-weather effects separately. Rite does not request weather or interpret forecasts. Both modules work independently; lower intensities and protected clear areas help when combining them.
