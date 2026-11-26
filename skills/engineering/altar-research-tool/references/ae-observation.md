# AE observation discipline

Use when live behavior is needed to answer the research question. Static-only research does not require starting or driving AE.

## Fixture and state

Record AE/plugin versions, project file, comp/layer/effect identities, frame/time, dimensions, preview resolution, renderer, bit depth, working/display color settings, alpha/background and relevant transforms. Duplicate a fixture for destructive comparisons. Keep a baseline and a reproducible way back to it. Save projects and renders in Product AE Files, with text evidence linked from the research directory.

Read current Altar instructions. Prefer typed operations; use narrow `run_extendscript` probes when required. Read actual results, including skipped writes and nested errors. Resolve exact effect instances and layer identities, not an ambiguous display name or stale index. Avoid replacing the user's open project for a probe. When UI observation is needed, use the available computer-use interface and current screenshots.

## Controls and coverage

- Enumerate group/order, display name, match name, index/ID, type, default, range, units, animation support and enabled/hidden conditions. Native popup labels and button names can require resource inspection or the UI.
- Change one independent variable at a time, or explicitly document a dependency test. Test return-to-baseline to detect stale caches or cumulative effects.
- Hidden native controls can reject scripted writes or refresh only after a UI action. Read back both the active state and value; do not claim a hidden-control bypass.
- Buttons, resets and presets are transactions. Compare every affected value, not just the expected main parameter.
- Layer references may have host-injected Source / Masks / Effects & Masks selectors. A numeric layer-index round trip does not establish sampling stage, transforms or timing.
- For search/launcher products, test focus/shortcut, selection and no-selection, result kinds, apply/preset paths, undo, persistence and cancellation instead of inventing an effect-control matrix.

## Render evidence

Use before/after captures with identical framing and color settings. Semi-transparent and HDR captures need a known-good control fixture: historical capture paths have misrepresented these pixels. An opaque background can aid visual comparisons but does not test alpha correctness. Raw float renders are needed for claims about values above 1, negative channels and premultiplication.

For important render behavior, test meaningful boundaries and interactions: 8/16/32 bpc, alpha, resolution, transforms, animated values, source time, edges and relevant renderer modes. Do not claim integer-path verification from a float render request. Separate cold/warm performance and record the fixture; one cached preview is not a benchmark. For timing and quality comparisons, follow [benchmarks](benchmarks.md). Imported libraries or thread-related strings are hypotheses, not MFR or GPU certification.

## Recovery

If a native UI action hangs or the Bridge times out, its outcome is unknown. Inspect executor/AE state before any replay. Historical LightSweep probes left changed settings after an apparent failure. Prefer screenshot-grounded actions when native accessibility controls misbehave. Do not replay a known failing control through another backend without resolving the state and cause.

Protect the user's project. Before quitting, restarting or relaunching AE for any reason, read the open project (name, saved or unsaved) and ask the user, stating both; never quit with `saving no` without that check. A request to probe in a given AE is not that permission. Do not force-quit, dismiss an unknown save dialog, reset preferences or restore old crash flags as routine recovery. Continue independent static work when host access is blocked, record the exact resume point, and request only the missing recovery decision. Past chat permissions are not current permission to restart AE.
