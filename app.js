var budgetController = ( function() {
    var Expenses = function(id,description,amount) {
        this.id = id,
        this.description = description,
        this.amount = amount
    }

    var Income = function(id,description,amount) {
        this.id = id,
        this.description = description,
        this.amount = amount
    }

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },

        totals: {
            exp: 0,
            inc: 0 
        }
    }

    return{
        addItem: function(type,des,amt) {
            var ID, newItem
            // Create a new ID
            if (data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            // Create new item based on 'inc' or 'exp'
           if (type === 'exp'){
               newItem = new Expenses(ID,des,amt)
           } else if (type === 'inc') {
               newItem = new Income(ID,des,amt)
           } 

           data.allItems[type].push(newItem)

           return newItem
        },
        testing: function(){
            console.log(data)
        }
    }

}())





var UIController = ( function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputAmount: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list'
    }

    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                amount: document.querySelector(DOMStrings.inputAmount).value
            }
        },

        addListItem: function(obj,type) {
            var html,newHtml,element

            // Create HTML placeholder Strings
            if (type === 'inc') { 
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%Description%</div><div class="right clearfix"><div class="item__value">%Amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                } else if (type === 'exp') {
                element = DOMStrings.expensesContainer
                    html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%Description%</div>
                    <div class="right clearfix"><div class="item__value">%Amount%</div>
                    <div class="item__percentage">21%</div><div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div></div></div>`
            }
            
            //Replace with HTML with actual data
            newHtml = html.replace('%id%',obj.id)
            newHtml = newHtml.replace('%Description%',obj.description)
            newHtml = newHtml.replace('%Amount%',obj.amount)
            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
        },
        getDOMStrings: function() {
            return DOMStrings
        }
    }
}())





var controller = (function(budgetCtlr, UICtlr) {

    var SetEventListeners = function () {
        var DOM = UICtlr.getDOMStrings()

        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem)
        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()
            }}
        )}

    
    var ctrlAddItem = function() {
        var input,newItem
        //Get input fields 
        input = UICtlr.getInput()
        //Add the Item to Budget Controller
        newItem = budgetCtlr.addItem(input.type,input.description,input.amount)
        //Add Item to the UI
        UICtlr.addListItem(newItem,input.type)
        //Calculate the Budget

        //Display the Budget on the UI
    }

    return {
        init: function() {
            console.log('Application Started')
            SetEventListeners()
        }
    }

}(budgetController,UIController))


controller.init()

