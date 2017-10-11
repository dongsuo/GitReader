window.onload = function() {
    const select = document.getElementById('select');
    const saveBtn = document.getElementById('saveBtn')
    const currentInfo = document.getElementById('currentInfo')
    let targetRepo = window.localStorage.repo || '';
    currentInfo.innerHTML = '当前所在仓库为：'+ targetRepo+'.'
    select.value = targetRepo
    select.addEventListener('change', function(e) {
        console.log(e.target.value)
        targetRepo = e.target.value
    })
    saveBtn.addEventListener('click', function(e) {
        console.log('保存成功')
        e.preventDefault()
        window.localStorage.repo = targetRepo
    })

    // init it!!
    oauth(fetchRepoList)
}




function oauth(callback) {
    if (window.localStorage.access_token) {
        callback(window.localStorage.access_token)
        return;
    }

    chrome.identity.launchWebAuthFlow({
        url: 'https://github.com/login/oauth/authorize?client_id='+CONFIG.client_id+'&scope=user,repo',
        interactive: true
    }, function(redirect_url) {
        console.log(redirect_url.substring(redirect_url.indexOf("code=") + 5))
        fetch({
            url: 'https://github.com/login/oauth/access_token',
            method: 'POST',
            data: {
                code: redirect_url.substring(redirect_url.indexOf("code=") + 5),
                client_secret: CONFIG.client_secret,
                client_id: CONFIG.client_id
            }
        }).then((response) => {
            window.localStorage.access_token = JSON.parse(response).access_token;
            callback(JSON.parse(response).access_token)
        })
    })
}


function fetchRepoList(token) {
    fetch({
        url: 'https://api.github.com/graphql',
        data: {
            query: "query  { viewer { login }}"
        },
        token
    }).then((response) => {
        window.localStorage.login = JSON.parse(response).data.viewer.login
        return JSON.parse(response).data.viewer.login
    }).then((login) => {
        console.log(login)
        fetch({
            url: 'https://api.github.com/graphql',
            data: {
                query: "query{user(login:\"" + login + "\") {repositories(first:50){edges{node{name,description}}}}}"
            },
            token
        }).then((responseText) => {
            renderOption(JSON.parse(responseText).data.user.repositories.edges)
        })
    })

}

function renderOption(repositories) {
    for (var i = 0; i < repositories.length; i++) {
        let opt = document.createElement('option');
        opt.setAttribute('value', repositories[i].node.name)
        opt.setAttribute('label', repositories[i].node.name)
        opt.innerHTML = repositories[i].node.name
        select.appendChild(opt)
    }
}

// 封装Promise

function fetch(parameter) {
    var url = parameter.url;
    var method = parameter.method || 'POST';
    var data = parameter.data;
    var token = parameter.token || null;
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.open(method, url)
        xhr.setRequestHeader('Authorization', 'token ' + token)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onload = function() {
            if (xhr.status == 200 || xhr.status == 201) {
                resolve(xhr.responseText)
            } else {
                reject(xhr.responseText);
            }
        }
        xhr.send(JSON.stringify(data))
    });
}