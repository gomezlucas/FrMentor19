/* Defino Variables */
let filterArray = []
let filtertDiv = document.querySelector('.filter')
let containerPostsDiv = document.querySelector('.container')
let filterUl = document.querySelector('.filter__options')
let jobPostArray = [] //U: todos los job postings 
let jobPostArrayFiltered = [] //U: los filtrados hasta ahora


//CONSEJO: que las funciones se puedan probar desde la consola
const appInit= async function () {
    const dataJson = './data.json'
    const JobPostResponseJson = await fetch(dataJson)
    const JobPostResponse = await JobPostResponseJson.json()
    jobPostArray = await formatJobPostResponse(JobPostResponse)
		jobPostArrayFiltered = jobPostArray //A: inicialmente todos
    await showJobPosts(jobPostArray)
};

/* Luego de Cargar la pagina*/
document.addEventListener("DOMContentLoaded", appInit);



//CONSEJO: si vas a declarar las funciones asi, la gente les pone const (aunque es un embole porque no las podes ir corrigiendo en la consola)

/* Dentro del objeto: join de los Array languajes y tools,
{... "languages": ["HTML", "JavaScript"], "tools": ["React"]  
      = "skills" : ["HTML", "JavaScript","React"]
*/
formatJobPostResponse = (jobPosts) => {
    jobPosts.forEach(job => {
				/* CONSEJO: trata de que tus estructuras tengan ej. siempre un array (normaliza)
 				* o usa un default, lucha para que tu codigo sea legible :)
 				* Tambien podrias haber usado .concat de array con un if por key
 				* tipo

 				job.skills= []; //DFLT
				['languages','tools'].forEach(k => {
					if (job.hasOwnProperty(k)) {
						job.skills= job.skills.concat(job[k]);
					}
				});

        if (job.hasOwnProperty('languages') && job.hasOwnProperty('tools')) {
            job.skills = [...job.languages, ...job.tools]
        } else if (job.hasOwnProperty('languages')) {
            job.skills = [...job.languages]
        } else if (job.hasOwnProperty('tools')) {
            job.skills = [...job.tools]
        } else {
            job.skills = []
        }
				*/
				job.skills= [ ... (job.languages || []) , ... (job.tools || [])];

        delete job.languages //CONSEJO: OjO con delete, googlea los efectos ...
        delete job.tools
    })
    return jobPosts

}

/* Generar html para mostrar en el documento

Los datos tiene este forma 

jobsPosts = [{
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
}]

*/
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
//CONSEJO: si ves repetido, convertilo en funcion!
createLi = (property, data, id) => {
	li = document.createElement('li')
	li.dataset[property] = `${data}`
	li.classList.add("item__require")
	li.innerHTML = `${data}`
	addEventListenerPostLi(li)
	document.querySelector(`#N${id}`).appendChild(li)
}

createPostLi = (property, data, id) => {
    let li = ''
    if (property !== "skills") { 
			createLi(property, data, id);
    } else {
      data.forEach(skill => createLi(property, skill, id))
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
    if (filterArray.find(value => value[key] === data)==null) {
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
        //     CONSEJO: si usas git, no dejes codigo muerto ... lo podes recuperar del history
        //     jobPostArray.length = 0
        jobPostArrayFiltered= jobPostArray //A: todos
        showJobPosts(jobPostArrayFiltered)
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

//CONSEJO: mantene una variable siempre con el mismo sentido, ej. jobPostArrayFiltered tiene SIEMPRE los posts "filtrados hasta ahora" que pueden ser todos ...

updateJobsPosts = (key, data) => {
    let keyObject = key.substring(5) /*  role  = role-data  */

    jobPostArrayFiltered = filterPost(jobPostArrayFiltered, keyObject, data)
		//A: filtro un poco mas los que ya tenia filtrados (que tal vez eran todos)
    showJobPosts(jobPostArrayFiltered)
}

//CONSEJO: a veces rinde que el switch devuelva la funcion que vas a usar, porque anda mas rapido y porque la podes probar aparte
//U: devuevle una funcion para filtrar los posts con el criterio deseado o null
filterPost_f = (key, data) => {
		switch (key) {
				case 'role':
				case 'level':
						return ((post) => (post[key] && post[key] === data));
						break;
				case 'skills':
						return ((post) => (post[key].includes(data))); 
						break;
				default:
						console.error('filterPost_f Unknown filter');
						break;
		}
		return null;
}

filterPost = (jobPosts, key, data) => {
		var filter_f= filterPost_f(key, data);
		X= filter_f
    return (filter_f==null ? jobPosts : jobPosts.filter(filter_f)) 
}

deleteFilter = (event) => {
    let skillsArray = []
    let roleObjectFilter
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

		//CONSEJO: las condiciones en un && u || se evaluan de izq a der, entonces te podes ahorrar evaluaciones si las escribis juntas asi, ademas se lee mejor
    jobPostArrayFiltered= jobPostArray.filter(post => {
				return (roleObjectFilter==null || roleObjectFilter === post.role)
				       && (levelObjectFilter==null || levelObjectFilter === post.level) 
				       && (skillsArray.length==0 || skillsArray.every(skill => post.skills.includes(skill))) 
    })
}




eraseFilterElement = (event) => {
		let e;
    switch (event.srcElement.tagName) {
        case 'path':
            e= event.target.parentNode.parentNode.parentNode
            break;
        case 'svg':
            e= event.target.parentNode.parentNode
            break;
        case 'BUTTON':
            e= event.target.parentNode
            break;
    }

		if (e!=null) {
			e.remove()
			data = e.attributes[0].value
			key = e.attributes[0].name
		}
}
