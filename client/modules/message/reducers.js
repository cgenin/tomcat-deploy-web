import {SEND,HIDE} from './actions';

const defaultState = {
    type: '',
    text: '',
    show: false
};

export function mReducers(state = defaultState, action) {
    let type;
    let text;
    let show;
    switch (action.type) {
        case SEND:
            type = action.content.type;
            text = action.content.text;
            show = true;
            return {type, text, show};
        case HIDE:
           type = '';
           text = '';
           show = false;
            return {type, text, show};
        default :
            return state;
    }
};