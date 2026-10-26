---
title: >-
  "I Should Know, But I Dare Not Ask": From Understanding Challenges in
  Healthcare Journeys to Deriving Design Implications for North Korean
  Defectors' Adaptation
summary: >-
  While it is well-established that North Korean defectors face difficulties
  adapting to the South Korean healthcare system, research exploring their
  specific healthcare journeys remains scarce. To address this gap, this study
  conducted in-depth healthcare journey interviews with ten North Korean
  defectors—considering their sociopolitical backgrounds, medical histories, and
  migration-specific conditions—and identified the clinical consultation process
  as their primary barrier. Consequently, we developed "Medibridge," a mobile
  prototype application that leverages an LLM with a physician persona, enabling
  users to practice clinical conversation flows through simulated consultations
  without a human doctor. The application also offers North Korean dialect
  correction and explicit education on patients' rights to ask questions. The
  results demonstrated that systematic practice enhanced users' perceived
  communication competence, helped them overcome their fear of questioning
  rooted in North Korean experiences, and fostered a fundamental shift in
  self-awareness by gradually recognizing their own rights during consultations.
  Conversely, participants exhibited strong negative reactions to quantitative
  evaluations, which triggered memories of surveillance and evaluation in North
  Korea, and revealed a dual linguistic identity—desiring to preserve their
  North Korean dialect as part of their identity while simultaneously wishing to
  conceal it from others.
category: paper-reviews
tags:
  - ai-doctor
  - communication
  - hci
  - healthcare
  - north-korean-defectors
draft: false
---
## 1. Paper Information

* Authors: Hyungwoo Song, Jeongha Kim, Minju Kim, Duhyung Kwak, Minjeong Shin, Bongwon Suh, Hyunggu Jung
* Venue and year: CHI '26: Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems
* Paper link: https://dl.acm.org/doi/full/10.1145/3772318.3790752

## 2. Overview & Key Findings

### 2-1. Research Background

While it is well-established that North Korean defectors face difficulties adapting to the South Korean healthcare system, research exploring their specific healthcare journeys remains scarce.

#### 2-1-1. Sociopolitical Background

North Korean citizens are a population with extremely limited exposure to market economies, democratic institutions, and concepts of individual rights. Furthermore, they have lived in environments where digital access is strictly restricted. Due to this pervasive isolation, North Korean defectors lack an understanding of the digital infrastructure, consumer choice, and individual autonomy found in modern South Korean society.

#### 2-1-2. Medical Background

Surveys indicate that only 55.1% of North Korean citizens received medical services when ill, and hospitals in North Korea lack stable electricity, water, and heating systems. Consequently, North Korean defectors face significant challenges in adapting to modern South Korean medical services. Moreover, since they are accustomed to the black-market medical economy rather than formal channels in North Korea, they tend to have a culture of self-medication and a widespread distrust of formal medical institutions.

#### 2-1-3. Migration-Specific Conditions

All North Korean defectors arriving in South Korea undergo 400 hours of intensive education—covering social adaptation, vocational training, and digital literacy—at 'Hanawon,' a government-operated resettlement support center. However, it is realistically impossible to bridge decades of missed technological and social development through these programs alone. In particular, the curriculum focuses heavily on administrative procedures for medical subsidy applications, leaving a shortage of guidance on making medical appointments, navigating insurance, and communicating effectively with medical staff.

### 2-2. Core Idea

This study conducted healthcare journey interviews with ten North Korean defectors and confirmed that the clinical consultation process serves as their primary barrier. Specifically, the three major difficulties identified were symptom expression, managing socio-cultural issues, and overcoming language barriers. To address this, the study developed "Medibridge," an AI physician role-playing prototype, providing users with opportunities to simulate clinical consultation processes with a doctor and diagnose their own accents before actual hospital visits.

#### 2-2-1. Structured Communication Support

1. Pre-practice Guidance: Presents 10 essential consultation elements derived from medical communication standards to build a clear mental model. This includes items to share (site of pain, current medications, allergy history) and items to understand (rationale for diagnosis, potential side effects).
2. Interactive Practice: Enables users to practice clinical conversation flows through voice or chat simulations utilizing an AI physician persona.
3. Criteria-Based Evaluation: Provides specific assessments against the 10 guidelines and offers actionable suggestions for missing or insufficiently detailed information.

#### 2-2-2. Psychological Support

1. Explicit Rights Education: Challenges the pre-existing cultural conformism of North Korean defectors by framing active questioning not as a burden, but as a legitimate right.
2. Intentionally Challenging AI Characters: Allows users to practice assertiveness and interactions with authoritative figures without the burden of real-world consequences.
3. Positive Reinforcement Algorithm: Increases self-efficacy by highlighting communication strengths and validates natural ways of expression.

#### 2-2-3. Adaptive Linguistic Support

1. Terminology Linking Function: Identifies inputted North Korean medical terms and presents the corresponding South Korean terms without explicitly pointing out the user's dialect.
2. Help Note Generation: Converts fragmented practice attempts into a coherent and professional medical script.

___

## 3. Results

### 3-1. Quantitative Results

1. Systematic practice enhanced users' perceived communication competence.
2. Addressed the specific challenges of a unique population (North Korean defectors) that general solutions fail to resolve.

### 3-2. Qualitative Results

#### 3-2-1. Ambivalent Desires Regarding Dialect Recognition

1. Protective Effect of Technical Limitations: Participants interpreted the system's unstable dialect recognition not as a flaw, but as a protective benefit. This suggests it acted as a buffer against potential stigma stemming from a North Korean accent in real clinical situations, allowing participants to maintain their linguistic identity without experiencing the pressures they might face in reality.
2. Desire for Correction Support: Several participants showed interest in correcting their dialect through technology and believed that technological interventions could facilitate social integration.
3. Dual Linguistic Identity: Participants exhibited a dual linguistic identity, demonstrating conflicting desires for preservation and change—wishing to preserve their North Korean dialect as part of their identity while simultaneously wanting to conceal it from others.

#### 3-2-2. From Fear of Expression to Recognition of Rights: Technical Support for Agency Development

1. Fear of Questioning: Participants expressed deep anxiety about asking questions due to past experiences in North Korea where questioning could lead to punishment. However, Medibridge’s systematic guidance empowered participants with the "right to speak" through prompts like "This is a safe and valid question," helping them reframe questioning as a collaborative rather than a confrontational approach.
2. Gradual Recognition of Rights: Through repeated use, participants experienced a fundamental shift in self-awareness, such as realizing that asking sufficient questions is inherently a right.

#### 3-2-3. Structured Approach as Cognitive Support

1. Burdens and Benefits of Structured Complexity: Participants noted that adapting to the process required significant effort, yet they acknowledged that it helped increase clarity and confidence.
2. Dilemma and Comfort in Choices: The study found that past experiences with limited autonomy in North Korea influenced how participants processed options within the interface, revealing an inherent tension between preferring concrete directions and wanting to maintain autonomy.
3. Discovering Hidden Needs Through Systematic Guidance: The structured approach was particularly useful in identifying concerns that participants had previously been unable to articulate clearly.

#### 3-2-4. The Paradox of Evaluation

1. Trust in the AI Physician: When Medibridge was perceived as a supportive medical solution providing a safe practice space, participants readily accepted and trusted it.
2. Strong Reaction to Scores: Participants exhibited strong negative reactions to quantitative evaluations, which frequently triggered memories of surveillance and evaluation in North Korea.
3. Distinguishing Support from Control: Participants differentiated helpful guidance from controlling evaluations, showing a strong preference for empowering systems over evaluative ones.

#### 3-2-5. Addressing Social and Cultural Barriers: The Need for Population-Tailored Design

1. Features Tailored to Cultural Considerations: While participants valued general AI-driven communication correction as useful, they felt it was insufficient for resolving socio-cultural anxieties. Conversely, Medibridge’s culturally informed components (such as stigma-reduction content emphasizing that "people focus on others less than you think") fostered a sense that the system deeply understood them, thereby building trust.
2. Value of Specificity: Participants emphasized the importance of culturally responsive design to meet their unique needs, suggesting that while general solutions offer basic support, a tailored approach is indispensable for addressing the challenges of specific populations.

___

## 4. Insight

### 4-1. Contributions

1. Investigated the healthcare access barriers faced by North Korean defectors and identified daily clinical consultations as a critical hurdle.
2. Developed and evaluated Medibridge, an AI-powered virtual physician consultation simulator, which generates personalized consultation guidance and demonstrated improvements in perceived communication competence across multiple dimensions.
3. Conducted research on the unique population of North Korean defectors, offering design considerations for medical technologies that are easily overlooked in general refugee studies.

### 4-2. Limitations

1. To ensure depth of analysis and cultural homogeneity, the study focused exclusively on North Korean defectors residing in the Seoul metropolitan area, which limits the generalizability of the findings to other regions or populations from different authoritarian backgrounds.
2. Evaluations were conducted in a controlled environment to isolate the core effects of the system from confounding variables, leaving its efficacy in real-world settings unverified.
3. The study only examined short-term usage effects to capture initial user reactions and system acceptance, leaving long-term efficacy unverified.
4. Based on the empirical findings, this study proposed the theoretical concepts of "linguistic identity ambivalence" and "internalized information passivity"; however, further research across diverse populations is essential for these concepts to be applied more broadly within Human-Computer Interaction (HCI) research.

### 4-3. Ideas for My Future Research

North Korean defectors residing in South Korea represent a unique population that shares the same language but possesses a distinct cultural background. This characteristic shares many similarities with populations of individuals with disabilities, who often navigate various prejudices and inconveniences. Therefore, in future HCI research focusing on populations with disabilities, the theoretical concepts proposed in this study—namely "the ambivalence of identity preservation and change" and "internalized information passivity"—can be effectively utilized.
