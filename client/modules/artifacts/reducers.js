import {SAVE, FINDALL} from './actions';

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
        default :
            return state;
    }
};