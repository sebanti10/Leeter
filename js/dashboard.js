chrome.storage.sync.get({
    'leetData': []
}, data => {
    if (data.leetData.length !== 0) {
        appendData(data.leetData);
        // console.log(data.leetData);
    } else {
        console.log('No data', data.leetData);
    }
});

function appendData(leetData) {
    // console.log(leetData);
    let mainContainer = document.querySelector('.container');
    const dateWiseData = updateByDate(leetData);

    dateWiseData.forEach((valArr, date) => {
        // Each date is a separate container
        let dateContainer = document.createElement("div");
        dateContainer.className = "date-container my-3 p-3 bg-white rounded box-shadow";

        // Each created date is a 'h6'
        let createdDate = document.createElement("h6");
        createdDate.className = "created-date border-bottom border-gray pb-2 mb-0";
        createdDate.innerHTML = date;

        dateContainer.appendChild(createdDate);

        // Loop through each array for date key
        valArr.forEach(val => {
            // Each array object
            let submission = document.createElement("div");
            submission.className = "submission media text-muted pt-3";

            let problem = document.createElement("p");
            problem.className = "problem media-body pb-3 mb-0 small lh-125 border-bottom border-gray";


            // Problem heading
            const problemStatement = document.createElement("strong");
            problemStatement.className = "problem-statement d-block text-gray-dark";
            const problemNo = val.problemNo;
            const problemTitle = val.problemTitle;

            // problemStatement.innerHTML = problemNo + ". " + problemTitle;

            // Problem link
            let a = document.createElement("a");
            a.className = "problem-url";
            a.appendChild(document.createTextNode(problemNo + ". " + problemTitle));
            a.title = problemTitle;
            a.href = val.tabURL;
            a.target = "_blank";

            problemStatement.appendChild(a);

            // Approach
            let approach = document.createElement("p");
            approach.className = "approach";
            approach.innerText = val.approach;

            const badges = ["success", "warning", "danger", "primary", "secondary", "info", "light", "dark"];

            // Difficulty
            const difficulty = document.createElement("span");
            const difficultyLevel = ["Easy", "Medium", "Hard"];
            const badge = badges[difficultyLevel.indexOf(val.difficulty)];

            difficulty.className = `difficulty badge bg-${badge}`;
            difficulty.innerHTML = val.difficulty;

            // Tags
            const tags = document.createElement("div");
            tags.className = `tags`;

            val.tags.forEach(tag => {
                let randomNumber = Math.floor((Math.random() * 7));

                let tagElement = document.createElement("span");
                tagElement.className = `tag badge rounded-pill bg-${badges[randomNumber]} text-dark`;
                tagElement.innerHTML = tag;

                tags.appendChild(tagElement);
            });

            problem.appendChild(problemStatement);
            problemStatement.appendChild(difficulty);

            problem.appendChild(approach);
            problem.appendChild(tags);

            submission.appendChild(problem);
            dateContainer.appendChild(submission);
        });

        mainContainer.appendChild(dateContainer);
    });
}

function updateByDate(data) {
    let dateWiseData = new Map();
    for (let i = 0; i < data.length; i++)
        dateWiseData.set(data[i].createdDate, new Array());

    for (let i = 0; i < data.length; i++)
        dateWiseData.get(data[i].createdDate).push(data[i]);

    // console.log(dateWiseData);

    // dateWiseData.forEach((valArr, date) => {
    //     console.log('Date: ' + date);
    //     for (let i = 0; i < valArr.length; i++)
    //         console.log(valArr[i].problemTitle);
    // });
    return dateWiseData;

}


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