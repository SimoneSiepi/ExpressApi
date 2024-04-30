function test(){
    fetch("http://localhost:3000/mafiaNews/title/Palermo")
    .then(function(res){
        return res.json();
    }).then(function(data){
        console.log(data);
    });
}