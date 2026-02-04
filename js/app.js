// ---------------------------
// 1. DATA & FORCED RESET
// ---------------------------

// This forces a one-time wipe to ensure the new image structure is used
if (!localStorage.getItem("hasUpdatedImagesV3")) {
    localStorage.clear();
    localStorage.setItem("hasUpdatedImagesV3", "true");
}

let items = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, title: "Black Backpack", claimed: false, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" },
    { id: 2, title: "AirPods Case", claimed: false, image: "https://images.unsplash.com/photo-1588423770674-f285514035b3?w=300" },
    { id: 3, title: "Calculator", claimed: false, image: "https://images.unsplash.com/photo-1574607383476-f517f220d398?w=300" },
    { id: 4, title: "Water Bottle", claimed: false, image: "https://images.unsplash.com/photo-1523362622602-deba56a2f90a?w=300" },
    { id: 5, title: "Notebook", claimed: false, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300" },
    { id: 6, title: "Phone Charger", claimed: false, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300" },
    { id: 7, title: "Sunglasses", claimed: false, image: "https://images.unsplash.com/photo-1511499767350-a15104643f14?w=300" },
    { id: 8, title: "Keychain", claimed: false, image: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=300" },
    { id: 9, title: "Umbrella", claimed: false, image: "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=300" },
    { id: 10, title: "Lunchbox", claimed: false, image: "https://images.unsplash.com/photo-1623156346149-d5bc8bd27094?w=300" }
];

let claims = JSON.parse(localStorage.getItem("claims")) || [];

function saveState() {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("claims", JSON.stringify(claims));
}

// ---------------------------
// 2. RENDERING FUNCTIONS
// ---------------------------

function renderItems() {
    const itemsListEl = document.getElementById("itemsList");
    if (!itemsListEl) return;

    itemsListEl.innerHTML = "";
    itemsListEl.style.display = "grid";
    itemsListEl.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
    itemsListEl.style.gap = "20px";

    const availableItems = items.filter(i => i.claimed === false);

    availableItems.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "card";
        wrapper.style.textAlign = "center";

        const img = document.createElement("img");
        img.src = item.image;
        img.style.width = "100%";
        img.style.height = "150px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";

        const title = document.createElement("div");
        title.innerHTML = `<strong>${item.title}</strong>`;
        title.style.margin = "10px 0";

        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Claim This";
        btn.onclick = () => { window.location.href = "claim.html"; };

        wrapper.appendChild(img);
        wrapper.appendChild(title);
        wrapper.appendChild(btn);
        itemsListEl.appendChild(wrapper);
    });
}

function populateItemSelect() {
    const itemSelectEl = document.getElementById("itemSelect");
    if (!itemSelectEl) return;
    
    itemSelectEl.innerHTML = '<option value="" disabled selected>Select an item...</option>';
    
    const availableItems = items.filter(i => i.claimed === false);
    
    availableItems.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.title;
        itemSelectEl.appendChild(opt);
    });
}

// ---------------------------
// 3. EVENT HANDLERS
// ---------------------------

function handleClaimSubmit(event) {
    event.preventDefault();
    const itemSelectEl = document.getElementById("itemSelect");
    const studentNameEl = document.getElementById("studentName");
    
    const selectedId = itemSelectEl.value;
    if(!selectedId) return alert("Select an item first!");

    const itemIndex = items.findIndex(i => i.id == selectedId);
    if(itemIndex !== -1) items[itemIndex].claimed = true;

    claims.push({
        name: studentNameEl.value,
        itemId: selectedId,
        status: "pending"
    });

    saveState();
    
    document.getElementById("claimForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    setTimeout(() => { window.location.href = "index.html"; }, 2000);
}

// ---------------------------
// 4. INITIALIZATION
// ---------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Run these immediately when the page loads
    renderItems();
    populateItemSelect();

    // Attach listeners only if the elements exist on the current page
    const claimForm = document.getElementById("claimForm");
    if (claimForm) claimForm.addEventListener("submit", handleClaimSubmit);

    const cancelBtn = document.getElementById("cancelClaim");
    if (cancelBtn) cancelBtn.addEventListener("click", () => window.location.href = "index.html");

    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) refreshBtn.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });
});
