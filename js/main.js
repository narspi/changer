const preloader = document.getElementById('preloaderbg');
const burgerBtn = document.querySelector(".header__burger");
const burgerBtnClose = document.querySelector(".header__menu-close");
const menu = document.querySelector(".menu");

const exchangeForm = document.querySelector(".exchange-form");
const btnSwap = document.querySelector(".exchange-form__swap");
const btnSubmit = document.querySelector(".exchange-form__btn");

const selects = document.querySelectorAll('.exchange-form__select select');

const imagecryptocurrency = document.querySelector('.swap-cryptocurrency .exchange-form__pic-svg');
const imagePayment = document.querySelector('.exchange-form__img');

const iconExchangeFormSwapCryptocurrency = document.querySelector('.exchange-form__swap-cryptocurrency');
const iconExchangeFormSwapPayment = document.querySelector('.exchange-form__swap-payment');
const logoIcon = document.querySelector('.logo__icon');

const noticeCryptocurrency = document.querySelector('.exchange-form__notice-cryptocurrency');
const noticePirce = document.querySelector('.exchange-form__notice-price');

const outputInputs = exchangeForm.querySelectorAll('.exchange-form__input');

let arrChoices = {};

const changeExchangeFormEvent = (e) => {
    const select = e.target;
    const name = select.name;
    const checkedOption = select.querySelector('option:checked');
    const value = checkedOption.value;
    const textInput = checkedOption.textContent;
    const url = arrChoices[name][value].url;
    if (name === 'cryptocurrency') {
        imagecryptocurrency.children[0].setAttribute('xlink:href', url);
        iconExchangeFormSwapCryptocurrency.children[0].setAttribute('xlink:href', url);
        logoIcon.children[0].setAttribute('xlink:href', url);
        noticeCryptocurrency.textContent = textInput;
        noticePirce.textContent = arrChoices[name][value].price;
        const cryptocurrencyInput = exchangeForm.querySelector('.swap-cryptocurrency .exchange-form__input');
        const paymentInput = exchangeForm.querySelector('.swap-payment .exchange-form__input');
        cryptocurrencyInput.value = 1;
        paymentInput.value = arrChoices[name][value].price;
    }

    if (name === 'payment') {
        imagePayment.setAttribute('src', url);
        iconExchangeFormSwapPayment.setAttribute('src', url);
    }

}

const objSettings = {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: "",
    allowHTML: false,
};

fetch('data.json').then(res => res.json()).then(data => {
    arrChoices = data;
    document.body.style.overflow = 'auto';
    preloader.classList.add('hide');
    let i = 0;
    for (name in arrChoices) {
        selects[i].name = name;
        for (value in arrChoices[name]) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = arrChoices[name][value].text;
            selects[i].append(option)
        }
        i++;
    }
    selects.forEach(select => {
        const elem = new Choices(select, objSettings);
        select.addEventListener('change', changeExchangeFormEvent);
    });
});

const outputChangeFoo = function () {
    const input = this;
    const value = this.value;
    const select = exchangeForm.querySelector('.swap-cryptocurrency select');
    const name = select.name;
    const option = select.querySelector('option');
    const valueOption = option.value;
    const price = arrChoices[name][valueOption].price;


    if (value.length === 0) {
        input.value = 0;
    }

    if (input.closest('.swap-cryptocurrency') && !input.hasAttribute('readonly')) {
        const regTest = /[^+\d]/g;
        if (value.length === 2 && value[0] === '0') {
            input.value = value[1];
        }

        if (regTest.test(value)) {
            let changedValue = value.replace(/[^0-9]/g, '');
            input.value = changedValue;
        }
        const currentValue = input.value;
        const numberCurrentValue = Number(currentValue);
        const paymentInput = exchangeForm.querySelector('.swap-payment .exchange-form__input');
        const total = numberCurrentValue * price;
        if (total === 0) {
            paymentInput.value = 0;
        } else {
            paymentInput.value = total.toFixed(2);
        }
    }

    if (input.closest('.swap-payment') && !input.hasAttribute('readonly')) {
        if (value.length === 2 && value[0] === '0' && value[1] !== '.' && value[1] !== ',') {
            const regTest = /[^0-9]/;
            if (regTest.test(value[1])) {
                input.value = 0;
            } else {
                input.value = value[1];
            }
        }

        const regTest = /^([0-9]+|[0-9]+[\.\,]{0,1}[0-9]*)$/;

        const checkLength = (arr) => {
            if (arr === null) return 0;
            return arr.length;
        }

        if (value.length !== 0 && !regTest.test(value)) {
            let changedValue = value.replace(/[^0-9.,]+/g, '');
            changedValue = changedValue.replace(/\.{2}/g, '.');
            changedValue = changedValue.replace(/\,{2}/g, ',');
            changedValue = changedValue.replace(/\,\./g, ',');
            changedValue = changedValue.replace(/\.\,/g, '.');
            if (checkLength(changedValue.match(/\./g)) === 2) {
                changedValue = changedValue.replace(/\.{1}$/, '');
            }
            if (checkLength(changedValue.match(/\,/g)) === 2) {
                changedValue = changedValue.replace(/\,{1}$/, '');
            }
            if (changedValue.match(/\,/g) && changedValue.match(/\./g)) {
                changedValue = changedValue.replace(/\.{1}$/, '');
                changedValue = changedValue.replace(/\,{1}$/, '');
            }
            input.value = changedValue;
        }

        const currentValue = input.value;
        const numberCurrentValue = Number(currentValue);
        const cryptocurrencyInput = exchangeForm.querySelector('.swap-cryptocurrency .exchange-form__input');
        const count = numberCurrentValue / price;
        cryptocurrencyInput.value = Math.floor(count);
    }
};

outputInputs.forEach(input => {
    input.addEventListener('input', outputChangeFoo)
});

const clickFooBurger = (event) => {
    const target = event.target;
    menu.classList.toggle("active");
    if (target.closest(".header__burger")) {
        document.body.style.overflow = "hidden";
    }
    if (target.closest(".header__menu-close")) {
        document.body.style.overflow = null;
    }
};

const clickFooSwap = function () {
    const swapBtn = this;
    const inputCard = exchangeForm.querySelector(".swap-payment input");
    const titleCard = exchangeForm.querySelector(
        ".swap-payment .exchange-form__title span"
    );
    const inputCryptocurrency = exchangeForm.querySelector(".swap-cryptocurrency input");
    const titleCryptocurrency = exchangeForm.querySelector(
        ".swap-cryptocurrency .exchange-form__title span"
    );
    const inputHidden = exchangeForm.querySelector(
        ".exchange-form__state-exchange"
    );
    if (exchangeForm.classList.contains("swap")) {
        exchangeForm.classList.remove("swap");
        inputCard.setAttribute("readonly", "");
        inputCryptocurrency.removeAttribute("readonly");
        inputHidden.value = "bit";
        titleCard.textContent = "Receive";
        titleCryptocurrency.textContent = "Send";
        swapBtn.prepend(iconExchangeFormSwapCryptocurrency);
        swapBtn.append(iconExchangeFormSwapPayment);
    } else {
        exchangeForm.classList.add("swap");
        inputCard.removeAttribute("readonly");
        inputCryptocurrency.setAttribute("readonly", "");
        inputHidden.value = "card";
        titleCard.textContent = "Send";
        titleCryptocurrency.textContent = "Receive";
        swapBtn.append(iconExchangeFormSwapCryptocurrency);
        swapBtn.prepend(iconExchangeFormSwapPayment);
    }
};

const exchangeFormFooSubmit = (e) => {
    e.preventDefault();
};

const clickFooToSubmit = () => {
    exchangeForm.submit();
};

exchangeForm.addEventListener("submit", exchangeFormFooSubmit);
burgerBtn.addEventListener("click", clickFooBurger);
burgerBtnClose.addEventListener("click", clickFooBurger);
btnSwap.addEventListener("click", clickFooSwap);
btnSubmit.addEventListener("click", clickFooToSubmit);


const updateExchangeForm = () => {
    const select = exchangeForm.querySelector('.swap-cryptocurrency select');
    const name = select.name;
    const option = select.querySelector('option');
    const valueOption = option.value;
    const price = arrChoices[name][valueOption].price;
    const inputCryptocurrency = exchangeForm.querySelector('.swap-cryptocurrency .exchange-form__input');
    const inputPayment = exchangeForm.querySelector('.swap-payment .exchange-form__input');
    noticePirce.textContent = price;
    if (exchangeForm.classList.contains('swap')) {
        const number = Number(inputPayment.value);
        const count = Math.floor(number/price);
        inputCryptocurrency.value = count;
    } else {
        const number = Number(inputCryptocurrency.value);
        const total = number * price;
        inputPayment.value = total.toFixed(2);
    }
};


let timerId = setInterval(() => {
    fetch('data.json').then(res => res.json()).then(data => {
        arrChoices = data;
        updateExchangeForm();
    })
}, 1000);