// ---------------------------
// 1. DATA & FORCED RESET
// ---------------------------

// This wipes old data once to ensure images and new structures work
if (!localStorage.getItem("hasUpdatedImagesV2")) {
    localStorage.clear();
    localStorage.setItem("hasUpdatedImagesV2", "true");
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
const claimStatusEl = document.getElementById("claimStatus");
const studentNameEl = document.getElementById("studentName");
const contactEl = document.getElementById("contact");
const messageEl = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");

// Found form references
const foundFormEl = document.getElementById("foundForm");
const foundTitleEl = document.getElementById("foundTitle");
const foundImageEl = document.getElementById("foundImage");

// ---------------------------
// 3. RENDERING FUNCTIONS
// ---------------------------

function renderItems() {
    if (!itemsListEl) return;
    itemsListEl.innerHTML = "";

    // Force grid layout
    itemsListEl.style.display = "grid";
    itemsListEl.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
    itemsListEl.style.gap = "20px";

    const availableItems = items.filter(i => i.claimed === false);

    availableItems.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "card";
        wrapper.style.textAlign = "center";

        const img = document.createElement("img");
        img.src = item.image || "https://via.placeholder.com/150";
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
    if (!itemSelectEl) return;
    
    // Clear existing options
    itemSelectEl.innerHTML = '<option value="" disabled selected>Select an item...</option>';
    
    const availableItems = items.filter(i => i.claimed === false);
    
    if (availableItems.length === 0) {
        const opt = document.createElement("option");
        opt.textContent = "No items available";
        opt.disabled = true;
        itemSelectEl.appendChild(opt);
        return;
    }

    availableItems.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.title;
        itemSelectEl.appendChild(opt);
    });
}

// ---------------------------
// 4. EVENT HANDLERS
// ---------------------------

function handleClaimSubmit(event) {
    event.preventDefault();
    
    const selectedId = itemSelectEl.value;
    const name = studentNameEl.value;
    
    if(!selectedId) {
        alert("Please select an item!");
        return;
    }

    // Mark item as claimed
    const itemIndex = items.findIndex(i => i.id == selectedId);
    if(itemIndex !== -1) items[itemIndex].claimed = true;

    claims.push({
        name: name,
        itemId: selectedId,
        status: "pending",
        date: new Date().toLocaleDateString()
    });

    saveState();
    
    document.getElementById("claimForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    
    setTimeout(() => { window.location.href = "index.html"; }, 2000);
}

// ---------------------------
// 5. INIT
// ---------------------------

function init() {
    renderItems();
    populateItemSelect();

    if (claimFormEl) claimFormEl.addEventListener("submit", handleClaimSubmit);
    if (cancelClaimBtn) cancelClaimBtn.addEventListener("click", () => window.location.href = "index.html");
    if (refreshBtn) refreshBtn.addEventListener("click", () => { localStorage.clear(); location.reload(); });
}

document.addEventListener("DOMContentLoaded", init);
