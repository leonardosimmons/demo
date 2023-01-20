/* 
 * -----------------------
 * Constants
 * ----------------------- 
 */

/* Breakpoints */
const BREAKPOINT_MOBILE_SM = 300;
const BREAKPOINT_MOBILE_MD = 368;
const BREAKPOINT_MOBILE_LG = 500;
const BREAKPOINT_TABLET_SM = 768;
const BREAKPOINT_TABLET_MD = 900;
const BREAKPOINT_TABLET_LG = 1020;
const BREAKPOINT_DESKTOP_SM = 1200;
const BREAKPOINT_DESKTOP_MD = 1536;
const BREAKPOINT_DESKTOP_LG = 2160;

/* General */
const BASE_URL = 'public'
const EPISODE_COUNT_CURRENT = 2;
const EPISODE_COUNT_TOTAL = 8;

/* 
 * -----------------------
 * Data
 * ----------------------- 
 */

const EPISODE_LINKS = ['https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5',];

/* 
 * -----------------------
 * Globals
 * ----------------------- 
 */

const Controller = new ScrollMagic.Controller();
const Episodes = [];

/* 
 * -----------------------
 * Selectors
 * ----------------------- 
 */

/* Intro */
const intro = document.querySelector( '.aic__intro' );
const mainTitle = intro.querySelector( 'span' );

/* Content */
const content = document.querySelector( '.aic__content' );
const bgVideo = content.querySelector( 'video' );

/* Modals */
const modals = document.querySelector( '.aic__modals' );
const closeModalBtn = document.querySelector( '#aic__modals--btn-close' );

/* 
 * -----------------------
 * Core
 * ----------------------- 
 */

function init() {
    generatePage();
    generateEpisodes();

    introScene();
    episodeOneScene();
    episodeTwoScene();
}

function generatePage() {
    /* Adds 'close modal' button to modal overlay */
    modals.append(closeModalBtn)
}

function generateEpisodes() {
    const offSetHeight = bgVideo.offsetHeight * episodeBlockOffset();
    const blockHeight = offSetHeight / EPISODE_COUNT_TOTAL;

    const asset = (num, kind, type) => {
        return num <= EPISODE_COUNT_CURRENT ? `${BASE_URL}/ep-${num}-${kind}.${type}` : '';
    }

    /* Generate episode section blocks & coresponding modal */
    [...Array(EPISODE_COUNT_TOTAL)].forEach((_, index) => {
        const episodeNum = index + 1;

        /* Builds individual episode section */
        const section = document.createElement('section');
        section.setAttribute('id', `aic__episode-${episodeNum}`);
        section.classList.add('aic__ep--block');
        section.style.height = `${blockHeight}px`;
        section.innerHTML = `
            <div ${ episodeNum > EPISODE_COUNT_CURRENT ? 'class="hidden"' : '' }>
                <img class="aic__ep--circle" src=${asset(episodeNum, 'circle', 'png')} />
                <img class="aic__ep--title" src=${asset(episodeNum, 'title', 'png')} />
            </div>
        </div>
        `;

        /* Add connecting line if NOT last node */
        if (episodeNum < EPISODE_COUNT_CURRENT) {
            /* SVG capatability --WAITING FOR PHASE 2-- */
            // const svg = document.querySelector( '.aic__ep--line' );
            // if (svg) {
            //     const clone = svg.cloneNode(true);

            //     clone.classList.remove('hidden');
            //     clone.classList.remove('aic__ep--line');
            //     clone.classList.add('aic__ep--line-main');

            //     section.querySelector( 'div' ).append(clone);
            // }

            const mainLine = document.createElement('img');
            mainLine.classList.add(`aic__ep--line-main`);
            mainLine.setAttribute('src', `${BASE_URL}/ep-line.png`);
            section.querySelector( 'div' ).append(mainLine);
        }

        /* Generate corresponding modal and add to page */
        const modal = generateEpisodeModal(episodeNum);
        modals.append(modal);

        /* Add event listeners */
        const node = section.querySelector( '.aic__ep--circle' );
        node.addEventListener('click', () => openEpisodeModal(modal));
        modals.addEventListener('click', () => {
            closeEpisodeModal(modal)
        });

        /* Adds episode section to the page */
        content.querySelector( '.aic__episodes' ).append(section);
        
        /* Adds episode data to 'Episodes' global */
        Episodes.push({
            number: section, 
            element: {
                circle: section.querySelector( '.aic__ep--circle' ),
                line: {
                    main: section.querySelector( '.aic__ep--line-main' )
                },
                title: section.querySelector( '.aic__ep--title' ),
                wrapper: section,
                modal,
            }
        });
    });
}

function generateEpisodeModal(episodeNum) {
    const modal = document.createElement( 'div' );
    modal.setAttribute('id', `aic__episode-${episodeNum}--modal`);
    modal.classList.add('modal');
    modal.classList.add('hidden');

     modal.innerHTML = `
        <div class="aic__modals--wrapper">
            <iframe
                title="vimeo-player" 
                src=${EPISODE_LINKS[episodeNum - 1]} 
                frameborder="0"
                style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:95%;height:100%;margin: 0 auto;"  
                allowfullscreen>
            </iframe>
        </div>
    `;

    const iframe = modal.querySelector( 'iframe' );
    iframe.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' && !modal.classList.contains('hidden'))
            closeEpisodeModal(modal)
    });

    return modal;
}

function openEpisodeModal(modal) {
    if (modals.classList.contains('hidden') && modal.classList.contains('hidden')) {
        modals.classList.remove('hidden');
        modal.classList.remove('hidden');
    }
}

function closeEpisodeModal(modal) {
    if (!modals.classList.contains('hidden') && !modal.classList.contains('hidden')) {
        modals.classList.add('hidden');
        modal.classList.add('hidden');
    }
}

/* 
 * -----------------------
 * Animations
 * ----------------------- 
 */

function appearOnScroll(el, trigger, opts) {
    const tween = TweenMax.fromTo(el, opts && opts.tweenDuaration || 5, { opacity: 0 }, { opacity: 1 });

    new ScrollMagic.Scene({
        duration: opts && opts.duration || 0,
        triggerElement: trigger,
        triggerHook: opts && opts.triggerHook || 0
    })
        .offset(opts && opts.offset || 0)
        .setTween(tween)
        .addIndicators()
        .addTo(Controller)
}

function draw(svg, trigger, opts) {
    const path = svg.querySelector( 'path' );
    preparePath(path);

    const tween = TweenMax.to(path, 3, { strokeDashoffset: 0, ease: Linear.easeNone });

    new ScrollMagic.Scene({
        duration: opts && opts.duration || 0,
        triggerElement: trigger,
        triggerHook: opts && opts.triggerHook || 0
    })
        .offset(opts && opts.offset || 0)
        .setTween(tween)
        .addTo(Controller)
}

function fadeOnScroll(el, trigger, opts) {
    const tween = TweenMax.fromTo(el, 3, { opacity: 1 }, { opacity: 0 });

    new ScrollMagic.Scene({
        duration: opts && opts.duration || 0,
        triggerElement: trigger,
        triggerHook: opts && opts.triggerHook || 0
    })
        .offset(opts && opts.offset || 0)
        .setTween(tween)
        .addTo(Controller)
}

/* 
 * -----------------------
 * Event Listeners
 * ----------------------- 
 */

/* Closes episode modal when user presses the 'Escape' key */
document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') Episodes.forEach(episode => closeEpisodeModal(episode.element.modal));
});

/* Enables 'close modal' button */
closeModalBtn.addEventListener('click', () => {
    Episodes.forEach(episode => closeEpisodeModal(episode.element.modal))
});

/* 
 * -----------------------
 * Helpers
 * ----------------------- 
 */

function episodeBlockOffset() {
    const vw = viewport().width;
    
    if (vw <= 500) { return 0.7; } else
    if (vw > 500 && vw < 1200) { return 0.8 } else
    if (vw >= 1200) { return 0.9 }
}

function preparePath(path) {
    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length; 
}

function viewport() {
    const vw =  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    switch(true) {
        case (vw < BREAKPOINT_TABLET_SM):
            return { type: 'mobile', width: vw, height: vh };    
        case (vw > BREAKPOINT_DESKTOP_SM):
            return { type: 'desktop', width: vw, height: vh };
        default: 
            return { type: 'tablet', width: vw, height: vh };
    }
}

/* 
 * -----------------------
 * Scenes
 * ----------------------- 
 */

/* Main title intro */
function introScene() {
    const scrollText = intro.querySelector( 'div' );

    const timeline = new TimelineMax();
    const scrolLTextAnim = TweenMax.fromTo(scrollText, 5, { opacity: 1 }, { opacity: 0 });
    const textFadeAnim = TweenMax.fromTo(mainTitle, 3, { opacity: 0.3 }, { opacity: 1 });
    const textDirectionAnim = TweenMax.to(mainTitle, 0.5, { scale: 1.2, repeat: 5, yoyo: true });
    
    timeline.add(scrolLTextAnim).add(textFadeAnim).add(textDirectionAnim);

    const duration = () => {
        const width = viewport().width;

        if (width < BREAKPOINT_TABLET_SM) { return 300; } else
        if (width >= BREAKPOINT_TABLET_SM && width < BREAKPOINT_TABLET_LG) { return 400; } else
        if (width >= BREAKPOINT_TABLET_LG && width < BREAKPOINT_DESKTOP_SM) { return 300; }else 
        if (width >= BREAKPOINT_DESKTOP_SM && width < BREAKPOINT_DESKTOP_MD) { return 350; } else
        if (width >= BREAKPOINT_MOBILE_MD) { return 550;}
    }

    new ScrollMagic.Scene({
        duration: duration(), 
        triggerElement: intro, 
        triggerHook: 0 
    })
        .setPin(intro)
        .setTween(timeline)
        .addTo(Controller)
}

/* Episode 1 */
function episodeOneScene() {
    const instructions = content.querySelector( 'h2' );

    appearOnScroll(Episodes[0].element.circle, intro, { 
        duration: 100,
        offset: 280
    });

    appearOnScroll(Episodes[0].element.title, intro, {
        duration: 75,
        offset: 365 
    });

    appearOnScroll(Episodes[0].element.line.main, intro, {
        duration: 200,
        offset: 330
    });

    appearOnScroll(instructions, intro, {
        duration: 150,
        offset: 680 
    });
}

/* Episode 2 */
function episodeTwoScene() {
    appearOnScroll(Episodes[1].element.circle, intro, {
        duration: 100,
        offset: 380 
    });

    appearOnScroll(Episodes[1].element.title, intro, {
        duration: 75,
        offset: 465
    });
}

/* 
 * -----------------------
 * init
 * ----------------------- 
 */

init();
