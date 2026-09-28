const API = "http://localhost:8080";
const USER_ID = 1;

let allReports = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", function () {
    const lostForm = document.getElementById("lostForm");
    const foundForm = document.getElementById("foundForm");

    if (lostForm) {
        lostForm.addEventListener("submit", submitLostPet);
    }

    if (foundForm) {
        foundForm.addEventListener("submit", submitFoundAnimal);
    }

    loadReports();
});

async function loadReports() {
    try {
        const lostResponse = await fetch(`${API}/lost-pets`);
        const foundResponse = await fetch(`${API}/found-animals`);

        if (!lostResponse.ok) {
            throw new Error("Failed to load lost pet reports");
        }

        if (!foundResponse.ok) {
            throw new Error("Failed to load found animal reports");
        }

        const lostReports = await lostResponse.json();
        const foundReports = await foundResponse.json();

        allReports = [
            ...lostReports.map(report => ({ ...report, reportType: "lost" })),
            ...foundReports.map(report => ({ ...report, reportType: "found" }))
        ];

        updateCounts();
        displayReports();
        populateLostPetDropdown();

    } catch (error) {
        console.error("LOAD ERROR:", error);

        const container = document.getElementById("reportsContainer");

        if (container) {
            container.innerHTML = `<p class="loading">Unable to load reports.</p>`;
        }
    }
}

function displayReports() {
    const container = document.getElementById("reportsContainer");

    if (!container) {
        return;
    }

    let reports = [...allReports];

    if (currentFilter === "lost") {
        reports = reports.filter(report => report.reportType === "lost");
    }

    if (currentFilter === "found") {
        reports = reports.filter(report => report.reportType === "found");
    }

    const localityInput = document.getElementById("locality");

    if (localityInput && localityInput.value.trim() !== "") {
        const searchText = localityInput.value.trim().toLowerCase();

        reports = reports.filter(report =>
            report.locality &&
            report.locality.toLowerCase().includes(searchText)
        );
    }

    if (reports.length === 0) {
        container.innerHTML = `<p class="loading">No reports found.</p>`;
        return;
    }

    container.innerHTML = reports.map(report => {
        const isLost = report.reportType === "lost";
        const location = isLost ? report.lastSeenLocation : report.foundLocation;

        return `
            <div class="card ${report.reportType}">
                <p class="eyebrow">${isLost ? "LOST PET" : "FOUND ANIMAL"}</p>
                <h3>${escapeHtml(report.breed)}</h3>
                <p><strong>Species:</strong> ${escapeHtml(report.species)}</p>
                <p><strong>Color:</strong> ${escapeHtml(report.color)}</p>
                <p><strong>Locality:</strong> ${escapeHtml(report.locality)}</p>
                <p><strong>${isLost ? "Last Seen" : "Found Location"}:</strong> ${escapeHtml(location)}</p>
                <p><strong>Status:</strong> ${escapeHtml(report.status)}</p>

                <div class="card-actions">
                    <button type="button" onclick="viewReport('${report.reportType}', ${report.id})">View</button>

                    ${isLost && report.status === "ACTIVE" ? `
                        <button type="button" onclick="findMatchesForReport(${report.id})">Matches</button>
                    ` : ""}

                    ${report.status === "ACTIVE" ? `
                        <button type="button" onclick="resolveReport('${report.reportType}', ${report.id})">Resolve</button>
                        <button type="button" onclick="deleteReport('${report.reportType}', ${report.id})">Delete</button>
                    ` : ""}
                </div>
            </div>
        `;
    }).join("");
}

function filterReports(filter, button) {
    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    displayReports();
}

function searchReports() {
    displayReports();
}

async function submitLostPet(event) {
    event.preventDefault();

    const data = {
        species: document.getElementById("lostSpecies").value.trim(),
        breed: document.getElementById("lostBreed").value.trim(),
        color: document.getElementById("lostColor").value.trim(),
        locality: document.getElementById("lostLocality").value.trim(),
        lastSeenLocation: document.getElementById("lastSeenLocation").value.trim(),
        user: { id: USER_ID }
    };

    try {
        const response = await fetch(`${API}/lost-pets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(result));
        }

        document.getElementById("lostForm").reset();
        document.getElementById("lostMessage").textContent =
            "Lost pet report submitted successfully.";

        await loadReports();

    } catch (error) {
        console.error("LOST PET ERROR:", error);
        document.getElementById("lostMessage").textContent = error.message;
    }
}

async function submitFoundAnimal(event) {
    event.preventDefault();

    const data = {
        species: document.getElementById("foundSpecies").value.trim(),
        breed: document.getElementById("foundBreed").value.trim(),
        color: document.getElementById("foundColor").value.trim(),
        locality: document.getElementById("foundLocality").value.trim(),
        foundLocation: document.getElementById("foundLocation").value.trim(),
        user: { id: USER_ID }
    };

    console.log("Sending found animal:", data);

    try {
        const response = await fetch(`${API}/found-animals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await readResponse(response);

        console.log("Found animal response:", result);

        if (!response.ok) {
            throw new Error(getErrorMessage(result));
        }

        document.getElementById("foundForm").reset();
        document.getElementById("foundMessage").textContent =
            "Found animal report submitted successfully.";

        await loadReports();

    } catch (error) {
        console.error("FOUND ANIMAL ERROR:", error);
        document.getElementById("foundMessage").textContent = error.message;
    }
}

function populateLostPetDropdown() {
    const select = document.getElementById("lostPetSelect");

    if (!select) {
        return;
    }

    const activeLostPets = allReports.filter(report =>
        report.reportType === "lost" && report.status === "ACTIVE"
    );

    select.innerHTML = `<option value="">Select a lost pet</option>`;

    activeLostPets.forEach(report => {
        const option = document.createElement("option");

        option.value = report.id;
        option.textContent =
            `${report.species} - ${report.breed} - ${report.color} - ${report.locality}`;

        select.appendChild(option);
    });
}

async function findMatches() {
    const select = document.getElementById("lostPetSelect");

    if (!select || !select.value) {
        alert("Please select a lost pet.");
        return;
    }

    await getMatches(select.value);
}

async function findMatchesForReport(lostPetId) {
    const select = document.getElementById("lostPetSelect");

    if (select) {
        select.value = String(lostPetId);
    }

    await getMatches(lostPetId);

    const matchesSection = document.getElementById("matches");

    if (matchesSection) {
        matchesSection.scrollIntoView({ behavior: "smooth" });
    }
}

async function getMatches(lostPetId) {
    const container = document.getElementById("matchesContainer");

    if (!container) {
        return;
    }

    container.innerHTML = `<p class="loading">Finding possible matches...</p>`;

    try {
        const response = await fetch(`${API}/matches/${lostPetId}`);
        const result = await readResponse(response);

        console.log("MATCH RESPONSE:", result);

        if (!response.ok) {
            throw new Error(getErrorMessage(result));
        }

        displayMatches(result);

    } catch (error) {
        console.error("MATCH ERROR:", error);
        container.innerHTML = `<p class="loading">${escapeHtml(error.message)}</p>`;
    }
}

function displayMatches(matches) {
    const container = document.getElementById("matchesContainer");

    if (!container) {
        return;
    }

    if (!Array.isArray(matches) || matches.length === 0) {
        container.innerHTML = `<p class="loading">No possible matches found.</p>`;
        return;
    }

    container.innerHTML = matches.map(report => `
        <div class="card found">
            <p class="eyebrow">MATCH FOUND</p>
            <h3>${escapeHtml(report.breed)}</h3>
            <p><strong>Species:</strong> ${escapeHtml(report.species)}</p>
            <p><strong>Color:</strong> ${escapeHtml(report.color)}</p>
            <p><strong>Locality:</strong> ${escapeHtml(report.locality)}</p>
            <p><strong>Found Location:</strong> ${escapeHtml(report.foundLocation)}</p>
            <p><strong>Status:</strong> ${escapeHtml(report.status)}</p>

            <div class="card-actions">
                <button type="button" onclick="viewReport('found', ${report.id})">View</button>
            </div>
        </div>
    `).join("");
}

async function viewReport(type, id) {
    try {
        const endpoint = type === "lost"
            ? `${API}/lost-pets/${id}`
            : `${API}/found-animals/${id}`;

        const response = await fetch(endpoint);
        const report = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(report));
        }

        const location = type === "lost"
            ? report.lastSeenLocation
            : report.foundLocation;

        const modal = document.getElementById("modal");
        const content = document.getElementById("modalContent");

        content.innerHTML = `
            <p class="eyebrow">${type === "lost" ? "LOST PET" : "FOUND ANIMAL"}</p>
            <h2>${escapeHtml(report.breed)}</h2>
            <p><strong>Species:</strong> ${escapeHtml(report.species)}</p>
            <p><strong>Breed:</strong> ${escapeHtml(report.breed)}</p>
            <p><strong>Color:</strong> ${escapeHtml(report.color)}</p>
            <p><strong>Locality:</strong> ${escapeHtml(report.locality)}</p>
            <p><strong>Location:</strong> ${escapeHtml(location)}</p>
            <p><strong>Status:</strong> ${escapeHtml(report.status)}</p>
            <p><strong>Reported:</strong> ${formatDate(report.reportedDate)}</p>
        `;

        modal.classList.remove("hidden");

    } catch (error) {
        console.error("VIEW ERROR:", error);
        alert(error.message);
    }
}

function closeModal() {
    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

async function resolveReport(type, id) {
    if (!confirm("Mark this report as resolved?")) {
        return;
    }

    const endpoint = type === "lost"
        ? `${API}/lost-pets/${id}/resolve`
        : `${API}/found-animals/${id}/resolve`;

    try {
        const response = await fetch(endpoint, { method: "PUT" });
        const result = await readResponse(response);

        console.log("RESOLVE RESPONSE:", result);

        if (!response.ok) {
            throw new Error(getErrorMessage(result));
        }

        alert(
            type === "lost"
                ? "Lost pet report resolved successfully."
                : "Found animal report resolved successfully."
        );

        await loadReports();

    } catch (error) {
        console.error("RESOLVE ERROR:", error);
        alert(error.message);
    }
}

async function deleteReport(type, id) {
    if (!confirm("Are you sure you want to delete this report?")) {
        return;
    }

    const endpoint = type === "lost"
        ? `${API}/lost-pets/${id}`
        : `${API}/found-animals/${id}`;

    console.log("DELETE:", endpoint);

    try {
        const response = await fetch(endpoint, { method: "DELETE" });
        const result = await readResponse(response);

        console.log("DELETE RESPONSE:", result);

        if (!response.ok) {
            throw new Error(getErrorMessage(result));
        }

        alert(typeof result === "string" ? result : "Report deleted successfully.");

        await loadReports();

    } catch (error) {
        console.error("DELETE ERROR:", error);
        alert(error.message);
    }
}

function updateCounts() {
    const lostCount = allReports.filter(report =>
        report.reportType === "lost" && report.status === "ACTIVE"
    ).length;

    const foundCount = allReports.filter(report =>
        report.reportType === "found" && report.status === "ACTIVE"
    ).length;

    const lostElement = document.getElementById("lostCount");
    const foundElement = document.getElementById("foundCount");

    if (lostElement) {
        lostElement.textContent = lostCount;
    }

    if (foundElement) {
        foundElement.textContent = foundCount;
    }
}

function goTo(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
        return;
    }

    section.scrollIntoView({ behavior: "smooth" });
}

async function readResponse(response) {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(result) {
    if (typeof result === "string") {
        return result;
    }

    if (result && result.error) {
        return result.error;
    }

    if (result && typeof result === "object") {
        const values = Object.values(result);

        if (values.length > 0) {
            return values.join("\n");
        }
    }

    return "Something went wrong.";
}

function formatDate(date) {
    if (!date) {
        return "Not available";
    }

    return new Date(date).toLocaleString();
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}