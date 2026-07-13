/* GALLERY section */
function initGallery () {
    const isMobile = window.isMobile();
    const container = document.getElementById("gallery-container");
    const moreBtn = document.getElementById("more-btn");

    if (!container || !moreBtn) return;

    const items = window.getGalleryItems();
    let itemsTotal = isMobile ? 4 : 8;
    let prevTotal = 0;
    let masonryInstance = null;

    const galleryTop = container.getBoundingClientRect().top + window.scrollY;
    let oldHeight = 0;
    let newHeight = 0;

    let action = "initial"; // "more", "less", "initial"
    
    // GALLERY dynamic items
    // EXAMPLE IMG URL https://res.cloudinary.com/dtvkhhwwb/image/upload/hills_wp2zti.jpg 
    function updateItems () {   
        if (itemsTotal <= prevTotal) {
            container.innerHTML = '';
            prevTotal = 0;
        } 
        const newItemsNodes = []
        oldHeight = container.offsetHeight;
            
        for (let index = prevTotal; index < itemsTotal; index++) {
            if (index >= itemsTotal) break;
            
            const itemData = items[index];
    
            // create new item
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            if (index >= prevTotal) {
                itemDiv.classList.add("new-item");
                newItemsNodes.push(itemDiv);
            }
        
            // fetch image
            const url = `https://res.cloudinary.com/dtvkhhwwb/image/upload/w_600,q_auto,f_auto/${itemData.publicId}.jpg`;
            const img = document.createElement("img");
            img.classList.add("item-img")
            img.src = url;
            img.alt = itemData.altText || '';
            img.loading = "lazy";
        
            // creating new overlay
            const overlayDiv = document.createElement("div");
            overlayDiv.classList.add("item-overlay");
            overlayDiv.setAttribute("data-id", itemData.id);

            //assemble
            itemDiv.append(img, overlayDiv);
            container.append(itemDiv);
        }

        const oldPrevTotal = prevTotal;
        prevTotal = itemsTotal;
    
        // init or update Masonry
       if (typeof imagesLoaded !== 'undefined') {
            imagesLoaded(container, function() {
                if (!masonryInstance) {
                    masonryInstance = new Masonry(container, {
                        itemSelector: '.item',
                        columnWidth: '.item',
                        percentPosition: true,
                        gutter: 20,
                        transitionDuration: '0.5s'
                    });
                } else {
                    masonryInstance.reloadItems();
                    masonryInstance.layout();
                }

                // animate new items
                if (newItemsNodes.length > 0) {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            newItemsNodes.forEach(item => item.classList.add("loaded"));
                            
                            newHeight = container.offsetHeight;

                            if (action == "less") {
                                window.scrollTo({
                                    top: galleryTop * 1.2,
                                    behavior: "smooth"
                                });
                            } else if (action == "more") {
                                window.scrollBy({
                                    top: newHeight / 1.2 - oldHeight,
                                    behavior: "smooth"
                                });
                            }
                        });
                    });
                }
            });
        } else {
            console.error("ImagesLoaded library not found!");
        }
    }

    // Handle More/Less btn
    let less = false;
    
    moreBtn.addEventListener("click", () => {
        if (less) {
            action = "less";

            itemsTotal = isMobile ? 4 : 8;
            moreBtn.textContent = "MORE";
            less = false;
            updateItems();
        } else {
            action = "more";

            const increment = isMobile ? 4 : 3;
            itemsTotal += increment;

            if (itemsTotal >= items.length) {
                itemsTotal = items.length;
                moreBtn.textContent = "LESS";
                less = true;
            }
            updateItems();
        }
    });
        
    // initial load
    updateItems();
}
