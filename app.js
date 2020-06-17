//---------------------------------------Budget-------------------------------------

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

    var calTotal = function(type) {
        var sum = 0
        data.allItems[type].forEach(function(cur) {
            sum += cur.amount;
        });
        data.totals[type] = parseFloat(sum)
    }

    var data = {
        allItems:{
            exp:[],
            inc:[]
        },

        totals: {
            exp: 0,
            inc: 0 
        },
        budget: 0,
        percentage:-1
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
        deleteItem: function(type,id) {
            var ids,index

            ids = data.allItems[type].map(function(current){
                return current.id
            })

            index = ids.indexOf(id)

            if (index !== -1){
                data.allItems[type].splice(index,1)
            }
        },

        calculateBudget: function() {

            // Calculate totals 
            calTotal('inc')
            calTotal('exp')
            // Calculate Net Income
            data.budget = data.totals.inc - data.totals.exp
            // calculate the percantage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc ) * 100 )
            }else {
                data.percentage = -1
            }
            
        },
        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data)
        }
    }

}())


//--------------------------------------UI----------------------------------------------


var UIController = ( function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputAmount: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container'
    }

    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMStrings.inputAmount).value)
            }
        },

        addListItem: function(obj,type) {
            var html,newHtml,element

            // Create HTML placeholder Strings
            if (type === 'inc') { 
                element = DOMStrings.incomeContainer
                html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%Description%</div>
                <div class="right clearfix"><div class="item__value">%Amount%</div>
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div></div></div>`
                } else if (type === 'exp') {
                element = DOMStrings.expensesContainer
                    html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%Description%</div>
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
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },
        clearFields: function() {
            document.querySelector(DOMStrings.inputDescription).value = '';
            document.querySelector(DOMStrings.inputAmount).value = '';
            document.querySelector(DOMStrings.inputDescription).focus();
        },
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%"
            }else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "NA" 
            }
        },
        getDOMStrings: function() {
            return DOMStrings
        }
    }
}())



//------------------------------------------Main----------------------------------------------------

var controller = (function(budgetCtlr, UICtlr) {

    var SetEventListeners = function () {
        var DOM = UICtlr.getDOMStrings()

        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem)

        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()
            }}
        )
        document.querySelector(DOM.container).addEventListener('click',ctrlDelItem)
    
    }
    
    var updateBudget = function() {
        //Calculate the Budget
        budgetCtlr.calculateBudget()
        //Return the budget
        var budget = budgetCtlr.getBudget()
        //Display the Budget on the UI
        UICtlr.displayBudget(budget)
    }
    
    var ctrlAddItem = function() {
        var input,newItem
        //Get input fields 
        input = UICtlr.getInput()
        if (input.description !== "" && !isNaN(input.amount) && input.amount > 0 ) {
            //Add the Item to Budget Controller
            newItem = budgetCtlr.addItem(input.type,input.description,input.amount)
            //Add Item to the UI
            UICtlr.addListItem(newItem,input.type)
            // Clear the fields
            UICtlr.clearFields()
            //Calculate and update budget
            updateBudget()
        }else {
            alert("Input Error: Please Check Input")
        }
        
    }

    var ctrlDelItem = function(event) {
        var itemID,splitID,type,ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        
        if(itemID) {
            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            //Delete from Data
            budgetCtlr.deleteItem(type,ID)
            //Delete Item from UI
            UICtlr.deleteListItem(itemID)
            //Update and show the new Budget
            updateBudget()
        }
    }

    return {
        init: function() {
            console.log('Application Started')
            UICtlr.displayBudget({budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0})
            SetEventListeners()
        }
    }

}(budgetController,UIController))


controller.init()

