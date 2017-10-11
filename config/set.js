
fetch({
    url: '',
    data: {
        query: "query  { viewer { login }}"
    }
}).then((responseText) => {
    login = JSON.parse(responseText).data.viewer.login;
    console.log(login)
    window.localStorage.login = login;
    return login
    
}, (err) => {
    console.log(err)
    window.open('https://github.com/login/oauth/authorize?client_id=cf19ecfcda2c1104352a&redirect_uri=chrome-extension://bmbgdbfkfjbinlblpidimgjcfdbihnig/set.html&scope=user,repo'
        ,true)
}).then((login)=>{
    fetch({
        url:'',
        data:{
            query:"query{user(login:\"dongsuo\") {repositories(first:50){edges{node{name,description}}}}}"
        }
    }).then((responseText)=>{
        console.log(JSON.parse(responseText))
        window.localStorage.repositoryList = JSON.stringify(JSON.parse(responseText).data.user.repositories.edges);
    })
})

// 封装Promise

function fetch(parameter) {
    var url = 'https://api.github.com/graphql' + parameter.url;
    var method = parameter.method || 'POST';
    var data = parameter.data;
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.open(method, url)
        xhr.setRequestHeader('Authorization', 'token '+CONFIG.token)
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