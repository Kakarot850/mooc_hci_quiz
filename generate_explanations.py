# -*- coding: utf-8 -*-
"""
Script to enrich quizData.json with comprehensive educational explanations
for all 120 HCI questions across Weeks 1 to 12.
"""
import json
import os

explanations_map = {
    # WEEK 1: Introduction to HCI & Usability Concepts
    (1, 1): "HCI stands for Human-Computer Interaction. It is a multidisciplinary field of study focusing on the design of computer technology and the interaction between humans (users) and computers. Alternatives like 'Integration', 'Intelligence', or 'Control Interface' misrepresent this fundamental discipline.",
    (1, 2): "The 'User' is the central stakeholder and key component of HCI alongside the computer and the interaction itself. Hardware metrics like processor speed, network cables, or battery life are technical system attributes, not core components of the human-computer interaction triad.",
    (1, 3): "A clear push/pull sign on a door provides clear signifiers and affordances, immediately communicating how to interact without confusion (preventing 'Norman Doors'). Confusing navigation, cluttered buttons, and lack of feedback are well-known anti-patterns of poor design.",
    (1, 4): "Digital transformation refers to the integration of digital technology into all areas of activity, fundamentally converting physical/manual workflows into digital systems. It aims to modernize systems rather than increase manual paper forms or eliminate technology.",
    (1, 5): "Network speed is an infrastructural/technical performance metric, whereas usability factors (according to Jakob Nielsen) specifically measure human interaction: Efficiency, Learnability, Memorability, Errors, and Satisfaction.",
    (1, 6): "Affordance refers to the perceived and actual properties of an object that determine just how the object could possibly be used (e.g., a button affords pressing). Feedback conveys system state after an action, consistency maintains uniform conventions, and visibility makes elements perceivable.",
    (1, 7): "Feedback is the principle of sending back information to the user about what action has been done and what result has been accomplished (e.g., sound, visual change, loading indicator). It is not about altering storage or removing interface controls.",
    (1, 8): "A cluttered interface creates excessive cognitive load, visual noise, and distraction, directly leading to user confusion and error. It hinders usability, speed, and user satisfaction.",
    (1, 9): "Interaction Design (IxD) focuses on designing interactive digital systems and engaging user experiences, defining how people interact with technology. It is not limited to physical hardware engineering, backend database administration, or low-level programming language syntax.",
    (1, 10): "Feature bloat (or 'featuritis') overcomplicates the user experience by overloading menus and increasing cognitive load, making simple tasks tedious and confusing for the majority of users.",

    # WEEK 2: UX, Interaction Design & Inclusivity
    (2, 1): "User Experience (UX) encompasses all aspects of the end-user's overall interaction, satisfaction, emotions, and perceptions when engaging with a company, its services, and its products. It goes far beyond raw coding, bandwidth, or hardware price points.",
    (2, 2): "User Interface (UI) design is a primary design discipline in digital interaction, dealing with visual and interactive layouts. Network, cable, and processor design belong to computer hardware and telecommunications engineering.",
    (2, 3): "Inclusivity in design (Inclusive Design) means creating products that accommodate diverse users with varying abilities, backgrounds, ages, and environments. Designing solely for experts, fast users, or children excludes wide segments of the human population.",
    (2, 4): "Visibility ensures that relevant elements, controls, and statuses are clearly perceivable and easily discoverable by the user, making available options obvious at a glance.",
    (2, 5): "Interaction design provides the methodology and user-centric mindset to deeply understand user goals, needs, mental models, and behaviors, allowing designers to create intuitive, delightful solutions.",
    (2, 6): "An Information Architect focuses on organizing, structuring, labeling, and defining the navigational flows of digital content to help users find information efficiently. UI designers handle aesthetics, motion designers handle animations, and brand designers focus on identity.",
    (2, 7): "Screen readers are essential assistive technologies that interpret and vocalize digital text and structure for blind and visually impaired users. Bright colors, heavy animations, and storage size do not provide non-visual accessibility.",
    (2, 8): "Error prevention and recovery is a core usability heuristic (Nielsen) that aims to design systems defensively to prevent mistakes from occurring and provide clear, constructive mechanisms to recover when they do.",
    (2, 9): "Accessibility (a11y) specifically ensures that digital products, technologies, and environments are usable by people with disabilities (auditory, cognitive, neurological, physical, speech, and visual).",
    (2, 10): "Interaction design teams are inherently multidisciplinary (engineers, designers, psychologists, business analysts). Aligning different vocabularies, priorities, and perspectives across disciplines is a classic operational challenge.",

    # WEEK 3: Design Thinking & Methodologies
    (3, 1): "Design Thinking is an iterative, non-linear, user-centered problem-solving approach that seeks to understand users, challenge assumptions, and redefine problems to create innovative solutions.",
    (3, 2): "The 'Empathize' stage is the foundation of Design Thinking, focusing on researching and understanding users' experiences, motivations, emotional states, and challenges through observation and engagement.",
    (3, 3): "The Testing phase validates and refines prototypes by putting them in front of real users to observe interactions, gather qualitative feedback, and discover unforeseen flaws before release.",
    (3, 4): "Ideation is a core creative stage in the design process where teams generate a wide range of ideas and potential solutions without immediate judgment. Debugging, compilation, and encryption are software engineering implementation phases.",
    (3, 5): "In the British Design Council's Double Diamond model (Discover, Define, Develop, Deliver), the 'Develop' phase focuses on exploring and generating multiple potential solutions, concepts, and prototypes.",
    (3, 6): "Low-fidelity (lo-fi) prototypes are quick, low-cost representations (like paper sketches, wireframes, or storyboards) used to test concepts early without investing heavily in code or visual polish.",
    (3, 7): "Activity-centered design focuses on the specific tasks, workflows, and activities people perform, organizing the technology around the nature of the activity rather than purely idiosyncratic user traits.",
    (3, 8): "System design is a holistic discipline that encompasses the complete architecture, components, interfaces, modules, and data flows necessary for a system to satisfy specified operational requirements.",
    (3, 9): "Empirical measurement in User-Centered Design (Gould & Lewis) means continuously observing, recording, and analyzing real users performing actual tasks with simulations and prototypes rather than relying on designer intuition.",
    (3, 10): "A central challenge in Design Thinking is balancing unrestricted creative ideation with real-world constraints such as technical feasibility, business viability, deadlines, and budget limitations.",

    # WEEK 4: User Perspectives, Cognitive Factors & Data Synthesis
    (4, 1): "User perspectives examine the cognitive, sensory, and behavioral ways human users perceive, interpret, and interact with technology, ensuring systems fit human capabilities.",
    (4, 2): "Accessibility ensures that digital systems and environments can be perceived, understood, navigated, and interacted with by everyone, including people with physical, sensory, or cognitive impairments.",
    (4, 3): "Novice users lack established mental models of the application and benefit most from simple, guided interfaces with clear cues, step-by-step wizards, and helpful constraints rather than complex shortcut combinations.",
    (4, 4): "An Empathy Map is divided into 4 core quadrants: Says, Thinks, Does, and Feels, capturing a holistic understanding of the user's mindset and behaviors.",
    (4, 5): "Compilation is a technical compiler process that converts source code into machine code; it is completely unrelated to user-centered cognitive aspects like usability, accessibility, and user needs.",
    (4, 6): "Personas are archetypal representations of target users synthesized from research data, and are primarily formulated during the 'Define' phase to synthesize findings into actionable personas and problem statements.",
    (4, 7): "Surveys allow researchers to distribute standardized questionnaires to hundreds or thousands of participants efficiently, collecting large-scale quantitative and demographic data compared to labor-intensive qualitative 1-on-1 interviews.",
    (4, 8): "Affinity mapping (or affinity diagramming) is a collaborative technique used to organize large volumes of qualitative user observations, ideas, and interview notes into natural groups and clusters based on relationships.",
    (4, 9): "Users are not a monolith; they possess diverse capabilities, mental models, cultural backgrounds, technical fluencies, and accessibility needs, making broad user comprehension inherently challenging.",
    (4, 10): "Data synthesis is the analytical phase where raw qualitative and quantitative research data is dissected and reassembled to uncover meaningful patterns, themes, mental models, and actionable design insights.",

    # WEEK 5: Interaction Paradigms & Interface Styles
    (5, 1): "In HCI, an interface acts as the shared boundary and interactive medium through which human users and computing systems exchange signals, inputs, commands, and visual feedback.",
    (5, 2): "Interaction fundamentally entails a bidirectional dialogue or communication between the user (inputs, intentions) and the system (processing, responses, feedback).",
    (5, 3): "Conversing (conversational interaction) allows users to interact with a system using natural language dialogue, either via speech (voice assistants) or text (chatbots), mimicking human-to-human conversation.",
    (5, 4): "Responding interaction occurs when the system proactively initiates the communication (e.g., alerts, contextual notifications, proactive recommendations) and the user reacts to the system's prompt.",
    (5, 5): "Conversational interfaces leverage natural human language, an interaction modality that users have practiced since childhood, making engagement intuitively familiar without requiring users to memorize GUI layouts or syntax.",
    (5, 6): "Ben Shneiderman coined the term 'Direct Manipulation' in 1982 to describe interfaces featuring continuous representation of objects of interest, rapid reversible actions, and physical actions (like clicking and dragging).",
    (5, 7): "Direct manipulation interfaces rely on visual widgets, icons, controls, and spatial arrangements, which can consume significant screen real estate compared to compact command-line syntax.",
    (5, 8): "Command-Line Interfaces (CLIs) require users to recall specific syntax and commands from memory rather than recognizing them visually, making CLIs preferred by expert users seeking speed and scripting power.",
    (5, 9): "Paradigms in HCI represent predominant design models, conceptual frameworks, and community-shared practices that define how we conceptualize and build interactive computer systems.",
    (5, 10): "While interface metaphors (e.g., desktop, folders, trash can) ease initial learning by borrowing from the physical world, they can constrain innovation when designers slavishly adhere to physical limitations in digital spaces.",

    # WEEK 6: Data Gathering, Needs Identification & Quantitative Research
    (6, 1): "In HCI, data gathering is primarily conducted to understand users' goals, mental models, workflows, environmental contexts, and pain points to inform user-centered design decisions.",
    (6, 2): "A data requirement establishes the specific types, formats, and quantities of user and context data that must be captured and utilized to effectively drive interface design specifications.",
    (6, 3): "Surveys yield quantitative data (ratings, Likert scale scores, completion counts) that can be statistically analyzed, unlike open-ended interviews, observational studies, or focus groups which are primarily qualitative.",
    (6, 4): "Closed-ended questions provide predetermined response options (e.g., rating scales, yes/no), producing structured, numerical data that is straightforward to tabulate and statistically evaluate.",
    (6, 5): "Focus groups are vulnerable to social desirability bias and dominant personalities swaying the room (groupthink), where quieter participants conform rather than share divergent personal experiences.",
    (6, 6): "Semi-structured interviews utilize a prepared question guide for consistency across participants while preserving the flexibility to probe deeper with open-ended follow-up questions when interesting topics arise.",
    (6, 7): "A between-group (between-subjects) experimental design assigns distinct, separate groups of participants to each test condition or design variation, preventing learning transfer effects across conditions.",
    (6, 8): "Holistic data capturing during user research leverages multiple sensory channels: written observer notes, audio recordings for verbal comments, and video recordings to capture micro-expressions, posture, and screen interactions.",
    (6, 9): "The arithmetic mean is calculated by summing all collected values and dividing by the count of observations, representing the central mathematical average of the dataset.",
    (6, 10): "Overgeneralization occurs when researchers draw sweeping, unjustified conclusions about an entire user population based on a small, non-representative, or biased sample of participants.",

    # WEEK 7: Prototyping Fidelity & Techniques
    (7, 1): "Prototyping is an experimental and iterative process where design teams produce tangible manifestations of concepts to test ideas, communicate design intent, and validate hypotheses with users.",
    (7, 2): "High-fidelity prototypes closely resemble the final production system in terms of visual design, interactivity, typography, transitions, and realistic content behavior.",
    (7, 3): "Storyboards in HCI are illustrated sequences of sketches or panels depicting a user interacting with a system within a real-world scenario, illustrating user context, motivations, and journey flow.",
    (7, 4): "Fidelity refers to the level of detail, realism, and refinement embodied in a prototype across visual appearance, interactivity, and content richness.",
    (7, 5): "Prototyping allows teams to uncover flaws, clarify ambiguity, and test assumptions early in the development lifecycle, saving immense engineering time and financial resources before code is written.",
    (7, 6): "Mid-fidelity prototypes (such as wireframes with placeholder elements) often lead test participants to get sidetracked critiquing visual aesthetics, typography, or missing polish rather than evaluating core navigation and workflow logic.",
    (7, 7): "The Wizard-of-Oz technique evaluates a system concept by having a hidden human operator ('the wizard') simulate complex backend intelligence or automated system responses behind the scenes without the user's awareness.",
    (7, 8): "Conceptual design focuses on the fundamental underlying mental models, metaphors, core abstractions, and information architecture before getting bogged down in surface aesthetics like color palettes and typography.",
    (7, 9): "Horizontal prototyping provides a broad overview across many application features and screens with minimal underlying functionality (wide but shallow), contrasting with vertical prototypes which implement deep functionality for one specific feature.",
    (7, 10): "The foundational principle of prototyping is iterative refinement: create rapid representations, evaluate with real users, learn from feedback, and progressively refine the solution.",

    # WEEK 8: Usability Evaluation & Metrics
    (8, 1): "Evaluation in HCI is the systematic assessment of a system's usability, accessibility, efficiency, and overall user experience to ensure it satisfies user needs and design objectives.",
    (8, 2): "A primary objective of usability evaluation is discovering usability defects, friction points, confusion, and interface bugs so they can be rectified before product launch.",
    (8, 3): "Task completion time is an objective, quantitative usability metric measured in seconds or minutes, unlike qualitative sentiments gathered from interviews, open feedback, or ethnographic observations.",
    (8, 4): "The think-aloud protocol asks participants to verbalize their thoughts, expectations, confusions, and intentions continuously as they perform assigned tasks, revealing their underlying cognitive thought processes.",
    (8, 5): "Formative evaluation is conducted iteratively during the design and development phase to diagnose problems and guide ongoing refinement, in contrast to summative evaluation performed post-release.",
    (8, 6): "Diagnostic evaluation specifically aims to isolate exact usability barriers, bottlenecks, and error sources within an interface to provide actionable fixes for the design team.",
    (8, 7): "In between-group (between-subjects) usability experiments, separate cohorts of participants evaluate different system designs, avoiding bias caused by users learning from an earlier design.",
    (8, 8): "Efficiency is one of ISO 9241-11's three primary usability pillars (alongside Effectiveness and Satisfaction), measuring the resources expended by users (time, clicks, mental effort) to achieve task goals accurately.",
    (8, 9): "Heuristic evaluation is an expert review inspection method where usability specialists evaluate an interface against recognized usability principles (such as Jakob Nielsen's 10 Usability Heuristics).",
    (8, 10): "Error rate quantifies usability by recording the frequency of user mistakes, missteps, unintended actions, or task failures while attempting to accomplish specific goals.",

    # WEEK 9: HCI in IoT, Smart Objects & Emerging Hardware
    (9, 1): "The Internet of Things (IoT) refers to a decentralized network of interconnected physical devices ('smart objects') embedded with sensors, software, and connectivity to collect and exchange data.",
    (9, 2): "HCI in the IoT domain provides the critical human interface layer (mobile controllers, voice, gestural interfaces, ambient displays) that allows people to understand, configure, and seamlessly interact with connected smart environments.",
    (9, 3): "Touch interfaces provide direct physical manipulation where the user directly touches and manipulates graphical representations on the display surface without intermediary pointing devices.",
    (9, 4): "IoT devices continuously gather contextual data—such as ambient temperature, spatial location, movement, light, and proximity—to provide intelligent, adaptive behaviors suited to the user's immediate environment.",
    (9, 5): "Iterative design is a continuous cycle of prototyping, testing, analyzing, and refining a product to evolve it closer to user needs with each repetition.",
    (9, 6): "Cognitive overload happens when the volume of incoming stimuli, alerts, complex choices, or raw data exceeds the working memory capacity of the human brain, resulting in decision fatigue and error.",
    (9, 7): "IoT architectures are fundamentally dependent on robust network connectivity (Wi-Fi, Bluetooth, Zigbee, Cellular) to synchronize sensor telemetry and relay user commands across devices and cloud services.",
    (9, 8): "Wearable interfaces (smartwatches, smart rings, AR glasses) remain in continuous contact with the user's body, providing persistent, context-aware, glanceable, and personalized access to information.",
    (9, 9): "HaptiDrag enhances virtual reality interactions by providing variable friction haptic feedback, simulating tactile drag sensations as users move their hands or tools across virtual surfaces.",
    (9, 10): "In magnetic tangible interaction research (MobiTangibles), according to the inverse-square law of magnetics, magnetic field strength increases significantly as the physical distance between the tangible marker and sensor decreases.",

    # WEEK 10: LLMs, Behavior & AI-Driven Interfaces
    (10, 1): "Large Language Models (LLMs) are deep learning models trained on vast text corpora specifically engineered to understand, process, synthesize, and generate human-like natural language.",
    (10, 2): "In psychology and HCI, behavior refers to the observable actions, decisions, responses, and interactive habits exhibited by individuals when engaging with their environment or interfaces.",
    (10, 3): "LLMs enhance human-computer interfaces by enabling fluid, natural language interaction, allowing users to express complex, nuanced goals conversationally rather than navigating nested menus or rigid syntax.",
    (10, 4): "Multimodal LLMs (e.g., GPT-4o, Gemini) process and cross-reference multiple modalities simultaneously, including natural text, raster imagery, audio, and video streams.",
    (10, 5): "Zero-shot prompting refers to submitting a task or query directly to a language model without providing demonstration input-output examples, relying entirely on the model's pre-trained knowledge base.",
    (10, 6): "Few-shot prompting conditions the model by providing a few concrete examples of expected inputs and desired outputs in the prompt context, dramatically steering accuracy and formatting consistency.",
    (10, 7): "Adaptive learning systems continuously assess individual learner performance, pacing, and retention to tailor educational content dynamically, optimizing engagement and mastery.",
    (10, 8): "LLMs advance accessibility by providing automated voice-to-text, real-time simplified summaries, alternative text generation for images, and natural conversational assistance for users with physical or cognitive challenges.",
    (10, 9): "In behavioral and adaptive HCI systems, a core algorithmic and design challenge is determining the optimal context: deciding precisely what content to display, at what timing, and to which target user without causing annoyance or intrusion.",
    (10, 10): "Integrating LLMs into HCI introduces serious ethical concerns regarding user privacy, unintended data exposure, algorithmic hallucinations, and dark persuasive manipulation risks.",

    # WEEK 11: Privacy, Security, Ethics & Harms in HCI
    (11, 1): "In HCI, privacy centers on user autonomy and data sovereignty: granting individuals transparent awareness and actionable control over how their personal data is collected, processed, and shared.",
    (11, 2): "Security in HCI ensures robust protection of computing systems, data assets, and communication channels against unauthorized access, malicious exploitation, and data corruption.",
    (11, 3): "LLMs inherit and amplify historical human biases present in their training corpora, which can produce discriminatory outputs, biased judgments, and harmful stereotyping across demographic groups.",
    (11, 4): "Two-factor authentication (2FA) strengthens account protection by requiring two distinct credential categories (e.g., something you know like a password, and something you have like an authenticator token).",
    (11, 5): "A profound risk of generative AI deepfakes is the weaponization and hyper-realistic dissemination of misinformation, fraud, non-consensual imagery, and synthetic political propaganda.",
    (11, 6): "The General Data Protection Regulation (GDPR) mandates strict HCI design requirements for explicit informed consent, clear privacy policies, data minimization, and user-accessible data controls.",
    (11, 7): "Dark patterns are manipulative user interface designs deliberately crafted to trick, deceive, or coerce users into taking actions they might not otherwise choose (such as disguised ads or hidden subscriptions).",
    (11, 8): "SHAP (SHapley Additive exPlanations) is a prominent explainable AI (XAI) methodology based on cooperative game theory used to interpret and visualize the contribution of each feature to a machine learning model's predictions.",
    (11, 9): "The Zero Trust security paradigm enforces the operational principle 'never trust, always verify', requiring continuous identity authentication and authorization for every user and device regardless of network perimeter.",
    (11, 10): "A pervasive challenge in security UX is excessive cognitive friction and user burden (complex password rules, repetitive authentication prompts), which often induces user frustration and risky workarounds.",

    # WEEK 12: Conversational Systems & Dialogue Management
    (12, 1): "A conversational system (or conversational agent) is an interactive software system designed to communicate with users through natural human language dialogue via speech, text, or multimodal channels.",
    (12, 2): "Communication is fundamentally defined as the reciprocal exchange and transmission of information, ideas, and meaning between two or more communicating entities.",
    (12, 3): "Natural Language Understanding (NLU) is the subfield of AI responsible for parsing human input, extracting semantic meaning, resolving entities, and identifying the user's underlying communicative intent.",
    (12, 4): "Dialogue Management orchestrates the conversational state and trajectory, keeping track of conversation history, context, turn-taking, and deciding the next appropriate system action.",
    (12, 5): "In Shannon-Weaver communication theory, 'noise' refers to any unwanted interference, static, distortion, or ambiguity that disrupts the accurate transmission or reception of a message.",
    (12, 6): "Multimodal systems combine and synthesize inputs and outputs across multiple interaction modalities—such as simultaneous speech, gesture, gaze tracking, touch, and visual displays.",
    (12, 7): "Conversational AI elevates user experience by facilitating fluid, intuitive communication through everyday natural language, eliminating the cognitive friction of memorizing commands or hunting through menus.",
    (12, 8): "In multimodal assistive AI systems designed for autism support, systems comprehensively analyze non-verbal behavioral cues, facial expressions, vocal prosody, and movement dynamics to support interaction.",
    (12, 9): "A compelling practical advantage of automated conversational AI agents is uninterrupted 24/7 availability, providing immediate real-time support across all time zones without human fatigue.",
    (12, 10): "A recognized operational limitation of conversational AI is susceptibility to hallucinated statements, demographic bias, and misinterpreting subtle conversational nuance or sarcasm."
}

def clean_text(t):
    if not isinstance(t, str):
        return t
    # Fix encoding glitches like Users -> User's
    t = t.replace('', "'")
    t = t.replace('\u00e2\u0080\u0099', "'")
    t = t.replace('  ', ' ').strip()
    return t

def main():
    root_json = 'quizData.json'
    with open(root_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    enriched_data = {}
    for w in range(1, 13):
        wk = f'week{w}'
        questions = data.get(wk, [])
        enriched_data[wk] = []
        for q in questions:
            qid = q['id']
            q_clean = clean_text(q['question'])
            options_clean = [clean_text(opt) for opt in q.get('options', [])]
            ans_clean = clean_text(q.get('answer', ''))
            pts_clean = clean_text(q.get('points', '1 Point'))
            
            exp = explanations_map.get((w, qid), '')
            if not exp:
                exp = f"'{ans_clean}' is the correct choice based on core HCI principles discussed in {wk.capitalize()}."
                
            enriched_data[wk].append({
                'id': qid,
                'question': q_clean,
                'options': options_clean,
                'answer': ans_clean,
                'points': pts_clean,
                'explanation': exp
            })

    # Save to all target paths
    target_paths = [
        'quizData.json',
        os.path.join('data', 'quizData.json'),
        os.path.join('src', 'data', 'quizData.json')
    ]
    
    os.makedirs(os.path.join('src', 'data'), exist_ok=True)
    
    for p in target_paths:
        with open(p, 'w', encoding='utf-8') as out_f:
            json.dump(enriched_data, out_f, indent=2, ensure_ascii=False)
        print(f"Saved enriched data to: {p}")

    print("Successfully processed all 120 questions across 12 weeks!")

if __name__ == '__main__':
    main()
