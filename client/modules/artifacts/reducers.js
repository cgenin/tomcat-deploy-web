import {SAVE, FINDALL, DELETE} from './actions';

const defaultState = [];

export function areducers(state = defaultState, action) {
    switch (action.type) {
        case FINDALL:
            return state;
        case SAVE:
            const name = action.name;
            const url = action.url;
            const obj = {name, url};
            state.push(obj);
            return state;
        case DELETE :
            const n = action.name;
            const index = state.findIndex((o)=> o.name === n);
            if (index !== -1) {
                state.splice(index, 1);
            }
            return Array.from(state);
        default :
            return state;
    }
};