var titleInput = document.getElementById('title');
var urlInput = document.getElementById('url');
var errTip = document.getElementById('err-tip');
chrome.tabs.getSelected(null, function(tab) {
    titleInput.setAttribute('value', tab.title)
    urlInput.setAttribute('value', tab.url)
});

fetch({
    url: '',
    data: {
        query: "query  { viewer { login }}"
    }
}).then((responseText) => {
	login = JSON.parse(responseText).data.viewer.login;
	console.log(login)
	window.localStorage.login = login
	fetch({
		url:'',
		data:{
			query:"query{user(login:\"dongsuo\") {repositories(first:50){edges{node{name,description}}}}}"
		}
	}).then((responseText)=>{
		console.log(JSON.parse(responseText))
		window.localStorage.repositoryList = JSON.stringify(JSON.parse(responseText).data.user.repositories.edges);
	})
}, (err) => {
    console.log(err)
        errTip.innerHTML = "授权失败，请尝试重置Token"
    
})

// 封装Promise

function fetch(parameter) {
    var url = 'https://api.github.com/graphql' + parameter.url;
    var method = parameter.method || 'POST';
    var data = parameter.data;
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.open(method, url)
        xhr.setRequestHeader('Authorization', 'bearer'+CONFIG.token)
        xhr.onload = function() {
            if (xhr.status == 200) {
                resolve(xhr.responseText)
            } else {
                reject(xhr.responseText);
            }
        }
        xhr.send(JSON.stringify(data))
    });
}