---
title: >-
  Your Call—Keep or Wrap: Examining the Impact of Self-regulatory Intervention
  on Short-form Video Consumption Behavior
summary: >-
  Participants using the Android overlay prototype demonstrated heightened
  awareness of their viewing habits, along with improved self-control over both
  watch time and content consumption quality. However, the intervention's
  efficacy diminished on high-stress or high-fatigue days. This suggests that
  future self-regulation tools must dynamically adapt their intervention styles
  based on the user's real-time emotional and physical states.
category: paper-reviews
tags:
  - hci
  - self-regulatory
  - short-form
  - video
draft: false
---
## 1. Paper Information
- Authors:  Yeohyun Jung , Sooyohn Nam , Junhyun An , Hwajung Hong
- Venue and year:  CHI 2026 🏆 Honorable Mention
- Paper link:  https://dl.acm.org/doi/10.1145/3772318.3791925

___

## 2. Overview & Key Findings
### 2-1. Motivation
Seeking an accessible entry point into HCI research, I looked for a study grounded in everyday life with an intuitive approach. This paper naturally caught my attention: it targets YouTube Shorts—a familiar medium—and uses a highly intuitive Android overlay prototype to test self-regulation.

### 2-2. Core Idea
Short-form media easily triggers mindless scrolling. Traditional interventions like screen-time limits or direct warnings often spark user resistance or get ignored altogether.
To overcome this, the authors introduced non-intrusive interventions: subtle visual overlays, playful/neutral nudges, and quick post-viewing micro-reflections. The system also reinforces ongoing self-awareness by allowing users to check their viewing history at any time and providing progress checkpoints every 10 videos.

#### 2-2-1. Playful & Neutral Nudges
1. That was your _th video. Just for your information. (Really, just FYI!)
2. You've now passed _ videos. The meaning is yours to decide. We just counted :)
3. Just so you know: You've watched _ Shorts.
4. You've reached your _ videos. Sharing this just for your info!
5. You've watched _ videos. (We’ll leave the interpretation to you!)
6. You've watched the number you set—_ videos! Should we award you a badge?

### 2-3. Methods & Results
#### 2-3-1. Design Goals & Co-Creation
The study defined three core Design Goals (DGs):
1. DG1. Provide integrated support for holistic self-regulation
2. DG2. Enhance users’ awareness and agency in consuming short-form videos
3. DG3. Address the fleeting and ephemeral nature of short-form videos

To translate these goals into compelling features, the team held a Figma-based design workshop with six HCI-focused design graduate students.

#### 2-3-2. Core System Features
|Num|Feature|Description|
|---|---|---|
| 1 | Goal Nudge | Prompts users to set a target video count before scrolling. |
| 2 | Micro Reflection | Enables quick post-video notes or tag selections. |
| 3 | Viewing Checkpoint | Recaps total watch count and video history every 10 Shorts. |
| 4 | Viewing Logbook | Daily Summary:  App launch frequency & total Shorts watched. <br>Session Summary:  Target vs. actual viewing count per session. <br>Detail View:  Timeline of watched videos and logged comments. |

#### 2-3-3. Technical Architecture
The prototype was built as a native Android app (Kotlin) that runs as an interactive overlay on top of YouTube.
| Component | Tech Stack & Mechanism |
|---|---|
| App Framework | Kotlin & Android SDK:  Core UI construction. |
| User Monitoring | Android Accessibility Service:  Tracks scroll/click gestures and parses dynamic UI elements. |
| Overlay Window | WindowManager API:  Renders non-intrusive UI layers over YouTube for goal setting, reflection, and feedback. |
| Storage | SharedPreferences:  Stores local user preferences and basic settings. <br>Firebase:  Logs detailed user interaction data securely to a serverless backend. |

___

## 3. Results & Discussion
### 3-1. Lessons Learned
- Agency over Restraint:  Non-intrusive, continuous feedback—paired with self-set goals—fosters far better self-awareness, agency, and restraint than forceful, restrictive warnings.
- Context Matters:  High stress undermined the system’s effectiveness. Future interventions must dynamically adapt to users' real-time emotional and stress states.

### 3-3. Future Questions
- Demographic Generalizability:  Do these behavioral interventions yield similar efficacy across different age groups and demographics?
- Multimodal Interventions:  How would shifting from purely visual overlays to haptic or auditory nudges alter user self-regulation and control?
