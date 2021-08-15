chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProblemDetails') {
        const problemTitle = document.querySelector('.css-v3d350').innerText;
        const difficultyLevel = document.querySelector('.css-14oi08n') || document.querySelector('.css-dcmtd5') || document.querySelector('.css-t42afm');
        const difficulty = difficultyLevel.innerText;
        // console.log(difficultyLevel, difficulty);
        const tags = Array.from(document.querySelectorAll('.tag__24Rd')).map(tag => tag.innerText);

        sendResponse({
            problemTitle,
            difficulty,
            tags
        });
    }
});