import {run,getData as get,setData as set} from './tinway.js'

let container = {
    module: {get},
    attributes: {
        class:'container',
        style:'background: #f5f5f5'
    }
}

if (true) {
    run({...container, dataName:'index', setData: {title: 'Page index'}, module: {...container.module,set}, view:'view/index', js:'js/index'})
} else {
    console.log('end')
}