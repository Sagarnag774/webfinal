const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const adoptionCards = document.getElementById('adoptionCards');
const careTipsCarousel = document.getElementById('careTipsCarousel');
const carouselNav = document.getElementById('carouselNav');
const successStories = document.getElementById('successStories');
const volunteerForm = document.getElementById('volunteer-form');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadAdoptionPets();
    loadCareTips();
    loadSuccessStories();
    initMap();
    initPawBot();
    createFloatingPaws();
    
    // Form submission
    volunteerForm.addEventListener('submit', handleFormSubmit);
});

// Load adoption pets from API
async function loadAdoptionPets() {
    try {
        const response = await fetch(`${API_BASE}/pets`);
        const pets = await response.json();
        
        adoptionCards.innerHTML = '';
        pets.forEach(pet => {
            const card = createPetCard(pet);
            adoptionCards.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading pets:', error);
        adoptionCards.innerHTML = '<p>Error loading pets. Please try again later.</p>';
    }
}


function createPetCard(pet) {
    const card = document.createElement('div');
    card.className = 'pet-card';
    card.innerHTML = `
        <div class="pet-image">${pet.emoji || '🐾'}</div>
        <div class="pet-info">
            <h3>${pet.name}</h3>
            <p><strong>${pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</strong> • ${pet.age}</p>
            <p>${pet.bio}</p>
            <button class="adopt-btn" data-pet-id="${pet._id}">Adopt Me</button>
        </div>
    `;
    
    card.querySelector('.adopt-btn').addEventListener('click', () => {
        handleAdoption(pet._id, pet.name);
    });
    
    return card;
}

async function handleAdoption(petId, petName) {
    const userName = prompt(`We're thrilled you want to adopt ${petName}! Please enter your name:`);
    if (userName) {
        try {
            const response = await fetch(`${API_BASE}/adoptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    petId,
                    userName,
                    petName
                })
            });
            
            if (response.ok) {
                alert(`Thank you, ${userName}! We'll contact you soon about adopting ${petName}.`);
            } else {
                alert('There was an error processing your adoption request. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your adoption request. Please try again.');
        }
    }
}

// Load care tips from API
async function loadCareTips() {
    try {
        const response = await fetch(`${API_BASE}/care-tips`);
        const tips = await response.json();
        
        careTipsCarousel.innerHTML = '';
        carouselNav.innerHTML = '';
        
        tips.forEach((tip, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
                <i class="${tip.icon}"></i>
                <h3>${tip.title}</h3>
                <p>${tip.content}</p>
            `;
            careTipsCarousel.appendChild(item);

            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            carouselNav.appendChild(dot);
            
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto-advance carousel
        let currentSlide = 0;
        setInterval(() => {
            currentSlide = (currentSlide + 1) % tips.length;
            showSlide(currentSlide);
        }, 5000);
        
    } catch (error) {
        console.error('Error loading care tips:', error);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    careTipsCarousel.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// Load success stories from API
async function loadSuccessStories() {
    try {
        const response = await fetch(`${API_BASE}/success-stories`);
        const stories = await response.json();
        
        successStories.innerHTML = '';
        stories.forEach(story => {
            const storyElement = document.createElement('div');
            storyElement.className = 'success-story';
            storyElement.innerHTML = `
                <div class="story-image">${story.emoji || '🐾'}</div>
                <p class="story-text">"${story.story}"</p>
                <p class="story-author">- ${story.name}</p>
            `;
            successStories.appendChild(storyElement);
        });
    } catch (error) {
        console.error('Error loading success stories:', error);
    }
}

// Initialize map
function initMap() {
    const mapContainer = document.getElementById('map');
    // Simple map implementation - in production, you'd use Google Maps API
    mapContainer.innerHTML = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;">
            <i class="fas fa-map-marker-alt" style="font-size:3rem;color:var(--warm-orange);"></i>
            <h3>Find Nearby Animal Shelters</h3>
            <p>Enter your location to find shelters near you</p>
            <div style="display:flex;gap:1rem;">
                <input type="text" id="locationInput" placeholder="Enter your city" style="padding:0.5rem;border-radius:5px;border:1px solid var(--soft-brown);">
                <button onclick="searchShelters()" style="background:var(--warm-orange);color:white;border:none;padding:0.5rem 1rem;border-radius:5px;cursor:pointer;">Search</button>
            </div>
            <div id="shelterResults" style="margin-top:1rem;"></div>
        </div>
    `;
}

function searchShelters() {
    const location = document.getElementById('locationInput').value;
    const results = document.getElementById('shelterResults');
    
    if (location) {
        results.innerHTML = `
            <div style="text-align:center;">
                <p>Searching for shelters in ${location}...</p>
                <p><small>(This is a demo. In a real application, this would show actual shelters from Google Maps API)</small></p>
            </div>
        `;
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        interest: document.getElementById('interest').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you for your message! We will contact you soon.');
            volunteerForm.reset();
        } else {
            alert('There was an error sending your message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
    }
}

// PawBot functionality
function initPawBot() {
    const pawBottle = document.getElementById('pawBottle');
    const pawbotChat = document.getElementById('pawbotChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');

    pawBottle.addEventListener('click', function() {
        pawbotChat.style.display = 'flex';
        
        // Speak greeting
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = "Woof! I'm PawBot, your pet care buddy! How can I help you today?";
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        }
    });

    // PawBot responses
    const pawbotResponses = {
        'hello': 'Woof! Hello there! How can I help you with your pet today?',
        'hi': 'Woof! Hello there! How can I help you with your pet today?',
        'food': 'Pets need a balanced diet with high-quality food. Always provide fresh water!',
        'exercise': 'Daily exercise is important for pets. Dogs need walks, cats need playtime!',
        'health': 'Regular vet check-ups and vaccinations keep your pet healthy and happy.',
        'grooming': 'Regular grooming helps maintain your pet\'s coat and overall hygiene.',
        'training': 'Positive reinforcement works best for training. Be patient and consistent!',
        'adopt': 'Adopting a pet is a wonderful decision! Visit our adoption center to find your new friend.',
        'thank': 'You\'re welcome! Woof woof!',
        'bye': 'Goodbye! Remember to give your pet extra cuddles today!'
    };

    function getPawbotResponse(message) {
        message = message.toLowerCase();
        
        for (const keyword in pawbotResponses) {
            if (message.includes(keyword)) {
                return pawbotResponses[keyword];
            }
        }
        
        return "I'm not sure about that. Try asking about pet food, exercise, health, grooming, training, or adoption!";
    }

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            setTimeout(() => {
                const response = getPawbotResponse(message);
                addMessage(response);
                
                // Speak response
                if ('speechSynthesis' in window) {
                    const speech = new SpeechSynthesisUtterance();
                    speech.text = response;
                    speech.volume = 1;
                    speech.rate = 1;
                    speech.pitch = 1;
                    window.speechSynthesis.speak(speech);
                }
            }, 1000);
        }
    });

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage.click();
        }
    });
}

// Create floating paw animations
function createFloatingPaws() {
    const container = document.getElementById('floatingPaws');
    for (let i = 0; i < 15; i++) {
        const paw = document.createElement('div');
        paw.className = 'paw-float';
        paw.innerHTML = '🐾';
        paw.style.left = `${Math.random() * 100}vw`;
        paw.style.animationDelay = `${Math.random() * 15}s`;
        container.appendChild(paw);
    }
}
// For Netlify deployment - use relative paths
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// ... rest of the client code remains the same, just update the fetch calls to use API_BASE