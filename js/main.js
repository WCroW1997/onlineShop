const addNewBtn = document.querySelector('.add__new')


if(!localStorage.getItem('goods')){
    localStorage.setItem('goods', JSON.stringify([]))
}

let myModal =  new bootstrap.Modal(document.getElementById('exampleModal'), {keyboard: false})

let options = {
    valueNames: ['name', 'price ']
}

let userList

addNewBtn.addEventListener('click', function(e){
    let name = document.querySelector('#good__name').value
    let price = document.querySelector('#good__price').value
    let count = document.querySelector('#good__count').value
    if(name && price && count){
        document.querySelector('#good__name').value = ''
        document.querySelector('#good__price').value = ''
        document.querySelector('#good__count').value = '1'
        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good' + goods.length , name, price, count, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))
        update__goods()
        myModal.hide()
    } else{
        Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Заполните поля',
          })
    }
    
})





function update__goods() {
    let resultPrice = 0
    let tbody = document.querySelector('.list')
    let cart = document.querySelector('.cart')
    tbody.innerHTML = ""
    cart.innerHTML = ""
    let goods = JSON.parse(localStorage.getItem('goods'))
    if (goods.length) {
        table1.hidden = false
        table2.hidden = false
        for (let i = 0; i < goods.length; i++) {
            tbody.insertAdjacentHTML('beforeend', 
            `
            <tr class="align-middle">
                <td>${i+1}</td>
                <td class="name">${goods[i][1]}</td>
                <td class="price">${goods[i][2]}</td>
                <td>${goods[i][3]}</td>
                <td><button class="good__delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                <td><button class="good__delete btn-primary" data-goods="${goods[i][0]}">&#10149;</button></td>
            </tr>
            `
            )
            if (goods[i][4]>0) {
                goods[i][6] = goods[i][4]*goods[i][2] - goods[i][4]*goods[i][2]*goods[i][5]*0.01
                resultPrice += goods[i][6]
                cart.insertAdjacentHTML('beforeend', 
                `
                <tr class="align-middle">
                    <td>${i+1}</td>
                    <td class="price__name">${goods[i][1]}</td>
                    <td class="price__number">${goods[i][2]}</td>
                    <td class="price__count">${goods[i][4]}</td>
                    <td class="price__discount"><input type="text" data-goodit="${goods[i][0]}" value="${goods[i][5]}" min="0" max="100"></td>
                    <td>${goods[i][6]}</td>
                    <td><button class="good__delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                </tr>
                `
                )
            }
            
        }
        userList = new List('goods', options)
    } else{
        table1.hidden = true
        table2.hidden = true
    }
    document.querySelector('.price__result').innerHTML = resultPrice + '&#8372;'
}

update__goods()


document.querySelector('.list').addEventListener('click', function(e){
    if (!e.target.dataset.delete) {
        return
    }
    Swal.fire({
        title: 'Внимание!',
        text: 'Вы действительно хотите удалить товар?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да',
        cancelButtonText: 'Отмена',
    }).then((result)=>{
        if (result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem('goods'))
            for (let i = 0; i < goods.length; i++) {
                if(goods[i][0] == e.target.dataset.delete){
                    goods.splice(i, 1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    update__goods()
                }
            }
            Swal.fire(
                'Удалено',
                'Выбранный товар был удален.',
                'success'
            )
        }
    })
})

document.querySelector('.list').addEventListener('click', function(e){
    if (!e.target.dataset.goods) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
        for (let i = 0; i < goods.length; i++) {
            if(goods[i][3]>0 && goods[i][0] == e.target.dataset.goods){
                goods[i].splice(3, 1, goods[i][3]-1)
                goods[i].splice(4, 1, goods[i][4]+1)
                localStorage.setItem('goods', JSON.stringify(goods))
                update__goods()
            }
        }
})


document.querySelector('.cart').addEventListener('click', function(e){
    if (!e.target.dataset.delete) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
        for (let i = 0; i < goods.length; i++) {
            if(goods[i][4]>0 && goods[i][0] == e.target.dataset.delete){
                goods[i].splice(3, 1, goods[i][3]+1)
                goods[i].splice(4, 1, goods[i][4]-1)
                localStorage.setItem('goods', JSON.stringify(goods))
                update__goods()
            }
        }
})

document.querySelector('.cart').addEventListener('input', function(e){
    if (!e.target.dataset.goodit) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
        for (let i = 0; i < goods.length; i++) {
            if(goods[i][0] == e.target.dataset.goodit){
                goods[i][5] = e.target.value
                goods[i][6] = goods[i][4]*goods[i][2] - goods[i][4]*goods[i][2]*goods[i][5]*0.01
                localStorage.setItem('goods', JSON.stringify(goods))
                update__goods()
                let input = document.querySelector(`[data-goodit="${goods[i][0]}"]`)
                input.focus()
                input.selectionStart = input.value.length
            }
        }
})