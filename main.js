let title = document.getElementById("title");
let price = document.getElementById("price");
let tax = document.getElementById("tax");
let ads = document.getElementById("ads");
let count = document.getElementById("count");
let category = document.getElementById("category");
let Allinputs = document.querySelectorAll(".inputs input");
let search = document.getElementById("search");
let tBody = document.getElementById("tbody");
let globIndex;

// delete one btn
let btns = document.getElementsByClassName("delete");
// create btn
let create = document.getElementById("create")
// delete all btn
let delAll = document.getElementById("deleteAll");
// search by title btn
let searhByT = document.getElementById("titleSea");
// search by category btn
let searhByC = document.getElementById("categorySea");


// get total price and show it immediate in page
function getTotal(){
    Allinputs.forEach(ele=>{
            ele.addEventListener("keyup",()=>{
                if(price.value != ""){
                    let result = +price.value + +ads.value + +tax.value + +count.value;
                    document.getElementById("total").innerHTML = result;
                    document.querySelector(".total").style.backgroundColor = "rgb(89 236 181)"
                }
                else {
                    document.getElementById("total").innerHTML = "";
                    document.querySelector(".total").style.backgroundColor = "#ddd"
                }
            })       
    })
}
getTotal();

////////////////////////////////////////////////

// make an array and add data into it , check if the array empty
let dataProducts;
if(localStorage.getItem("products") != null){
    dataProducts = JSON.parse(localStorage.products);
}
else {
    dataProducts = [];
}


// create product and add it in local storage
create.addEventListener("click",()=>{
    let newProduct = {
        title:title.value.toLowerCase().trim(),
        price:price.value,
        tax:tax.value,
        ads:ads.value,
        total:document.getElementById("total").innerHTML,
        count:count.value,
        category:category.value.toLowerCase().trim()
    }

    // handle errors->clean data
    if(title.value.length < 1){
        handleErorr(title);
    }
    else if(category.value.length < 1){
        handleErorr(category);
    }
    else if(count.value < 1 || count.value > 100){
        handleErorr(count);
    }
    else if(ads.value < 1 || ads.value > 100000){
        handleErorr(ads);
    }
    else if(tax.value < 1 || tax.value > 100000){
        handleErorr(tax);
    }
    else if(price.value < 1 || price.value > 100000){
        handleErorr(price);
    }
    else{
        // creat/update product
        if(create.innerHTML == 'create'){
            // count how much products will be shown  
            if(newProduct.count > 1){
                console.log(newProduct.count)
                for(let i = 0; i < newProduct.count; i++){
                    dataProducts.push(newProduct);
                }
            }
            else{
                dataProducts.push(newProduct); // show it once
            }
        }
        else{
            dataProducts[globIndex] = newProduct;
            create.innerHTML = 'create';
            count.style.display = "block"
        }
        // save data in local storage as json(string)
        localStorage.setItem("products",JSON.stringify(dataProducts));
        showData();
        clearData();
        window.scrollTo(0, document.body.scrollHeight)
    }
})


// clear data from inputs to add the new data
function clearData(){
    Allinputs.forEach((ele)=>{
        ele.value = "";
        ele.style.border = "";
        document.getElementById("total").innerHTML = "";
        document.querySelector(".total").style.backgroundColor = "#ddd";
    })
}


// handle my data in html elements
function handleData(i){
    let myEle = '';
        myEle += `
        <tr>
        <td>${i}</td>
        <td>${dataProducts[i].title}</td>
        <td>${dataProducts[i].price}</td>
        <td>${dataProducts[i].tax}</td>
        <td>${dataProducts[i].ads}</td>
        <td>${dataProducts[i].total}</td>
        <td>${dataProducts[i].category}</td>
        <td><button onclick="deleteOne(${i})" class="delete">delete</button></td>
        <td><button onclick="update(${i})" class="update">update</button></td>
        </tr>
        `;
    return myEle;
};

// show data in html 
function showData(){
    let myData = '';
    for(let i = 0; i < dataProducts.length; i++){
        myData += handleData(i);
    }
    tBody.innerHTML = myData;
    
    // make some animation and transition with the result show
    tBody.style.opacity = 1;
    tBody.style.transform = "scale(1)";
    tBody.classList.add("animate__animated","animate__backInLeft")

    // hide the deleteAll button if there is no data
    if(dataProducts.length > 0){
        delAll.style.display = "block"
        delAll.addEventListener("click",()=>{
            deleteAll();
        })
        window.setTimeout(()=>{
        delAll.classList.add("animate__animated","animate__backInLeft")
        })
    }
    else{
        delAll.style.display = "none"
    }
};
showData();


// delete one product
function deleteOne(i){
    dataProducts.splice(i,1);
    localStorage.products = JSON.stringify(dataProducts);
    showData();
}


// delete all products 
function deleteAll(){
    localStorage.clear();
    dataProducts.splice(0);
    showData();
}


// update product
function update(i){
    console.log(dataProducts[i]);
    title.value = dataProducts[i].title
    price.value = dataProducts[i].price
    tax.value = dataProducts[i].tax
    ads.value = dataProducts[i].ads
    count.style.display = 'none';
    category.value = dataProducts[i].category
    document.getElementById("total").innerHTML = dataProducts[i].total
    create.innerHTML = "update";
    globIndex = i;
    scroll({
        top:0,
    })
    title.focus();
}

let mode = "";
// search for products by title/category
function searchMode(id){
    if(id == "titleSea"){
        mode = "searchByTitle";
        search.placeholder = "search by title"
    }
    else{
        mode = "searchByCategory";
        search.placeholder = "search by category"
    }
    search.focus();
}

function getValue(value){
    for(let i = 0; i < dataProducts.length; i++){
        if(mode == "searchByTitle"){
            let myData = '';
                if(dataProducts[i].title.includes(value)){
                    console.log(dataProducts[i]);
                    myData += handleData(i);
                }
                tBody.innerHTML = myData;
        }
        else {
            let myData = '';
                if(dataProducts[i].category.includes(value)){
                    console.log(dataProducts[i]);
                    myData += handleData(i);
                }
            tBody.innerHTML = myData;
        }
    }
};


// handle & throw errors
function handleErorr(input){
    input.style.border = "2px solid red"
    input.focus();
}