// ---------------------------
// 1. DATA & FORCED RESET
// ---------------------------

// Check if we need to force a reset to show images (first-time fix)
if (!localStorage.getItem("hasUpdatedImages")) {
    localStorage.clear();
    localStorage.setItem("hasUpdatedImages", "true");
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
// 2. DOM REFERENCES
// ---------------------------

const itemsListEl = document.getElementById("itemsList");
const itemSelectEl = document.getElementById("itemSelect");
const claimFormEl = document.getElementById("claimForm");
const cancelClaimBtn = document.getElementById("cancelClaim");
const pendingClaimsEl = document.getElementById("pendingClaims");
const adminItemsEl = document.getElementById("adminItems");
const refreshBtn = document.getElementById("refreshBtn");
const claimStatusEl = document.getElementById("claimStatus");

// Lost form
const lostFormEl = document.getElementById("lostForm");
const cancelLostBtn = document.getElementById("cancelLost");
const lostTitleEl = document.getElementById("lostTitle");
const lostLocationEl = document.getElementById("lostLocation");
const lostDateEl = document.getElementById("lostDate");
const lostNameEl = document.getElementById("lostName");
const lostContactEl = document.getElementById("lostContact");
const lostMessageEl = document.getElementById("lostMessage");

// Found form
const foundFormEl = document.getElementById("foundForm");
const cancelFoundBtn = document.getElementById("cancelFound");
const foundTitleEl = document.getElementById("foundTitle");
const foundNameEl = document.getElementById("foundName");
const foundContactEl = document.getElementById("foundContact");
const foundImageEl = document.getElementById("foundImage");

// Claim form 
const studentNameEl = document.getElementById("studentName");
const contactEl = document.getElementById("contact");
const messageEl = document.getElementById("message");

// ---------------------------
// 3. RENDERING FUNCTIONS
// ---------------------------

function renderItems() {
    if (!itemsListEl) return;
    itemsListEl.innerHTML = "";

    // Force a grid layout via JS so it's not a single column
    itemsListEl.style.display = "grid";
    itemsListEl.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
    itemsListEl.style.gap = "15px";

    const availableItems = items.filter(i => !i.claimed);

    if (availableItems.length === 0) {
        itemsListEl.innerHTML = `<p class="muted small">No items currently available.</p>`;
        return;
    }

    availableItems.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "item-card";
        wrapper.style.border = "1px solid #ddd";
        wrapper.style.padding = "10px";
        wrapper.style.borderRadius = "8px";
        wrapper.style.textAlign = "center";
        wrapper.style.background = "#fff";

        const img = document.createElement("img");
        img.src = item.image || "https://via.placeholder.com/150";
        img.style.width = "100%";
        img.style.height = "120px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "4px";

        const title = document.createElement("div");
        title.textContent = item.title;
        title.style.margin = "10px 0";
        title.style.fontWeight = "bold";

        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Claim";
        btn.style.width = "100%";
        btn.onclick = () => window.location.href = "claim.html";

        wrapper.appendChild(img);
        wrapper.appendChild(title);
        wrapper.appendChild(btn);
        itemsListEl.appendChild(wrapper);
    });

    populateItemSelect();
}

function populateItemSelect() {
    if (!itemSelectEl) return;
    itemSelectEl.innerHTML = "";
    items.forEach(item => {
        if (item.claimed) return;
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.title;
        itemSelectEl.appendChild(opt);
    });
}

function renderClaimStatus() {
    if (!claimStatusEl) return;
    if (claims.length === 0) {
        claimStatusEl.textContent = "No recent claims.";
        return;
    }
    const latest = claims[claims.length - 1];
    claimStatusEl.textContent = `${latest.name} submitted a claim for an item — status: ${latest.status || "pending"}.`;
}

// ---------------------------
// 4. HANDLERS
// ---------------------------

function handleFoundSubmit(event) {
    event.preventDefault();
    const title = foundTitleEl.value.trim();
    const file = foundImageEl?.files[0];

    const reader = new FileReader();
    reader.onloadend = function() {
        const newId = Date.now();
        items.push({
            id: newId,
            title: title,
            claimed: false,
            image: file ? reader.result : "https://via.placeholder.com/150"
        });
        saveState();
        window.location.href = "index.html";
    };

    if (file) { reader.readAsDataURL(file); } 
    else { reader.onloadend(); }
}

function handleClaimSubmit(event) {
    event.preventDefault();
    claims.push({
        name: studentNameEl.value,
        itemId: itemSelectEl.value,
        status: "pending"
    });
    saveState();
    window.location.href = "index.html";
}

function handleRefresh() {
    localStorage.clear();
    location.reload();
}

// ---------------------------
// 5. INIT
// ---------------------------

function init() {
    if (claimFormEl) claimFormEl.addEventListener("submit", handleClaimSubmit);
    if (foundFormEl) foundFormEl.addEventListener("submit", handleFoundSubmit);
    if (refreshBtn) refreshBtn.addEventListener("click", handleRefresh);
    
    renderItems();
    renderClaimStatus();
}

document.addEventListener("DOMContentLoaded", init);
