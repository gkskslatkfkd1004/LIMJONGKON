// ============================
// YouTube Background Manager
// ============================
// Unified manager for YouTube background videos on home and detail pages
// Handles retry logic, fallback, and proper cleanup

window.youtubeBackgroundManager = {
    homePlayer: null,
    detailPlayer: null,
    isAPIReady: false,
    retryCount: 0,
    maxRetries: 1,

    // Initialize YouTube IFrame API
    initAPI() {
        if (this.isAPIReady) return;

        console.log('[YT BG] Loading YouTube IFrame API');
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onerror = () => {
            console.error('[YT BG] Failed to load YouTube API script');
            this.retryAPILoad();
        };
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    // Retry API loading once
    retryAPILoad() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`[YT BG] Retrying API load (attempt ${this.retryCount}/${this.maxRetries})`);
            setTimeout(() => this.initAPI(), 2000);
        } else {
            console.error('[YT BG] Max retries reached, applying fallback');
            this.applyFallbackBackground('video-background-container');
        }
    },

    // Create YouTube player
    createPlayer(containerId, videoId, startTime, endTime, type) {
        console.log(`[YT BG] Creating ${type} player in ${containerId}`);

        if (!this.isAPIReady || typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            console.error('[YT BG] YouTube API not ready');
            setTimeout(() => this.createPlayer(containerId, videoId, startTime, endTime, type), 1000);
            return;
        }

        // Cleanup existing player of this type
        if (type === 'home' && this.homePlayer) {
            console.log('[YT BG] Destroying existing home player');
            try {
                this.homePlayer.destroy();
            } catch (e) {
                console.error('[YT BG] Error destroying home player:', e);
            }
            this.homePlayer = null;
        } else if (type === 'detail' && this.detailPlayer) {
            console.log('[YT BG] Destroying existing detail player');
            try {
                this.detailPlayer.destroy();
            } catch (e) {
                console.error('[YT BG] Error destroying detail player:', e);
            }
            this.detailPlayer = null;
        }

        const player = new YT.Player(containerId, {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                mute: 1,
                mute: 1,
                // loop: 1, // REMOVED: Native loop resets start time to 0. Controlled via JS.
                // playlist: videoId, // REMOVED: Not needed if native loop is off
                playsinline: 1,
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                rel: 0,
                start: startTime,
                end: endTime,
                origin: window.location.origin
            },
            events: {
                onReady: (event) => this.onPlayerReady(event, type),
                onStateChange: (event) => this.onPlayerStateChange(event, type, startTime),
                onError: (event) => this.onPlayerError(event, type, containerId)
            }
        });

        if (type === 'home') {
            this.homePlayer = player;
        } else {
            this.detailPlayer = player;
        }
    },

    onPlayerReady(event, type) {
        console.log(`[YT BG] ${type} player ready`);
        event.target.mute();

        // Attempt autoplay with fallback detection
        const playPromise = event.target.playVideo();

        // For detail pages, detect autoplay failure and SILENTLY fail (no overlay)
        if (type === 'detail' && playPromise !== undefined) {
            // Check if playback actually started after a short delay
            setTimeout(() => {
                if (event.target.getPlayerState && typeof event.target.getPlayerState === 'function') {
                    const playerState = event.target.getPlayerState();
                    // If not playing (state !== 1), just log it. Do NOT show overlay.
                    if (playerState !== YT.PlayerState.PLAYING) {
                        console.log('[YT BG] Autoplay blocked? Staying silent.');
                        // this.showClickToPlayOverlay(type); // REMOVED
                    }
                }
            }, 500);
        }
    },

    onPlayerStateChange(event, type, startTime) {
        if (event.data === YT.PlayerState.ENDED) {
            console.log(`[YT BG] ${type} player ended, looping`);
            const player = type === 'home' ? this.homePlayer : this.detailPlayer;
            if (player) {
                player.seekTo(startTime);
                player.playVideo();
            }
        }
    },

    onPlayerError(event, type, containerId) {
        console.error(`[YT BG] ${type} player error:`, event.data);
        this.applyFallbackBackground(containerId);
    },

    // Apply gradient fallback if video fails
    applyFallbackBackground(containerId) {
        console.log(`[YT BG] Applying fallback background to ${containerId}`);
        const container = document.getElementById(containerId);
        if (container) {
            container.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)';
        }
    },

    // Show click-to-play overlay when autoplay is blocked
    showClickToPlayOverlay(type) {
        // DISABLED: Silent fallback requested
        console.log('[YT BG] Click-to-play overlay request ignored (Silent Fallback)');
        return;
    },

    // Ensure player is ready and playing
    ensurePlayerReady(type) {
        const player = type === 'home' ? this.homePlayer : this.detailPlayer;
        if (!player) {
            console.log(`[YT BG] ${type} player not found, recreating`);
            if (type === 'home') {
                this.createPlayer('video-background', '9V2tVurYTxc', 2, 110, 'home');
            }
        }
    },

    // Cleanup player
    cleanup(type) {
        console.log(`[YT BG] Cleaning up ${type} player`);
        const player = type === 'home' ? this.homePlayer : this.detailPlayer;

        if (player) {
            try {
                player.stopVideo();
                player.destroy();
            } catch (e) {
                console.error(`[YT BG] Error cleaning up ${type} player:`, e);
            }

            if (type === 'home') {
                this.homePlayer = null;
            } else {
                this.detailPlayer = null;
            }
        }
    }
};

// Global callback for YouTube API ready
function onYouTubeIframeAPIReady() {
    console.log('[YT BG] YouTube IFrame API ready');
    window.youtubeBackgroundManager.isAPIReady = true;
    // Create home player
    window.youtubeBackgroundManager.createPlayer('video-background', '9V2tVurYTxc', 2, 110, 'home');
}

// Initialize API loading
window.youtubeBackgroundManager.initAPI();

document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor removed - using default OS cursor

    const sections = document.querySelectorAll('.gallery-item, .section-title');
    // Observer logic inside DOMContentLoaded
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    sections.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(50px)';
        sec.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(sec);
    });

    // Lazy Load "About" Section
    const aboutSection = document.querySelector('#about');
    const aboutWrapper = document.querySelector('.about-wrapper');

    const ABOUT_HTML_CONTENT = `
        <div class="about-intro-layer">
            <!-- Section Label -->
            <div class="about-label">ABOUT</div>

            <!-- Content Stack (Normal Flow) -->
            <div class="about-hero-content-stack">
                <!-- Main Statement -->
                <div class="about-statement">
                    <div>Words explain.</div>
                    <div class="stmt-reveal">Images convince.</div>
                </div>

                <!-- 3-Line Role Summary -->
                <div class="about-hero__intro about-role-summary">
                    <div>Sydney-based.</div>
                    <div>Open to Junior Editor roles — Disney+ / Netflix / Korean commercial feature films experience. Ready to learn Australian workflow fast.</div>
                    <div>Open to Camera Trainee / Utility / 2nd AC support — ready to learn Australian workflow fast.</div>
                    <div>Short-film cinematography + commercial set experience.</div>
                </div>

                <!-- TOOLS Section -->
                <div class="about-hero__tools">
                    <div class="about-hero__tools-label">TOOLS</div>
                    <div class="about-hero__tools-divider"></div>
                    <div class="about-hero__tools-body">
                        <div>Cameras: ARRI ALEXA Mini (setup support), RED Raptor / KOMODO (operation - short film), Sony FX3/FX6/FX9/A7S III</div>
                        <div>Software: Premiere Pro, DaVinci Resolve</div>
                        <div>Set: Data wrangle, batteries, media, slate support</div>
                    </div>
                </div>



                <!-- Contact Information Block -->
                <div class="about-contact-info">
                    <div><a href="tel:+61404675927">Phone: 0404 675 927</a></div>
                    <div><a href="mailto:yje03163@gmail.com">Email: yje03163@gmail.com</a></div>
                </div>
            </div>
        </div>

        <div class="about-content-layer narrative-truth-scene">
            <div class="bio-content">
                <img src="images/classroom-still.png" alt="Classroom scene" class="narrative-still">
                <p class="lead-text about-text-block">I shoot for precision, not impressiveness.</p>
                <p class="about-text-block">Clarity, restraint, and intention over spectacle.</p>
                
                <!-- Minimal CTA -->
                <div class="narrative-cta" id="next-scene-01">
                    <span class="cta-label">next</span>
                    <span class="cta-icon">▶︎</span>
                </div>
            </div>
        </div>

        <div class="about-content-layer-02 narrative-truth-scene-02">
            <div class="bio-content">
                <p class="lead-text about-text-block scene02-text">Every project is a collaboration—a shared pursuit of the image that tells the story.</p>
                <p class="scene02-text">I've had the privilege of working alongside experienced cinematographers, gaffers, and directors who have shaped my understanding of visual storytelling. Each set teaches something new: patience, precision, and the importance of serving the narrative above all else.</p>
                <p class="about-text-block scene02-text">My toolkit spans digital and film formats, from Sony Venice to ARRI Alexa, with a particular affinity for anamorphic glass. But the camera is only a means—what matters is the story it helps to tell.</p>
                
                <!-- Minimal CTA for next scene or end -->
                <div class="narrative-cta" id="next-scene-02">
                    <span class="cta-label">next</span>
                    <span class="cta-icon">▶︎</span>
                </div>
            </div>
        </div>

        <!-- About Page 2: Comic Pages + Text -->
        <div class="about-content-layer-03 about-page2-scene">
            <div class="about2-container">
                <!-- Two Labeled Comic Pages -->
                <div class="about2-pages-grid">
                    <div class="about2-page-item">
                        <span class="about2-page-label">Page 1</span>
                        <img src="images/about2/page1.jpeg" alt="Comic Page 1 - swimming race" class="about2-page-img">
                    </div>
                    <div class="about2-page-item">
                        <span class="about2-page-label">Page 2</span>
                        <img src="images/about2/page2.jpeg" alt="Comic Page 2 - swimming race" class="about2-page-img">
                    </div>
                </div>
                
                <!-- Text Block -->
                <div class="about2-text-block">
                    <p>I learned early that what I feel won't always land the same way for others.</p>
                    <p>So in film, <strong class="bold-emphasis">I treat framing and rhythm as persuasion, not self-expression</strong>.</p>
                    <p>In school, I once drew a swimming race in a manga style I loved.</p>
                    <p>But people didn't connect with it, because it wasn't clear to them.</p>
                    <p>That moment taught me: if the audience can't feel it, it isn't working yet.</p>
                </div>
                
                <!-- NEXT Button for Page 3 -->
                <div class="narrative-cta" id="next-page-03">
                    <span class="cta-label">next</span>
                    <span class="cta-icon">▶︎</span>
                </div>
            </div>
        </div>

        <!-- About Page 3: Section 03 - Text Above / Image Grid Below -->
        <div class="about-content-layer-04 about-page3-scene">
            <div class="about3-container">
                <!-- 2-Column Image Grid -->
                <div class="about3-image-grid">
                    <!-- Left Column: 4:5 Portrait -->
                    <div class="about3-grid-left">
                        <img 
                            src="images/about-section03/portrait.jpg" 
                            alt="Cinematographer on set with camera" 
                            class="about3-img-left"
                            loading="lazy"
                            decoding="async"
                        >
                        <p class="about3-caption">Cinematography is alignment in motion.</p>
                    </div>

                    <!-- Right Column: 2x 16:9 Stacked -->
                    <div class="about3-grid-right">
                        <div class="about3-grid-right-item">
                            <img 
                                src="images/about-section03/setup.jpg" 
                                alt="Camera setup and handoff on set" 
                                class="about3-img-right"
                                loading="lazy"
                                decoding="async"
                            >
                            <p class="about3-caption">Execution depends on clean handoffs.</p>
                        </div>
                        <div class="about3-grid-right-item">
                            <img 
                                src="images/about-section03/crew.jpg" 
                                alt="Film crew team photo" 
                                class="about3-img-right"
                                loading="lazy"
                                decoding="async"
                            >
                            <p class="about3-caption">Trust turns a crew into a system.</p>
                        </div>
                    </div>
                </div>

                <!-- Text Block -->
                <div class="about3-text-block">
                    <p>That understanding of persuasion extended beyond images in a time-critical team environment.</p>
                    <p>Working in a system where every role had to move with shared timing and intent, I learned what alignment really requires.</p>
                    <p>Alignment doesn't come from authority alone.</p>
                    <p>From experienced teammates, I learned to recognize when someone had found a more efficient method—and to adopt it quickly.</p>
                    <p>From newer teammates, I learned that execution depends on how clearly a method is handed off, and how motivation is sustained through trust.</p>
                    <p class="about3-emphasis"><strong>That logic—shared timing, clear methods, and trust—became my baseline on film sets.</strong></p>
                    <p>After that, I carried it directly into filmmaking.</p>
                    <p>In Korea, I shot low-budget narrative films as a cinematographer while intentionally rotating through camera, lighting, production, sound, and directing to understand how each department contributes to the same outcome.</p>
                </div>
                
                <!-- NEXT Button for Section 04 -->
                <div class="narrative-cta" id="next-section-03">
                    <span class="cta-label">next</span>
                    <span class="cta-icon">▶︎</span>
                </div>
            </div>
        </div>

        <!-- About Section 04: Australia / Seeking Roles -->
        <div class="about-content-layer-05 about-section04-scene">
            <div class="about4-container">
                <!-- Two Centered Images (3:4 aspect ratio) -->
                <div class="about4-image-grid">
                    <div class="about4-image-item">
                        <img 
                            src="images/about-section04/night-rig.jpg" 
                            alt="Cinematographer with camera rig at night - rebuild and discipline" 
                            class="about4-img"
                            loading="lazy"
                            decoding="async"
                        >
                    </div>
                    <div class="about4-image-item">
                        <img 
                            src="images/about-section04/storyboard.jpg" 
                            alt="Reviewing storyboard and shot list - method sharing and collaboration" 
                            class="about4-img"
                            loading="lazy"
                            decoding="async"
                        >
                    </div>
                </div>

                <!-- Text Block Below -->
                <div class="about4-text-block">
                    <p>Persuasion doesn't begin in the frame.</p>
                    <p>It begins when a crew moves as one—without needing to explain every intention.</p>
                    
                    <p>Narrative film made me question where persuasion truly holds.</p>
                    <p>Korean sensibility has started to travel globally, but I wanted to test my approach in a place where persuasion cannot rely on familiarity.</p>
                    
                    <p>That question brought me into an English-speaking industry, where nothing is assumed.</p>
                    <p>Trust has to be earned, methods have to be shared clearly, and alignment has to be rebuilt from zero—project by project.</p>
                    
                    <p>I'm currently based in Australia.</p>
                    <p>To stay here and keep moving toward narrative work, I support myself on construction sites—then return to film with the same discipline, every week.</p>
                    
                    <p class="about4-emphasis"><strong>Now, I'm seeking roles as a Junior Cinematographer or Assistant Camera.</strong></p>
                    <p>I bring a calm, collaborative, and long-term mindset to the camera department—focused on consistency, clarity, and the kind of trust that holds under pressure.</p>
                </div>
            </div>
        </div>
    `;

    if (aboutSection && aboutWrapper) {
        let isContentInjected = false;
        let isTextAnimationStarted = false;
        let isEnterInteractionActive = false;

        // Enter Key Handler
        const handleEnterKey = (e) => {
            if (e.key === 'Enter') {
                if (aboutWrapper.classList.contains('fade-in')) {
                    if (!isEnterInteractionActive) {
                        triggerCinematicEntry();
                    } else {
                        // If already in Narrative Scene, Trigger Scene 02
                        triggerNarrativeScene02();
                        // Prevent potential double triggers or scroll interference
                        e.preventDefault();
                    }
                }
            }
        };

        // Cinematic Entry Logic (Intro -> Narrative)
        const triggerCinematicEntry = () => {
            if (isEnterInteractionActive) return; // Prevent double trigger
            isEnterInteractionActive = true;

            const introLayer = document.querySelector('.about-intro-layer');
            const contentLayer = document.querySelector('.about-content-layer');

            if (introLayer && contentLayer) {
                // 1. Fast Exit Left (Intro)
                introLayer.classList.add('exit-left');

                // 2. Fast Enter (Content) - Simultaneous for rigid camera move
                requestAnimationFrame(() => {
                    contentLayer.classList.add('enter-reveal');
                });
            }
        };

        // Horizontal Transition Logic (Scene 01 -> About Page 2)
        const triggerNarrativeScene02 = () => {
            const scene01 = document.querySelector('.about-content-layer');
            const scene03 = document.querySelector('.about-content-layer-03');

            if (scene01 && scene03) {
                // Trigger Simultaneous Move (Scene 01 exits left, Scene 03 enters from right)
                requestAnimationFrame(() => {
                    scene01.classList.add('exit-left');
                    scene03.classList.add('enter-reveal');
                });
            }
        };

        // Horizontal Transition Logic (Scene 02 -> About Page 2)
        const triggerAboutPage2 = () => {
            const scene02 = document.querySelector('.about-content-layer-02');
            const scene03 = document.querySelector('.about-content-layer-03');

            if (scene02 && scene03) {
                // Trigger Simultaneous Move (Scene 02 exits left, Scene 03 enters from right)
                requestAnimationFrame(() => {
                    scene02.classList.add('exit-left');
                    scene03.classList.add('enter-reveal');
                });
            }
        };

        // Horizontal Transition Logic (About Page 2 -> About Page 3)
        const triggerAboutPage3 = () => {
            const scene03 = document.querySelector('.about-content-layer-03');
            const scene04 = document.querySelector('.about-content-layer-04');

            if (scene03 && scene04) {
                // Trigger Simultaneous Move (Scene 03 exits left, Scene 04 enters from right)
                requestAnimationFrame(() => {
                    scene03.classList.add('exit-left');
                    scene04.classList.add('enter-reveal');
                });
            }
        }

        // Horizontal Transition Logic (Section 03 -> Section 04)
        const triggerSection04 = () => {
            const section03 = document.querySelector('.about-content-layer-04');
            const section04 = document.querySelector('.about-content-layer-05');

            if (section03 && section04) {
                // Trigger Simultaneous Move (Section 03 exits left, Section 04 enters from right)
                requestAnimationFrame(() => {
                    section03.classList.add('exit-left');
                    section04.classList.add('enter-reveal');
                });
            }
        };




        // Horizontal Transition Logic (Narrative -> Work) - Preserved for future use
        const triggerWorkTransition = () => {
            const contentLayer = document.querySelector('.about-content-layer-02.enter-reveal') || document.querySelector('.about-content-layer.enter-reveal');
            const workSection = document.getElementById('work');

            if (contentLayer && workSection) {
                // 1. Prepare Work Section (Off-screen Right)
                workSection.classList.add('work-scene-view');

                // Initialize text reveal state
                const workTitle = workSection.querySelector('.section-title');
                const workGallery = workSection.querySelector('.gallery');
                if (workTitle) workTitle.classList.add('work-reveal-init');
                if (workGallery) workGallery.classList.add('work-reveal-init');

                // 2. Trigger Simultaneous Move (Left <-- Current | Next <-- Right)
                requestAnimationFrame(() => {
                    contentLayer.classList.add('exit-left');
                    workSection.classList.add('work-scene-enter');
                });

                // 3. Restore Background (After move completes or slightly before)
                document.body.classList.remove('about-dimmed');

                // 4. Reveal Content after Pause
                setTimeout(() => {
                    if (workTitle) workTitle.classList.add('work-reveal-active');
                    if (workGallery) workGallery.classList.add('work-reveal-active');
                }, 1000);
            }
        };

        document.addEventListener('keydown', handleEnterKey);

        const sensitiveObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = entry.isIntersecting;

                if (isVisible) {
                    // 1. Inject Content (only once)
                    if (!isContentInjected) {
                        aboutWrapper.innerHTML = ABOUT_HTML_CONTENT;
                        isContentInjected = true;



                        // Bind "Next" Button (Scene 01 -> Scene 02)
                        const nextBtnScene01 = document.getElementById('next-scene-01');
                        if (nextBtnScene01) {
                            nextBtnScene01.addEventListener('click', (e) => {
                                e.stopPropagation();
                                triggerNarrativeScene02();
                            });
                        }

                        // Bind "Next" Button (Scene 02 -> About Page 2)
                        const nextBtnScene02 = document.getElementById('next-scene-02');
                        if (nextBtnScene02) {
                            nextBtnScene02.addEventListener('click', (e) => {
                                e.stopPropagation();
                                triggerAboutPage2();
                            });
                        }

                        // Bind "Next" Button (About Page 2 -> About Page 3)
                        const nextBtnPage03 = document.getElementById('next-page-03');
                        if (nextBtnPage03) {
                            nextBtnPage03.addEventListener('click', (e) => {
                                e.stopPropagation();
                                triggerAboutPage3();
                            });
                        }

                        // Bind "Next" Button (Section 03 -> Section 04)
                        const nextBtnSection03 = document.getElementById('next-section-03');
                        if (nextBtnSection03) {
                            nextBtnSection03.addEventListener('click', (e) => {
                                e.stopPropagation();
                                triggerSection04();
                            });
                        }



                        // Lightbox Functionality for About Page 2 Images
                        const setupLightbox = () => {
                            const images = document.querySelectorAll('.about2-page-img');

                            images.forEach(img => {
                                img.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    window.openLightbox(img.src, img.alt);
                                });
                            });
                        };

                        // Expose to window for global use
                        window.openLightbox = (imageSrc, imageAlt, allImages = [], currentIndex = 0) => {
                            // Create lightbox overlay
                            const overlay = document.createElement('div');
                            overlay.className = 'lightbox-overlay lightbox-opening';

                            // Create lightbox image
                            const lightboxImg = document.createElement('img');
                            lightboxImg.className = 'lightbox-image';
                            lightboxImg.src = imageSrc;
                            lightboxImg.alt = imageAlt;

                            // Create close button
                            const closeBtn = document.createElement('button');
                            closeBtn.className = 'lightbox-close';
                            closeBtn.innerHTML = `
                                <svg viewBox="0 0 24 24" fill="none">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            `;
                            closeBtn.setAttribute('aria-label', 'Close lightbox');

                            overlay.appendChild(lightboxImg);
                            overlay.appendChild(closeBtn);

                            // Add navigation arrows if there are multiple images
                            let prevBtn, nextBtn;
                            if (allImages && allImages.length > 1) {
                                prevBtn = document.createElement('button');
                                prevBtn.className = 'lightbox-nav prev';
                                prevBtn.innerHTML = `
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                `;
                                prevBtn.setAttribute('aria-label', 'Previous image');

                                nextBtn = document.createElement('button');
                                nextBtn.className = 'lightbox-nav next';
                                nextBtn.innerHTML = `
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                `;
                                nextBtn.setAttribute('aria-label', 'Next image');

                                overlay.appendChild(prevBtn);
                                overlay.appendChild(nextBtn);
                            }

                            document.body.appendChild(overlay);

                            // Track current index
                            let currentIdx = currentIndex;

                            // Navigate to image
                            const navigateToImage = (index) => {
                                if (!allImages || allImages.length === 0) return;

                                currentIdx = (index + allImages.length) % allImages.length;
                                lightboxImg.src = allImages[currentIdx];
                                lightboxImg.alt = `Image ${currentIdx + 1}`;
                            };

                            // Close lightbox
                            const closeLightbox = () => {
                                overlay.classList.remove('lightbox-opening');
                                overlay.classList.add('lightbox-closing');

                                // Remove from DOM after animation completes
                                setTimeout(() => {
                                    if (overlay.parentNode) {
                                        overlay.parentNode.removeChild(overlay);
                                    }
                                    // Remove event listeners
                                    document.removeEventListener('keydown', handleKeydown);
                                }, 220); // Match animation duration
                            };

                            // Handle keyboard navigation
                            const handleKeydown = (e) => {
                                if (e.key === 'Escape') {
                                    closeLightbox();
                                } else if (e.key === 'ArrowLeft' && allImages && allImages.length > 1) {
                                    navigateToImage(currentIdx - 1);
                                } else if (e.key === 'ArrowRight' && allImages && allImages.length > 1) {
                                    navigateToImage(currentIdx + 1);
                                }
                            };

                            // Add event listeners
                            overlay.addEventListener('click', (e) => {
                                // Only close if clicking the overlay itself, not the image or buttons
                                if (e.target === overlay) {
                                    closeLightbox();
                                }
                            });

                            closeBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                closeLightbox();
                            });

                            if (prevBtn) {
                                prevBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    navigateToImage(currentIdx - 1);
                                });
                            }

                            if (nextBtn) {
                                nextBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    navigateToImage(currentIdx + 1);
                                });
                            }

                            document.addEventListener('keydown', handleKeydown);
                        };


                        // Setup lightbox after a short delay to ensure images are loaded
                        setTimeout(() => {
                            setupLightbox();

                            // Also setup lightbox for About Page 1 narrative-still image
                            const narrativeImage = document.querySelector('.narrative-still');
                            if (narrativeImage) {
                                narrativeImage.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    window.openLightbox(narrativeImage.src, narrativeImage.alt);
                                });
                            }
                        }, 100);
                    }

                    // 2. Trigger Container Fade-In
                    requestAnimationFrame(() => {
                        aboutWrapper.classList.add('fade-in');
                    });

                    // 3. Setup Animation Trigger (Run once)
                    if (!isTextAnimationStarted) {
                        isTextAnimationStarted = true;
                        const stmtReveal = document.querySelector('.stmt-reveal');
                        if (stmtReveal) {
                            setTimeout(() => {
                                stmtReveal.classList.add('is-visible');
                            }, 400);
                        }
                    }

                    // 4. Dim Background on Arrival
                    document.body.classList.add('about-dimmed');

                } else {
                    // 4. Trigger Container Fade-Out
                    aboutWrapper.classList.remove('fade-in');
                    document.body.classList.remove('about-dimmed');
                }
            });
        }, {
            threshold: 0.6 // 60% visible
        });

        sensitiveObserver.observe(aboutSection);
    }
});

// ============================
// Works Section - Netflix Style
// ============================

let slideshowInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Render Works List
    const worksList = document.getElementById('works-list');

    if (worksList && typeof WORKS_DATA !== 'undefined') {
        renderWorksList();
    }

    // Modal functionality
    setupWorkModal();
});

// Render Works List from Data
function renderWorksList() {
    const worksList = document.getElementById('works-list');

    WORKS_DATA.forEach(work => {
        const card = createWorkCard(work);
        worksList.appendChild(card);
    });
}

// Create Work Card Element
function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.setAttribute('data-slug', work.slug);

    // Build tags HTML
    const tagsHTML = work.tags && work.tags.length > 0
        ? `<div class="work-card-tags">
            ${work.tags.slice(0, 4).map(tag => `<span class="work-tag">${tag}</span>`).join('')}
           </div>`
        : '';

    // Check if this is a poster-style work
    const posterClass = work.isPoster ? ' poster-style' : '';
    const posterStyle = work.isPoster ? ` style="background-image: url('${work.hero_still_url}');"` : '';

    card.innerHTML = `
        <a href="#" class="work-card-link" data-slug="${work.slug}" aria-label="View details for ${work.title}"></a>
        <div class="work-card-image${posterClass}"${posterStyle}>
            <img 
                src="${work.hero_still_url}" 
                alt="${work.title}" 
                loading="lazy"
                decoding="async"
            >
        </div>
        <div class="work-card-info">
            <h3 class="work-card-title">${work.title}</h3>
            <p class="work-card-meta">${work.year}${work.runtime ? ' · ' + work.runtime : ''} · ${work.format}${work.genre ? ' · ' + work.genre : ''} · ${work.role}${(work.credits && work.credits.some(credit => credit.role === "Director" && /Jongkon|Lim/i.test(credit.name))) ? ' · Director' : ''}</p>
            <p class="work-card-logline">${work.logline}</p>
            ${tagsHTML}
            <div class="work-card-cta">
                <button class="work-cta-button" data-slug="${work.slug}">View Details</button>
            </div>
        </div>
    `;

    return card;
}

// Setup Work Modal
function setupWorkModal() {
    const modal = document.getElementById('work-modal');
    if (!modal) return;

    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');
    const panel = modal.querySelector('.modal-panel');

    // Open modal when CTA button clicked
    document.addEventListener('click', (e) => {
        // Handle both button clicks and card link clicks
        if (e.target.classList.contains('work-cta-button')) {
            const slug = e.target.getAttribute('data-slug');
            openWorkModal(slug);
        } else if (e.target.classList.contains('work-card-link')) {
            e.preventDefault(); // Prevent default link behavior
            const slug = e.target.getAttribute('data-slug');
            openWorkModal(slug);
        }
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeWorkModal);
    backdrop.addEventListener('click', closeWorkModal);

    // ESC key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
            closeWorkModal();
        }
    });

    // Focus trap
    modal.addEventListener('keydown', trapFocus);
}

// Open Work Modal
function openWorkModal(slug) {
    const work = WORKS_DATA.find(w => w.slug === slug);
    if (!work) return;

    const modal = document.getElementById('work-modal');
    const panel = modal.querySelector('.modal-panel');

    // Populate modal content
    populateModalContent(work);

    // Show modal
    modal.style.display = 'flex';
    panel.classList.remove('modal-exit');

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Set focus to close button
    setTimeout(() => {
        modal.querySelector('.modal-close').focus();
    }, 100);
}

// Close Work Modal
function closeWorkModal() {
    const modal = document.getElementById('work-modal');
    const panel = modal.querySelector('.modal-panel');

    // Cleanup video preview
    if (window.videoPreviewManager) {
        window.videoPreviewManager.cleanup();
    }

    // Cleanup YouTube background player for detail page
    if (window.youtubeBackgroundManager) {
        window.youtubeBackgroundManager.cleanup('detail');

        // Remove YouTube background container
        const ytBgContainer = document.getElementById('modal-yt-background');
        if (ytBgContainer) {
            ytBgContainer.remove();
        }
    }

    // Add exit animation
    panel.classList.add('modal-exit');

    // Hide modal after animation
    setTimeout(() => {
        modal.style.display = 'none';
        panel.classList.remove('modal-exit');
        stopHeroSlideshow(); // Stop hero slideshow
        stopSlideshow(); // Stop gallery slideshow

        // Unlock body scroll
        document.body.style.overflow = '';
    }, 260);
}

// Populate Modal Content
function populateModalContent(work) {
    console.log('[Modal] Populating content for:', work.slug);

    // ============================
    // Work-Specific State Cleanup
    // ============================
    // Prevent hero state mixing between different works
    if (window.heroSlideshowState && window.heroSlideshowState.currentWorkSlug !== work.slug) {
        console.log('[Modal] Work changed, cleaning up previous hero state');
        stopHeroSlideshow();

        // Remove any existing hero slideshow elements
        const modalHero = document.getElementById('modal-hero');
        if (modalHero) {
            const existingSlides = modalHero.querySelectorAll('.hero-slide-layer');
            existingSlides.forEach(slide => slide.remove());
            modalHero.classList.remove('hero-slideshow-active');
        }
    }

    // Update current work slug
    if (window.heroSlideshowState) {
        window.heroSlideshowState.currentWorkSlug = work.slug;
    }

    // ============================
    // YouTube Background for Works with YouTube ID
    // ============================
    // Create YouTube background player for works that have youtubeId (The Origin of Love, MOVING)
    if (work.youtubeId && (work.slug === 'the-origin-of-love' || work.slug === 'moving' || work.slug === 'project-title-2' || work.slug === 'project-title-3' || work.slug === 'project-new-1' || work.slug === 'project-new-2' || work.slug === 'project-new-3' || work.slug === 'project-new-4')) {
        console.log(`[Modal] Initializing YouTube background for ${work.title}`);

        // Create a background container in the modal hero if it doesn't exist
        const modalHero = document.getElementById('modal-hero');
        let ytBgContainer = document.getElementById('modal-yt-background');

        if (!ytBgContainer) {
            ytBgContainer = document.createElement('div');
            ytBgContainer.id = 'modal-yt-background';
            ytBgContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                pointer-events: none;
            `;
            modalHero.insertBefore(ytBgContainer, modalHero.firstChild);
        }

        // Create player div inside container
        ytBgContainer.innerHTML = '<div id="modal-video-background"></div>';

        // Initialize YouTube background player
        setTimeout(() => {
            // Determine start time for background video
            // heavily requested to fix Alchemy reset issue (start at 16:43 = 1003s)
            // For others, keep 0 to avoid changing legacy behavior
            let bgStartTime = 0;
            if (work.slug === 'project-title-3') {
                bgStartTime = 1003;
            } else if (work.slug === 'project-new-3') {
                bgStartTime = 720;
            } else if (work.slug === 'project-new-4') {
                bgStartTime = 1077;
            }

            if (window.youtubeBackgroundManager) {
                window.youtubeBackgroundManager.createPlayer(
                    'modal-video-background',
                    work.youtubeId, // Use work's YouTube ID
                    bgStartTime, // Custom start time for Alchemy, 0 for others
                    undefined, // End time (play full video)
                    'detail'
                );
            }
        }, 500);
    }

    // Hero: Initialize Video Preview or Still
    const stillImg = document.getElementById('modal-hero-still');
    const videoContainer = document.getElementById('modal-hero-video');
    const muteToggle = document.getElementById('modal-mute-toggle');
    const playOverlay = document.getElementById('modal-play-overlay');
    const modalHero = document.getElementById('modal-hero');

    // Reset preview state
    stillImg.src = work.hero_still_url;
    stillImg.alt = work.isPoster
        ? `${work.title} key art — a couple facing each other on a quiet street.`
        : work.title;
    stillImg.classList.remove('fade-out');
    videoContainer.classList.remove('fade-in');
    videoContainer.innerHTML = '';
    muteToggle.style.display = 'none';
    playOverlay.style.display = 'none';

    // Apply poster-style class for vertical key art
    if (work.isPoster) {
        modalHero.classList.add('poster-style');
    } else {
        modalHero.classList.remove('poster-style');
    }

    // Initialize hero slideshow if heroSlideshow array exists (TUM GAP only)
    if (work.heroSlideshow && work.heroSlideshow.length > 0) {
        initializeHeroSlideshow(work.heroSlideshow, modalHero);
    } else {
        // Clean up any existing hero slideshow
        stopHeroSlideshow();
        modalHero.classList.remove('hero-slideshow-active');
        const existingSlides = modalHero.querySelectorAll('.hero-slide-item');
        existingSlides.forEach(slide => slide.remove());
    }

    // Initialize video preview if YouTube data exists
    if (work.youtubeId && work.previewStartTime !== undefined && work.previewEndTime !== undefined) {
        initializeVideoPreview(work);
    }

    // Title & Meta
    document.getElementById('modal-title').textContent = work.title;
    document.querySelector('.modal-meta').textContent =
        work.customMetaLine || `${work.year}${work.runtime ? ' · ' + work.runtime : ''} · ${work.format}${work.genre ? ' · ' + work.genre : ''} · ${work.role}${(work.credits && work.credits.some(credit => credit.role === "Director" && /Jongkon|Lim/i.test(credit.name))) ? ' · Director' : ''}`;

    // Watch Full Film CTA (only show if YouTube ID exists AND not MOVING)
    const ctaSection = document.getElementById('modal-cta-section');
    const watchFullBtn = document.getElementById('modal-watch-full');
    const copyLinkBtn = document.getElementById('modal-copy-link');

    // Hide CTA buttons for MOVING, show for other works with YouTube ID
    if (work.youtubeId && work.slug !== 'moving' && work.slug !== 'project-title-2' && work.slug !== 'project-new-1' && work.slug !== 'project-new-2') {
        const youtubeUrl = `https://www.youtube.com/watch?v=${work.youtubeId}`;

        // Show CTA section
        ctaSection.style.display = 'flex';

        // Set Watch Full Film link
        watchFullBtn.href = youtubeUrl;

        // Show and setup Copy Link button
        copyLinkBtn.style.display = 'inline-flex';
        copyLinkBtn.onclick = () => {
            navigator.clipboard.writeText(youtubeUrl).then(() => {
                const originalText = copyLinkBtn.querySelector('span').textContent;
                copyLinkBtn.querySelector('span').textContent = 'Copied!';
                setTimeout(() => {
                    copyLinkBtn.querySelector('span').textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        };
    } else {
        ctaSection.style.display = 'none';
    }

    document.getElementById('modal-synopsis').textContent = work.synopsis;

    // Contribution
    const contributionList = document.getElementById('modal-contribution');
    contributionList.innerHTML = work.contribution_bullets
        .map(bullet => `<li>${bullet}</li>`)
        .join('');

    // Credits
    const creditsSection = document.getElementById('modal-credits-section');
    const creditsContainer = document.getElementById('modal-credits');

    if (work.credits && work.credits.length > 0) {
        creditsSection.style.display = 'block';
        creditsContainer.innerHTML = work.credits
            .map(credit => `
                <div class="modal-credit-item">
                    <div class="modal-credit-role">${credit.role}</div>
                    <div class="modal-credit-name">${credit.name}</div>
                </div>
            `)
            .join('');
    } else {
        creditsSection.style.display = 'none';
    }

    // Stills Gallery with Tabs
    const stillsSection = document.getElementById('modal-stills-section');
    const stillsGrid = document.getElementById('modal-stills');

    // Initialize gallery with default "stills" category
    if (stillsSection && stillsGrid) {
        stillsSection.style.display = 'block';

        // Set up tab click handlers
        const tabs = stillsSection.querySelectorAll('.modal-gallery-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                switchGalleryCategory(category, work);
            });

            // Keyboard support (Enter/Space)
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const category = tab.getAttribute('data-category');
                    switchGalleryCategory(category, work);
                }
            });
        });

        // Render default category (stills)
        renderGalleryImages(work.stills || [], work.title, stillsGrid);
    }
}

// Switch Gallery Category
function switchGalleryCategory(category, work) {
    const stillsGrid = document.getElementById('modal-stills');
    const tabs = document.querySelectorAll('.modal-gallery-tab');

    // DEBUG LOGGING
    console.log('=== GALLERY DEBUG ===');
    console.log('work.slug:', work?.slug);
    console.log('work.title:', work?.title);
    console.log('activeTab/category:', category);
    console.log('work.onsetImages:', work?.onsetImages);
    console.log('work.stills:', work?.stills?.length, 'images');
    console.log('work.storyboardImages:', work?.storyboardImages?.length, 'images');
    console.log('work.lightingPlanImages:', work?.lightingPlanImages?.length, 'images');
    console.log('====================');

    // Update tab states
    tabs.forEach(tab => {
        const isActive = tab.getAttribute('data-category') === category;
        tab.setAttribute('aria-selected', isActive);
    });

    // Set data-category on grid for scoped CSS
    if (stillsGrid) {
        stillsGrid.setAttribute('data-category', category);
    }

    // Get images for selected category
    let images = [];
    switch (category) {
        case 'stills':
            images = work.stills || [];
            break;
        case 'onset':
            images = work.onsetImages || [];
            break;
        case 'storyboard':
            images = work.storyboardImages || [];
            break;
        case 'lighting':
            images = work.lightingPlanImages || [];
            break;
    }


    // Fade out → update content → fade in
    stillsGrid.classList.add('fade-out');

    setTimeout(() => {
        renderGalleryImages(images, work.title, stillsGrid);
        stillsGrid.classList.remove('fade-out');
        stillsGrid.classList.add('fade-in');

        // Remove fade-in class after animation
        setTimeout(() => {
            stillsGrid.classList.remove('fade-in');
        }, 200);
    }, 200);
}


// Focus Trap for Modal
function trapFocus(e) {
    const modal = document.getElementById('work-modal');
    if (modal.style.display === 'none') return;

    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// ============================
// Netflix-Style Video Preview
// ============================

// Video Preview Manager
window.videoPreviewManager = {
    player: null,
    loopTimer: null,
    startTime: 0,
    endTime: 0,
    isMuted: true,
    isPlaying: false,
    isInitialized: false,
    currentVideoId: null,

    init(youtubeId, startTime, endTime, loopPreview = true) {
        console.log('[YT Player] Initializing with:', { youtubeId, startTime, endTime, loopPreview });

        if (this.isInitialized) {
            this.destroy(); // Cleanup previous instance
        }

        this.youtubeId = youtubeId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.loopPreview = loopPreview;
        this.isMuted = true;
        this.isPlaying = false;

        const videoContainer = document.getElementById('modal-hero-video');
        if (!videoContainer) {
            console.error('[YT Player] Video container not found');
            return;
        }

        const playerId = 'youtube-preview-player';

        // Clear existing player div if present
        const existingPlayer = document.getElementById(playerId);
        if (existingPlayer) {
            console.log('[YT Player] Removing existing player div');
            existingPlayer.remove();
        }

        // Create player div
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        videoContainer.appendChild(playerDiv);

        // Wait for YouTube API to be ready
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            console.error('[YT Player] ERROR: YouTube IFrame API not loaded');
            // Silent failure - do not show overlay
            return;
        }

        // Create YouTube player
        this.player = new YT.Player(playerId, {
            videoId: youtubeId,
            playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                start: startTime,
                end: endTime,
                loop: 0, // REMOVED: Native loop resets to 0. We use manual seeking.
                // playlist: youtubeId // REMOVED
            },
            events: {
                onReady: (event) => this.onPlayerReady(event),
                onStateChange: (event) => this.onPlayerStateChange(event),
                onError: (event) => this.onPlayerError(event)
            }
        });

        this.isInitialized = true;
        console.log('[YT Player] Player object created');
    },

    onPlayerReady(event) {
        console.log('[YT Player] Ready, starting playback at', this.startTime);

        // Try to autoplay muted
        event.target.mute();
        event.target.seekTo(this.startTime, true);
        event.target.playVideo();

        // Show mute toggle
        const muteToggle = document.getElementById('modal-mute-toggle');
        if (muteToggle) {
            muteToggle.style.display = 'flex';
            muteToggle.onclick = () => this.toggleMute();
        }

        // Start loop monitoring
        this.startLoopMonitoring();
    },

    onPlayerStateChange(event) {
        const stateNames = {
            '-1': 'UNSTARTED',
            '0': 'ENDED',
            '1': 'PLAYING',
            '2': 'PAUSED',
            '3': 'BUFFERING',
            '5': 'CUED'
        };

        console.log('[YT Player] State changed to:', stateNames[event.data] || event.data);

        if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            // Crossfade from still to video
            const stillImg = document.getElementById('modal-hero-still');
            const videoContainer = document.getElementById('modal-hero-video');
            if (stillImg) stillImg.classList.add('fade-out');
            if (videoContainer) videoContainer.classList.add('fade-in');
        } else if (event.data === YT.PlayerState.PAUSED && !this.isPlaying) {
            // Autoplay was blocked
            console.log('[YT Player] Autoplay blocked, staying silent (no overlay)');
            // this.showPlayOverlay(); // REMOVED: Silent fallback
        } else if (event.data === YT.PlayerState.ENDED) {
            console.log('[YT Player] Video ended, looping back to start');
            if (this.player) {
                this.player.seekTo(this.startTime, true);
                this.player.playVideo();
            }
        }
    },

    onPlayerError(event) {
        console.error('[YT Player] ERROR: Player error code:', event.data);
        // Keep still image visible
    },

    startLoopMonitoring() {
        console.log('[YT Player] Starting loop monitoring (100ms interval)');

        // Clear any existing timer
        if (this.loopTimer) {
            clearInterval(this.loopTimer);
        }

        // Monitor playback and loop segment
        const checkTime = () => {
            if (!this.player) {
                console.error('[YT Player] ERROR: Player became null during monitoring');
                if (this.loopTimer) {
                    clearInterval(this.loopTimer);
                    this.loopTimer = null;
                }
                return;
            }

            if (this.player.getCurrentTime) {
                try {
                    const currentTime = this.player.getCurrentTime();
                    if (currentTime >= this.endTime) {
                        if (this.loopPreview) {
                            console.log('[YT Player] Looping from', this.endTime, 'to', this.startTime);
                            this.player.seekTo(this.startTime, true);
                            this.player.playVideo();
                        } else {
                            console.log('[YT Player] End time reached. Pausing video (no loop).');
                            this.player.pauseVideo();
                            // Stop monitoring since we're done
                            if (this.loopTimer) {
                                clearInterval(this.loopTimer);
                                this.loopTimer = null;
                            }
                        }
                    }
                } catch (e) {
                    console.error('[YT Player] ERROR in loop monitoring:', e);
                }
            }
        };

        // Check every 100ms for more reliable looping
        this.loopTimer = setInterval(checkTime, 100);
    },

    toggleMute() {
        if (!this.player) {
            console.error('[YT Player] Cannot toggle mute: player is null');
            return;
        }

        const muteToggle = document.getElementById('modal-mute-toggle');

        if (this.isMuted) {
            this.player.unMute();
            this.isMuted = false;
            if (muteToggle) muteToggle.classList.add('unmuted');
            console.log('[YT Player] Unmuted');
        } else {
            this.player.mute();
            this.isMuted = true;
            if (muteToggle) muteToggle.classList.remove('unmuted');
            console.log('[YT Player] Muted');
        }
    },

    showPlayOverlay() {
        // DISABLED: Silent fallback requested
        console.log('[YT Player] Play overlay request ignored (Silent Fallback)');
        /*
        const playOverlay = document.getElementById('modal-play-overlay');
        if (!playOverlay) return;

        playOverlay.style.display = 'flex';
        playOverlay.onclick = () => {
            if (this.player) {
                console.log('[YT Player] Manual play triggered');
                this.player.playVideo();
                playOverlay.style.display = 'none';
            }
        };
        */
    },

    cleanup() {
        console.log('[YT Player] Cleanup called');

        // Stop loop monitoring
        if (this.loopTimer) {
            clearInterval(this.loopTimer);
            this.loopTimer = null;
            console.log('[YT Player] Loop monitoring stopped');
        }

        // Stop and destroy player
        if (this.player) {
            try {
                this.player.stopVideo();
                this.player.destroy();
                console.log('[YT Player] Player destroyed');
            } catch (e) {
                console.error('[YT Player] Error destroying player:', e);
            }
            this.player = null;
        }

        // Reset UI
        const stillImg = document.getElementById('modal-hero-still');
        const videoContainer = document.getElementById('modal-hero-video');
        const muteToggle = document.getElementById('modal-mute-toggle');
        const playOverlay = document.getElementById('modal-play-overlay');

        if (stillImg) stillImg.classList.remove('fade-out');
        if (videoContainer) {
            videoContainer.classList.remove('fade-in');
            videoContainer.innerHTML = '';
        }
        if (muteToggle) muteToggle.style.display = 'none';
        if (playOverlay) playOverlay.style.display = 'none';

        this.isPlaying = false;
        this.isMuted = true;
        this.isInitialized = false;
        this.currentVideoId = null;

        console.log('[YT Player] Cleanup complete');
    }
};

// Initialize Video Preview
function initializeVideoPreview(work) {
    // Wait 1 second to show still image
    setTimeout(() => {
        window.videoPreviewManager.init(
            work.youtubeId,
            work.previewStartTime,
            work.previewEndTime,
            work.loopPreview !== undefined ? work.loopPreview : true // Default to loop=true
        );
    }, 1000);
}

// Render Gallery Images (Refactored for Grid + Lightbox)
function renderGalleryImages(images, workTitle, container) {
    if (images && images.length > 0) {
        // Remove slideshow-active class (switch to Grid)
        container.classList.remove('slideshow-active');

        // Render images
        container.innerHTML = images
            .map((imageUrl, index) => `
                <div class="modal-still-item">
                    <img src="${imageUrl}" 
                         alt="${workTitle} still ${index + 1}" 
                         loading="lazy" 
                         decoding="async"
                         onerror="console.error('[Gallery Error] Failed to load image:', this.src, 'for', '${workTitle}'); this.style.opacity=0.5; this.parentElement.style.border='1px solid red';">
                </div>
            `)
            .join('');

        // Add Lightbox Click Listeners
        const items = container.querySelectorAll('.modal-still-item');
        items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // LOG A: Check if click event fires
                console.log('[LOG A] Thumbnail click event fired for index:', index);

                e.stopPropagation();
                e.preventDefault();

                const img = item.querySelector('img');
                if (img) {
                    // LOG B: Check image data
                    console.log('[LOG B] Image source identified:', img.src);

                    if (window.openLightbox) {
                        try {
                            // LOG C: Attempting to open viewer
                            console.log('[LOG C] Calling window.openLightbox with:', {
                                src: img.src,
                                alt: img.alt,
                                totalImages: images ? images.length : 0,
                                index: index
                            });

                            window.openLightbox(img.src, img.alt, images, index);
                        } catch (err) {
                            console.error('[LOG C FAILURE] Lightbox error:', err);
                        }
                    } else {
                        console.error('[LOG C FAILURE] window.openLightbox is undefined');
                    }
                } else {
                    console.error('[LOG B FAILURE] No image found in item');
                }
            });
        });


        // No slideshow start required
    } else {
        container.classList.remove('slideshow-active');
        // stopSlideshow(); // Legacy
        container.innerHTML = `
            <div class="modal-gallery-empty">
                No images yet. Upload will be added soon.
            </div>
        `;
    }
}

// Gallery Slideshow Helper Functions
function startSlideshow() {
    stopSlideshow(); // Clear any existing interval

    // Use a unique interval variable for the gallery
    window.gallerySlideshowInterval = setInterval(() => {
        const grid = document.getElementById('modal-stills');
        if (!grid) return;

        const items = grid.querySelectorAll('.modal-still-item');
        if (items.length < 2) return;

        // Find current active index
        let activeIndex = -1;
        items.forEach((item, index) => {
            if (item.classList.contains('active')) {
                activeIndex = index;
            }
        });

        // Determine next index
        const nextIndex = (activeIndex + 1) % items.length;

        // Transition: Remove active from current, Add to next
        if (activeIndex !== -1) items[activeIndex].classList.remove('active');
        items[nextIndex].classList.add('active');

    }, 4000); // 4 seconds per slide
}

function stopSlideshow() {
    if (window.gallerySlideshowInterval) {
        clearInterval(window.gallerySlideshowInterval);
        window.gallerySlideshowInterval = null;
    }
}

// Hero Slideshow Management (TUM GAP only)
// Optimized 2-Layer Crossfade System with Preloading
// Work-specific state to prevent mixing between different works
window.heroSlideshowState = {
    interval: null,
    currentIndex: 0,
    images: [],
    currentWorkSlug: null
};

function initializeHeroSlideshow(imageUrls, heroContainer) {
    // Stop any existing slideshow
    stopHeroSlideshow();

    // Store image URLs
    window.heroSlideshowState.images = imageUrls;
    window.heroSlideshowState.currentIndex = 0;

    // Add slideshow class
    heroContainer.classList.add('hero-slideshow-active');

    // Clear existing slides
    const existingSlides = heroContainer.querySelectorAll('.hero-slide-layer');
    existingSlides.forEach(slide => slide.remove());

    // Preload all images before starting
    preloadHeroImages(imageUrls).then(() => {
        // Create 2 layers: current and next
        const currentLayer = createHeroLayer('current', imageUrls[0]);
        const nextLayer = createHeroLayer('next', imageUrls[1] || imageUrls[0]);

        heroContainer.appendChild(currentLayer);
        heroContainer.appendChild(nextLayer);

        // Start slideshow if multiple images
        if (imageUrls.length > 1) {
            startHeroSlideshow();
        }
    });
}

function preloadHeroImages(imageUrls) {
    return Promise.all(
        imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => resolve(url); // Continue even if one fails
                img.src = url;
            });
        })
    );
}

function createHeroLayer(className, imageUrl) {
    const layer = document.createElement('div');
    layer.className = `hero-slide-layer ${className}`;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'TUM (GAP) still';
    img.loading = 'eager';
    img.decoding = 'async';

    layer.appendChild(img);
    return layer;
}

function startHeroSlideshow() {
    // stopHeroSlideshow(); // Clears data, so we manually clear interval instead
    if (window.heroSlideshowState.interval) {
        clearInterval(window.heroSlideshowState.interval);
        window.heroSlideshowState.interval = null;
    }

    window.heroSlideshowState.interval = setInterval(() => {
        const hero = document.querySelector('.modal-hero.hero-slideshow-active');
        if (!hero || window.heroSlideshowState.images.length < 2) return;

        const currentLayer = hero.querySelector('.hero-slide-layer.current');
        const nextLayer = hero.querySelector('.hero-slide-layer.next');

        if (!currentLayer || !nextLayer) return;

        // Calculate next index
        const nextIndex = (window.heroSlideshowState.currentIndex + 1) % window.heroSlideshowState.images.length;
        const futureIndex = (nextIndex + 1) % window.heroSlideshowState.images.length;

        // Update next layer image (prepare for next transition)
        const nextImg = nextLayer.querySelector('img');
        nextImg.src = window.heroSlideshowState.images[nextIndex];

        // Trigger crossfade
        nextLayer.classList.add('fading-in');

        // After fade completes, swap layers
        setTimeout(() => {
            // Remove fade class
            nextLayer.classList.remove('fading-in');

            // Swap roles
            currentLayer.classList.remove('current');
            currentLayer.classList.add('next');
            nextLayer.classList.remove('next');
            nextLayer.classList.add('current');

            // Prepare old current (now next) for future transition
            const oldCurrentImg = currentLayer.querySelector('img');
            oldCurrentImg.src = window.heroSlideshowState.images[futureIndex];

            // Update index
            window.heroSlideshowState.currentIndex = nextIndex;
        }, 800); // Match CSS animation duration

    }, 4000); // 4 seconds per slide
}

function stopHeroSlideshow() {
    if (window.heroSlideshowState.interval) {
        clearInterval(window.heroSlideshowState.interval);
        window.heroSlideshowState.interval = null;
    }
    window.heroSlideshowState.currentIndex = 0;
    window.heroSlideshowState.images = [];
    window.heroSlideshowState.currentWorkSlug = null;

    // Remove all hero slideshow elements from DOM
    const modalHero = document.getElementById('modal-hero');
    if (modalHero) {
        const existingSlides = modalHero.querySelectorAll('.hero-slide-layer');
        existingSlides.forEach(slide => slide.remove());
    }
}

// ============================
// Hero Navigation Buttons - Smooth Scroll
// ============================
document.addEventListener('DOMContentLoaded', () => {
    const heroNavButtons = document.querySelectorAll('.hero-nav-btn');

    heroNavButtons.forEach(button => {
        // Only add smooth scroll for internal anchor links (not the PDF download)
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
});

