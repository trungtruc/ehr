var obj ={
    "array":[{"name":"a", "age":"222"},{"name":"b", "age":"333"}],
    "as":"Fff"
};

for(var i in obj.array){
    delete obj.array[i]["name"];
}

// delete obj["name"];
console.log(obj);