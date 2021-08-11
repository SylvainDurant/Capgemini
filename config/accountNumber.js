const generateAccountNumber = async () => {
    let accountNumber = 'BE'

    for (let i = 0; i < 14; i++) {
        accountNumber += Math.floor(Math.random() * 10);  
    }

    return accountNumber
}

module.exports = generateAccountNumber;