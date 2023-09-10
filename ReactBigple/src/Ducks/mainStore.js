import reducers from './Reducers/MainReducers';
import { createStore,applyMiddleware  } from 'redux';
import ReduxThunk from 'redux-thunk';

export default function initStore() {
   // const logger = createLogger();

    const store = createStore(
        reducers,
        applyMiddleware(
            // Middleware will not be applied to this sample.
            ReduxThunk
            //logger,
        ),
    );
    return store;
}
