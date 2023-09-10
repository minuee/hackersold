// Imports: Dependencies
import { createStore, applyMiddleware } from 'redux';
//import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

// Imports: Redux Root Reducer
import rootReducer from './reducers';

// Imports: Redux Root Saga
import { rootSaga } from './index';

// Middleware: Redux Saga
const sagaMiddleware = createSagaMiddleware();

// Redux: Store
const store = createStore(
  rootReducer,
  applyMiddleware(
    sagaMiddleware  
  ),
);

// Middleware: Redux Saga
sagaMiddleware.run(rootSaga);

// Exports
export {
  store,
}