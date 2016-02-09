import {SEND,HIDE} from './actions';

const defaultState = {
    type: '',
    text: '',
    show: false
};

export function mReducers(state = defaultState, action) {
    console.log(action);
    switch (action.type) {
        case SEND:
            state.type = action.content.type;
            state.text = action.content.text;
            state.show = true;
            return state;
        case HIDE:
           state.type = '';
           state.text = '';
           state.show = false;
            return state;
        default :
            return state;
    }
};