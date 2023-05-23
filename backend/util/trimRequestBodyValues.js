function trimRequestBodyValues(requestBody) {
    const trimValues = {};
    Object.keys(requestBody).forEach(key => {
        trimValues[key] = requestBody[key].trim();
    });

    return trimValues;
}

module.exports = { trimRequestBodyValues };