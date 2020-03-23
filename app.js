
/* Defino Variables */
let array = []
let filter = document.querySelector('.filter')
let container = document.querySelector('.container')
let filterList = document.querySelector('.filter__options')
let response = ''
let newArray = []
let arrayObj = []

/* Luego de Cargar la pagina*/
document.addEventListener("DOMContentLoaded", async function () {
    var data = './data.json'
    const fetchResult = await fetch(data)
    response = await fetchResult.json()
    await printData(response)
});


/* Manejo del Array con los datos filtrados*/
checkArray = (key, data) => {
    /* Chequeo que el dato seleccionado no este repetido*/
    if (array.filter(value => value[key] == data).length === 0) {
        filter.classList.add('filter--show')
        let object = { [key]: data }
        array.push(object)

        /*Una vez aparecido el filtro le agrego el evento al boton Clear*/
        document.querySelector('.button__clear').addEventListener('click', function () {
            filter.classList.remove('filter--show')
            printData(response)
            filterList.innerHTML = ''
            array.length = 0
            newArray.length = 0
        })
        /*Creo el elemento Li y Button del Filtro*/
        let li = document.createElement('li')
        li.setAttribute(key, data)
        let button = document.createElement('button')
        button.classList.add('filter__closeBTN')
        li.innerHTML = `${data}`
        button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
        <path fill="#FFF" fill-rule="evenodd"
        d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z" />
        </svg>
        `
        /*Agrego el eventListener al button*/
        button.addEventListener('click', function (e) {
            handleCloseBtn(e)
            printData(newArray)

        })
        /*Agrego al documento*/
        li.appendChild(button)
        filterList.appendChild(li)
    }
}

/* Funcion  relacionada con el button del cierre del filtro*/
handleCloseBtn = (event) => {
    let data, key
    /*Switch detecta donde se hizo el click*/
    switch (event.srcElement.tagName) {
        case 'path':
            event.target.parentNode.parentNode.parentNode.remove()
            data = event.target.parentNode.parentNode.parentNode.attributes[0].value
            key = event.target.parentNode.parentNode.parentNode.attributes[0].name
            break;
        case 'svg':
            event.target.parentNode.parentNode.remove()
            data = event.target.parentNode.parentNode.attributes[0].value
            key = event.target.parentNode.parentNode.attributes[0].name

            break;
        case 'BUTTON':
            event.target.parentNode.remove()
            data = event.target.parentNode.attributes[0].value
            key = event.target.parentNode.attributes[0].name
            break;
        default:
            break;
    }

    /*Filtro y Elimino del ArrayFiltro la seleccion */
    array = array.filter(item => data !== item[key])

    let prueba = []
    let mainKey
    let arrayLanguagesTools = []
    let role = ''
    let level = ''

    /*Recorro el Array Filtro para separar datos, en un array con lenguajes y tools, y variables para role y level*/
    array.forEach(itemArray => {
        for (key in itemArray) {
            mainKey = key
        }
        if (mainKey === "data-languages" || mainKey === "data-tools") {
            arrayLanguagesTools.push(itemArray[mainKey])
        } else if (mainKey === "data-role") {
            role = itemArray[mainKey]
        } else {
            level = itemArray[mainKey]
        }
    })

    /*Recorro el json Original*/
    response.forEach(item => {
        let isRole = false
        let isLevel = false
        let isExtra = false

        /* Si el dato filtro existe y coincide con el del json True, si no existe tb True*/
        if (role) {
            if (role === (item.role.toLowerCase())) {
                isRole = true
            }
        } else {
            isRole = true
        }

        if (level) {
            if (level === (item.level.toLowerCase())) {
                isLevel = true
            }
        } else {
            isLevel = true
        }

        /* Join de los Array de los datos */
        let lowerCaseArr = item.hasOwnProperty('languages') && item.languages.map(language => language.toLowerCase())
        let lowerCaseArr1 = item.hasOwnProperty('tools') && item.tools.map(tool => tool.toLowerCase())
        let lower

        if (lowerCaseArr && lowerCaseArr1) {
            lower = [...lowerCaseArr, ...lowerCaseArr1]
        } else if (lowerCaseArr) {
            lower = [...lowerCaseArr]
        } else {
            lower = [...lowerCaseArr1]
        }


        /* Chequeo que el array del filtro este en cada uno de los datos provenientes del json, devuelvo true*/
        if (lower && arrayLanguagesTools) {
            if (arrayLanguagesTools.every(language => lower.includes(language))) {
                isExtra = true
            } else {
                isExtra = false
            }
        } else {

        }

        /* paso por las pruebas, agrego el item del json al Array*/
        if ((isRole && isLevel && isExtra)) {
            prueba.push(item)
        }
    })


    /* Variable que se rendea al documento, borro su info, y agrego la salida de lo anterio*/
    newArray.length = 0
    newArray = [...prueba]


    /*Si no tengo mas datos en el array, lo elimino del documento*/
    if (array.length === 0) {
        filter.classList.remove('filter--show')
        newArray = [...response]
    }
}



/* Funcion que renderiza la info al documento dependiendo del filtro seleccionado*/
updateScreen = (key, data) => {
    let keyString = key.substr(5)
    if (newArray.length === 0) {
        response.forEach(item => {

            switch (keyString) {
                case 'role':
                case 'level':
                    if (item[keyString] && item[keyString].toLowerCase() === data) {
                        newArray.push(item)
                    }
                    break;
                case 'languages':
                case 'tools':
                    if (item[keyString]) {
                        let newItem = item[keyString].map(item => item.toLowerCase())

                        if (newItem.includes(data)) {
                            newArray.push(item)
                        }
                    }
                    break;
                default:
                    break;
            }
        })
    } else {
        /* Clickeando un segundo y + filtro */
        let secondArr
        switch (keyString) {
            case 'role':
            case 'level':
                secondArr = newArray.filter(item => item[keyString] && item[keyString].toLowerCase() === data)
                newArray.length = 0
                newArray = [...secondArr]
                break;
            case 'languages':
            case 'tools':
                secondArr = newArray.filter(item => {
                    let newItem = item[keyString] && item[keyString].map(it => it.toLowerCase())
                    return newItem ? newItem.includes(data) : false
                })
                newArray.length = 0
                newArray = [...secondArr]

                break;
            default:
                break;
        }

    }
}


/*funcion que agrega el evento Listener a los Li de los Post*/
addEventListenerLi = (li) => {
    li.addEventListener('click', function (event) {
        let key = event.target.attributes[0].name
        let data = event.target.attributes[0].value.toLowerCase()
        checkArray(key, data)
        updateScreen(key, data)
        printData(newArray)
    })
}

/* Funcion que renderiza la info al documento*/
printData = (jobs) => {
    container.innerHTML = ''
    jobs.map(job => {
        let div = document.createElement('div')

        div.innerHTML = `
        <div class="item ${job.isItFeatured && 'item__borderRight'}"
            data-role=${job.role}
            data-level=${job.level}
            data-languages=${job.languages}
            data-tools=${job.tools}
        >
        <div class="item__img">
          <img src="${job.img}" alt="company logo">
        </div>
        <div class="item__description">
          <div class="item__header">
            <h2 class="item__company">${job.company} </h2>
             ${ job.isItNew ? '<p class="item__new"> new!</p>' : ''}
            ${job.isItFeatured ? '<p class="item__featured">featured</p>' : ''}
          </div>
          <h1 class="item__position"> <a href="#">Senior Frontend Developer</a></h1>
          <div class="item__footer">
            <p> ${job.timeStamp}</p>
            <div class="item__circle"></div>
            <p> ${job.hours} </p>
            <div class="item__circle"></div>
            <p>${job.location} </p>
          </div>
        </div>
        <ul class="item__requirements" id="N${job.id}">

         </ul>
      </div>
                `
        /* Agrego los Li filstro para seleccion y sus eventos Listeners a los Posts */
        container.appendChild(div)

        let liRole = document.createElement('li')
        //liRole.innerHTML = `<li data-role=${job.role} class="item__require"> ${job.role}  </li>`
        liRole.dataset.role = `${job.role}`
        liRole.classList.add("item__require")
        liRole.innerHTML = `${job.role}`
        addEventListenerLi(liRole)
        document.querySelector(`#N${job.id}`).appendChild(liRole)

        let liLevel = document.createElement('li')
        // liLevel.innerHTML = `<li data-level=${job.level} class="item__require"> ${job.level} </li>`
        liLevel.dataset.level = `${job.level}`
        liLevel.classList.add("item__require")
        liLevel.innerHTML = `${job.level}`
        addEventListenerLi(liLevel)
        document.querySelector(`#N${job.id}`).appendChild(liLevel)

        if (job.languages && job.languages.length > 0) {
            job.languages.forEach(language => {
                let lilanguage = document.createElement('li')
                lilanguage.dataset.languages = `${language}`
                lilanguage.classList.add("item__require")
                lilanguage.innerHTML = `${language}`
              //    lilanguage.innerHTML = `<li data-languages=${language} class="item__require"> ${language}  </li>`
                addEventListenerLi(lilanguage)
                document.querySelector(`#N${job.id}`).appendChild(lilanguage)
            })
        }
        if (job.tools && job.tools.length > 0) {
            job.tools.forEach(tool => {
                let liTool = document.createElement('li')
               liTool.dataset.tools = `${tool}`
               liTool.classList.add("item__require")
               liTool.innerHTML = `${tool}`
             // liTool.innerHTML = `<li data-tools=${tool} class="item__require">${tool}  </li>`
                addEventListenerLi(liTool)
                document.querySelector(`#N${job.id}`).appendChild(liTool)
            })
        }


    })
}


