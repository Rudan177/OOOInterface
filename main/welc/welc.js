const messages = document.querySelectorAll('#message p');
let currentIndex = 0;

const urlParams = new URLSearchParams(window.location.search);
const isManualOpen = urlParams.get('manual') === 'true';

if (localStorage.getItem('hasVisited') === 'true' && !isManualOpen) {
    window.location.href = '../index.html';
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();

        if (currentIndex < messages.length) {
            messages[currentIndex].classList.add('visible');
            currentIndex++;
        } else {
            localStorage.setItem('hasVisited', 'true');
            window.location.href = '../index.html';
        }
    }
});
document.getElementById('version').textContent = VERSION;