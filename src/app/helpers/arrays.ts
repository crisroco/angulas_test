export function DynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a,b) => {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function DynamicSortMultiple(args) {
    var props = args;
    return (obj1, obj2) => {
        var i = 0, result = 0, numberOfProperties = props.length;
        while(result === 0 && i < numberOfProperties) {
            result = DynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}