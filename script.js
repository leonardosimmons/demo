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

/* Data */
const EPISODE_LINKS = ['https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5', 'https://player.vimeo.com/video/775360954?h=19337743c5',];

/* 
 * -----------------------
 * Variables
 * ----------------------- 
 */

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
const video = content.querySelector( 'video' );

/* Modals */
const modals = document.querySelector( '.aic__modals' );

/* 
 * -----------------------
 * Core
 * ----------------------- 
 */

function init() {
    generateEpisodes();
    introScene();
    episodeOneScene();
    episodeTwoScene();
}

function generateEpisodes() {
    const offSetHeight = video.offsetHeight * .7;
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
            <div class="${ episodeNum > EPISODE_COUNT_CURRENT && 'hidden' }"">
                <img class="aic__ep--circle" src=${asset(episodeNum, 'circle', 'png')} />
                <img class="aic__ep--title" src=${asset(episodeNum, 'title', 'png')} />
            </div>
        </div>
        `;

        /* Add connecting line if NOT last node*/
        if (episodeNum <= EPISODE_COUNT_CURRENT - 1) {
            const mainLine = document.createElement('img');
            mainLine.classList.add(`aic__ep--line-main`);
            mainLine.setAttribute('src', `${BASE_URL}/ep-line.svg`);
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
                wrapper: section,
                title: section.querySelector( '.aic__ep--title' ),
                circle: section.querySelector( '.aic__ep--circle' ),
                modal,
                line: {
                    main: section.querySelector( '.aic__ep--line-main' )
                }
            }
        });
    });

    /* adds close button to modal overlay */
    const closeBtn = document.querySelector( '#aic__modals--btn-close' );
    closeBtn.addEventListener('click', () => {
        Episodes.forEach(episode => closeEpisodeModal(episode.element.modal))
    });
    modals.append(closeBtn)
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
 * Event Listeners
 * ----------------------- 
 */

document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') Episodes.forEach(episode => closeEpisodeModal(episode.element.modal));
});

/* 
 * -----------------------
 * Helpers
 * ----------------------- 
 */

function appearOnScroll(el, trigger, opts) {
    const tween = TweenMax.fromTo(el, 3, { opacity: 0 }, { opacity: 1 });

    new ScrollMagic.Scene({
        duration: opts && opts.duration || 0,
        triggerElement: trigger,
        triggerHook: opts && opts.triggerHook || 0
    })
        .offset(opts && opts.offset || 0)
        .setTween(tween)
        .addTo(controller)
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

const controller = new ScrollMagic.Controller();

/* Main title intro */
function introScene() {
    const timeline = new TimelineMax();
    const textFadeAnim = TweenMax.fromTo(mainTitle, 3, { opacity: 0.3 }, { opacity: 1 });
    const textDirectionAnim = TweenMax.to(mainTitle, 0.5, { scale: 1.2, repeat: 5, yoyo: true });
    
    timeline.add(textFadeAnim).add(textDirectionAnim);

    new ScrollMagic.Scene({
        duration: viewport().width >= BREAKPOINT_TABLET_SM ? '100%' : 300, 
        triggerElement: intro, 
        triggerHook: 0 
    })
        .setPin(intro)
        .setTween(timeline)
        .addTo(controller)
}

/* Episode 1 */
function episodeOneScene() {
    appearOnScroll(Episodes[0].element.circle, intro, { 
        duration: 100,
        offset: 150
    });

    appearOnScroll(Episodes[0].element.title, intro, {
        duration: 75,
        offset: 235 
    });

    appearOnScroll(Episodes[0].element.line.main, intro, {
        duration: 75,
        offset: 200
    });
}

function episodeTwoScene() {
    appearOnScroll(Episodes[1].element.circle, intro, {
        duration: 100,
        offset: 220 
    });

    appearOnScroll(Episodes[1].element.title, intro, {
        duration: 75,
        offset: 275
    });
}

/* 
 * -----------------------
 * init
 * ----------------------- 
 */

init();
