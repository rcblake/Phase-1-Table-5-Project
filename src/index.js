
//////global constants/////

//search Bar/Nav constants (nolan)
const entireSearchNav = document.querySelector("#searchNav");
const formSearchInput = document.querySelector("#searchInput");
const searchFilterDD = document.querySelector("#searchFilter");
const ingrFilter = document.querySelector("#ingrFilter");
const nameFilter = document.querySelector("#nameFilter");
const searchForm = document.querySelector("#searchForm");

//card constants (shiyao)
const cards = document.querySelector('.cards')
const modelDtl = document.querySelector('#detailed-modal')
const modalName = document.getElementById('drink-name-modal')
const modalImg = document.getElementById('img-modal')
const ingAndMea = document.getElementById('ingredient-measure')
const modalInst = document.getElementById('instructions-modal')
const meaTable = document.querySelector('.Measure')
const ingTable = document.getElementById('ingredient')

//buttons n stuff constants:
const surpriseBtn = document.querySelector('#random-filter-btn')
const popularBtn = document.querySelector('#most-popular-btn')
const latestDrinksBtn = document.querySelector('#new-recipies-btn')

//functions

//This is the initial fetch for Random on page load but also to be used for the random preset
const fetchDrink = () => {
  fetch("https://www.thecocktaildb.com/api/json/v2/9973533/randomselection.php")
    .then((resp) => resp.json())
    .then((drinkData) => {
      drinkData.drinks.forEach((drink) => {
        renderDrink(drink);
      });
    });
};
fetchDrink();

const userSearchByName = (drinkName) => {
    const input = (formSearchInput.value)
    const URLinput = encodeURI(input.replace(' ','_'));
   // console.log(URLinput)
   const query = drinkName ? drinkName : URLinput 
   const searchNameUrl = 'https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=' + query
    fetch(searchNameUrl)
    .then(res => res.json())
    .then(searchedArray => {
        searchedArray.drinks.forEach(drink => {
            renderDrink(drink)
        })
    })
}

const userSearchByIngredient = () => {
    const input = (formSearchInput.value)
    URLinput = encodeURI(input.replace(' ','_'));
    const searchNameUrl = 'https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=' + URLinput
    console.log(URLinput)
    fetch(searchNameUrl)
    .then(res => res.json())
    .then(searchedArray => {
        const namesArray = searchedArray.drinks.map(drink =>{
        return drink.strDrink
        })
        namesArray.forEach(userSearchByName)
    })
}

const renderDrink = (drink) => {
  const card = document.createElement('div')
  card.className = 'single-card'
  cards.appendChild(card)
  const drinkImg = document.createElement('img')
  drinkImg.className = 'drink-img'
  drinkImg.src = drink.strDrinkThumb
  const drinkName = document.createElement('div')
  drinkName.className = 'drink-info'
  drinkName.innerText = drink.strDrink
  card.append(drinkImg, drinkName)
  drinkInfo(drink, drinkName)
  
  
  card.dataset.checkBoxTags = [
  drink.strAlcoholic,
  drink.strIngredient1,
  drink.strIngredient2,
  drink.strCategory,
];
  
  drinkImg.addEventListener('click', () => handleDrink(drink))
}

const column1 = (drink) => {
  ingTable.innerHTML = '';
  (ingredientList(drink)).forEach(ingredient => {
    const createIng = document.createElement('td')
    createIng.innerText = ingredient
    ingTable.append(createIng)
  })
}
const column2 = (drink) => {
  meaTable.innerHTML = '';
  (measureList(drink)).forEach(measure => {
    const createMea = document.createElement('td')
    createMea.innerText = measure
    meaTable.append(createMea)
  })
}

const handleDrink = (drink) => {

  modalImg.remove()
  modalInst.remove()

  modalImg.src = drink.strDrinkThumb
  modalName.innerText = drink.strDrink
  column1(drink)
  column2(drink)
  modalInst.textContent = drink.strInstructions

  modelDtl.append(modalInst, modalImg)
}

const ingredientList = (drink) => {
    let ingreKeyArr = Object.keys(drink).filter(keys => {
        return keys[12] === 't'
    })
    const ingreArr = []
    for (let i = 0; i < ingreKeyArr.length; i++ ){
      if (drink[ingreKeyArr[i]]){
        ingreArr.push(drink[ingreKeyArr[i]])
      }
    }
    return ingreArr
}

const measureList = (drink) => {
  let meaKeyArr = Object.keys(drink).filter(keys => {

      return keys[3] === 'M'
  })
  const meaArr = []
  for (let i = 0; i < meaKeyArr.length; i++ ){
    if (drink[meaKeyArr[i]]){
      meaArr.push(drink[meaKeyArr[i]])
    }
  }
  return meaArr
}

const drinkInfo = (drink, drinkName) => {
  const drinkType = document.createElement('li')
  drinkType.textContent = drink.strAlcoholic
  const drinkIng1 = document.createElement('li')
  drinkIng1.textContent = drink.strIngredient1
  drinkName.append(drinkType, drinkIng1)
}



//Initial Page fetch with 10 random drinks for
function fetchRandom() {
  fetch("https://www.thecocktaildb.com/api/json/v2/9973533/randomselection.php")
    .then(res => res.json())
    .then(randomDrinksArray => randomDrinksArray.drinks.forEach(oneRandomDrink =>renderDrink(oneRandomDrink)));
}

///event listeners:
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  cards.innerHTML = "";
  userSearchByName();
});

//preset filter section

document.addEventListener("click", (e) => {
  const isPresetFilter = e.target.classList.contains("preset-filter-btn"); //adding event listen to each preset filter box
  const presetURLAdd = e.target.value;
  if (isPresetFilter) {
    fetch(
      `https://www.thecocktaildb.com/api/json/v2/9973533/${presetURLAdd}.php`
    )
      .then((res) => res.json())
      .then((drinkData) => {
        cards.innerHTML = "";
        drinkData.drinks.forEach((drink) => {
          renderDrink(drink);
        });
      });
  }
});

//filter section

const checkBoxForm = document.getElementById("filter-section-form");

document.addEventListener("change", (e) => {
  const isCheckBoxClick = e.target.classList.contains("filter-input"); // adding event listener to eachcheckbox (with matching class)
  console.log("checkbox got clicked"); // This works!
});
