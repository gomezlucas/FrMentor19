/* Defino Variables */
let filterArray = []
let filtertDiv = document.querySelector('.filter')
let containerPostsDiv = document.querySelector('.container')
let filterUl = document.querySelector('.filter__options')
let jobPostArray = []
let jobPostArrayFiltered = []


/* Luego de Cargar la pagina*/
document.addEventListener("DOMContentLoaded", async function () {
    const dataJson = './data.json'
    const JobPostResponseJson = await fetch(dataJson)
    const JobPostResponse = await JobPostResponseJson.json()
    jobPostArray = await formatJobPostResponse(JobPostResponse)
    await showJobPosts(jobPostArray)
});



/* Dentro del objeto: join de los Array languajes y tools,
{... "languages": ["HTML", "JavaScript"], "tools": ["React"]  
      = "skills" : ["HTML", "JavaScript","React"]
*/
formatJobPostResponse = (jobPosts) => {
    jobPosts.forEach(job => {
        if (job.hasOwnProperty('languages') && job.hasOwnProperty('tools')) {
            job.skills = [...job.languages, ...job.tools]
        } else if (job.hasOwnProperty('languages')) {
            job.skills = [...job.languages]

        } else if (job.hasOwnProperty('tools')) {
            job.skills = [...job.tools]
        } else {
            job.skills = []
        }
        delete job.languages
        delete job.tools
    })
    return jobPosts

}

/* Funcion que renderiza la info al documento*/
/*jobsPosts = [{
{
    "id": 1,
    "company": "Photosnap",
    "img": "./images/photosnap.svg",
    "isItNew": true,
    "isItFeatured": true,
    "position": "Senior Frontend Developer",
    "role": "Frontend",
    "level": "Senior",
    "timeStamp": "1d ago",
    "hours": "FullTime",
    "location": "USA Only",
    "skills": ["HTML", "CSS", "JavaScript"]
  },
}]*/
showJobPosts = (jobPosts) => {
    containerPostsDiv.innerHTML = ''
    jobPosts.map(job => {
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
        containerPostsDiv.appendChild(div)

        createPostLi("role", job.role, job.id)
        createPostLi("level", job.level, job.id)
        createPostLi("skills", job.skills, job.id)
    })
}

/* Agrega  Li con los filtros al Post  */
createPostLi = (property, data, id) => {
    let li = ''
    if (property !== "skills") {
        li = document.createElement('li')
        li.dataset[property] = `${data}`
        li.classList.add("item__require")
        li.innerHTML = `${data}`
        addEventListenerPostLi(li)
        document.querySelector(`#N${id}`).appendChild(li)
    } else {
        if (data.length > 0) {
            data.forEach(skill => {
                li = document.createElement('li')
                li.dataset[property] = `${skill}`
                li.classList.add("item__require")
                li.innerHTML = `${skill}`
                addEventListenerPostLi(li)
                document.querySelector(`#N${id}`).appendChild(li)
            })
        }
    }
}

addEventListenerPostLi = (li) => {
    li.addEventListener('click', function (event) {
        const key = event.target.attributes[0].name
        const data = event.target.attributes[0].value
        updateFilterArray(key, data)
    })
}


updateFilterArray = (key, data) => {
    /*Verifico que el dato seleccionado no este repetido*/
    if (filterArray.filter(value => value[key] === data).length === 0) {
        const filterObject = { [key]: data }
        filtertDiv.classList.add('filter--show')
        filterArray.push(filterObject)
        addEventListenerClear(key, data)
        createFilterLi(key, data)
        updateJobsPosts(key, data)
    }
}


/* Agrego evento Listener al buton Clear del filtro*/
addEventListenerClear = (key, data) => {
    document.querySelector('.button__clear').addEventListener('click', function () {
        filtertDiv.classList.remove('filter--show')
        filterUl.innerHTML = ''
        filterArray.length = 0
        //     jobPostArray.length = 0
        jobPostArrayFiltered.length = 0
        showJobPosts(jobPostArray)
    })
}

createFilterLi = (key, data) => {
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
        deleteFilter(e)
        showJobPosts(jobPostArrayFiltered)
    })
    /*Agrego al documento*/
    li.appendChild(button)
    filterUl.appendChild(li)
}


updateJobsPosts = (key, data) => {
    let keyObject = key.substring(5) /*  role  = role-data  */

    /* Verifico que jobPostArrayFiltered (array que contiene todos  los Posts Filtrados) este vacio. 
    Si lo esta filtro  el jobPostArray que tiene todos los posts,
    sino filtro el jobspostArrayfiltered*/
    let jobPostArrayTemp = []

    if (jobPostArrayFiltered.length === 0) {
        jobPostArrayTemp = filterPost(jobPostArray, keyObject, data)
    } else {
        jobPostArrayTemp = filterPost(jobPostArrayFiltered, keyObject, data)
    }

    jobPostArrayFiltered.length = 0
    jobPostArrayFiltered = [...jobPostArrayTemp]
    showJobPosts(jobPostArrayFiltered)

}



filterPost = (array, key, data) => {
    return array.filter(post => {
        switch (key) {
            case 'role':
            case 'level':
                if (post[key] && post[key] === data) {
                    return true
                }
                break;
            case 'skills':
                if (post[key].includes(data)) {
                    return true
                }
                break;
            default:
                break;
        }
    })
}

deleteFilter = (event) => {


    let jobPostArrayTemp = []
    let skillsArray = []
    let roleObjectFilter = ''
    let levelObjectFilter

    eraseFilterElement(event) /* ejemplo:   role, "frontend" */
    /*Filtro filterArray la seleccion */
    filterArray = filterArray.filter(item => data !== item[key])

    /*Recorro filterArray para separar datos, un array con skills y variables para role y level*/
    filterArray.forEach(itemFilter => {
        let propertyName = Object.getOwnPropertyNames(itemFilter)[0]

        if (propertyName === "data-skills") {
            skillsArray.push(itemFilter[propertyName])
        } else if (propertyName === "data-role") {
            roleObjectFilter = itemFilter[propertyName]
        } else {
            levelObjectFilter = itemFilter[propertyName]
        }
    })

    jobPostArrayTemp = jobPostArray.filter(post => {
        let isRoleRequested = false
        let isLevelRequested = false
        let isSkillsRequested = false

         if (roleObjectFilter) {
            if (roleObjectFilter === post.role) {
                isRoleRequested = true
            }
        } else {
            isRoleRequested = true
        }

         if (levelObjectFilter) {
            if (levelObjectFilter === post.level) {
                isLevelRequested = true
            }
        } else {
            isLevelRequested = true
        }

        if (skillsArray) {
            if (skillsArray.every(skill => post.skills.includes(skill))) {
                isSkillsRequested = true
            }
        } else {
            isSkillsRequested = true
        }
 

        if (isRoleRequested && isLevelRequested && isSkillsRequested) {
             return true
        }
    })
    console.log(jobPostArrayTemp)
    jobPostArrayFiltered.length = 0
    jobPostArrayFiltered = [...jobPostArrayTemp]
}




eraseFilterElement = (event) => {
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

}