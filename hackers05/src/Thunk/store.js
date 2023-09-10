import reducers from './reducers';
import { createStore,applyMiddleware  } from 'redux';
//import loggerMiddleware from './loggerMiddleware'; //TEST
//import { createLogger } from 'redux-logger';
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
