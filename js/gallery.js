/* GALLERY section */
function initGallery () {
    const isMobile = window.isMobile();

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
}
