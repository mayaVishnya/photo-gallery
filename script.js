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
    
function updateFocus() {
    carouselImages.forEach(img => img.classList.remove('is-focused'));
    
    if (currentIndex >= carouselImages.length)
        currentIndex = carouselImgs.length - 1;
    if (currentIndex < 0)
        currentIndex = 0;

    carouselImages[currentIndex].classList.add('is-focused');

    return currentIndex;
}
    
// add caroulel 'movement'
const AUTO_SLIDE_INTERVAL = 3000; // 3 sec
let autoSlideTimer;
    
function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;
    
        const firstImg = carouselImages[0];
        if (!firstImg) return;
    
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
        let nextIndex = currentIndex + dir;

        // check for the first and last element
        if (nextIndex >= carouselImages.length - 1) {
            nextIndex = carouselImages.length - 1;
            dir = -1;
        } else if (nextIndex <= 0) {
            nextIndex = 0;
            dir = 1;
        }
    
        currentIndex = nextIndex;
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
        setTimeout(() => {
            isAnimating = false;
        }, 500);
}
    
// starting the animation timer
function startAutoSlide () {
    // clear current timers
    stopAutoSlide();
        
    autoSlideTimer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
}
    
// stop the timer
function stopAutoSlide () {
    if (autoSlideTimer)
        clearInterval(autoSlideTimer);
}
    
// -- INIT CAROUSEL --
startAutoSlide();
    
// Pause animation on hover (PC)
if (carouselViewport) {
    carouselViewport.addEventListener('mouseenter', stopAutoSlide);
    carouselViewport.addEventListener('mouseleave', startAutoSlide);
}
    
// Pause animation on touch (Mobile)
if (carouselViewport) {
    carouselViewport.addEventListener('touchstart', stopAutoSlide);
    carouselViewport.addEventListener('touchend', () => {
        setTimeout(startAutoSlide, 2000);
    })
}

/* GALLERY section */

function getItems() {
    return [
        {
            id: 0,
            name: "Irish Hills",
            publicId: "hills_wp2zti",
            altText: "Hills at the coast of Ireland"
        },
        {
            id: 1,
            name: "Behind the curtain",
            publicId: "van_hntkqw",
            altText: "Van"
        },
        {
            id: 2,
            name: "Something",
            publicId: "squirel_xnm2z6",
            altText: "Squirel"
        },
        {
            id: 3,
            name: "Something",
            publicId: "small-bird_vrqzfe",
            altText: "Small Birb"
        },
        {
            id: 4,
            name: "Something",
            publicId: "road_jviv50",
            altText: "Road"
        },
        {
            id: 5,
            name: "Something",
            publicId: "horse_g3aglf",
            altText: "Horse"
        },
        {
            id: 6,
            name: "Something",
            publicId: "bird_wdsmof",
            altText: "Birb"
        },
        {
            id: 7,
            name: "Something",
            publicId: "hills_wp2zti",
            altText: "Hills"
        },
        {
            id: 8,
            name: "Something",
            publicId: "van_hntkqw",
            altText: "Van"
        },
        {
            id: 9,
            name: "Something",
            publicId: "bird_wdsmof",
            altText: "Birb"
        },
        {
            id: 10,
            name: "Something",
            publicId: "horse_g3aglf",
            altText: "Horse"
        },
        {
            id: 11,
            name: "Something",
            publicId: "road_jviv50",
            altText: "Road"
        },
        {
            id: 12,
            name: "Something",
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
        overlayDiv.innerHTML = 
            `<span id="name">${item.name}</span>
            <button id= "view-btn-${item.id}" 
                    class="view-btn" 
                    onclick="onViewBtnPressed(this.id)">
                    VIEW
            </button>`;
    
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

function onMoreBtnPressed() {
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
}

// Handling View btn
const modal = document.getElementById("item-modal");
const modalContent = document.getElementById("modal-content");

function onViewBtnPressed(item_id) {
    item_id = item_id.match(/(\d)+/)[0];
    if (!item_id) return;

    const modalContent = document.getElementById("modal-content");

    let isVertical = true;
    const items = getItems();
    const item = items.at(item_id);
    
    // fetch image
    const url = `https://res.cloudinary.com/dtvkhhwwb/image/upload/w_400,q_auto,f_auto/${item.publicId}.jpg`;
    const img = document.createElement("img");
    img.src = url;
    if (item.altText != null) img.alt = item.altText;
    img.onload = function() {
        if (this.naturalWidth > this.naturalHeight) {
            isVertical = false;
        } else {
            isVertical = true;
        }
        img.style.width = `${isVertical ? 350 : 550}px`;
    
        modalContent.innerHTML = `
            <div class="name-close-div">
                <span class="name">${item.name}</span>
                <span class="close" onclick="onClosePressed()">&times;</span>
            </div>
        `;
        modalContent.append(img);
        
        modalContent.style.margin = `${isVertical ? 5 : 10}% auto`;
        modal.style.display = "block";
    };
}

function onClosePressed() {
    modal.style.display = "none";
}

// Close when clicking the background overlay ---
modal.addEventListener('click', function(event) {
    if (event.target === this) {
        onClosePressed();
    }
});

/* CONTACT section*/

// Setting up contact form
const contactForm = document.getElementById("contact-form");
const sendBtn = document.getElementById("send-btn");
let isSending = false;

function sendEmail(event) {
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
}

function resetBtn() {
    isSending = false;
    sendBtn.disabled = false;
    sendBtn.innerText = "SEND";
}
