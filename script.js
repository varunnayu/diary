document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const diaryContainer = document.getElementById('diary-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const diaryEntryInput = document.getElementById('diary-entry');
    const diaryEntriesContainer = document.getElementById('diary-entries');
    const imageUploadInput = document.getElementById('image-upload');
    const preview = document.getElementById('preview');
    const addImageBtn = document.getElementById('add-image-btn');
    const usernameDisplay = document.getElementById('username-display');

    let currentUser = null;

    // Load user data from localStorage
    function loadUserData() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            renderDiaryEntries();
            showDiaryContainer();
        } else {
            showLoginForm();
        }
    }

    // Save user data to localStorage
    function saveUserData(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Function to render diary entries
    function renderDiaryEntries() {
        const userEntries = JSON.parse(localStorage.getItem(currentUser.username)) || {entries: []};
        diaryEntriesContainer.innerHTML = '';
        userEntries.entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('diary-entry');
            entryDiv.innerHTML = `
                <p><strong>${entry.date}</strong></p>
                <p>${entry.text}</p>
                ${entry.image ? `<img src="${entry.image}" alt="Image">` : ''}
                <button class="delete-btn" data-id="${entry.id}">Delete</button>
                <button class="edit-btn" data-id="${entry.id}">Edit</button>
            `;
            diaryEntriesContainer.appendChild(entryDiv);
        });

        // Add event listeners to delete and edit buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteEntry);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editEntry);
        });
    }

    // Function to show login form and hide diary container
    function showLoginForm() {
        loginForm.style.display = 'block';
        diaryContainer.style.display = 'none';
    }

    // Function to show diary container and hide login form
    function showDiaryContainer() {
        loginForm.style.display = 'none';
        diaryContainer.style.display = 'block';
        usernameDisplay.textContent = currentUser.username;
    }

    // Function to login user
    function loginUser() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Define users and their passwords
        const users = {
            "varu": "varun123",
            "nayana": "nayana123"
        };

        // Check if the entered username exists and the password matches
        if (users.hasOwnProperty(username) && users[username] === password) {
            currentUser = { username: username };
            saveUserData(currentUser);
            loadUserData();
        } else {
            alert('Invalid username or password');
        }
    }

    // Function to logout user
    function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showLoginForm();
    }

    // Function to save diary entry
    function saveEntry() {
        const entryText = diaryEntryInput.value.trim();
        const entryImage = preview.querySelector('img');
        if (entryText !== '' || entryImage) {
            const userEntries = JSON.parse(localStorage.getItem(currentUser.username)) || {entries: []};
            const entry = {
                id: Date.now(),
                text: entryText,
                date: new Date().toLocaleString(),
                image: entryImage ? entryImage.src : null
            };
            userEntries.entries.push(entry);
            localStorage.setItem(currentUser.username, JSON.stringify(userEntries));
            renderDiaryEntries();
            diaryEntryInput.value = '';
            preview.innerHTML = '';
        } else {
            alert('Please write something or add an image before saving.');
        }
    }

    // Function to clear the diary entry input
    function clearEntry() {
        diaryEntryInput.value = '';
        preview.innerHTML = '';
        imageUploadInput.value = '';
    }

    // Function to delete diary entry
    function deleteEntry(event) {
        const entryId = parseInt(event.target.getAttribute('data-id'));
        const userEntries = JSON.parse(localStorage.getItem(currentUser.username)) || {entries: []};
        const updatedEntries = userEntries.entries.filter(entry => entry.id !== entryId);
        userEntries.entries = updatedEntries;
        localStorage.setItem(currentUser.username, JSON.stringify(userEntries));
        renderDiaryEntries();
    }

    // Function to edit diary entry
    function editEntry(event) {
        const entryId = parseInt(event.target.getAttribute('data-id'));
        const userEntries = JSON.parse(localStorage.getItem(currentUser.username)) || {entries: []};
        const entryToEdit = userEntries.entries.find(entry => entry.id === entryId);
        if (entryToEdit) {
            diaryEntryInput.value = entryToEdit.text;
            if (entryToEdit.image) {
                const img = document.createElement('img');
                img.src = entryToEdit.image;
                preview.appendChild(img);
            }
            deleteEntry(event);
        }
    }

    // Event listeners
    document.getElementById('login-btn').addEventListener('click', loginUser);
    logoutBtn.addEventListener('click', logoutUser);
    saveBtn.addEventListener('click', saveEntry);
    clearBtn.addEventListener('click', clearEntry);

    // Image upload handling
    addImageBtn.addEventListener('click', function() {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.innerHTML = '';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // Load user data on page load
    loadUserData();
});
