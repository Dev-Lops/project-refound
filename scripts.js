//Seleciona os elementos do formulário.
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

//Seleciona os elementos da lista
const expenseList = document.querySelector('ul')
const expenseTotal = document.querySelector('aside header h2')
const expenseQuantity = document.querySelector('aside header p span')

//captura o evento de 'input' para o formatar o valor.
amount.oninput = () => {
  //obtem o valor atual do input e remove os caracteres não numéricos
  let value = amount.value.replace(/\D/g, "")

  //Transformar o valor em centavos.(exemplo: 150/100= 1.5)
  value = Number(value) / 100

  //atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  //Formata o valor no padrão BRL (real brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  //retorna o valor formatado
  return value
}

//Captura o evento de submit do formulario para obter os valores
form.onsubmit = (e) => {
  //previne o comportamento padrão do formulário de enviar dados
  e.preventDefault()

  //cria um novo objeto com os valores do formulário
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  //Chama a função que irá adicionar o item na lista
  expenseAdd(newExpense)
}

//adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    //Cria o elemento de li para adicionar o (li) na lista (ul)
    const expenseItem = document.createElement('li')
    expenseItem.classList.add('expense')

    //Cria o icone da categoria
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute('alt', newExpense.category_name)

    //Cria a info da despesa
    const expenseInfo = document.createElement('div')
    expenseInfo.classList.add('expense-info')

    //cria o nome da despesa
    const expenseName = document.createElement('strong')
    expenseName.textContent = newExpense.expense

    //Cria a categoria da despesa
    const expenseCategory = document.createElement('span')
    expenseCategory.textContent = newExpense.category_name

    //Adciona name e category em expense-info
    expenseInfo.append(expenseName, expenseCategory)

    //Cria o valor da despesa
    const expenseAmount = document.createElement('span')
    expenseAmount.classList.add('expense-amount')
    expenseAmount.innerHTML = `<small>R$</small>${formatCurrencyBRL(newExpense.amount.toUpperCase().replace('R$', ''))}`

    //Cria o icone de remover
    const removeIcon = document.createElement('img')
    removeIcon.classList.add('remove-icon')
    removeIcon.setAttribute('src', 'img/remove.svg')
    removeIcon.setAttribute('alt', 'remover')

    //Adciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adiciona o item na lista
    expenseList.append(expenseItem)

    //atualiza os totais
    updateTotals()
    //Limpa os campos do formulário para adicionar um novo item 
    clearInputs()


  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas")
    console.log(error)
  }
}

//Atualiza os totais
function updateTotals() {
  try {
    //Recupera todos os itens(li) da lista(ul)
    const items = expenseList.children

    //Atualiza a quantidade itens da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`

    //Variável para icrementar o total
    let total = 0
    //Percorre cada item(li) da lista(ul)
    for (let i = 0; i < items.length; i++) {
      //Recupera o valor do item(li)
      const itemAmount = items[i].querySelector('.expense-amount')

      //Remove caracteres não númericos e substitui a virgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.')

      //Converte o valor para float.
      value = parseFloat(value)

      //Verifica se o valor é NaN(Not a Number)
      if (isNaN(value)) {
        return alert('Não foi possivel calcular o total. O valor não parece ser um número')
      }

      //Incrementa o total
      total += Number(value)

    }

    //Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement('small')
    symbolBRL.textContent = 'R$'

    //formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace('R$', '')

    //limpa o conteudo do elemento
    expenseTotal.innerHTML = ''
    //adiciona o símbolo da moeda e o valor total formatado
    expenseTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

//Evento que captura o click nos itens da lista

expenseList.addEventListener('click', (e) => {
  //verifica se o evento é um clique no icone de remover
  if (e.target.classList.contains('remove-icon')) {

    //Obtem a li pai do elemento cliclado
    const item = e.target.closest('.expense')

    //remove o item da lista
    item.remove()
  }

  //atualiza os totais
  updateTotals()
})

//Função para limpar os inputs

function clearInputs() {
  expense.value = ''
  amount.value = ''
  category.value = ''

  //coloca o foco no input de nome da despesa
  expense.focus()
}