/* CAROUSEL section */
// TO DO: adapt for MOBILE

function initCarousel () {
    const isMobile = window.isMobile();
    const carouselImgs = [
        { publicId: "squirel_xnm2z6", altText: "Squirel" },
        { publicId: "bird_wdsmof", altText: "Birb" },
        { publicId: "small-bird_vrqzfe", altText: "Small Birb" },
        { publicId: "horse_g3aglf", altText: "Horse" },
        { publicId: "bird_wdsmof", altText: "Birb" },
        { publicId: "small-bird_vrqzfe", altText: "Small Birb" },
        { publicId: "squirel_xnm2z6", altText: "Squirel" }
    ];

    const carouselTrack = document.querySelector('#carousel-track');
    const carouselViewport = document.querySelector('#carousel-viewport');
    let currentIndex = 0;
        
    function buildCarousel(_middleIndex = 1) {
        if (!carouselTrack) return;
    
        carouselTrack.innerHTML = '';
        currentIndex = _middleIndex;
        
        carouselImgs.forEach((item, index) => {            
            const img = document.createElement("img");
            img.src = `https://res.cloudinary.com/dtvkhhwwb/image/upload/h_400,q_auto,f_auto/${item.publicId}.jpg`;
            img.alt = item.altText;
            img.classList.add("photo");
            if (index === _middleIndex)
                img.classList.add("is-focused");
        
            // adding img to the track
            carouselTrack.append(img);
        });
    }
        
    let numOfElementsDisplayed = isMobile ? 0 : 1;
    buildCarousel(numOfElementsDisplayed);
        
    // -- ADDING ANIMATION --
    const carouselImages = Array.from(document.querySelectorAll('#carousel-track .photo'));
    
    let currentTranslate = 0;
    let isAnimating = false;
    let dir = 1; // 1 - forward, -1 - backwards
    
    // gives focus to the next img
    function updateFocus() {
        carouselImages.forEach(img => img.classList.remove('is-focused'));
        
        if (currentIndex >= carouselImages.length)
            currentIndex = carouselImgs.length - 1;
        if (currentIndex < 0)
            currentIndex = 0;
    
        carouselImages[currentIndex].classList.add('is-focused');
    
        return currentIndex;
    }
        
    function nextSlide(_dir = dir) {
        if (isAnimating) return;
        isAnimating = true;
        
        const firstImg = carouselImages[0];
        if (!firstImg) {
            isAnimating = false;
            return;
        } 
        
        // calculating shift amount
        const gap = 20;
        const moveAmount = isMobile ? firstImg.getBoundingClientRect().height + gap :
                                firstImg.getBoundingClientRect().width + gap;
        currentTranslate -= moveAmount;
        const firstImgSize = isMobile ? firstImg.getBoundingClientRect().height / 3 : 
                            firstImg.getBoundingClientRect().width;
        
        // check for end of track
        const trackSize = isMobile ? carouselTrack.scrollHeight : carouselTrack.scrollWidth;
        const viewportSize = isMobile ? carouselViewport.clientHeight : carouselViewport.clientWidth;
        const maxTranslate = -(trackSize - viewportSize);
        const centerOffset = (viewportSize / 2) - firstImgSize;
    
        // calc next position    
        currentIndex = getNextIndex(_dir);
        currentTranslate = -(currentIndex * moveAmount) + centerOffset;
    
        // check physical limit of the track
        if (currentTranslate < maxTranslate) {
            currentTranslate = maxTranslate;
        }
        if (currentTranslate > 0) {
            currentTranslate = 0;
        }
    
        carouselTrack.style.transform = isMobile ? `translateY(${currentTranslate}px)` : `translateX(${currentTranslate}px)`;
        
        updateFocus();
        
        // reset animation block after transition
        carouselTrack.addEventListener("transitionend", () => {
            isAnimating = false;
        });
    }
        
    function getNextIndex(_dir) {
        let nextIndex = currentIndex + _dir;
    
        // check for the first and last element
        if (nextIndex >= carouselImages.length - 1) {
            nextIndex = carouselImages.length - 1;
            dir = -1;
        } else if (nextIndex <= 0) {
            nextIndex = 0;
            dir = 1;
        }
        return nextIndex;
    }
    
    // add caroulel 'movement'
    let slideInterval = null;
    const AUTO_SLIDE_INTERVAL = 3000; // 3 sec
    const INTERACTIVE_SLIDE_INTERVAL = 1000; // 1 sec when user is interacting
    let interactionMode = "auto"; // auto, left, right, pause
    
    function clearSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // starting the animation timer
    function startAutoSlide () {
        // clear current timers
        clearSlideInterval();
            
        slideInterval = setInterval(() => nextSlide(dir), AUTO_SLIDE_INTERVAL);
    }
    
    // starting the interaction animation timer
    function startInteractiveSlide (direction) {
        // clear current timers
        clearSlideInterval();
        nextSlide(direction);
        slideInterval = setInterval(() => nextSlide(direction), INTERACTIVE_SLIDE_INTERVAL);
    }
    
    function setMode(mode) {
        if (interactionMode === mode)
            return;
    
        interactionMode = mode;
        clearSlideInterval();
    
        switch(mode) {
            case "auto":
                slideInterval = setInterval(() => nextSlide(dir), 3000);
                break;
    
            case "left":
                slideInterval = setInterval(() => nextSlide(-1), 1000);
                break;
    
            case "right":
                slideInterval = setInterval(() => nextSlide(1), 1000);
                break;
    
            case "pause":
                break;
        }
    }
    
    function handleCarouselInteraction(e) {
        if (isMobile) return;
    
        const viewportRect = carouselViewport.getBoundingClientRect();
        const cursorX = e.clientX - viewportRect.left;
        const centerPoint = viewportRect.width / 2;
        const threshold = viewportRect.width *  0.2; // middle zone, 20% from center
    
        // change behavior depending on the zone
        if(cursorX < centerPoint - threshold) {
            setMode("left");
        } else if (cursorX > centerPoint + threshold) {
            setMode("right");
        } else {
            setMode("pause");
        }
    }
    
    // -- INIT CAROUSEL --
    startAutoSlide();
    
    // Pause animation on hover (PC)
    if (carouselViewport) {
        carouselViewport.addEventListener('mousemove', handleCarouselInteraction);
        carouselViewport.addEventListener('mouseleave', () => {
            setMode("auto");
        });
    }
        
    // Pause animation on touch (Mobile)
    if (carouselViewport) {
        carouselViewport.addEventListener('touchstart', () => { 
            clearSlideInterval();
        }, {passive: true });
        carouselViewport.addEventListener('touchend', () => {
            setTimeout(startAutoSlide, 2000);
        })
    }
}
