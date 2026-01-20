// Works Data Structure
// Each work contains: title, slug, year, runtime, format, role, logline, synopsis, 
// contribution_bullets, hero_still_url, trailer_url (optional), stills (optional), credits (optional)

const WORKS_DATA = [
    {
        title: "The Great Flood",
        slug: "project-new-1",
        year: "2025",
        runtime: "",
        format: "Netflix Original Film",
        role: "Junior Editor",
        logline: "A great flood engulfs the world—could today be Earth's last day?",
        synopsis: "A great flood engulfs the world—could today be Earth's last day?",
        contribution_bullets: [
            "File naming and folder organization",
            "Sync and footage prep for editorial",
            "Converting on-set footage into proxy files for editing",
            "Distributing and delivering files to the color, sound, mixing, and CG/VFX teams",
            "Assembly edits (rough cut support)"
        ],
        hero_still_url: "images/works/the-great-flood-hero.jpg",
        trailer_url: "",
        youtubeId: "SYF0MxHVAR0",
        previewStartTime: 0,
        previewEndTime: 30,
        tags: ["Netflix", "Disaster", "Junior Editor"],
        stills: [],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Junior Editor", name: "Jongkon Lim" }
        ]
    },
    {
        title: "MOVING",
        slug: "moving",
        year: "2023",
        runtime: "20 episodes",
        format: "Disney+ TV Series",
        role: "Junior Editor",
        logline: "A story about children living while hiding their superpowers, and parents who hide a dangerous past to protect them.",
        synopsis: "A story about children living while hiding their superpowers, and parents who hide a dangerous past to protect them.",
        contribution_bullets: [
            "File naming and folder organization",
            "Sync and footage prep for editorial",
            "Converting on-set footage into proxy files for editing",
            "Distributing and delivering files to the color, sound, mixing, and CG/VFX teams",
            "Assembly edits (rough cut support)"
        ],
        hero_still_url: "images/works/moving-hero.jpg",
        trailer_url: "",
        youtubeId: "SZFRw7MSPog", // MOVING YouTube video
        previewStartTime: 10, // 0:10
        previewEndTime: 40,   // 0:40 (30 second preview)
        tags: ["Drama", "Superpowers", "Hero", "Narrative"],
        stills: [],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Junior Editor", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Sweet Home Season 2",
        slug: "project-title-2",
        year: "2024",
        runtime: "8 episodes",
        format: "Netflix TV Series",
        role: "Junior Editor",
        logline: "The survivors of Green Home continue their fight for survival in a new refuge, caught between monsters and humans, as their desires, choices, and relationships with new figures expand the world.",
        synopsis: "The survivors of Green Home continue their fight for survival in a new refuge, caught between monsters and humans, as their desires, choices, and relationships with new figures expand the world.",
        contribution_bullets: [
            "File naming and folder organization",
            "Sync and footage prep for editorial",
            "Converting on-set footage into proxy files for editing",
            "Distributing and delivering files to the color, sound, mixing, and CG/VFX teams",
            "Assembly edits (rough cut support)"
        ],
        hero_still_url: "images/works/sweet-home-season2-hero.jpg",
        trailer_url: "",
        youtubeId: "3WJweFedauI",
        previewStartTime: 10,
        previewEndTime: 40,
        tags: ["Sci-Fi", "Creature", "Apocalypse", "Narrative"],
        stills: [],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Junior Editor", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Ransomed",
        slug: "project-new-2",
        year: "2023",
        runtime: "Korean Film",
        format: "Commercial Feature",
        role: "Junior Editor",
        logline: "Based on a true story, a South Korean diplomat abducted in Beirut in 1987 must be rescued as a Ministry of Foreign Affairs officer teams up with a local taxi driver for an unofficial, high-stakes extraction.",
        synopsis: "Based on a true story, a South Korean diplomat abducted in Beirut in 1987 must be rescued as a Ministry of Foreign Affairs officer teams up with a local taxi driver for an unofficial, high-stakes extraction.",
        contribution_bullets: [
            "Placeholder contribution 1",
            "Placeholder contribution 2",
            "Placeholder contribution 3",
            "Placeholder contribution 4",
            "Placeholder contribution 5"
        ],
        hero_still_url: "images/works/JAOHpcsMwFfq-5svp7M9o7D_R1U.jpg",
        trailer_url: "",
        youtubeId: "tQ_4F7NxbVw",
        previewStartTime: 10,
        previewEndTime: 40,
        tags: ["Korean Film", "Action", "Heartfelt", "Chase", "Junior Editor"],
        stills: [],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Role TBD", name: "Name TBD" }
        ]
    },
    {
        title: "THE ORIGIN OF LOVE",
        slug: "the-origin-of-love",
        year: "2025",
        runtime: "18 min",
        format: "Short",
        role: "Cinematography",
        director: "Director",
        logline: "A man is given a second chance to act on the love inside him.",
        synopsis: "A protagonist who couldn't find the courage when he met a woman by chance is given a second chance. Will he be able to seize it this time?",
        contribution_bullets: [
            "Screenwriting: A classic structure, directed with intention to create a quiet yet tense catharsis.",
            "Lighting Design: Planned lighting for each location; used day-for-night to shoot both day and night scenes on a low budget.",
            "Storyboarding: Designed frames so each shot carries meaning and communicates one clear theme.",
            "Editing: A precise rhythm—never too slow, never too fast—to hold delicate emotional shifts without losing momentum."
        ],
        hero_still_url: "images/works/origin-of-love-new-hero.jpg",
        trailer_url: "", // No trailer - will fallback to hero still
        youtubeId: "pOf3yX06cnU",
        previewStartTime: 1056, // 17:36
        previewEndTime: 1086,   // 18:06
        tags: ["Anamorphic", "Romance", "Narrative"],
        stills: [
            "images/works/origin-of-love-hero.jpg",
            "images/works/origin-of-love-still-01.jpg",
            "images/works/origin-of-love-still-02.jpg",
            "images/works/origin-of-love-still-03.jpg",
            "images/works/origin-of-love-still-04.jpg",
            "images/works/origin-of-love-still-05.jpg"
        ],
        onsetImages: [
            "images/works/origin-of-love-onset/onset-01.jpg",
            "images/works/origin-of-love-onset/onset-02.jpg",
            "images/works/origin-of-love-onset/onset-03.jpg",
            "images/works/origin-of-love-onset/onset-04.jpg"
        ],
        storyboardImages: [
            "images/works/origin-of-love-storyboard/storyboard-01.png",
            "images/works/origin-of-love-storyboard/storyboard-02.png",
            "images/works/origin-of-love-storyboard/storyboard-03.png",
            "images/works/origin-of-love-storyboard/storyboard-04.png",
            "images/works/origin-of-love-storyboard/storyboard-05.png"
        ],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "JONGKON LIM" },
            { role: "Editing", name: "JONGKON LIM / TAEYOUNG PARK" },
            { role: "Cinematography", name: "JONGKON LIM" }
        ]
    },
    {
        title: "TUM (GAP)",
        slug: "tum-gap",
        year: "2023",
        runtime: "15 min",
        format: "Short",
        role: "Cinematography",
        logline: "A woman haunted by childhood trauma becomes obsessed with sealing every crack—unaware that someone is watching her through the smallest gap.",
        synopsis: "Haunted by the stress and pressure she endured from her mother as a child, a young woman develops an obsessive fear of cracks and gaps. She tries to control her anxiety by sealing every tiny opening in her room. But she doesn't realize someone has been watching her—quietly—through a narrow gap.",
        contribution_bullets: [
            "Collaborated from the storyboarding stage, visualizing the script and shaping framing choices early in pre-production.",
            "Designed lighting to amplify the protagonist's emotional state and build sustained tension.",
            "Operated the camera to capture subtle shifts in performance and maintain psychological intimacy."
        ],
        hero_still_url: "images/works/tum-gap-hero.jpg",
        heroSlideshow: [
            "images/works/tum-gap-stills/still-01.png",
            "images/works/tum-gap-stills/still-02.png",
            "images/works/tum-gap-stills/still-03.png",
            "images/works/tum-gap-stills/still-04.png",
            "images/works/tum-gap-stills/still-05.png"
        ],
        trailer_url: "", // No video link
        tags: ["Narrative", "Horror", "Storyboarding", "Lighting Design"],
        stills: [
            "images/works/tum-gap-stills/tum-still-01.png",
            "images/works/tum-gap-stills/tum-still-02.png",
            "images/works/tum-gap-stills/tum-still-03.png",
            "images/works/tum-gap-stills/tum-still-04.png",
            "images/works/tum-gap-stills/tum-still-05.png",
            "images/works/tum-gap-stills/tum-still-06.png",
            "images/works/tum-gap-stills/tum-still-07.png",
            "images/works/tum-gap-stills/tum-still-08.png",
            "images/works/tum-gap-stills/tum-still-09.png",
            "images/works/tum-gap-stills/tum-still-10.png"
        ],
        onsetImages: [
            "images/works/teum/onset/3F6FC24E-D048-4FA6-9E49-3478391F0E3D.jpg",
            "images/works/teum/onset/55B3E995-7C9B-46F2-A811-C2A6FDCDFA87.jpg",
            "images/works/teum/onset/A6962747-BECC-44C1-98ED-216377DFC4BF.jpg",
            "images/works/teum/onset/IMG_1516.jpg",
            "images/works/teum/onset/IMG_1522.jpg"
        ],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "Mini Kim" },
            { role: "Cinematography", name: "Jongkon Lim" },
            { role: "Editing", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Sawol (APRIL)",
        slug: "tidal-patterns",
        year: "2022",
        runtime: "35 min",
        format: "Narrative / Short",
        role: "Cinematographer",
        logline: "I heard the news that a close friend had passed away.",
        synopsis: "I heard the news of a close friend's passing.",
        contribution_bullets: [
            "Lighting design",
            "Storyboarding & framing",
            "Camera build / rigging (Sony FX9)",
            "Color grading"
        ],
        hero_still_url: "images/works/tidal-patterns-hero-new.jpg",
        heroSlideshow: [
            "images/works/sawol-april-hero/sawol-01.png",
            "images/works/sawol-april-hero/sawol-02.png",
            "images/works/sawol-april-hero/sawol-03.png",
            "images/works/sawol-april-hero/sawol-04.png",
            "images/works/sawol-april-hero/sawol-05.png"
        ],
        trailer_url: "",
        tags: ["Narrative", "Cinematographer", "Drama", "Lighting Director", "Storyboard"],
        stills: [
            "images/works/sawol-april-hero/sawol-01.png",
            "images/works/sawol-april-hero/sawol-02.png",
            "images/works/sawol-april-hero/sawol-03.png",
            "images/works/sawol-april-hero/sawol-04.png",
            "images/works/sawol-april-hero/sawol-05.png",
            "images/works/sawol-april-stills/sawol-06.png",
            "images/works/sawol-april-stills/sawol-07.png",
            "images/works/sawol-april-stills/sawol-08.png",
            "images/works/sawol-april-stills/sawol-09.png",
            "images/works/sawol-april-stills/sawol-10.png"
        ],
        onsetImages: [
            "images/works/sawol-april-onset/onset-01.jpg",
            "images/works/sawol-april-onset/onset-02.jpg",
            "images/works/sawol-april-onset/onset-03.jpg",
            "images/works/sawol-april-onset/onset-04.jpg",
            "images/works/sawol-april-onset/onset-05.jpg"
        ],
        storyboardImages: [
            "images/works/sawol-april-storyboard/storyboard-01.png",
            "images/works/sawol-april-storyboard/storyboard-02.png",
            "images/works/sawol-april-storyboard/storyboard-03.png",
            "images/works/sawol-april-storyboard/storyboard-04.png",
            "images/works/sawol-april-storyboard/storyboard-05.png"
        ],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "YeaRim Yang" },
            { role: "Cinematography", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Insomnia",
        slug: "insomnia",
        year: "2022",
        runtime: "Short",
        format: "Narrative",
        genre: "Sci-Fi",
        role: "Cinematographer",
        logline: "Can I push away the scientists who keep me awake and fall asleep again?",
        synopsis: "Can I push away the scientists who keep me awake and fall asleep again?",
        contribution_bullets: [
            "Framing",
            "Camera system setup",
            "Rig system setup",
            "Lighting design",
            "Storyboarding",
            "Camera operation (FX3)"
        ],
        hero_still_url: "images/works/insomnia-hero.png",
        heroSlideshow: [
            "images/works/insomnia-slide-1.png",
            "images/works/insomnia-slide-2.png",
            "images/works/insomnia-slide-3.png",
            "images/works/insomnia-slide-4.png",
            "images/works/insomnia-slide-5.png"
        ],
        trailer_url: "",
        youtubeId: "",
        tags: ["Sci-Fi", "Narrative", "Storyboard", "Lighting"],
        stills: [
            "images/works/insomnia-stills/insomnia-still-01.png",
            "images/works/insomnia-stills/insomnia-still-02.png",
            "images/works/insomnia-stills/insomnia-still-03.png",
            "images/works/insomnia-stills/insomnia-still-04.png",
            "images/works/insomnia-stills/insomnia-still-05.png"
        ],
        onsetImages: [
            "images/works/insomnia-onset/3BD1AB20-5C03-4892-9E9E-A0402C584B29.JPG",
            "images/works/insomnia-onset/323F0C26-B361-427F-9AB1-D294A240C5BD.JPG",
            "images/works/insomnia-onset/IMG_0016.JPG",
            "images/works/insomnia-onset/IMG_0029.PNG",
            "images/works/insomnia-onset/IMG_0226.JPG"
        ],
        storyboardImages: [
            "images/works/insomnia-storyboard/IMG_0034.PNG",
            "images/works/insomnia-storyboard/IMG_0035.PNG",
            "images/works/insomnia-storyboard/IMG_0039.PNG",
            "images/works/insomnia-storyboard/IMG_0040.PNG"
        ],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "Yerin Seong" },
            { role: "Cinematography", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Alchemy",
        slug: "project-title-3",
        year: "2022",
        runtime: "25 min",
        format: "Short Film",
        role: "Cinematographer",
        customMetaLine: "2022 25 min Short Film Cinematographer",
        logline: "A young woman, driven by a childhood memory of meeting an alchemist, refuses to give up and continues practicing alchemy.",
        synopsis: "A young woman, driven by a childhood memory of meeting an alchemist, refuses to give up and continues practicing alchemy.",
        contribution_bullets: [
            "Cinematography",
            "Camera system setup",
            "Lighting system setup",
            "Lighting design",
            "Storyboards"
        ],
        hero_still_url: "images/works/project-title-3-hero.jpg",
        trailer_url: "",
        youtubeId: "YCn_VaIucU4",
        previewStartTime: 1003, // 16:43
        previewEndTime: 1183,   // 16:43 + 3:00 (180s) = 19:43
        loopPreview: false,     // Pause at end instead of looping
        tags: ["Short Film", "Cinematographer", "Storyboard", "Lighting"],
        stills: [
            "images/works/alchemy-stills/alchemy-still-01.png",
            "images/works/alchemy-stills/alchemy-still-02.png",
            "images/works/alchemy-stills/alchemy-still-03.png",
            "images/works/alchemy-stills/alchemy-still-04.png",
            "images/works/alchemy-stills/alchemy-still-05.png",
            "images/works/alchemy-stills/alchemy-still-06.png",
            "images/works/alchemy-stills/alchemy-still-07.png",
            "images/works/alchemy-stills/alchemy-still-08.png",
            "images/works/alchemy-stills/alchemy-still-09.png",
            "images/works/alchemy-stills/alchemy-still-10.png"
        ],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "Hyunpyo Ahn" },
            { role: "Cinematography", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Road Melody",
        slug: "project-new-3",
        year: "2019",
        runtime: "", // Cleared to match requested meta line format
        format: "Documentary",
        role: "Cinematographer",
        director: "Director TBD",
        logline: "Descendants of people exiled by colonial rule retrace their ancestors’ path today, performing music to comfort and remember them.",
        synopsis: "Descendants of people exiled by colonial rule retrace their ancestors’ path today, performing music to comfort and remember them.",
        contribution_bullets: [
            "Screenwriting: A classic structure, directed with intention to create a quiet yet tense catharsis.",
            "Lighting Design: Planned lighting for each location; used day-for-night to shoot both day and night scenes on a low budget.",
            "Storyboarding: Designed frames so each shot carries meaning and communicates one clear theme.",
            "Editing: A precise rhythm—never too slow, never too fast—to hold delicate emotional shifts without losing momentum."
        ],
        hero_still_url: "images/works/road-melody-hero.png",
        trailer_url: "",
        youtubeId: "0gQYFY2gw9A",
        previewStartTime: 720,
        previewEndTime: 900,
        loopPreview: false,
        tags: ["Documentary", "Independent Film", "Cinematographer"],
        stills: [],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "Jiseon Lee" },
            { role: "Cinematography", name: "Jongkon Lim" }
        ]
    },
    {
        title: "Villain, You're Alright",
        slug: "project-new-4",
        year: "2019",
        runtime: "Short",
        format: "Narrative",
        genre: "", // Empty to properly format meta line
        role: "Cinematography",
        director: "Director TBD",
        logline: "Is it okay if I can’t make money, even if people see me as a ‘bad guy’ actor?",
        synopsis: "Is it okay if I can’t make money, even if people see me as a ‘bad guy’ actor?",
        contribution_bullets: [
            "Collaborated from the storyboarding stage, visualizing the script and shaping framing choices early in pre-production.",
            "Designed lighting to amplify the protagonist's emotional state and build sustained tension.",
            "Operated the camera to capture subtle shifts in performance and maintain psychological intimacy."
        ],
        hero_still_url: "images/works/project-new-4-hero.png",
        trailer_url: "",
        youtubeId: "J3We8ejqkxQ",
        previewStartTime: 1077, // 17:57
        previewEndTime: 1107,   // 17:57 + 30s
        tags: ["Short", "Cinematography", "Storyboard", "Lighting Plan"],
        stills: [
            "images/works/villain-stills/villain-still-01.png",
            "images/works/villain-stills/villain-still-02.png",
            "images/works/villain-stills/villain-still-03.png",
            "images/works/villain-stills/villain-still-04.png",
            "images/works/villain-stills/villain-still-05.png",
            "images/works/villain-stills/villain-still-06.png",
            "images/works/villain-stills/villain-still-07.png",
            "images/works/villain-stills/villain-still-08.png",
            "images/works/villain-stills/villain-still-09.png",
            "images/works/villain-stills/villain-still-10.png"
        ],
        onsetImages: [],
        storyboardImages: [],
        lightingPlanImages: [],
        credits: [
            { role: "Director", name: "Hwanhee Lee" },
            { role: "Cinematography", name: "Jongkon Lim" }
        ]
    }
];
