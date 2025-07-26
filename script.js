let editingIndex = null;
let interns = [];

function previewImage(event) {
  const preview = document.getElementById("preview");
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function openModal(id) {
  document.getElementById(`${id}-modal`).classList.remove("hidden");
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(`${id}-modal`).classList.add("hidden");
  document.body.style.overflow = 'auto';
  editingIndex = null;
  document.getElementById("addInternForm").reset();
  document.getElementById("preview").src = "https://api.dicebear.com/6.x/initials/svg?seed=New User";
}

function renderInternCard(intern, index) {
  const card = document.createElement("div");
  card.className = "glass-card rounded-2xl p-6 text-white animate-fade-in";

  card.innerHTML = `
    <div class="text-center">
      <img 
        src="${intern.image || `https://api.dicebear.com/6.x/initials/svg?seed=${intern.name}`}" 
        alt="${intern.name}" 
        class="profile-img w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      >
      <h3 class="text-xl font-bold mb-2">${intern.name}</h3>
      <p class="opacity-80 mb-4">${intern.university} | ${intern.batch}</p>
      
      <div class="flex justify-center gap-2 mb-4 flex-wrap">
        <span class="tag text-xs px-3 py-1 rounded-full">${intern.project}</span>
        <span class="tag text-xs px-3 py-1 rounded-full">${intern.duration}</span>
      </div>

      <div class="flex justify-center gap-4 mb-4">
        ${intern.linkedin ? `<a href="${intern.linkedin}" target="_blank" class="social-link text-blue-300 hover:text-blue-100">
          <i class="ri-linkedin-fill text-xl"></i>
        </a>` : ''}
        ${intern.github ? `<a href="${intern.github}" target="_blank" class="social-link text-purple-300 hover:text-purple-100">
          <i class="ri-github-fill text-xl"></i>
        </a>` : ''}
      </div>

      <div class="flex justify-center gap-2">
        <button onclick="editIntern(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors">
          <i class="ri-edit-line"></i> Edit
        </button>
        <button onclick="deleteIntern(${index})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition-colors">
          <i class="ri-delete-bin-line"></i> Delete
        </button>
      </div>
    </div>
  `;

  return card;
}

function editIntern(index) {
  const intern = interns[index];

  document.getElementById("name").value = intern.name;
  document.getElementById("university").value = intern.university;
  document.getElementById("batch").value = intern.batch;
  document.getElementById("duration").value = intern.duration;
  document.getElementById("project").value = intern.project;
  document.getElementById("linkedin").value = intern.linkedin || '';
  document.getElementById("github").value = intern.github || '';
  document.getElementById("preview").src = intern.image || `https://api.dicebear.com/6.x/initials/svg?seed=${intern.name}`;

  editingIndex = index;
  openModal("add-intern");
}

function deleteIntern(index) {
  if (confirm("Are you sure you want to delete this intern?")) {
    interns.splice(index, 1);
    renderAllInterns();
    updateStats();
  }
}

function renderAllInterns() {
  const grid = document.getElementById("internGrid");
  grid.innerHTML = "";
  
  interns.forEach((intern, index) => {
    const card = renderInternCard(intern, index);
    grid.appendChild(card);
  });
}

function updateStats() {
  document.getElementById("totalInterns").textContent = interns.length;
}

document.getElementById("addInternForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const intern = {
    name: document.getElementById("name").value,
    university: document.getElementById("university").value,
    batch: document.getElementById("batch").value,
    duration: document.getElementById("duration").value,
    project: document.getElementById("project").value,
    linkedin: document.getElementById("linkedin").value,
    github: document.getElementById("github").value,
    image: document.getElementById("preview").src,
  };

  if (editingIndex !== null) {
    interns[editingIndex] = intern;
  } else {
    interns.push(intern);
  }

  renderAllInterns();
  updateStats();
  closeModal("add-intern");
});

function exportToCSV() {
  if (interns.length === 0) {
    alert("No interns to export!");
    return;
  }

  const header = Object.keys(interns[0]);
  const rows = interns.map((intern) =>
    header
      .map((key) => `"${(intern[key] || "").replace(/"/g, '""')}"`)
      .join(",")
  );

  const csvContent = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "interns.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize
window.addEventListener("DOMContentLoaded", function() {
  renderAllInterns();
  updateStats();
});