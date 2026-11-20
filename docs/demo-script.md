# 60-second walkthrough script

Status: script ready, video not recorded
Runtime: 60 seconds
Target: 1440x900 in Chrome 157 or later
Owner: Jim Merioles
Related: [Repository README](../README.md), [Roadmap](roadmap.md), [Manual test plan](qa/manual-test-plan.md)

This is the production script for the Throughline walkthrough. The case study page shows a poster and this shot list until the video exists. Do not add a placeholder video or a fake player. Record the real thing, then replace the poster.

The narration is written to be spoken at a calm pace. Each line fits its window with room to breathe. If a take runs long, tighten the pause between actions, not the words.

## Before recording

1. Use Chrome 157 or later. Confirm `drawElementImage` is available in the console:
   ```js
   'drawElementImage' in CanvasRenderingContext2D.prototype
   ```
2. For Chromium 147 to 156, enable `chrome://flags/#canvas-draw-element`, relaunch, and confirm the canvas path renders.
3. Set the viewport to 1440x900. Use 1920x1080 only if the final embed needs a 16:9 frame, and keep the whole board fitted.
4. Set the display to 100% scaling. Do not record a downscaled desktop.
5. Clear saved state and reload:
   ```js
   localStorage.removeItem('throughline:board:v1')
   ```
6. Confirm the board is fitted, the hint is visible, and the default state is restored. No card should be selected.
7. Hide the bookmarks bar, close DevTools, silence notifications, and close other tabs.
8. Turn off `prefers-reduced-motion` for the recording so the camera flights are visible.
9. Move the pointer off the board before you start. A hovered card changes its border and draws attention away from the narration.
10. Practice the zoom once and note the stopping point. Around 75 to 100 percent keeps The big idea, all three headline rows, and The decision card reachable. Above 110 percent, the headline card leaves the top and the decision card leaves the bottom.
11. Record at 60fps. Capture the cursor, not a synthetic highlight.

## The 60-second script

| Time         | Action                                                                                                                                                                                                                                                                 | On-screen result                                                                                                                                                 | Narration                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 0:00 to 0:06 | Open on the fitted board. Do not move the pointer.                                                                                                                                                                                                                     | All ten cards fit in one view. The title, connectors, hint, and HTML-in-Canvas badge are visible.                                                                | "This is Throughline. Ten real HTML cards, fitted to one canvas."                                              |
| 0:06 to 0:16 | Drag the background from an empty area toward the upper left, then place the pointer over The big idea card and scroll up slowly until The big idea is prominent and all three headline rows are still visible (about 75 to 100 percent). Wait for the zoom to settle. | The camera pans and zooms. The snapshot softens during the gesture, then the card is crisp. The headline card stays in frame. The zoom percentage updates.       | "Pan and zoom behave like a canvas. The text catches up when the gesture stops."                               |
| 0:16 to 0:27 | Click into the second headline, select the line, and type a new one. Then click the Marquee letters checkbox.                                                                                                                                                          | The real textarea takes focus. The caret and selection are visible. The canvas repaints on each keystroke. The checkbox ticks and the label gets a line-through. | "These are real controls. Click a headline, type, check a task. The canvas repaints as I work."                |
| 0:27 to 0:35 | Pan up until The decision card and its stamp area are fully in frame, then click Mark approved. Hold for one beat.                                                                                                                                                     | The button changes to Direction approved and disables. The red Approved stamp lands fully in frame.                                                              | "Approve the direction and the stamp lands. The state survives a reload."                                      |
| 0:35 to 0:50 | Press Escape if a field is focused, then click Present. Press ArrowRight three times with about 1.2 seconds between presses.                                                                                                                                           | The board dims. The camera flies to each card. The HUD shows the step count, title, and narration. The progress line advances.                                   | "Present flies card to card. The HUD carries the narration. Arrow keys move forward and back."                 |
| 0:50 to 1:00 | Press Escape to exit Present. Wait for the automatic fit to settle, then click Structure, wait for the panel, close it, and click Fit.                                                                                                                                 | The board returns to the fitted view, then card outlines, number badges, and the real card list appear. The panel closes and Fit restores the whole board.       | "Structure shows the DOM behind the pixels: roles, controls, tab order. Then Fit brings the whole board back." |

## The 15-second cut

Use this version for a social post, a README embed, or a portfolio preview. It assumes the board is already open and fitted.

| Time         | Action                                                                                                             | On-screen result                                                                                                    | Narration                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 0:00 to 0:04 | Hold on the fitted board.                                                                                          | The ten cards and the paper board are visible.                                                                      | "This is Throughline: ten real HTML cards on one canvas." |
| 0:04 to 0:08 | Zoom into The big idea without losing the headline card, then click into the second headline and type a few words. | The text is crisp after the zoom. The headline card stays in frame. The textarea takes focus and the card repaints. | "Pan, zoom, and edit. The text stays live."               |
| 0:08 to 0:11 | Check a task, pan to The decision card, then click Mark approved.                                                  | The checkbox ticks and the Approved stamp appears.                                                                  | "Real controls. Real state."                              |
| 0:11 to 0:15 | Open Present for one step, press Escape, then open Structure.                                                      | The camera lands on one card, then the structure outlines and panel appear.                                         | "Present the story, or inspect the DOM behind it."        |

## Recording notes

- **Browser:** Chrome 157 or later. The canvas path is on by default. If you record in an older Chromium build with the flag, say so in the video description.
- **Viewport:** 1440x900 is the primary size because the screenshots and the case study use it. 1920x1080 is acceptable for a 16:9 player. Do not mix sizes across takes.
- **Capture:** Use a 1440x900 window capture at 60fps. Do not use a tab-only screencast. It does not capture the cursor and can letterbox the page.
- **Clean state:** Clear `throughline:board:v1` and reload. The default board is the version in the script. Do not record over an edited board.
- **Cursor:** Move in straight, deliberate paths. Pause before a click. Never park the cursor over a card, because the hover border becomes a distraction. Do not let the pointer jump between edits.
- **Hover:** Keep the pointer away from cards except when you are about to click. The board is designed to be calm, and a stray hover breaks that.
- **Zoom:** Wait about 250ms after a wheel zoom before the next action. The card needs the settle time to become crisp. Do not cut away before it does.
- **Present mode:** Leave the camera flight visible. Do not jump cut between cards. The flight is part of the argument.
- **Audio:** Record narration in one take or add it afterward. Keep the level consistent. If there is no voice, use the narration text as captions.
- **Motion:** Do not speed ramp or add motion blur. The board already has motion. Reduced motion is off for the recording only.
- **Length:** The first shot is six seconds. If the opening feels slow, hold it anyway. The viewer needs a beat to read the board.
- **Output:** Record at 60fps, 1440x900, H.264 MP4 or WebM. Keep the raw file out of the repository. Upload the final file to the host and embed it in the case study.

## After recording

- [ ] The video is exactly 60 seconds, or the 15-second cut is exactly 15 seconds.
- [ ] Every action in the table appears on screen.
- [ ] The zoomed card is crisp before the next cut.
- [ ] The zoom keeps The big idea and all three headline rows in frame.
- [ ] The cursor does not hover a card by accident.
- [ ] The Approved stamp is fully in frame and visible for at least one full beat.
- [ ] Present mode shows three distinct cards.
- [ ] Structure opens and closes cleanly.
- [ ] Fit returns the whole board.
- [ ] The narration matches the table.
- [ ] No browser chrome, notifications, or personal tabs are visible.
- [ ] The video has captions or a transcript.
- [ ] The case study poster is replaced with the video and the "Recording pending" note is removed.

## What not to do

- Do not publish a still image as a video.
- Do not use a fake play button on the case study page.
- Do not add a screen recording of the case study page as a substitute for the board.
- Do not claim measured frame rates that were not captured.
- Do not record from a browser without the API and label it as the canvas path.
