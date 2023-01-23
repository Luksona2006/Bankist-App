'use strict'

const accounts = [
    {
        owner: 'Jonas Schmedtmann',
        movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
        interestRate: 1.2, // %
        pin: 1111,
        movementsDates: [
            '2023-01-19T01:17:12.178Z',
            '2023-01-18T07:42:02.383Z',
            '2023-01-12T09:15:04.904Z',
            '2023-01-01T10:17:24.185Z',
            '2022-12-25T14:11:59.604Z',
            '2022-12-02T17:01:17.194Z',
            '2022-08-11T23:36:17.929Z',
            '2022-01-02T10:51:36.790Z'
        ],
        currency: 'EUR',
        locale: 'pt-PT'
    },
    {
        owner: 'Jessica Davis',
        movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
        interestRate: 1.5,
        pin: 2222,
        movementsDates: [
            '2023-01-19T00:11:53.178Z',
            '2023-01-06T12:21:34.383Z',
            '2023-01-02T02:35:52.904Z',
            '2023-01-01T09:12:11.185Z',
            '2022-12-24T19:14:34.604Z',
            '2022-12-02T15:25:52.194Z',
            '2022-08-11T22:17:23.929Z',
            '2022-01-02T02:31:41.790Z'
        ],
        currency: 'USD',
        locale: 'en-US'
    }
];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalanceSpan = document.querySelector('.balance__value-div').querySelector('span');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const popUpError = document.querySelector('.popUp-error');
const blurPopUp = document.querySelector('.blur')
const popUpErrorText = popUpError.querySelector('p');
const popUpLoading = document.querySelector('.popUp-loading')

const popUpTransfers = document.querySelector('.popUp-transfers')
const btnConfirmTrans = document.querySelector('#confirm');
const popUpTransferText = document.querySelector('.transfer__text')
const btnCancelTrans = document.querySelector('#cancel');
const btnLoginIcon = document.querySelector('.login__icon')
const btnLogOut = document.querySelector('.logOut__btn')
const loginPopUp = document.querySelector('.login')
const registerBtn = document.querySelector('.register__btn')

const registerPopUp = document.querySelector('.register')
const registerName = document.querySelector('.register__input--name');
const registerSurname = document.querySelector('.register__input--surname');
const registerPin = document.querySelector('.register__input--pin');
const registerCurrency = document.querySelector('.register__input--currency');
const registerLocale = document.querySelector('.register__input--locale');
const createAccount = document.querySelector('.create__btn')
const popUpHide = document.querySelectorAll('.popUp__hide')

/////////////////////////////////////////////////
// Functions

// Input Default values

const deffaultStyles = function (inputs) {
    inputs.forEach(function(input) {
        input.style.border = '1px solid rgba(0, 0, 0, 0.281)'
        if(input !== inputLoginUsername && input !== inputLoginPin) {
            input.previousElementSibling.querySelector('label').style.color = '#444'
            input.previousElementSibling.querySelector('span').style.opacity = '0'
            input.previousElementSibling.querySelector('span').style.display = 'none'
        }
        input.value = ''
    })
}

// Create user names 

const createUserNames = function (accounts) {
    accounts.forEach(element => element.username = element.owner.toLowerCase().split(' ').map(name => name[0]).join(''))
};

createUserNames(accounts)


const createAccountFunc = function (e) {
    e.preventDefault();
    let register = true;
    [registerName, registerSurname, registerPin, registerCurrency, registerLocale].forEach(element => {
        if (element.value === '') {
            element.style.border = '1px solid #e52a5a'
            element.previousElementSibling.querySelector('label').style.color = '#e52a5a'
            element.previousElementSibling.querySelector('span').innerText = 'Can\'t be empty'
            element.previousElementSibling.querySelector('span').style.display = 'block'
            element.previousElementSibling.querySelector('span').style.opacity = '1'
            register = false;
        } else {
            element.style.border = '1px solid rgba(0, 0, 0, 0.281)'
            element.previousElementSibling.querySelector('label').style.color = '#444'
            element.previousElementSibling.querySelector('span').style.opacity = '0'
            element.previousElementSibling.querySelector('span').style.display = 'none'
        }
    });

    [registerName, registerSurname, registerCurrency, registerLocale].forEach(element => {
        if (/\d+/.test(element.value)) {
            element.style.border = '1px solid #e52a5a'
            element.previousElementSibling.querySelector('label').style.color = '#e52a5a'
            element.previousElementSibling.querySelector('span').innerText = 'Without numbers'
            element.previousElementSibling.querySelector('span').style.display = 'block'
            element.previousElementSibling.querySelector('span').style.opacity = '1'
            register = false;
        }
    });

    if (registerPin.value.length !== 4 && !/[a-z]+/.test(registerPin.value)) {
        registerPin.style.border = '1px solid #e52a5a'
        registerPin.previousElementSibling.querySelector('label').style.color = '#e52a5a'
        registerPin.previousElementSibling.querySelector('span').innerText = 'Only numbers (4)'
        registerPin.previousElementSibling.querySelector('span').style.display = 'block'
        registerPin.previousElementSibling.querySelector('span').style.opacity = '1'
        register = false;
    }

    if(registerLocale.value.length !== 5 || registerLocale.value[2] !== '-') {
        registerLocale.style.border = '1px solid #e52a5a'
        registerLocale.previousElementSibling.querySelector('label').style.color = '#e52a5a'
        registerLocale.previousElementSibling.querySelector('span').innerText = 'Wrong Format'
        registerLocale.previousElementSibling.querySelector('span').style.display = 'block'
        registerLocale.previousElementSibling.querySelector('span').style.opacity = '1'
        register = false;
    }    

    if (register) {
        accounts.push({
            owner: `${registerName.value[0].toUpperCase() + registerName.value.slice(1)} ${registerSurname.value[0].toUpperCase() + registerSurname.value.slice(1)}`,
            movements: [Math.floor(Math.random() * 600) + 150],
            interestRate: 1.05, // %
            pin: +registerPin.value,
            movementsDates: [new Date().toISOString()],
            currency: `${registerCurrency.value.toUpperCase()}`,
            locale: `${registerLocale.value.slice(0,2) + registerLocale.value.slice(2,5).toUpperCase()}`
        })

        createUserNames(accounts)

        registerPopUp.style.opacity = '0'
        registerPopUp.style.top = '-50%'

        delay(0)
            .then(() => {
                popUpLoading.style.display = 'flex'
                popUpLoading.style.opacity = '1'
            })
            .then(() => delay(Math.floor(Math.random() * 7000) + 4000).then(() => {
                popUpLoading.style.opacity = '0';
                blurPopUp.style.opacity = '0';
                [registerName, registerSurname, registerPin, registerCurrency, registerLocale].forEach(element => element.value = '');
                delay(100).then(() => {
                    blurPopUp.style.display = 'none'
                    popUpLoading.style.display = 'none'
                })
            }
            ))
    }


}

createAccount.addEventListener('click', createAccountFunc)

// Date format

const formatMovementDate = function (date) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);

    if (daysPassed < 1) return 'Today'
    if (daysPassed >= 1 && daysPassed < 2) return 'Yesterday'
    if (daysPassed <= 6) return `${daysPassed} days ago`
    if (daysPassed / 7 >= 1 && daysPassed / 7 <= 4) return `${Math.round(daysPassed / 7)} ${Math.round(daysPassed / 7) === 1 ? 'week' : 'weeks'} ago`
    if (daysPassed / 30 >= 1 && daysPassed / 30 <= 12) return `${Math.round(daysPassed / 30)} ${Math.round(daysPassed / 30) === 1 ? 'month' : 'months'} ago`
    if (daysPassed >= 365) {
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0)
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

}

// Formatting currencies

const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value)
}

// Add movements divs

const displayMovements = function (account, sort = false) {
    containerMovements.innerHTML = ''

    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

    movs.forEach((mov, i) => {
        const movType = mov > 0 ? 'deposit' : 'withdrawal'
        const date = new Date(account.movementsDates[i])
        const displayDate = formatMovementDate(date)

        const formattedMov = formatCur(mov, account.locale, account.currency)

        const movHtml = `
        <div class="movements__row">
            <div class="movements__deposit-date">
                <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
                <div class="movemenets__date">${displayDate}</div>
            </div>
            <div class="movements__value">${formattedMov}</div>
        </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', movHtml)
    });
}

// Calc balance

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce((acc, cur) => acc + cur, 0)
    const formattedMov = formatCur(account.balance, account.locale, account.currency)
    labelBalance.textContent = `${formattedMov}`
}

// 

const calcDisplaySummary = function (account) {
    const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    const withdrawals = Math.abs(account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0));
    const interest = account.movements.filter(mov => mov > 0).map(deposit => (deposit * account.interestRate) / 100).filter(int => int >= 1).reduce((acc, int) => acc + int, 0);

    labelSumIn.textContent = formatCur(incomes, account.locale, account.currency)
    labelSumOut.textContent = formatCur(Math.abs(withdrawals), account.locale, account.currency)
    labelSumInterest.textContent = formatCur(interest, account.locale, account.currency)
}

// Update UI

const updateUI = function (acc) {
    calcDisplayBalance(acc)
    displayMovements(acc)
    calcDisplaySummary(acc)
}

// LogOut Timer

const startLogOutTimer = function () {
    let time = 600;
    const clock = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const seconds = String(Math.trunc(time % 60)).padStart(2, 0);

        labelTimer.textContent = `${min}:${seconds}`;
        if (time === 0) {
            clearInterval(timer)
            labelWelcome.innerText = 'Log in to get started'
            containerApp.style.opacity = '0'
            setTimeout(() => {
                containerApp.style.display = 'none'
            }, 1000)
        }

        if (time === 30) {
            labelTimer.style.color = 'red'
        }

        time--;
    }

    clock()
    const timer = setInterval(clock, 1000)
    return timer;
}

// Event handlers

let currentAccount, timer;

const logInfunc = function (e) {
    e.preventDefault()
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    if (currentAccount?.pin === +inputLoginPin.value) {

        loginPopUp.style.opacity = '0'
        loginPopUp.style.top = '-50%'

        delay(0)
            .then(() => {
                popUpLoading.style.display = 'flex'
                popUpLoading.style.opacity = '1'
            })
            .then(() => delay(Math.floor(Math.random() * 4000) + 2000).then(() => {
                popUpLoading.style.opacity = '0'
                delay(100).then(() => {
                    popUpLoading.style.display = 'none'
                    btnLoginIcon.style.display = 'none'
                    btnLogOut.style.display = 'flex'
                    if (timer) clearInterval(timer)
                    timer = startLogOutTimer()
                })
                    .then(() => {
                        blurPopUp.style.opacity = '0'
                        setTimeout(() => {
                            blurPopUp.style.display = 'none'
                        }, 500);
                    }).then(() => {
                        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
                        containerApp.style.display = 'grid';
                        containerApp.style.opacity = '1'


                        // Create current date and time

                        const currentDate = new Date()
                        const day = `${currentDate.getDate()}`.padStart(2, 0);
                        const month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
                        const year = currentDate.getFullYear();
                        const hour = currentDate.getHours();
                        const min = `${currentDate.getMinutes()}`.padStart(2, 0);

                        labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

                        inputLoginUsername.value = '';
                        inputLoginPin.value = '';

                        inputLoginUsername.blur();
                        inputLoginPin.blur();

                        updateUI(currentAccount)
                    })
            }))
    } else {
        if (!currentAccount) {
            popUpErrorText.innerText = 'WRONG USER'
        } else {
            popUpErrorText.innerText = 'WRONG PIN'
        }

        popupFunc(popUpError)
    }
}

btnLogin.addEventListener('click', logInfunc)

// TRANSFER CONDITIONS

const transfers = function (e) {
    e.preventDefault()
    const amount = +inputTransferAmount.value;
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

    if (Math.floor((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000) <= 30) {
        popUpErrorText.innerText = `Wait ${Math.floor(30 - ((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000))} seconds`;
        popupFunc(popUpError, 'warn');
        deffaultStyles([inputTransferTo, inputTransferAmount])
    } else {
        if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc.username !== currentAccount.username) {
            popupFunc(popUpTransfers, 'transfer')
            popUpTransferText.textContent = `TRANSFER ${amount.toFixed(2)}€ TO ${recieverAcc.owner}(${recieverAcc.username})`
        } else {
            popupFunc(popUpError)
            if (recieverAcc === undefined) {
                popUpErrorText.innerText = 'NO USER FOUND'
            } else {
                if (recieverAcc.username === currentAccount.username) {
                    popUpErrorText.innerText = 'CAN\'T TRANSFER TO YOURSELF'
                } else {
                    if (currentAccount.balance < amount) {
                        popUpErrorText.innerText = 'INSUFFICENT MONEY ON BALANCE'
                    } else {
                        if (amount === 0 || amount === '') {
                            popUpErrorText.innerText = 'NO AMOUNT INPUTTED'
                        }
                    }
                }
            }
            deffaultStyles([inputTransferTo, inputTransferAmount])
        }
    }
}

btnTransfer.addEventListener('click', transfers)

// LOAN

const loanFunc = function (e) {
    e.preventDefault();

    const amount = +inputLoanAmount.value;

    if (Math.floor((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000) <= 30 && Math.floor((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000) >= 0) {
        popUpErrorText.innerText = `Wait ${Math.floor(30 - ((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000))} seconds`
        popupFunc(popUpError, 'warn')
        inputLoanAmount.value = ''
    } else {
        if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
            popupFunc(popUpTransfers, 'loan')
            popUpTransferText.textContent = `REQUEST LOAN ${amount.toFixed(2)}€`
        } else {
            popupFunc(popUpError)
            if (!currentAccount.movements.some(mov => mov >= amount * 0.1)) {
                popUpErrorText.textContent = `AVAIBLE ONLY MAX DEPOSIT'S 1000%`
            } else {
                if (amount === 0 || amount === '') {
                    popUpErrorText.innerText = 'NO AMOUNT INPUTTED'
                }
            }
            inputLoanAmount.value = ''
        }
    }
}


btnLoan.addEventListener('click', loanFunc)

// CLOSE ACCOUNT 

const closeFunc = function (e) {
    e.preventDefault();
    if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === +inputClosePin.value) {
        popupFunc(popUpTransfers, 'close')
        popUpTransferText.innerText = `DELETE ACCOUNT`
    } else {
        if (inputCloseUsername.value === '') {
            popUpErrorText.innerText = 'NO USERNAME INPUTTED'
        } else {
            if (currentAccount.username !== inputCloseUsername.value) {
                popUpErrorText.innerText = 'WRONG USERNAME!'
            } else {
                if (inputClosePin === '') {
                    popUpErrorText.innerText = 'NO PIN INPUTTED'
                } else {
                    popUpErrorText.innerText = 'WRONG PIN!'
                }
            }
        }

        deffaultStyles([inputCloseUsername, inputClosePin])
        popupFunc(popUpError)
    }
}

btnClose.addEventListener('click', closeFunc)

// Pop Up

const delay = ms => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

function popupFunc(popup, type) {

    // Reset timer
    clearInterval(timer)
    timer = startLogOutTimer();


    // CONFIRM && CANCEL TRANSFER || LOAN || CLOSE ACC
    const confirmTrans = function (e) {
        e.preventDefault()

        popUpTransfers.style.opacity = '0'
        setTimeout(() => {
            popUpTransfers.style.display = 'none'
        }, 0);


        if (type === 'transfer' || type === 'loan') {
            currentAccount.movementsDates.push(new Date().toISOString())
            const amountFunc = () => type === 'transfer' ? +inputTransferAmount.value : +inputLoanAmount.value;
            const amount = amountFunc();

            if (labelBalanceSpan.style.bottom == '-16px') {
                labelBalance.style.color = '#444'
                labelBalanceSpan.style.opacity = '0'
                labelBalanceSpan.style.bottom = '-36px'
            }

            delay(0)
                .then(() => {
                    popUpLoading.style.display = 'flex'
                    popUpLoading.style.opacity = '1'
                })
                .then(() => delay(Math.floor(Math.random() * 6000) + 4000).then(() => {
                    if (type === 'transfer') {
                        const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
                        recieverAcc.movements.push(amount);
                        recieverAcc.movementsDates.push(new Date().toISOString());
                    };

                    currentAccount.movements.push(type === 'transfer' ? -amount : amount);

                    // AFTER CLICK RESET ALL INPUT VALUES

                    deffaultStyles[inputTransferTo, inputTransferAmount, inputLoanAmount, inputCloseUsername, inputClosePin]

                    updateUI(currentAccount);

                    delay(100)
                        .then(() => {
                            blurPopUp.style.opacity = '0'
                            popUpLoading.style.opacity = '0'
                        })
                        .then(() => delay(500))
                        .then(() => {
                            blurPopUp.style.display = 'none'
                            popUpLoading.style.display = 'none'
                        })

                    setTimeout(() => {
                        labelBalance.style.color = `${type === 'transfer' ? '#D2042D' : '#32CD32'}`
                        labelBalanceSpan.style.color = `${type === 'transfer' ? '#e52a5a' : '#9be15d'}`
                        labelBalanceSpan.style.bottom = '-16px'
                        labelBalanceSpan.style.opacity = '1'
                        labelBalanceSpan.innerText = `${type === 'transfer' ? '-' + formatCur(amount, currentAccount.locale, currentAccount.currency) : '+' + formatCur(amount, currentAccount.locale, currentAccount.currency)}`
                        document.documentElement.style.overflowY = 'unset'
                    }, 0)


                    delay(2000).then(() => {
                        labelBalance.style.color = '#444'
                        labelBalanceSpan.style.bottom = '-36px'
                        labelBalanceSpan.style.opacity = '0'
                    })
                }))
        } else {
            if (type === 'close') {
                const index = accounts.findIndex(acc => acc.username === currentAccount.username)
                delay(0)
                    .then(() => {
                        popUpLoading.style.display = 'flex'
                        popUpLoading.style.opacity = '1'
                    })
                    .then(() => delay(Math.floor(Math.random() * 6000) + 3000).then(() => {
                        deffaultStyles[inputTransferTo, inputTransferAmount, inputLoanAmount, inputCloseUsername, inputClosePin]
                        
                        updateUI(currentAccount)

                        delay(100)
                            .then(() => {
                                blurPopUp.style.opacity = '0'
                                popUpLoading.style.opacity = '0'
                            })
                            .then(() => delay(500))
                            .then(() => {
                                blurPopUp.style.display = 'none'
                                popUpLoading.style.display = 'none'
                            })
                    }).then(() => {
                        // Delete Account
                        accounts.splice(index, 1)

                        // Hide UI
                        containerApp.style.opacity = '0';
                        setTimeout(() => {
                            containerApp.style.display = 'none';
                        }, 1000);
                        labelWelcome.innerText = 'Log in to get started'

                        deffaultStyles[inputTransferTo, inputTransferAmount, inputLoanAmount, inputCloseUsername, inputClosePin]
                        document.documentElement.style.overflowY = 'unset'
                    }))
            }
        }
    }

    btnConfirmTrans.addEventListener('click', confirmTrans)

    // CANCEL TRANSFER

    const cancelTrans = function () {
        popUpTransfers.style.opacity = '0'
        blurPopUp.style.opacity = '0'
        setTimeout(() => {
            blurPopUp.style.display = 'none'
        }, 500);

        if (type === 'transfer') {
            inputTransferAmount.value = ''
            inputTransferTo.value = ''
        } else {
            if (type === 'loan') {
                inputLoanAmount.value = ''
            } else {
                if (type === 'close') {
                    inputCloseUsername.value = '';
                    inputClosePin.value = '';
                }
            }
        }
        document.documentElement.style.overflowY = 'unset'
    }

    btnCancelTrans.addEventListener('click', cancelTrans)

    // POPUP STYLES

    window.scrollTo({ top: 0, behavior: 'smooth' });
    blurPopUp.style.display = 'block'
    setTimeout(() => {
        blurPopUp.style.opacity = '1'
    }, 0);
    document.documentElement.style.overflowY = 'hidden'

    if (popup === popUpError) {
        popup.style.opacity = '1'
        popup.style.top = '24px'

        delay(2000)
            .then(() => {
                popup.style.top = '-120px'
                popup.style.opacity = '0'

                if (popup.innerText !== 'WRONG USER' && popUpErrorText.innerText !== 'WRONG PIN') {
                    blurPopUp.style.opacity = '0'
                    document.documentElement.style.overflowY = 'unset'
                    setTimeout(() => {
                        blurPopUp.style.display = 'none'
                    }, 400);
                }
            })


    } else {
        popup.style.display = 'flex'
        setTimeout(() => {
            popup.style.opacity = '1'
            popup.style.top = '50%'

        }, 0);
    }
}


// SORT

let sorted = false;

const sortFunc = function (e) {
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
}

btnSort.addEventListener('click', sortFunc)

// FIRST NUMBER SHOULDN'T EQUAL TO 0

inputTransferAmount.onkeyup = function () {
    if (this.value[0] === '0') this.value = 0;
}

inputLoanAmount.onkeyup = function () {
    if (this.value[0] === '0') this.value = 0;
}


btnLoginIcon.addEventListener('click', function () {
    registerPopUp.style.opacity = '0'
    registerPopUp.style.top = '-50%'

    loginPopUp.style.opacity = '1'
    loginPopUp.style.top = '50%'

    blurPopUp.style.display = 'block'
    setTimeout(() => {
        blurPopUp.style.opacity = '1'
    }, 0);
})

popUpHide.forEach(element => {
    element.addEventListener('click', function () {
        loginPopUp.style.opacity = '0'
        loginPopUp.style.top = '-50%'

        registerPopUp.style.opacity = '0'
        registerPopUp.style.top = '-50%'
        

        blurPopUp.style.opacity = '0'
        setTimeout(() => {
            blurPopUp.style.display = 'none'
        }, 500);

        deffaultStyles([registerName, registerSurname, registerPin, registerCurrency, registerLocale, inputLoginUsername, inputLoginPin])
    })
})

registerBtn.addEventListener('click', function (e) {
    e.preventDefault();
    loginPopUp.style.opacity = '0'
    loginPopUp.style.top = '-50%'

    registerPopUp.style.opacity = '1'
    registerPopUp.style.top = '50%'
})

btnLogOut.addEventListener('click', function (e) {
    e.preventDefault();
    blurPopUp.style.display = 'block';
    deffaultStyles[inputTransferTo, inputTransferAmount, inputLoanAmount, inputCloseUsername, inputClosePin]
    delay(0)
        .then(() => {
            blurPopUp.style.opacity = '1';
            popUpLoading.style.display = 'flex';
            popUpLoading.style.opacity = '1';
        })
        .then(() => delay(Math.floor(Math.random() * 4000) + 2000).then(() => {
            popUpLoading.style.opacity = '0';
            containerApp.style.opacity = '0';
            blurPopUp.style.opacity = '0';
            containerApp.style.display = 'none';
            labelWelcome.innerText = 'Log in to get started';
            btnLoginIcon.style.display = 'flex';
            btnLogOut.style.display = 'none';
        }))
        .then(() => {
            delay(400).then(() => {
                blurPopUp.style.display = 'none';
                popUpLoading.style.display = 'none';
            })
        })
});



[inputTransferTo, inputTransferAmount, inputLoanAmount].forEach(element => element.addEventListener('click', function() {
    if (Math.floor((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000) <= 30 && Math.floor((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000) >= 0) {
        popUpErrorText.innerText = `Wait ${Math.floor(30 - ((new Date() - new Date(currentAccount.movementsDates.at(-1))) / 1000))} seconds`;
        popupFunc(popUpError, 'warn');
        this.blur();
    };
}));