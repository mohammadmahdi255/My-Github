const accountImg = document.querySelector("img");
const info = document.querySelector("#info");
const bio = document.querySelector("#bio");
const usernameInput = document.querySelector(".username");
const submitBotton = document.querySelector(".submit");

function submit() {
    
    if(usernameInput.value == "")
        return;

    fetch(`https://api.github.com/users/${usernameInput.value}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => {
        if(response.status == 200) {
            setProfile(response)
        }
    });

}

function setProfile(response) {
    response.json()
    .then(obj => {
        console.log(obj);
        accountImg.src = obj.avatar_url;
        info.innerHTML =`
        <p>
        Name: ${obj.name == "" ? "Unset" : obj.name}
        </p>
        <p>
        Blog: ${obj.blog == "" ? "Unset" : obj.blog}
        </p>
        <p>
        Location: ${obj.location == null ? "Unset" : obj.location}
        </p>
        `
        bio.innerHTML = `<p>${obj.bio}</p>`.replace("\n", "<br />");

        fetch(`https://api.github.com/users/${usernameInput.value}/repos`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(obj => {
            obj.sort((a, b) => {
                return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
            })
            console.log(obj);
            let firstFiveRepo = obj.slice(0, 5);
            console.log(firstFiveRepo);
        });

    });
}

function checkValidity(name) {
    const regex1 = /[A-Za-z ]+/g;
    const regex2 = /[0-9\.\-\/]+/g;
    const foundValid = name.match(regex1);
    const foundNotValid = name.match(regex2);
    if (foundNotValid == null && foundValid.length > 0) {
        return true;
    }
    return false;

}

submitBotton.addEventListener("click", submit);
window.localStorage.clear();