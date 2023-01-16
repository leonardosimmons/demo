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
const EPISODE_COUNT_CURRENT = 1;
const EPISODE_COUNT_TOTAL = 8;

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
}

function generateEpisodes() {
    const offSetHeight = video.offsetHeight * .7;
    const blockHeight = offSetHeight / EPISODE_COUNT_TOTAL;

    const asset = (num, kind, type) => {
        return num <= EPISODE_COUNT_CURRENT ? `${BASE_URL}/ep-${num}-${kind}.${type}` : '';
    }

    /* Generate episode section blocks & coresponding modal */
    [...Array(EPISODE_COUNT_TOTAL)].forEach((_, index) => {
        const episode = index + 1;
        const modal = generateEpisodeModal(episode);

        /* Builds individual episode section */
        const section = document.createElement('section');
        section.setAttribute('id', `aic__episode-${episode}`);
        section.classList.add('aic__ep--block');
        section.style.height = `${blockHeight}px`;
        section.innerHTML = `
            <div class="${ episode > EPISODE_COUNT_CURRENT && 'hidden' }"">
                <img class="aic__ep--circle" src=${asset(episode, 'circle', 'png')} />
                <img class="aic__ep--title" src=${asset(episode, 'title', 'png')} />
            </div>
        </div>
        `;

        /* Adds episode data to 'Episode' global */
        Episodes.push({
            number: section, 
            element: {
                wrapper: section,
                title: section.querySelector( '.aic__ep--title' ),
                circle: section.querySelector( '.aic__ep--circle' ),
                line: {
                    thumbnail: section.querySelector( '.aic__ep--line-thumbnail' )
                }
            }
        });

        /* Adds episode section to the page */
        content.querySelector( '.aic__episodes' ).append(section);
        
        /* Adds corresponding modal to page */
        modals.append(modal);
    });
}

function generateEpisodeModal(episode) {
    const modal = document.createElement('div');
    modal.setAttribute('id', `episode-${episode}-modal`);
    modal.classList.add('modal');
    modal.classList.add('hidden');
    // modal.innerHTML = `
    //     <div class="aic__episodes--modal--container">
    //         <div style="padding:56.25% 0 0 0;position:relative;">
    //             <iframe src="https://player.vimeo.com/video/684742502?h=c9d0e8ed69&amp;byline=0" style="position:absolute;top:0;width:95%;height:100%;margin: 0 auto;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="">
    //             </iframe>
    //         </div>
    //         <script src="https://player.vimeo.com/api/player.js"></script>
    //     </div>
    // `;
    return modal;
}

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
        .addIndicators()
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
        offset: 130
    });

    appearOnScroll(Episodes[0].element.title, intro, {
        offset:200 
    });
}

function episodeTwoScene() {
    appearOnScroll(Episodes[1].element.circle, content, {
        offset: -400
    });
}

/* 
 * -----------------------
 * init
 * ----------------------- 
 */

init();
