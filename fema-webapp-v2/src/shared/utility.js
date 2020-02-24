export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    } 
};

export const checkValidity = (rules, value) => {
    let isValid = true;
    if (!rules) {
        return isValid;
    }
    if (rules.required) {
        if (value.trim() === '') {
            isValid = false;
        }
    }

    if (rules.minlength) {
        if (value.trim().length < rules.minlength) {
            isValid = false;
        }
    }

    if (rules.maxlength) {
        if (value.trim().length > rules.maxlength) {
            isValid = false;
        }
    }

    if (rules.dataType) {
        if ((rules.dataType === 'numeric') && (isNaN(value))) {
            isValid = false;
        }
    }

    return isValid
}