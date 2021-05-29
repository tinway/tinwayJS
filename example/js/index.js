import {run,getData as get,setData as data} from '../tinway.js'

// get.index.b = (d) => {
//     console.log(d)
// }

data('index', {data:[]})

get.index.b = (e) => {
    var e = document.getElementById(e)
    history.pushState(null, null, e.value);

    window.onpopstate = function (event) {
        console.log('ddd')
      }

    data('index', {data:[...get.index.data, e.value]})
    console.log(e.value)
}

// // setTimeout(()=> {
// //     get.index.b = (d) => {
// //         console.log(d)
// //     }
// // },0)

// set('index', {b:(d) => {
//     console.log(d)
// }})

// // set('index', {a:'test',b:1})

// let testIndexTest = () => {
//     console.log(get.index)
// }

let Configurator = {
    view: 'view/index'
}

export default Configurator