// Don't need this anymore for now

module.exports.getDate = function() {
    const today = new Date();
    let options = { 
        weekday: 'long', 
        day: 'numeric' ,
        month: 'long',
    };
    return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function() {
    const today = new Date();
    let options = { 
        weekday: 'long' 
    };
    return today.toLocaleDateString("en-US", options);
}
