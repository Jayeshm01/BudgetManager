//---------------------------------------Budget-------------------------------------

var budgetController = ( function() {
    var Expenses = function(id,description,amount) {
        this.id = id,
        this.description = description,
        this.amount = amount
        this.percentage = -1
    }

    Expenses.prototype.calPercentages = function(totalIncome) {
        if (totalIncome > 0) {
        this.percentage = Math.round((this.amount / totalIncome) * 100 )
        } else  {
            this.percentage = -1
        }
    }

    Expenses.prototype.getPercentages = function() {
        return this.percentage
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
        calculatePercentage: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calPercentages(data.totals.inc)
            })
            },
        getPercentage: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentages()
            })
            return allPerc
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
        container:'.container',
        expensesPerLab:'.item__percentage',
        dateLabel:'.budget__title--month'
    }

    var formatNumber = function(num,type){
        var numSplit,int,dec,sign
        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]
        if (int.length > 3){
            int = int.substr(0,int.length-3) + "," + int.substr(int.length -3 ,int.length)
        }
        dec = numSplit[1]

        return (type === 'exp' ?"-" :"+") + ' ' + int +'.'+ dec
    }

    var nodeList = function(list,callback) {
        for (var i=0; i< list.length;i++){
            callback(list[i],i)
        }
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
            newHtml = newHtml.replace('%Amount%',formatNumber(obj.amount,type))
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
            var typ
            obj.budget > 0 ? typ ='inc' : 'exp'

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,typ)
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc')
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp')
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%"
            }else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "NA" 
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesPerLab)

           
            nodeList(fields,function(current,index){
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                }else {
                    current.textContent = "NA"
                }
            })
        },
        displayMonth: function() {
            var now = new Date()
            months = ['January','Febraury','March','April','May','June','July','August','September','October','November','December']
            month = now.getMonth()
            year = now.getFullYear()
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year
        },
        changedType:  function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + "," +
                DOMStrings.inputDescription + "," +
                DOMStrings.inputAmount
            )

            nodeList(fields,function(cur){
                cur.classList.toggle('red-focus')
            })

            document.querySelector(DOMStrings.inputButton).classList.toggle('red')

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
        document.querySelector(DOM.inputType).addEventListener('change', UICtlr.changedType)
    }
    
    var updateBudget = function() {
        //Calculate the Budget
        budgetCtlr.calculateBudget()
        //Return the budget
        var budget = budgetCtlr.getBudget()
        //Display the Budget on the UI
        UICtlr.displayBudget(budget)
    }

    var updatePercentages = function() {
        //Calculate %ages
        budgetCtlr.calculatePercentage()
        //Read from Budget controller
        var percentages = budgetCtlr.getPercentage()
        //Update UI to display
        UICtlr.displayPercentages(percentages)
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
            //update %age
            updatePercentages()
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
            //Update Percentage
            updatePercentages()
        }
    }

    return {
        init: function() {
            console.log('Application Started')
            UICtlr.displayMonth()
            UICtlr.displayBudget({budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0})
            SetEventListeners()
        }
    }

}(budgetController,UIController))


controller.init()

