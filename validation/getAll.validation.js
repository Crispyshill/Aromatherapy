const isValidCount = function(count){
    let isValid = true;
    const countNumber = parseInt(count, process.env.NUMBER_BASE);
    if(null == count){
        isValid = true;
    }
    else if(isNaN(countNumber)){
        isValid = false;
    }
    else if(countNumber < 1){
        isValid = false;
    }
    return isValid;
}

const isValidOffset = function(offset){
    let isValid = true;
    const offsetNumber = parseInt(offset, process.env.NUMBER_BASE);
    if(null == offset){
        isValid = true;
    }
    else if(isNaN(offsetNumber)){
        isValid = false;
    }
    else if(offsetNumber < 1){
        isValid = false;
    }
    return isValid;
}

module.exports = {
    isValidOffset,
    isValidCount
}