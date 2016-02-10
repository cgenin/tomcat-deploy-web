import fetch from 'isomorphic-fetch';

export const UPDATE = 'SEVER:UPDATE';
export const SAVE = 'SEVER:SAVE';

export function save() {
    return {
        type: SAVE
    };
}

export function update(server) {
    return {
            type: UPDATE,
            server: server
        };
}