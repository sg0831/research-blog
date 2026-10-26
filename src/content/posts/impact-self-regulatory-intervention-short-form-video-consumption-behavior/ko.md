---
title: >-
  Your Call—Keep or Wrap: Examining the Impact of Self-regulatory Intervention
  on Short-form Video Consumption Behavior
summary: >-
  본 연구에서 개발한 안드로이드 앱 오버레이 형태의 자기조절 개입 프로그램을 사용한 실험참여자들은 실제로 유튜브 숏츠를 시청할 때 스스로의
  시청 습관을 더 잘 인식했고 시청 시간과 시청 퀄리티에 대한 자기 통제력을 향상시킬 수 있었다. 그러나 실험 참여자들의 피로도나 스트레스
  정도가 높아진 날에는 개입의 효과가 미미해지는 순간이 발견되었는데, 이를 통해 개입 프로그램을 설계할 때는 사용자의 피로도나 스트레스 정도를
  기준으로 개입 방식이 동적으로 변화해야 함을 알 수 있다.
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
'HCI'라는 학계에 입문하기 위해 내 일상생활과 밀접한 주제를 다루며 내가 쉽게 이해할 수 있는 직관적인 접근 방식을 적용한 연구를 찾고 있었다.
마침 본 논문이 'Youtube Shorts'라는 나에게 매우 익숙한 콘텐츠를 다루고 있었고 안드로이드 앱 오버레이 형태의 프로토타입을 이용한 자기조절 테스트 시도는 나도 이해하기 쉬울 만큼 직관적인 접근 방식이었기에 이 논문을 리뷰하기로 결정했다.

### 2-2. Core Idea
가장 중독성이 강한 미디어 형태 중 하나인 숏폼 콘텐츠는 사용자가 자기조절 능력 없이 끊임없이 스크롤을 하게 만든다. 하지만 기존의 화면 사용 시간 제한이나 경고 메시지 같은 형태의 개입 방식은 사용자의 저항을 일으키거나 아예 무시되는 경우가 많았다.
그래서 본 연구에서는 직접적인 경고 메시지가 아닌 은은한 시각적 오버레이 형태의 가벼운 피드백
, 중립적이고 유쾌한 넛지 메시지, 시청한 영상에 대한 가벼운 감상 코멘트 남기기 기능들과 같은 직접적이지 않은 개입 방식을 사용했다. 또한 언제든지 사용자 자신의 시청 기록을 확인하고 영상을 10개씩 시청할 때마다 현재까지의 시청 영상의 개수와 시청 목록 피드백을 받을 수 있는 기능을 제공하여 사용자가 지속적으로 스스로의 시청량을 인지할 수 있도록 했다.

#### 2-2-1. 중립적이고 유쾌한 넛지 메시지
1. That was your _th video. Just for your information. (Really, just FYI!)
2. You've now passed _ videos. The meaning is yours to decide. We just counted :)
3. Just so you know: You've watched _ Shorts.
4. You've reached your _ videos. Sharing this just for your info!
5. You've watched _ videos. (We’ll leave the interpretation to you!)
6. You've watched the number you set—_ videos! Should we award you a badge?

### 2-3. Methods & Results
#### 2-3-1. 설계 목표 설정
본 연구에서는 아래와 같은 디자인 설계 목표들을 설정했다.
1. DG1. Provide integrated support for holistic self-regulation
2. DG2. Enhance users’ awareness and agency in consuming short-form videos
3. DG3. Address the fleeting and ephemeral nature of short-form videos

그리고 위 목표에 따라 의미있고 매력적인 디자인을 설계하기 위해 6명의 디자인 전공 대학원생을 협력자로 섭외하여 단일 디자인 워크숍을 개최해 연구 목표 및 디자인 설계 목표를 안내하고 figma 프로토타이핑 기반 디자인 토론을 진행했다.

#### 2-3-2. 통합 지원 시스템으로서의 4가지 기능
|번호|기능|설명|
|---|---|---|
| 1 | 목표 유도(Goal Nudge) | 사용자가 시청을 시작하기 전 시청할 동영상 수를 입력하여 개인적 시청 목표 설정 |
| 2 | 미세 성찰(Micro Reflection) | 사용자가 시청한 영상에 대해 태그 선택 또는 메모 입력 방식으로 시청 코멘트 작성 가능 |
| 3 | 체크포인트(Viewing Checkpoint) | 숏츠 영상 10개를 시청할 때마다 누적 시청 개수와 시청 목록을 제공 |
| 4 | 로그북(Viewing Logbook) | 데일리 사용량 요약:  하루동안 플랫폼에 접속한 횟수와 시청한 숏츠 영상 개수 안내<br> 세션 기반 요약:  세션별로 설정한 목표 시청 개수와 실제 시청 개수 안내<br> 상세 조회:  시청한 영상과 남긴 감상 코멘트 조회 |

### 2-4. 기술적 구현
본 연구에서 사용된 개입 프로그램(Prototype)은 유튜브 플랫폼 위에서 오버레이로 동작하는 안드로이드 네이티브 앱(Kotlin)으로 개발되었다.
| 구분 | 설명 |
|---|---|
| App Framework | Kotlin & Android SDK :  기본 UI 구성 |
| User Monitoring | Android Accessibility Service:  스크롤, 클릭 동작 모니터링 및 필요한 UI 요소 식별 |
| Overlay Window | WindowManager API:  유튜브 플랫폼 위에서 사용자에게 목표 개수 설정, 감상 코멘트 작성, 오버레이 피드백 제공을 위한 UI 오버레이 |
| Storage | Android Local Storage(SharedPreferences): 사용자 기본 데이터(사용자 이름, 초기설정값)는 로컬에 저장<br> Firebase:  자세한 상호작용 데이터 수집 후 원격 서버리스 환경에 안전하게 저장 |

___

## 3. Results & Discussion
### 3-1. Lessons Learned
#### 3-1-1. Key Findings
1. 화면 사용 시간 안내나 경고 메시지 같은 직접적이고 강요적인 개입보다 사용자가 스스로 목표를 설정하고 행동 현황을 되돌아볼 수 있고 직접적이지 않은 피드백을 지속적으로 받을 수 있는 개입 방식이 사용자가 스스로의 행동 습관을 보다 잘 인식하고 더욱 높은 절제력과 통제력을 가질 수 있게 한다.
2. 실험 참여자들이 스트레스를 많이 받은 상태에서는 본 연구의 개입 프로그램이 통제력과 자제력에 큰 영향을 주지 못하는 문제가 있었다. 이를 통해 이러한 실험을 설계할 때는 실험참여자들의 기분과 스트레스의 동적인 상태 변화를 고려해서 각 상태에 맞는 적절한 형태로 개입 방식이 조정되었어야 함을 알게 되었다.

### 3-3. Future Questions
1. 본 논문의 '한계점'에서도 언급되었듯이 본 연구에서의 실험 결과가 다른 연령대의 계층에서도 동일한 형태의 결과가 나오는지 궁금하다.
2. 본 실험에서는 시각적 형태의 UI만으로 개입을 설계했는데, 시각의 비중을 줄이고 청각이나 촉각 같은 다른 감각을 적극적으로 사용한 개입 프로그램을 만든다면 실험참여자들의 통제력과 자기제어 능력 향상에 어떤 영향을 줄 수 있을지 궁금하다.
