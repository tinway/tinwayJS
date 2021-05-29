import {run,getData as get,setData as set} from './tinway.js'
import Run from './js/index.js'

let container = {
    module: {get},
    attributes: {
        class:'container',
        style:'background: #f5f5f5',
        onclick: "tinway().get.test.set({test:'dddd'})"
    }
}

if (true) {
    run({...container, dataName:'index', setData: {title: 'Page index'}, module: {...container.module,set}, ...Run})
} else {
    console.log('end')
}