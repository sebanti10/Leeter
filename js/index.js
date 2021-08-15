let console = chrome.extension.getBackgroundPage().console;
const problem = {};

// returns the current date in format: 'Mon dd, yyyy'
const currentDate = () => {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// generate problem object with releavnt data
const trackData = (response, tabURL) => {
    const [probNo, probTitle] = response.problemTitle.split('.');

    const problemNo = document.querySelector('.problem-no');
    problemNo.innerText = 'Problem No.: ' + probNo;

    const problemTitle = document.querySelector('.problem-title');
    problemTitle.innerText = 'Problem Title: ' + probTitle;

    const difficulty = document.querySelector('.difficulty');
    difficulty.innerText = 'Difficulty: ' + response.difficulty;

    const tagList = document.querySelector('.tags');
    if (tagList.children.length === 0) {
        response.tags.forEach(tag => {
            const tagItem = document.createElement('li');
            const tagDetails = document.createTextNode(tag);

            tagItem.appendChild(tagDetails);
            tagList.appendChild(tagItem);
        });
    }

    // const tab = document.querySelector('.tab-url');
    // tab.innerText = tabURL;

    // const createdDate = document.querySelector('.created-date');
    // createdDate.innerText = currentDate();

};

// fetches chrome storage sync data
async function fetchStorageData() {
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

// add new problem object to 'leetData' array
function saveData(problem) {
    // First fetch the existing data, empty array in default case
    fetchStorageData().then(leetData => {
        let repeated = false;

        for (let i = 0; i < leetData.length; i++) {
            if (leetData[i].problemNo === problem.problemNo) {
                repeated = true;
                break;
            }
        }

        // Now update 'leetData' array with the new 'problem' object
        if (!repeated) {
            updateData(leetData, problem);
            document.querySelector('.message').innerText = 'Your data was successfully added!';
            hideMessage();
        } else {
            document.querySelector('.message').innerText = 'Oops, this data has already been added before!';
            hideMessage();
        }
    });
}

// Update 'leetData' array with 'problem' object
function updateData(leetData, problem) {
    leetData.push(problem);

    //then call the set to update with modified value
    chrome.storage.sync.set({
        'leetData': leetData
    }, () => console.log('Saved!', leetData));
}

// Download only possible if leetData is not empty
function downloadData() {
    fetchStorageData().then(leetData => {
        if (leetData.length > 0) {
            console.log(leetData);

            let blob = new Blob([JSON.stringify(leetData)], {
                type: 'text/plain'
            });

            // console.log(blob);

            let url = URL.createObjectURL(blob);

            setTimeout(() => {
                chrome.downloads.download({
                    url
                });
                console.log("Done!!");
            }, 1000);
        }
    });
}

// Hides message after 3 seconds
function hideMessage() {
    setTimeout(function () {
        document.querySelector('.message').classList.toggle('hidden');
    }, 1000);
}

function resetData() {
    console.log('Before:');
    chrome.storage.sync.get(result => console.log(result));

    // Clears chrome storage sync
    chrome.storage.sync.clear();

    const success = document.querySelector('.message');
    success.innerText = 'All your data has been reset now!';
    hideMessage();

    console.log('After:');
    chrome.storage.sync.get(result => console.log(result));
}

chrome.tabs.getSelected(null, tab => {
    if (tab.url.includes('https://leetcode.com/problems')) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'getProblemDetails'
        }, response => {

            console.log(response);

            // show data dump upon clickiing 'Track' button
            document.querySelector('.track').addEventListener('click', () => {
                trackData(response, tab.url);
            });

            const [problemNo, problemTitle] = response.problemTitle.split('.');
            problem.problemNo = parseInt(problemNo);
            problem.problemTitle = problemTitle;
            problem.difficulty = response.difficulty;
            problem.tags = response.tags;
            problem.tabURL = tab.url;
            problem.createdDate = currentDate();

            // Add problems to Leeter
            // document.querySelector('.add-leeter').addEventListener('click', async () => {

            //     // post each 'problem' object
            //     try {
            //         const url = 'http://localhost:3000';
            //         const res = await fetch(url, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify(problem)
            //         });
            //         console.log(res);
            //         const success = document.querySelector('.message');
            //         success.innerText = 'Done!';
            //     } catch (e) {
            //         console.log(e);
            //         const error = document.querySelector('.message');
            //         error.innerText = 'Not OK';
            //     }

            // });

            document.querySelector('.add-leeter').addEventListener('click', async () => {
                // post each 'problem' object
                saveData(problem);
            });

            // triggers the leeter homepage to open
            document.querySelector('.checkout-leeter').addEventListener('click', () => {
                chrome.tabs.create({
                    url: 'dashboard.html'
                });
            });

            // Reset all chrom storage sync data
            document.querySelector('.reset').addEventListener('click', () => {
                resetData();
            });

            // Download only if any problem has been added to the leetData array by now
            document.querySelector('.download').addEventListener('click', () => {
                downloadData();
            });
        });
    }
});