const accountImg = document.querySelector("img");
const info = document.querySelector("#info");
const bio = document.querySelector("#bio");
const usernameInput = document.querySelector(".username");
const submitBotton = document.querySelector(".submit");

// submit form and send request to server and get data
// for input name then call functions to show result
function submit(e) {
    
    e.preventDefault();
    
    if(usernameInput.value == "")
        return;

    if(!checkValidity(usernameInput.value))
        return;

    let data = getData(usernameInput.value)

    if(data != null) {
        console.log(data);
        setProfile(data);
        console.log("load profile from stroge")
        return;
    }


    console.log("send request");
    fetch(`https://api.github.com/users/${usernameInput.value}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => {
        if(response.status == 200) {
            processResponse(response)
        }
    });

}

// set profile field in html for information image and bio and favorite language
function processResponse(response) {
    response.json()
    .then(obj => {
        let saveObj = new Object();
        saveObj.avatar_url = obj.avatar_url; 
        saveObj.name = obj.name;
        saveObj.blog = obj.blog;
        saveObj.location = obj.location;
        saveObj.bio = obj.bio;

        // send request to get repo last pushed and use it to find favorite language
        fetch(`https://api.github.com/users/${usernameInput.value}/repos`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(obj => {
            obj.sort((a, b) => {
                if(a.language == null && b.language == null)
                    return 0;
                if(a.language == null)
                    return 1;
                if(b.language == null)
                    return -1;
                return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
            })

            let firstFavarite = obj.slice(0, Math.min(obj.length, 5));
            firstFavarite.sort((a, b) => {
                return b.stargazers_count - a.stargazers_count;
            })

            console.log(firstFavarite);
            saveObj.favoriteLanguage = firstFavarite.length > 0 ? firstFavarite[0].language : "";
            console.log(saveObj);

            setProfile(saveObj);
        });

    });
}

function setProfile(obj) {
    accountImg.src = obj.avatar_url;

    info.innerHTML =
    `
    ${obj.name == "" ? "" : `<p>Name: ${obj.name}</p>`}
    ${obj.blog == "" ? "" : `<p>Blog: ${obj.blog}</p>`}
    ${obj.location == null ? "" : `<p>Location: ${obj.location}</p>`}
    ${obj.favoriteLanguage == null ? "" : `<p>Favorite Language: ${obj.favoriteLanguage}</p>`}
    `
    bio.innerHTML = `<p>${obj.bio}</p>`.replace("\n", "<br />");

    saveData(usernameInput.value, obj)
}

// save data in local storage
function saveData(username, obj) {
    console.log("Try saving data into local storage.");
    window.localStorage.setItem(username, JSON.stringify(obj));
    console.log("Data saved into local storage.");
}

// save data in local storage
function getData(username) {
    console.log("Get saved data from local storage.");
    let data = window.localStorage.getItem(username)
    return JSON.parse(data);
}


// this function check input name validity
function checkValidity(name) {
    const regex1 = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    const foundValid = name.match(regex1);
    return foundValid == name;
}



submitBotton.addEventListener("click", submit);
document.addEventListener("keypress", (e) => e.code == "Enter" ? submit(e) : null);
window.localStorage.clear();