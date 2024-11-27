

export function isObject(value:any){
    return value !== null && typeof value === 'object'
}

export function isFunction(value:any){
    return typeof value === 'function'
}

export function isString(value:any){
    return typeof value === 'string';
}

export function isNumber(value:any){
    return typeof value === 'number'
}

export function isBoolean(value:any){
    return typeof value === 'boolean'
}

export function isNullOrUndefined(value:any){
    return value === null || value === undefined
}
