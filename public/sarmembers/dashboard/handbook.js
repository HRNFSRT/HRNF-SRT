// Firebase Configuration (Replace with your credentials)
const firebaseConfig = {
    apiKey: "AIzaSyCCz1kIH5hT_15pWT9rf5JqJhexK76qpRE",
    authDomain: "hrnf-srt.firebaseapp.com",
    projectId: "hrnf-srt",
    storageBucket: "hrnf-srt.appspot.com",
    messagingSenderId: "748926279394",
    appId: "1:748926279394:web:1303b9000361b1d51808bb",
    measurementId: "G-5PCZE3S5N5"
};

// Ensure to include the following imports at the top of your handbook.js file
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

// Load PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js"; // Update to use CDN

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
        const pdfRef = storage.ref('gs://hrnf-srt.appspot.com/HRNF S&R Handbook V2 (1).pdf'); // Path to your PDF in Firebase Storage
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
