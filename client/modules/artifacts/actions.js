export const SAVE = 'ARTIFACTS:SAVE';
export const DELETE = 'ARTIFACTS:DELETE';
export const FINDALL = 'ARTIFACTS:FINDALL';

export function save(name, url) {
    return {
        type: SAVE, name, url
    };
}

export function del(index) {
    return {
        type: DELETE, index
    };
}

export function update(server) {
    return {
        type: FINDALL
    };
}