(function(window) {
  'use strict'
  if (typeof(tinway) === 'undefined') {
      window.tinway = () => {
        //   console.log(mod);
          return mod
      }
  }
})(window)

'use strict'

let getData = {}, tempData = {}, temp, mod = {}

// Parser HTML
const STARTTAG_REX = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
const ENDTAG_REX = /^<\/([-A-Za-z0-9_]+)[^>]*>/
const ATTR_REX = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g

let makeMap = (str) => {
  return str.split(",").reduce((map,cur) => {
      map[cur] = true
      return map
  },{})
}

const EMPTY_MAKER = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr,template")
const FILLATTRS_MAKER = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected")

let isEmptyMaker = (tag) => {
  return !!EMPTY_MAKER[tag]
}

let isFillattrsMaker = (attr) => {
  return !!FILLATTRS_MAKER[attr]
}

class TagStart {
  
  constructor(name, tag) {
      this.name = name
      this.attributes = this.getAttributes(tag)
  }
  
  getAttributes(str) {
      let attrsMap = {}
      str.replace(ATTR_REX, function(match, name) {
          const args = Array.prototype.slice.call(arguments)
          const value = args[2] ? args[2] : args[3] ? args[3] : args[4] ? args[4] : isFillattrsMaker(name) ? name : ""
          attrsMap[name] = value.replace(/(^|[^\\])"/g, '$1\\\"')
      })
      return attrsMap
  }

}

class TagEmpty extends TagStart {
  
  constructor(name, tag) {
      super(name, tag)
  }

}

class TagEnd {
  
  constructor(name) {
      this.name = name
  }

}

class Text {
  
  constructor(text) {
      this.text = text
  }

}

const ElEMENT_TYPE = "Element"
const TEXT_TYPE = "Text"

let createElement = (token) => {
  const tagName = token.name
  const attributes = token.attributes
  
  if (token instanceof TagEmpty) {
      return {
          type: ElEMENT_TYPE,
          tagName,
          attributes
      }
  }
  
  return {
      type: ElEMENT_TYPE,
      tagName,
      attributes,
      children: []
  }
}

let createText = (token) => {
  const content = token.text
  
  return {
      type: TEXT_TYPE,
      content
  }
}

let createNodeFactory = (type, token) => {
  switch(type) {
      case ElEMENT_TYPE: return createElement(token)
      case TEXT_TYPE: return createText(token)
      default: break
  }
}

let parse = (tokens,attributes) => {
  let view = {
      tagName: 'div',
      attributes: attributes,
      children: []
  }
  
  let tagArray = [view]
  tagArray.last = () => tagArray[tagArray.length - 1]
  
  for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token instanceof TagStart) {
          const node = createNodeFactory(ElEMENT_TYPE, token)
          if (node.children) {
              tagArray.push(node)
          } else {
              tagArray.last().children.push(node)
          }
          continue
      }
      if (token instanceof TagEnd) {
          let parent = tagArray[tagArray.length - 2]
          let node = tagArray.pop()
          parent.children.push(node)
          continue
      }
      if (token instanceof Text) {
          tagArray.last().children.push(createNodeFactory(TEXT_TYPE, token))
          continue
      }
  }
  return view
}

let tokenize = (html) => {
  let string = html
  let tokens = []
  const maxTime = Date.now() + 1000
  while (string) {
      if (string.indexOf("<!--") === 0) {
          const lastIndex = string.indexOf("-->") + 3
          string = string.substring(lastIndex)
          continue
      }
      if (string.indexOf("</") === 0) {
          const match = string.match(ENDTAG_REX)
          if (!match) continue
          string = string.substring(match[0].length)
          const name = match[1]
          if (isEmptyMaker(name)) continue
          tokens.push(new TagEnd(name))
          continue
      }
      if (string.indexOf("<") === 0) {
          const match = string.match(STARTTAG_REX)
          if (!match) continue
          string = string.substring(match[0].length)
          const name = match[1]
          const attrs = match[2]
          const token = isEmptyMaker(name) ? new TagEmpty(name, attrs) : new TagStart(name, attrs)
          tokens.push(token)
          continue
      }
      const index = string.indexOf('<')
      const text = index < 0 ? string : string.substring(0, index)
      string = index < 0 ? "" : string.substring(index)
      tokens.push(new Text(text))
      if (Date.now() >= maxTime) break
  }
  return tokens
}

let htmlParser = (html,attributes) => {
  return parse(tokenize(html),attributes)
}

//Virtual DOM

let loadHtml = (view,result) => {

  let xmlhttp = new XMLHttpRequest()

  xmlhttp.onreadystatechange = function () {

      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

          return result(xmlhttp.responseText)
    
      }
  
  }
  
  xmlhttp.open("GET", view+'.html', true)
  xmlhttp.send()

}

let chekValue = (value) => {


  switch (typeof value) {
      case 'object':
          return true
      case 'string':
          return value.split('.')
      case 'boolean':
          return value
      default: return false
    }

  // switch (value) {
  //     case 'true':
  //         return true
  //     case 'false':
  //         return false
  //     case 'test.list':
  //         return value.split('.')
  //     case 'index.list':
  //         return value.split('.')
  //     case 'assadsd/asdasd.list':
  //         return value.split('.')
  //     default: return false
  //   }

}


let chekAttributes = (attributes,value) => {

  switch (attributes) {
      case 're':
          return [attributes,chekValue(value)]
      case 'hide':
          return [attributes,chekValue(value)]
      case 'show':
          return [attributes,chekValue(value)]
      case 'dataName':
          return [attributes,chekValue(value)]
      default: return false
    }

}

let createNewElement = (newEl,dom) => {

  if (dom.attributes) {
      
      for (let i = 0; i < Object.keys(dom.attributes).length; i++) {

          // attributes(Object.keys(dom.attributes)[i],Object.values(dom.attributes)[i])[2].forEach(element => {
          //     data[element] 
          // });

          if (chekAttributes(Object.keys(dom.attributes)[i],Object.values(dom.attributes)[i])) {
              console.log(dom.attributes['dataName']);
              console.log(chekAttributes(Object.keys(dom.attributes)[i],Object.values(dom.attributes)[i]))
              let vvvvv = chekAttributes(Object.keys(dom.attributes)[i],Object.values(dom.attributes)[i])
              if (vvvvv[0] === 're') {
                  console.log(getData[vvvvv[1][0]][vvvvv[1][1]]);
              }
          }
          
          newEl.setAttribute(Object.keys(dom.attributes)[i], Object.values(dom.attributes)[i])
      
      }
  
  }
  
  if (dom.children && dom.children.length > 0) {
      
      dom.children.forEach(function(element) {
          
          let innerElement = createDOMNode(element)
          newEl.appendChild(innerElement)
      
      })
  
  }
  
  return newEl

}

let createDOMNode = (dom) => {
  
  if (dom.type === 'Text') {
      
      return document.createTextNode(dom.content)
  
  }

  let newEl

  if (dom.tagName === 'template') {


    //   let xhr = new XMLHttpRequest(),doc = document
//   xhr.responseType = 'blob'
//   xhr.open('GET', pathToJSFile+'.js', true);
//   xhr.onload = function () {
//       let script = doc.createElement('script'),src = URL.createObjectURL(xhr.response)
//       script.type="module"
//       script.src = src
//       doc.body.appendChild(script)


newEl = document.createElement('div')
console.log(dom.attributes.modele);
import(dom.attributes.modele)
      .then(module => {
          console.log(module.default);

          if (module.default.data) {
              getData['test'] = module.default.data
          }

      loadHtml(module.default.view,function (d) {

          dom.children = htmlParser(d).children

          return createNewElement(newEl,dom)            

      })


      })
      .catch(err => {
        // main.textContent = err.message;
      });


  } else {
      
      newEl = document.createElement(dom.tagName)  
  
  }


  return createNewElement(newEl,dom)

}

let diffNodes = (oldnode, newnode) => {
  
  if (oldnode && newnode) {
      
      if (typeof oldnode != typeof newnode) {
          
          return true
      
      } else if ((oldnode.tagName && newnode.tagName) && (oldnode.tagName != newnode.tagName)) {
          
          return true
    
      } else if ((oldnode.type === 'Text' && newnode.type === 'Text') && newnode.content != oldnode.content) {

          return true
      
      }
    
      return false
  
  } else {
      
      throw new Error('Nodes are undefined')
  
  }

}

let updateNode = (parent, oldnode, newnode, index=0) => {
  if (!oldnode) {
      
      parent.appendChild(createDOMNode(newnode))
  
  } else if (!newnode) {
      
      if (parent.childNodes[index]) {
          
          parent.removeChild(parent.childNodes[index])
      
      }
  
  } else if (diffNodes(oldnode, newnode)) {

      parent.replaceChild(createDOMNode(newnode), parent.childNodes[index])
  
  } else if (newnode.tagName && newnode.children && oldnode.children) {

      for (var i = 0; i < newnode.children.length || i < oldnode.children.length; i++) {

              updateNode(parent.childNodes[index], oldnode.children[i], newnode.children[i], i)
  
      }
  
  }

}

let importJs = ({view,attributes},pathToJSFile) => {
//   let xhr = new XMLHttpRequest(),doc = document
//   xhr.responseType = 'blob'
//   xhr.open('GET', pathToJSFile+'.js', true);
//   xhr.onload = function () {
//       let script = doc.createElement('script'),src = URL.createObjectURL(xhr.response)
//       script.type="module"
//       script.src = src
//       doc.body.appendChild(script)
      loadHtml(view,function (d) {
          temp = null
          let root = document.getElementById('app')
          temp = htmlParser(d,attributes)
          while (root.hasChildNodes()) {
            root.removeChild(root.firstChild);
        }
          console.log(root);
          updateNode(root,null,temp)
          change()
      })
//   };
//   xhr.send()
}

let run = ({view,module,attributes,js,dataName,setData}) => {
  mod = module
  getData[dataName] = {...getData[dataName], ...setData}
  if (getData[dataName].title) document.title = getData[dataName].title
  importJs({view,attributes},js)
}

let setData = (name,d) => {
  getData[name] = {...getData[name], ...d}
  return getData[name]
}


let change = () => {
  // let input = document.querySelector('input')
  // input.addEventListener('input', result)
  
  // let textarea = document.querySelector('textarea')
  // textarea.addEventListener('input', result)
}

let result = (e) => {
    console.log(e.target.name)
  getData['index'] = {...getData['index'], ...{[e.target.name]:e.target.value}}
}

export {run,getData,setData}