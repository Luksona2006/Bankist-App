'use strict'

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    movementsDates: [
        '2023-01-19T01:17:12.178Z',
        '2023-01-18T07:42:02.383Z',
        '2023-01-12T09:15:04.904Z',
        '2023-01-01T10:17:24.185Z',
        '2022-12-24T14:11:59.604Z',
        '2022-12-02T17:01:17.194Z',
        '2022-08-11T23:36:17.929Z',
        '2022-01-02T10:51:36.790Z'
    ],
    currency: 'EUR',
    locale: 'pt-PT'
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        '2023-01-19T00:11:53.178Z',
        '2023-01-02T12:21:34.383Z',
        '2023-01-08T02:35:52.904Z',
        '2023-02-28T09:12:11.185Z',
        '2022-12-24T19:14:34.604Z',
        '2022-12-02T15:25:52.194Z',
        '2022-08-11T22:17:23.929Z',
        '2022-01-02T02:31:41.790Z'
    ],
    currency: 'USD',
    locale: 'en-US'
};

// const account3 = {
//     owner: 'Steven Thomas Williams',
//     movements: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
//     movementsDates: [
//         '2017-05-05T22:01:27.178Z',
//         '2017-08-14T06:12:53.383Z',
//         '2018-01-23T05:23:12.904Z',
//         '2018-02-32T12:23:27.185Z',
//         '2019-01-21T15:52:04.604Z',
//         '2019-03-14T12:24:09.194Z',
//         '2019-05-04T03:31:21.929Z',
//         '2019-09-11T12:31:34.790Z'
//     ]
// };

// const account4 = {
//     owner: 'Sarah Smith',
//     movements: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
//     movementsDates: [
//         '2020-05-32T22:44:12.178Z',
//         '2010-11-15T01:21:01.383Z',
//         '2020-02-53T03:34:34.904Z',
//         '2020-04-41T15:24:25.185Z',
//         '2021-01-23T16:23:49.604Z',
//         '2021-04-12T12:51:12.194Z',
//         '2021-07-05T03:46:37.929Z',
//         '2021-11-15T11:58:31.790Z'
//     ]
// }

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelectorAll('.welcome');
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


/////////////////////////////////////////////////
// Functions

// Date format

const formatMovementDate = function (date) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);

    if (daysPassed < 1) return 'Today'
    if (daysPassed >= 1 && daysPassed < 2) return 'Yesterday'
    if (daysPassed <= 6) return `${daysPassed} days ago`
    if (daysPassed / 7 >= 1 && daysPassed / 7 <= 4) return `${Math.round(daysPassed / 7)} ${Math.round(daysPassed / 7) === 1 ? 'week' : 'weeks'} ago`
    if (daysPassed / 30 >= 1 && daysPassed / 30 <= 12 || daysPassed / 31 >= 1 && daysPassed / 31 <= 12) {
        if (daysPassed / 30 >= 1 && daysPassed / 30 <= 12) {
            return `${Math.round(daysPassed / 30)} ${Math.round(daysPassed / 30) === 1 ? 'month' : 'months'} ago`
        } else {
            return `${Math.round(daysPassed / 31)} ${Math.round(daysPassed / 31) === 1 ? 'month' : 'months'} ago`
        }
    }
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
          <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
          <div class="movemenets__date">${displayDate}</div>
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


// Create user names 

const createUserNames = function (accounts) {
    accounts.forEach(element => element.username = element.owner.toLowerCase().split(' ').map(name => name[0]).join(''))
};

createUserNames(accounts)

// Update UI

const updateUI = function (acc) {
    calcDisplayBalance(acc)
    displayMovements(acc)
    calcDisplaySummary(acc)
}

// LogOut Timer

const startLogOutTimer = function() {
    let time = 600;
    const clock = function () {
        const min = String(Math.trunc(time / 60)).padStart(2,0);
        const seconds = String(Math.trunc(time % 60)).padStart(2,0);

        labelTimer.textContent = `${min}:${seconds}`;
        if(time === 0) {
            clearInterval(timer)
            labelWelcome.textContent = 'Log in to get started'
            containerApp.style.opacity = '0'
            setTimeout(() => {
                containerApp.style.display = 'none'
            }, 1000)
        }

        if(time === 30) {
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
    if(timer) clearInterval(timer)

    timer = startLogOutTimer()
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    if (currentAccount?.pin === +inputLoginPin.value) {
        labelWelcome[0].textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        labelWelcome[1].textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.display = 'grid';
        setTimeout(() => {
            containerApp.style.opacity = '1'
        }, 0);

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

    if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc.username !== currentAccount.username) {
        popupFunc(popUpTransfers, 'transfer')
        popUpTransferText.textContent = `TRANSFER ${amount.toFixed(2)}€ TO ${recieverAcc.owner}(${recieverAcc.username})`
    } else {
        popupFunc(popUpError)
        if (recieverAcc === undefined) {
            popUpErrorText.textContent = 'NO USER FOUND'
        } else {
            if (recieverAcc.username === currentAccount.username) {
                popUpErrorText.textContent = 'CAN\'T TRANSFER TO YOURSELF'
            } else {
                if (currentAccount.balance < amount) {
                    popUpErrorText.textContent = 'INSUFFICENT MONEY ON BALANCE'
                } else {
                    if (amount === 0 || amount === '') {
                        popUpErrorText.textContent = 'NO AMOUNT INPUTTED'
                    }
                }
            }
        }
    }
}

btnTransfer.addEventListener('click', transfers)

// LOAN

const loanFunc = function (e) {
    e.preventDefault();

    const amount = +inputLoanAmount.value;

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        popupFunc(popUpTransfers, 'loan')
        popUpTransferText.textContent = `REQUEST LOAN ${amount.toFixed(2)}€`
    } else {
        popupFunc(popUpError)
        if (!currentAccount.movements.some(mov => mov >= amount * 0.1)) {
            popUpErrorText.textContent = `AVAIBLE ONLY MAX DEPOSIT'S 1000%`
        } else {
            if (amount === 0 || amount === '') {
                popUpErrorText.textContent = 'NO AMOUNT INPUTTED'
            }
        }
    }
}

btnLoan.addEventListener('click', loanFunc)

// CLOSE ACCOUNT 

const closeFunc = function (e) {
    e.preventDefault();
    if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === +inputClosePin.value) {
        popupFunc(popUpTransfers, 'close')
        popUpTransferText.textContent = `DELETE ACCOUNT`
    } else {
        if (inputCloseUsername.value === '') {
            popUpErrorText.textContent = 'NO USERNAME INPUTTED'
        } else {
            if (currentAccount.username !== inputCloseUsername.value) {
                popUpErrorText.innerText = 'WRONG USERNAME'
            } else {
                if (inputClosePin === '') {
                    popUpErrorText.textContent = 'NO PIN INPUTTED'
                } else {
                    popUpErrorText.innerText = 'WRONG PIN'
                }
            }
        }
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

            if (type === 'transfer') {
                const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
                recieverAcc.movements.push(amount)
                recieverAcc.movementsDates.push(new Date().toISOString())
            }

            currentAccount.movements.push(type === 'transfer' ? -amount : amount);

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
                .then(() => delay(4000).then(() => {
                    updateUI(currentAccount)
                    delay(100)
                        .then(() => {
                            blurPopUp.style.opacity = '0'
                            popUpLoading.style.opacity = '0'
                        })
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

                // Delete Account
                accounts.splice(index, 1)

                // Hide UI
                containerApp.style.opacity = '0';
                setTimeout(() => {
                    containerApp.style.display = 'none';
                }, 1000);
                labelWelcome[0].textContent = 'Log in to get started'
                labelWelcome[1].textContent = 'Log in to get started'

                inputCloseUsername.value = '';
                inputClosePin.value = '';
            }
        }

        // AFTER CLICK RESET ALL INPUT VALUES

        [inputTransferTo, inputTransferAmount, inputLoanAmount, inputCloseUsername, inputClosePin].forEach(element => element.value = '')
    }

    btnConfirmTrans.addEventListener('click', confirmTrans)

    // CANCEL TRANSFER

    const cancelTrans = function (e) {
        e.preventDefault()
        popUpTransfers.style.opacity = '0'
        blurPopUp.style.opacity = '0'
        setTimeout(() => {
            blurPopUp.style.display = 'none'
        }, 0);

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
    }

    btnCancelTrans.addEventListener('click', cancelTrans)

    // POPUP STYLES

    window.scrollTo({ top: 0, behavior: 'smooth' });
    blurPopUp.style.display = 'block'
    setTimeout(() => {
        blurPopUp.style.opacity = '1'
    }, 0);
    if (popup === popUpError) {
        popup.style.display = 'flex';
        popup.style.opacity = '1'
        popup.style.top = '24px'

        delay(2000)
            .then(() => {
                popup.style.top = '-120px'
                popup.style.opacity = '0'
                blurPopUp.style.opacity = '0'
            })
            .then(() => delay(400)
                .then(() => {
                    blurPopUp.style.display = 'none'
                    popup.style.display = 'none'
                }))


    } else {
        popup.style.display = 'flex'
        setTimeout(() => {
            popup.style.opacity = '1'
        }, 0);
    }
}


// SORT

let sorted = false;

const sortFunc = function (e) {
    e.preventDefault();
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





