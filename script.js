// DOM Elements
const stepsCheckboxes = document.querySelectorAll('.step-checkbox');
const stepElements = document.querySelectorAll('.step');
const progressCount = document.getElementById('progress-count');
const progressFill = document.getElementById('progress-fill');
const completionMessage = document.getElementById('completion-message');

// Track completed steps
let completedSteps = 0;
const totalSteps = 10;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved progress from localStorage
    loadProgress();
    
    // Add event listeners to checkboxes
    stepsCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            handleStepCompletion(index, checkbox.checked);
        });
    });

    // Add click handler to step cards
    stepElements.forEach((step, index) => {
        step.addEventListener('click', () => {
            const checkbox = step.querySelector('.step-checkbox');
            checkbox.checked = !checkbox.checked;
            handleStepCompletion(index, checkbox.checked);
        });
    });
});

// Handle step completion
function handleStepCompletion(stepIndex, isCompleted) {
    const step = stepElements[stepIndex];
    const checkbox = stepsCheckboxes[stepIndex];

    if (isCompleted) {
        step.classList.add('completed');
        completedSteps++;
        playCompletionSound();
        createParticles(stepIndex);
    } else {
        step.classList.remove('completed');
        completedSteps--;
    }

    // Update UI
    updateProgress();
    
    // Save progress
    saveProgress();

    // Check if all steps are completed
    if (completedSteps === totalSteps) {
        setTimeout(showCompletionMessage, 500);
    }
}

// Update progress bar and counter
function updateProgress() {
    const progressPercentage = (completedSteps / totalSteps) * 100;
    progressFill.style.width = progressPercentage + '%';
    progressCount.textContent = completedSteps;

    // Intensify diya flame based on progress
    const flame = document.querySelector('.flame');
    const glow = document.querySelector('.glow');
    
    if (progressPercentage > 0) {
        flame.style.opacity = 0.5 + (progressPercentage / 100) * 0.5;
        flame.style.height = (50 + (progressPercentage / 100) * 20) + 'px';
        glow.style.boxShadow = `0 0 ${20 + (progressPercentage / 100) * 40}px rgba(255, 215, 0, ${0.3 + (progressPercentage / 100) * 0.7})`;
    }
}

// Show completion message
function showCompletionMessage() {
    completionMessage.style.display = 'flex';
    playVictorySound();
    createConfetti();
}

// Reset all steps
function resetSteps() {
    completedSteps = 0;
    stepsCheckboxes.forEach(checkbox => checkbox.checked = false);
    stepElements.forEach(step => step.classList.remove('completed'));
    updateProgress();
    completionMessage.style.display = 'none';
    localStorage.removeItem('diwaliProgress');
}

// Save progress to localStorage
function saveProgress() {
    const progress = [];
    stepsCheckboxes.forEach(checkbox => {
        progress.push(checkbox.checked);
    });
    localStorage.setItem('diwaliProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('diwaliProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        progress.forEach((isCompleted, index) => {
            if (isCompleted) {
                stepsCheckboxes[index].checked = true;
                stepElements[index].classList.add('completed');
                completedSteps++;
            }
        });
        updateProgress();
    }
}

// Create particle effects
function createParticles(stepIndex) {
    const step = stepElements[stepIndex];
    const rect = step.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = `hsl(${Math.random() * 60 + 30}, 100%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';

        document.body.appendChild(particle);

        // Animate particle
        const angle = (Math.PI * 2 * i) / 5;
        const velocity = 5 + Math.random() * 5;
        let x = rect.left + rect.width / 2;
        let y = rect.top;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity - 3;

        const animate = () => {
            x += vx;
            y += vy;
            vy += 0.2; // gravity

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = 1 - (y - rect.top) / 200;

            if (y - rect.top < 200) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

// Create confetti effect
function createConfetti() {
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = `hsl(${Math.random() * 60 + 30}, 100%, ${50 + Math.random() * 50}%)`;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1001';
        confetti.style.opacity = 1;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        let y = -10;
        let x = parseFloat(confetti.style.left);
        const vx = (Math.random() - 0.5) * 8;
        const gravity = 2;

        const animate = () => {
            y += gravity;
            x += vx;

            confetti.style.top = y + 'px';
            confetti.style.left = x + 'px';
            confetti.style.opacity = 1 - y / window.innerHeight;

            if (y < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        animate();
    }
}

// Play completion sound effect (using Web Audio API)
function playCompletionSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio context not supported
    }
}

// Play victory sound
function playVictorySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 100);
        });
    } catch (e) {
        // Audio context not supported
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetSteps();
    }
});