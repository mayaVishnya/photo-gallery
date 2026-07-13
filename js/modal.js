function initModal() {
    const isMobile = window.isMobile();

    // Modal, view photo
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
}
