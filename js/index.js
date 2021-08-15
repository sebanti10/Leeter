// #95c7f8 light blue
// #245e7c dark blue
// #dedbec grey
// #f9f6f9 white
// #070c0f black
let console = chrome.extension.getBackgroundPage().console;

const currentDate = () => {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}


const trackData = (response, tabURL) => {
    console.log(response);
    const problemTitle = document.querySelector('.problem-title');
    problemTitle.innerText = response.problemTitle;

    const difficulty = document.querySelector('.difficulty');
    difficulty.innerText = response.difficulty;

    const tagList = document.querySelector('.tags');
    if (tagList.children.length === 0) {
        response.tags.forEach(tag => {
            const tagItem = document.createElement('li');
            const tagDetails = document.createTextNode(tag);

            tagItem.appendChild(tagDetails);
            tagList.appendChild(tagItem);
        });
    }

    const tab = document.querySelector('.tab-url');
    tab.innerText = tabURL;

    const createdDate = document.querySelector('.created-date');
    createdDate.innerText = currentDate();

};

// const handleSubmit = async (e, problem) => {
//     e.preventDefault();
//     try {
//         const res = await axios.post('localhost:3000/', problem);
//         const success = document.querySelector('.success');
//         success.style.display = "none";
//         success.textContent = res.data;
//     } catch (e) {
//         const error2 = document.querySelector('.error');
//         error.style.display = "none";
//         error.textContent = "Oops!";
//     }
// }

function saveItem(leetDataStr) {
    localStorage.setItem('leetDataItems', leetDataStr);
}

const leetData = [];
const problem = {};

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

            problem.problemTitle = response.problemTitle;
            problem.difficulty = response.difficulty;
            problem.tags = response.tags;
            problem.tabURL = tab.url;
            problem.createdDate = currentDate();

            leetData.push(problem);
            const leetDataStr = JSON.stringify(leetData);

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
                try {
                    saveItem(leetDataStr);
                    const success = document.querySelector('.message');
                    success.innerText = 'Done!';
                } catch (e) {
                    console.log(e);
                    const error = document.querySelector('.message');
                    error.innerText = 'Not OK';
                }

            });

            // Download only if any problem has been added to the leetData array by now
            if (leetData.length > 0) {
                console.log(leetData);

                let blob = new Blob([leetDataStr], {
                    type: 'text/plain'
                });
                console.log(blob);

                let url = URL.createObjectURL(blob);

                document.querySelector('.download').addEventListener('click', () => {
                    setTimeout(() => {
                        chrome.downloads.download({
                            url
                        });
                        console.log("Done!!");
                    }, 1000);
                });
            }
        });
    }
});