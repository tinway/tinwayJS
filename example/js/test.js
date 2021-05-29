import {getData as get,setData as set} from '../tinway.js'
import {run} from '../run.js'

set('test')


var div = document.getElementById('list')
var data = get.index.data


window.onload = () => {
if (data.length === 0) {
    div.innerHTML = 'Пусто'
    console.log('ssssssssssssssss');
}
console.log('ssssssssssssssssssssssssssssssssssssssss');
}

let b = (d) => {
    // if (data.length === 0) {
    //     div.innerHTML = 'Пусто'
    //     console.log('ssssssssssssssss');
    // }

    console.log(d);
    // console.log(get)
    // // var div = document.getElementById('list')
    // // var data = get.index.data
    // div.innerHTML = '<b>Пусто</b>'

    // var ul = document.createElement('ul')
    // div.appendChild(ul)

   

    // if (data.length > 0) {
    //     data.map((d)=>{
    //         var li = document.createElement('li')
    //         li.innerHTML = '<b>'+d+'</b>'
    //         ul.appendChild(li)
    //     })
    // }


}

let Configurator = {
        view: 'view/test',
        data: {...get.test, set: b}
    }


export default Configurator