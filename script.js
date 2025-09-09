/* ===== PART 2: JAVASCRIPT FUNCTIONS - SCOPE, PARAMETERS & RETURN VALUES ===== */

// Global variables (demonstrating global scope)
let animationCount = 0;
const maxAnimations = 5;

// Function with parameters and return value - calculates animation delay
function calculateDelay(baseDelay, multiplier = 1) {
    const delay = baseDelay * multiplier;
    console.log(`Calculated delay: ${delay}ms`);
    return delay;
}

// Function demonstrating local scope and return values
function generateRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    
    // Local variable (local scope)
    const selectedColor = colors[randomIndex];
    
    return {
        color: selectedColor,
        index: randomIndex,
        timestamp: new Date().toLocaleTimeString()
    };
}

// Function with multiple parameters demonstrating scope awareness
function updateResults(message, type = 'info') {
    const resultsDiv = document.getElementById('results');
    
    // Local variables
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    // Access global variable
    animationCount++;
    
    resultsDiv.innerHTML += `<div>${formattedMessage}</div>`;
    resultsDiv.innerHTML += `<div>Total animations: ${animationCount}</div><br>`;
    
    return formattedMessage;
}

// Function that returns a function (closure demonstration)
function createAnimationHandler(elementId, animationClass) {
    // Variables in closure scope
    let isAnimating = false;
    
    return function() {
        if (isAnimating) return false;
        
        const element = document.getElementById(elementId);
        isAnimating = true;
        
        element.classList.add(animationClass);
        
        // Remove class after animation completes
        setTimeout(() => {
            element.classList.remove(animationClass);
            isAnimating = false;
        }, calculateDelay(500, 1));
        
        return true;
    };
}

/* ===== PART 3: COMBINING CSS ANIMATIONS WITH JAVASCRIPT ===== */

// DOM Elements
const animateBoxBtn = document.getElementById('animateBox');
const flipCardBtn = document.getElementById('flipCard');
const showModalBtn = document.getElementById('showModal');
const startLoaderBtn = document.getElementById('startLoader');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');
const loader = document.getElementById('loader');

// Create animation handlers using closure function
const boxAnimationHandler = createAnimationHandler('animatedBox', 'animate');

// Event Listeners with function calls

// 1. Animate Box - demonstrates parameter passing and return values
animateBoxBtn.addEventListener('click', function() {
    const success = boxAnimationHandler();
    const colorData = generateRandomColor();
    
    if (success) {
        const box = document.getElementById('animatedBox');
        box.style.background = colorData.color;
        
        updateResults(`Box animated with color ${colorData.color}`, 'animation');
    } else {
        updateResults('Animation already in progress', 'warning');
    }
});

// 2. Flip Card - demonstrates CSS class manipulation
let isCardFlipped = false;
flipCardBtn.addEventListener('click', function() {
    const card = document.getElementById('flipCardContainer').querySelector('.card');
    
    if (isCardFlipped) {
        card.classList.remove('flipped');
        updateResults('Card flipped to front', 'flip');
    } else {
        card.classList.add('flipped');
        updateResults('Card flipped to back', 'flip');
    }
    
    isCardFlipped = !isCardFlipped;
});

// 3. Modal Functions - demonstrates function composition
function showModal() {
    modal.style.display = 'flex';
    // Trigger animation after display is set
    setTimeout(() => {
        modal.classList.add('show');
        updateResults('Modal opened with slide animation', 'modal');
    }, 10);
}

function hideModal() {
    modal.classList.remove('show');
    
    // Hide modal after animation completes
    setTimeout(() => {
        modal.style.display = 'none';
        updateResults('Modal closed', 'modal');
    }, calculateDelay(300, 1));
}

showModalBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        hideModal();
    }
});

// 4. Loader Toggle - demonstrates state management with functions
let isLoaderActive = false;

function toggleLoader() {
    const loader = document.getElementById('loader');
    
    if (isLoaderActive) {
        loader.classList.add('hidden');
        startLoaderBtn.textContent = 'Start Loader';
        updateResults('Loader stopped', 'loader');
    } else {
        loader.classList.remove('hidden');
        startLoaderBtn.textContent = 'Stop Loader';
        updateResults('Loader started', 'loader');
    }
    
    isLoaderActive = !isLoaderActive;
    return isLoaderActive;
}

startLoaderBtn.addEventListener('click', toggleLoader);

// 5. Advanced function - demonstrates multiple concepts
function initializeInteractiveElements() {
    // Local scope variables
    const elements = document.querySelectorAll('.animated-box, .card, .modal-content');
    let initCount = 0;
    
    elements.forEach((element, index) => {
        // Add hover effects dynamically
        element.addEventListener('mouseenter', function() {
            const colorData = generateRandomColor();
            this.style.boxShadow = `0 5px 15px ${colorData.color}`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
        
        initCount++;
    });
    
    updateResults(`Initialized ${initCount} interactive elements`, 'init');
    return initCount;
}

// 6. Function demonstrating scope chain and parameter defaults
function createCountdownTimer(duration = 5, callback = null) {
    let timeLeft = duration;
    
    const timer = setInterval(() => {
        updateResults(`Countdown: ${timeLeft} seconds`, 'timer');
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            updateResults('Countdown finished!', 'timer');
            
            // Execute callback if provided
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    }, 1000);
    
    return timer;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive elements
    const elementCount = initializeInteractiveElements();
    
    // Start a demo countdown
    setTimeout(() => {
        createCountdownTimer(3, () => {
            updateResults('Demo initialization complete!', 'success');
        });
    }, 1000);
    
    // Display initial function results
    updateResults('JavaScript functions loaded successfully', 'init');
    updateResults(`Global animation limit set to: ${maxAnimations}`, 'config');
});
