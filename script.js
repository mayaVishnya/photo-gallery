//   This script literally just checks if your browser is capable of hovering over items without clicking, basically if you have a mouse or not. 
window.isMobile = function(){
  if(window.matchMedia("(any-hover:none)").matches) {
    return true;
  } else {
    return false;
  }
};
let isMobile = window.isMobile();

/* PORTFOLIO section */

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
const INTERACTIVE_SLIDE_INTERVAL = 1500; // 1.5 sec when user is interacting
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

/* GALLERY section */

// TO DO: move this to backend metadata
function getItems() {
    return [
        {
            id: 0,
            publicId: "hills_wp2zti",
            altText: "Hills at the coast of Ireland"
        },
        {
            id: 1,
            publicId: "van_hntkqw",
            altText: "Van"
        },
        {
            id: 2,
            publicId: "squirel_xnm2z6",
            altText: "Squirel"
        },
        {
            id: 3,
            publicId: "small-bird_vrqzfe",
            altText: "Small Birb"
        },
        {
            id: 4,
            publicId: "road_jviv50",
            altText: "Road"
        },
        {
            id: 5,
            publicId: "horse_g3aglf",
            altText: "Horse"
        },
        {
            id: 6,
            publicId: "bird_wdsmof",
            altText: "Birb"
        },
        {
            id: 7,
            publicId: "hills_wp2zti",
            altText: "Hills"
        },
        {
            id: 8,
            publicId: "van_hntkqw",
            altText: "Van"
        },
        {
            id: 9,
            publicId: "bird_wdsmof",
            altText: "Birb"
        },
        {
            id: 10,
            publicId: "horse_g3aglf",
            altText: "Horse"
        },
        {
            id: 11,
            publicId: "road_jviv50",
            altText: "Road"
        },
        {
            id: 12,
            publicId: "road_jviv50",
            altText: "Road"
        }
    ]
}

// GALLERY dynamic items
// EXAMPLE IMG URL https://res.cloudinary.com/dtvkhhwwb/image/upload/hills_wp2zti.jpg 
function updateItems (_itemsPerRow, _itemsArr, itemsTotal) {
    const container = document.getElementById("gallery-container");
    if (!container) return;

    let currentRow = null;
    const itemsPerRow = _itemsPerRow;

    container.innerHTML = '';
    
    const itemsArr = _itemsArr;
    const newItemsNodes = []
    
    itemsArr.forEach((item, index) => {
        if (index >= itemsTotal) return;

        // determine the row
        if (!currentRow || currentRow.children.length >= itemsPerRow) {
            currentRow = document.createElement("div");
            currentRow.classList.add("row");
            container.append(currentRow);
        }
        // create new item
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        if (index > prevTotal) {
            itemDiv.classList.add("new-item");
            newItemsNodes.push(itemDiv);
        }
    
        // fetch image
        const url = `https://res.cloudinary.com/dtvkhhwwb/image/upload/w_400,q_auto,f_auto/${item.publicId}.jpg`;
        const img = document.createElement("img");
        img.classList.add("item-img")
        img.src = url;
        if (item.altText != null) img.alt = item.altText;
        img.loading = "lazy";
    
        // creating new overlay
        const overlayDiv = document.createElement("div");
        overlayDiv.classList.add("item-overlay");
        overlayDiv.setAttribute("data-id", item.id);
        //adding overlay and img to the item
        itemDiv.append(img, overlayDiv);
    
        // adding items to the row
        currentRow.append(itemDiv);
    });
    prevTotal = itemsTotal;

    if (newItemsNodes.length > 0) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newItemsNodes.forEach(item => item.classList.add("loaded"));

                setTimeout(() => {
                    newItemsNodes[0].scrollIntoView({
                        behavior: 'smooth',
                        block: "start"
                    });
                }, 150);
            });
        });
    }
}

// Adding grid items on load
const items = getItems();
let itemsPerRow = isMobile ? 1 : 4;
let itemsTotal = isMobile ? 4 : 8;
let prevTotal = itemsTotal;
updateItems(itemsPerRow, items, itemsTotal);

function scrollToTopRow() {
    let index = isMobile ? 0 : 1;
    const firstRow = document.getElementsByClassName("row")[index];
    requestAnimationFrame(() => {
        setTimeout(() => {
            firstRow.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

    }, 150);
}

// Handling More/Less btn
const moreBtn = document.getElementById("more-btn");
let less = false;

moreBtn.addEventListener("click", () => {
    if (less) {
        itemsTotal = isMobile ? 4 : 8;
        updateItems(itemsPerRow, items, itemsTotal);
        moreBtn.textContent = "MORE";
        less = false;
        scrollToTopRow();
    } else {
        itemsTotal += isMobile? itemsPerRow * 2 : itemsPerRow;
        updateItems(itemsPerRow, items, itemsTotal);
        if (itemsTotal > items.length) {
            moreBtn.textContent = "LESS";
            less = true;
        }
    }
});

// Handling View btn
const modal = document.getElementById("item-modal");
const modalContent = document.getElementById("modal-content");
const galleryContainer = document.getElementById("gallery-container");

if (galleryContainer) {
    galleryContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('item-overlay')) {
            const id = event.target.getAttribute('data-id');
            openModal(parseInt(id, 10));
        }
    });
}

if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.classList.contains('close')) {
            closeModal();
        }
    });
}

function openModal(item_id) {
    if (!modal) return;

    const items = getItems();
    const item = items.find(i => i.id === item_id);
    if (!item) return;
    
    // fetch image
    const url = `https://res.cloudinary.com/dtvkhhwwb/image/upload/w_400,q_auto,f_auto/${item.publicId}.jpg`;
    const img = document.createElement("img");
    img.src = url;
    if (item.altText != null) img.alt = item.altText;
    img.onload = function() {
        const isVertical = this.naturalWidth < this.naturalHeight;
    
        if (isMobile) {
            img.style.width = `95%`;
            modalContent.style.margin = `${isVertical ? 8 : 25}% auto`;
        } else {
            img.style.width = `${isVertical ? 40 : 70}%`;
            modalContent.style.margin = `${isVertical ? 5 : 10}% auto`;
        }

        modalContent.innerHTML = `
            <div class="close-div">
                <span id="close">&times;</span>
            </div>
        `;
        modalContent.append(img);
        
        modal.style.display = "block";
    };
}

function closeModal() {
    if (modal) modal.style.display = "none";
}

// const closeBtn = document.getElementById('close');
// closeBtn.addEventListener("click", () => {
//     modal.style.display = "none";
// });

// // Close when clicking the background overlay ---
// modal.addEventListener('click', function(event) {
//     if (event.target === this) {
//         onClosePressed();
//     }
// });

/* CONTACT section*/

// Setting up contact form
const contactForm = document.getElementById("contact-form");
const sendBtn = document.getElementById("send-btn");
let isSending = false;

sendBtn.addEventListener("click", (event) => {
    if (event) event.preventDefault();
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }
    if (isSending)  return;
    isSending = true;

    sendBtn.disabled = true;
    sendBtn.innerText = "SENDING";

    emailjs.init("jJxcj0PryYSoWXzXt");

    let _name = document.getElementById("name").value;
    let _email = document.getElementById("email").value;
    let _message = document.getElementById("message").value;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (_email === "" || _name === "" || !emailRegex.test(_email)) {
        resetBtn();  
        return;
    }
    if (_message === "") {
        _message = "Please contact me! " + _email + ", " + _name;
    }

    let param = {
        name: _name,
        email: _email,
        message: _message
    }

    emailjs.send("service_eyvtkxd", "template_dhfp3b6", params).then(
        function (response) {
            console.log("SUCCESS!", response.status, response.text);
            alert("Message sent!");
            resetBtn(); 
        },
        function (error) {
            console.log("FAILED...", error);
            alert("Failed to send message, please try again later");
            resetBtn();
        }
    );
});

function resetBtn() {
    isSending = false;
    sendBtn.disabled = false;
    sendBtn.innerText = "SEND";
}
