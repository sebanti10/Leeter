document.querySelector('.see').addEventListener('click', () => {
    try {
        console.log('Hello!');
        // Read it using the storage API
        chrome.storage.sync.get({
            'leetData': []
        }, data => {
            if (data.leetData.length !== 0) {
                const data = document.querySelector('.data');
                data.innerText = 'Okay';
            } else {
                const data = document.querySelector('.data');
                data.innerText = 'Not okay';
            }

        });
        // const data = document.querySelector('.data');
        // data.innerText = message;
    } catch (e) {
        console.log(e);
        const data = document.querySelector('.data');
        data.innerText = 'Not Okay';
    }

});


async function renderStorageData() {
    let leetDataPromise = new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            'leetData': []
        }, data => {
            resolve(data.leetData);
        });
    });

    const leetData = await leetDataPromise;
    return leetData;
}

// function display() {
//     fetchStorageData().then(leetData => {
//         for (let i = 0; i < leetData.length; i++) {
//             if (leetData[i].createdDate) {
//                 repeated = true;
//                 break;
//             }
//         }
//     });
// }









$(function () {
    'use strict'

    $('[data-toggle="offcanvas"]').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })
})