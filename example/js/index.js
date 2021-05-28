let {get,set} = tinway()

set('index', {a:'test',b:'t'})

let testIndex = () => {
    console.log(get.index)
}