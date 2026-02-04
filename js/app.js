// ---------------------------
// 1. DATA & FORCED RESET
// ---------------------------
if (!localStorage.getItem("hasUpdatedImagesV4")) {
    localStorage.clear();
    localStorage.setItem("hasUpdatedImagesV4", "true");
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
// 2. USER RENDERING (Home/Claim)
// ---------------------------
function renderItems() {
    const itemsListEl = document.getElementById("itemsList");
    if (!itemsListEl) return;

    itemsListEl.innerHTML = "";
    itemsListEl.style.display = "grid";
    itemsListEl.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
    itemsListEl.style.gap = "20px";

    items.filter(i => !i.claimed).forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "card";
        wrapper.style.textAlign = "center";
        wrapper.innerHTML = `
            <img src="${item.image}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
            <div style="margin:10px 0;"><strong>${item.title}</strong></div>
            <button class="btn" onclick="location.href='claim.html'">Claim This</button>
        `;
        itemsListEl.appendChild(wrapper);
    });
}

function populateItemSelect() {
    const itemSelectEl = document.getElementById("itemSelect");
    if (!itemSelectEl) return;
    itemSelectEl.innerHTML = '<option value="" disabled selected>Select an item...</option>';
    items.filter(i => !i.claimed).forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.title;
        itemSelectEl.appendChild(opt);
    });
}

// ---------------------------
// 3. ADMIN RENDERING
// ---------------------------
function renderAdminDashboard() {
    const pendingClaimsEl = document.getElementById("pendingClaims");
    const adminItemsEl = document.getElementById("adminItems");
    if (!pendingClaimsEl || !adminItemsEl) return;

    // Render Claims
    pendingClaimsEl.innerHTML = "<h3>Pending Claims</h3>";
    const pending = claims.filter(c => c.status === "pending");
    
    if (pending.length === 0) {
        pendingClaimsEl.innerHTML += "<p class='muted small'>No pending claims.</p>";
    } else {
        pending.forEach((c, index) => {
            const item = items.find(i => i.id == c.itemId);
            const div = document.createElement("div");
            div.className = "item";
            div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";
            div.innerHTML = `
                <strong>${c.name}</strong> wants <strong>${item ? item.title : 'Unknown Item'}</strong>
                <div class="muted small">Contact: ${c.contact || 'N/A'}</div>
                <button class="btn" onclick="approveClaim(${index})">Approve</button>
                <button class="btn gray" onclick="rejectClaim(${index})">Reject</button>
            `;
            pendingClaimsEl.appendChild(div);
        });
    }

    // Render All Items
    adminItemsEl.innerHTML = "<h3>Inventory Management</h3>";
    items.forEach(item => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.gap = "10px";
        div.style.marginBottom = "5px";
        div.innerHTML = `
            <img src="${item.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
            <span>${item.title} - <strong>${item.claimed ? 'Claimed' : 'Available'}</strong></span>
        `;
        adminItemsEl.appendChild(div);
    });
}

// ---------------------------
// 4. ACTION HANDLERS
// ---------------------------
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (user === "Admin" && pass === "12345678") {
        document.getElementById("login").style.display = "none";
        document.getElementById("admin").style.display = "block";
        renderAdminDashboard();
    } else {
        alert("Incorrect credentials!");
    }
}

function approveClaim(index) {
    const claim = claims[index];
    const item = items.find(i => i.id == claim.itemId);
    if (item) item.claimed = true;
    claim.status = "approved";
    saveState();
    renderAdminDashboard();
}

function rejectClaim(index) {
    claims[index].status = "rejected";
    saveState();
    renderAdminDashboard();
}

function handleClaimSubmit(event) {
    event.preventDefault();
    const selectedId = document.getElementById("itemSelect").value;
    if(!selectedId) return alert("Select an item!");

    claims.push({
        name: document.getElementById("studentName").value,
        contact: document.getElementById("contact").value,
        itemId: selectedId,
        status: "pending"
    });

    saveState();
    document.getElementById("claimForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    setTimeout(() => location.href = "index.html", 2000);
}

// ---------------------------
// 5. INIT
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderItems();
    populateItemSelect();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const claimForm = document.getElementById("claimForm");
    if (claimForm) claimForm.addEventListener("submit", handleClaimSubmit);
});
