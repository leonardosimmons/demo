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
const EPISODE_COUNT_CURRENT = 2;
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
const intro = document.querySelector( '.brain__intro' );
const mainTitle = intro.querySelector( 'span' );

/* Content */
const content = document.querySelector( '.brain__content' );
const video = content.querySelector( 'video' );

/* Episodes */
const epOne = document.querySelector('#episode-1');


/* 
 * -----------------------
 * Helpers
 * ----------------------- 
 */

async function init() {
    await generateEpisodes();
    introScene();
    EpisodeOneScene();
    EpisodeTwoScene();
}

function generateEpisodeModal(epNum) {
    const modal = document.createElement('div');
    modal.setAttribute('id', `episode-${epNum}-modal`);
    modal.classList.add('brain__episodes--modal');
    modal.classList.add('hidden');
    modal.innerHTML = `
        <div class="brain__episodes--modal--container">
            <div style="padding:56.25% 0 0 0;position:relative;">
                <iframe src="https://player.vimeo.com/video/684742502?h=c9d0e8ed69&amp;byline=0" style="position:absolute;top:0;width:95%;height:100%;margin: 0 auto;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="">
                </iframe>
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
        </div>
    `;
    return modal;
}

async function generateEpisodes() {
    const offSetHeight = video.offsetHeight * .7;
    const blockHeight = offSetHeight / EPISODE_COUNT_TOTAL;

    const asset = (num, kind, type = 'png') => {
        return num <= EPISODE_COUNT_CURRENT ? `src="public/ep-${num}-${kind}.${type}"` : '';
    };

    /* Generate episode section blocks */
    [...Array(EPISODE_COUNT_TOTAL)].forEach((_, index) => {
        const epNum = index + 1;
        const el = document.createElement('section');
        const modal = generateEpisodeModal(epNum);

        el.setAttribute('id', `episode-${epNum}`);
        el.classList.add('brain__ep--block');
        el.style.height = `${blockHeight}px`;
        el.innerHTML = `
            <div>
                <img class="brain__ep--circle ${epNum > EPISODE_COUNT_CURRENT && 'hidden' }" ${asset(epNum, 'circle', 'png')} />
                <img class="brain__ep--main-line ${epNum > EPISODE_COUNT_CURRENT && 'hidden' }" ${ epNum === 1 && asset(epNum, 'line-main', 'svg')} />
            </div>
        </div>
        `;

        /* Adds episode data to 'Episode' global */
        Episodes.push({
            number: epNum, 
            element: {
                wrapper: el,
                circle: el.querySelector('.brain__ep--circle'),
                mainLine: el.querySelector( '.brain__ep--main-line' )
            }
        });

        /* Adds episode section to the page */
        content.querySelector('div.brain__episodes').append(el);
        
        /* Adds corresponding modal to page */
        content.querySelector('div.brain__episodes--modals').append(modal);
    });
}

function growOnScroll(el, trigger, opts) {
    const tween = TweenMax.fromTo(el, 3, { opacity: 0 }, { opacity: 1 });

    new ScrollMagic.Scene({
        duration: opts && opts.duration || 100,
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
function EpisodeOneScene() {
    growOnScroll(Episodes[0].element.circle, content, { 
        duration: 200,
        offset: -600
    });

    growOnScroll(Episodes[0].element.mainLine, content, {
        duration: 200,
        offset: -400
    });
}

/* Episode 2 */
function EpisodeTwoScene() {
    growOnScroll(Episodes[1].element.circle, content, {
        duration: 400,
        offset: -400
    });
}

/* 
 * -----------------------
 * init
 * ----------------------- 
 */

init();
