//   This script literally just checks if your browser is capable of hovering over items without clicking, basically if you have a mouse or not. 
window.isMobile = function(){
  if(window.matchMedia("(any-hover:none)").matches) {
    return true;
  } else {
    return false;
  }
};

// Adding grip items on load
const items = getItems();
let isMobile = window.isMobile();
let itemsPerRow = isMobile ? 1 : 4;
let itemsTotal = isMobile ? 4 : 8;
let prevTotal = itemsTotal;
updateItems(itemsPerRow, items, itemsTotal);

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

function getItems() {
    return [
        {
            id: 1,
            name: "Irish Hills",
            price: "from 30€",
            publicId: "hills_wp2zti",
            altText: "Hills at the coast of Ireland"
        },
        {
            id: 2,
            name: "Behind the curtain",
            price: "from 30€",
            publicId: "van_hntkqw",
            altText: "Van"
        },
        {
            id: 3,
            name: "Something",
            price: "from 30€",
            publicId: "squirel_xnm2z6",
            altText: "Squirel"
        },
        {
            id: 4,
            name: "Something",
            price: "from 30€",
            publicId: "small-bird_vrqzfe",
            altText: "Small Birb"
        },
        {
            id: 5,
            name: "Something",
            price: "from 30€",
            publicId: "road_jviv50",
            altText: "Road"
        },
        {
            id: 6,
            name: "Something",
            price: "from 30€",
            publicId: "horse_g3aglf",
            altText: "Horse"
        },
        {
            id: 7,
            name: "Something",
            price: "from 30€",
            publicId: "bird_wdsmof",
            altText: "Birb"
        },
        {
            id: 8,
            name: "Something",
            price: "from 30€",
            publicId: "hills_wp2zti",
            altText: "Hills"
        },
        {
            id: 9,
            name: "Something",
            price: "from 30€",
            publicId: "van_hntkqw",
            altText: "Van"
        },
        {
            id: 10,
            name: "Something",
            price: "from 30€",
            publicId: "bird_wdsmof",
            altText: "Birb"
        },
        {
            id: 11,
            name: "Something",
            price: "from 30€",
            publicId: "horse_g3aglf",
            altText: "Horse"
        },
        {
            id: 12,
            name: "Something",
            price: "from 30€",
            publicId: "road_jviv50",
            altText: "Road"
        },
        {
            id: 13,
            name: "Something",
            price: "from 30€",
            publicId: "road_jviv50",
            altText: "Road"
        }
    ]
}

// PRINT SHOP dynamic items
// EXAMPLE IMG URL https://res.cloudinary.com/dtvkhhwwb/image/upload/hills_wp2zti.jpg 
function updateItems (_itemsPerRow, _itemsArr, itemsTotal) {
    const container = document.getElementById("prints-container");
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
            <span id="price">${item.price}</span>
            <button id="view-btn">VIEW</button>`;
    
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

