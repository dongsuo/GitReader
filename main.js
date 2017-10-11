var titleInput = document.getElementById('title');
var urlInput = document.getElementById('url');
var errTip = document.getElementById('err-tip');
var saveBtn = document.getElementById('saveBtn');
var repo = window.localStorage.repo;
var login = window.localStorage.login
var token = window.localStorage.access_token
console.log(repo)
console.log(login)

chrome.tabs.getSelected(null, function(tab) {
    titleInput.setAttribute('value', tab.title)
    urlInput.setAttribute('value', tab.url)
});


saveBtn.addEventListener('click', function(e) {
    e.preventDefault()
    console.log('title',titleInput.value)
    var data = {
        title: titleInput.value,
        body: urlInput.value,
    }
    fetch({
        url: 'https://api.github.com/repos/' + login + '/' + repo + '/issues',
        method: 'POST',
        data,
        token
    }).then((response) => {
        console.log(response)
        errTip.innerHTML = '成功保存至'+repo
    }).catch((err) => {
        console.log(err)
    })
})


// 封装Promise

function fetch(parameter) {
    var url = parameter.url;
    var method = parameter.method || 'POST';
    var data = parameter.data;
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.open(method, url)
        xhr.setRequestHeader('Authorization', 'token ' + token)
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