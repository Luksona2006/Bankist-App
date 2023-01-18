'use strict'

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z'
    ]
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        '2019-11-18T12:04:12.178Z',
        '2019-11-22T04:22:01.383Z',
        '2020-01-05T06:51:13.904Z',
        '2020-01-21T17:53:26.185Z',
        '2020-04-02T12:23:55.604Z',
        '2020-05-17T18:21:37.194Z',
        '2020-08-22T11:54:24.929Z',
        '2020-08-29T15:31:23.790Z'
    ]
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    movementsDates: [
        '2017-05-05T22:01:27.178Z',
        '2017-08-14T06:12:53.383Z',
        '2018-01-23T05:23:12.904Z',
        '2018-02-32T12:23:27.185Z',
        '2019-01-21T15:52:04.604Z',
        '2019-03-14T12:24:09.194Z',
        '2019-05-04T03:31:21.929Z',
        '2019-09-11T12:31:34.790Z'
    ]
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    movementsDates: [
        '2020-05-32T22:44:12.178Z',
        '2010-11-15T01:21:01.383Z',
        '2020-02-53T03:34:34.904Z',
        '2020-04-41T15:24:25.185Z',
        '2021-01-23T16:23:49.604Z',
        '2021-04-12T12:51:12.194Z',
        '2021-07-05T03:46:37.929Z',
        '2021-11-15T11:58:31.790Z'
    ]
};

const accounts = [account1, account2, account3, account4];

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

const popUpTransfers = document.querySelector('.popUp-transfers')
const btnConfirmTrans = document.querySelector('#confirm');
const popUpTransferText = document.querySelector('.transfer__text')
const btnCancelTrans = document.querySelector('#cancel');


/////////////////////////////////////////////////
// Functions

// Add movements divs
const displayMovements = function (account, sort = false) {
    containerMovements.innerHTML = ''

    const movs = sort ? account.movements.slice().sort((a , b) => a - b) : account.movements; 

    movs.forEach((mov, i) => {
        const movType = mov > 0 ? 'deposit' : 'withdrawal'
        const date = new Date(account.movementsDates[i])
        const day = `${date.getDate()}`.padStart(2,0);
        const month = `${date.getMonth() + 1}`.padStart(2,0);
        const year = date.getFullYear();
        const hour = date.getHours();
        const min = date.getMinutes();

        const displayDate = `${day}/${month}/${year}`;

        const movHtml = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
          <div class="movemenets__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', movHtml)
    });
}

// Calc balance

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce((acc, cur) => acc + cur, 0)
    labelBalance.textContent = `${account.balance.toFixed(2)}€`
}

// 

const calcDisplaySummary = function (account) {
    const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    const withdrawals = Math.abs(account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0));
    const interest = account.movements.filter(mov => mov > 0).map(deposit => (deposit * account.interestRate) / 100).filter(int => int >= 1).reduce((acc, int) => acc + int, 0);

    labelSumIn.textContent = `${incomes.toFixed(2)}€`
    labelSumOut.textContent = `${withdrawals.toFixed(2)}€`
    labelSumInterest.textContent = `${interest.toFixed(2)}€`
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

// Event handlers

let currentAccount;

const logInfunc = function (e) {
    e.preventDefault()
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    if (currentAccount?.pin === +inputLoginPin.value) {
        labelWelcome[0].textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        labelWelcome[1].textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = '1';

        // Create current date and time

        const currentDate = new Date()
        const day = `${currentDate.getDate()}`.padStart(2,0);
        const month = `${currentDate.getMonth() + 1}`.padStart(2,0);
        const year = currentDate.getFullYear();
        const hour = currentDate.getHours();
        const min = `${currentDate.getMinutes()}`.padStart(2,0);

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

    // CONFIRM TRANSFER || LOAN || CLOSE ACC

    const confirmTrans = function (e) {
        e.preventDefault()
        popUpTransfers.style.opacity = '0'
        blurPopUp.style.opacity = '0'
        setTimeout(() => {
            blurPopUp.style.display = 'none'
            popUpTransfers.style.display = 'none'
        }, 0);

        if (type === 'transfer') {
            const amount = +inputTransferAmount.value;
            const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

            if(amount !== 0) {
                currentAccount.movements.push(-amount)
                recieverAcc.movements.push(amount)

                currentAccount.movementsDates.push(new Date().toISOString())
                recieverAcc.movementsDates.push(new Date().toISOString())
                updateUI(currentAccount)
    
                
                labelBalance.style.color = '#D2042D'
                labelBalanceSpan.style.color = '#e52a5a'
                labelBalanceSpan.style.bottom = '-16px'
                labelBalanceSpan.style.opacity = '1'
                labelBalanceSpan.textContent = `-${amount.toFixed(2)}€`
    
                setTimeout(() => {
                    labelBalance.style.color = '#444'
                    labelBalanceSpan.style.bottom = '-36px'
                    labelBalanceSpan.style.opacity = '0'
                }, 4000);
            }

            inputTransferAmount.value = ''
            inputTransferTo.value = ''
        } else {
            if (type === 'loan') {
                const amount = +inputLoanAmount.value;

                if(amount !== 0) {
                    currentAccount.movements.push(amount);
                    currentAccount.movementsDates.push(new Date().toISOString())
                    updateUI(currentAccount);

                    labelBalance.style.color = '#32CD32'
                    labelBalanceSpan.style.color = '#9be15d'
                    labelBalanceSpan.style.bottom = '-16px'
                    labelBalanceSpan.style.opacity = '1'
                    labelBalanceSpan.textContent = `+${amount.toFixed(2)}€`
    
                    setTimeout(() => {
                        labelBalance.style.color = '#444'
                        labelBalanceSpan.style.bottom = '-36px'
                        labelBalanceSpan.style.opacity = '0'
                    }, 4000);
                }

                inputLoanAmount.value = ''
            } else {
                if (type === 'close') {
                    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

                    // Delete Account
                    accounts.splice(index, 1)

                    // Hide UI
                    containerApp.style.opacity = '0';
                    labelWelcome[0].textContent = 'Log in to get started'
                    labelWelcome[1].textContent = 'Log in to get started'

                    inputCloseUsername.value = '';
                    inputClosePin.value = '';
                }
            }
        }
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

const sortFunc = function(e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
}

btnSort.addEventListener('click', sortFunc)

// FIRST NUMBER SHOULDN'T EQUAL TO 0

inputTransferAmount.onkeyup = function() {
    if(this.value[0] === '0') this.value = 0;
}

inputLoanAmount.onkeyup = function() {
    if(this.value[0] === '0') this.value = 0;
}







