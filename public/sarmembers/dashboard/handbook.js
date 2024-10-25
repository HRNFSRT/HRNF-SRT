// Firebase Configuration (Replace with your credentials)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Load PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/libs/pdfjs/pdf.worker.js';

// Handbook Sections (Sample JSON for demonstration)
const handbookSections = [
    {
        title: "Chapter 1: Introduction",
        subtopics: ["Mission", "Overview", "History"]
    },
    {
        title: "Chapter 2: Safety Procedures",
        subtopics: ["General Safety", "Equipment Safety", "Emergency Protocols"]
    },
    {
        title: "Chapter 3: Equipment Handling",
        subtopics: ["Rope Systems", "Medical Gear", "Navigation Tools"]
    }
];

// Load PDF from Firebase and render with PDF.js
async function loadPDF() {
    try {
        const pdfRef = storage.ref('handbooks/your-handbook.pdf'); // Path to your PDF in Firebase Storage
        const url = await pdfRef.getDownloadURL();
        renderPDF(url);
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}

// Render the PDF using PDF.js
async function renderPDF(url) {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;

    // Render the first page of the PDF
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };
    await page.render(renderContext);
}

// Function to build the sidebar dynamically
function buildSidebar() {
    const sidebarList = document.getElementById('sidebarList');
    handbookSections.forEach((section) => {
        // Create main section item
        const sectionItem = document.createElement('li');
        sectionItem.textContent = section.title;
        sectionItem.classList.add('section-item');

        // Create subtopics dropdown
        const subtopicList = document.createElement('ul');
        subtopicList.style.display = 'none';
        section.subtopics.forEach((subtopic) => {
            const subtopicItem = document.createElement('li');
            subtopicItem.textContent = subtopic;
            subtopicItem.classList.add('subtopic-item');
            subtopicItem.onclick = () => scrollToSection(subtopic);
            subtopicList.appendChild(subtopicItem);
        });

        sectionItem.onclick = () => {
            // Toggle dropdown visibility
            subtopicList.style.display = (subtopicList.style.display === 'none') ? 'block' : 'none';
        };
        sectionItem.appendChild(subtopicList);
        sidebarList.appendChild(sectionItem);
    });
}

// Placeholder Function to Scroll to Sections (to be implemented)
function scrollToSection(subtopic) {
    console.log(`Scroll to: ${subtopic}`);
    // Implement scrolling to the specified section here
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    loadPDF();
});
