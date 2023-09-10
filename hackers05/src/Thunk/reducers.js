import { combineReducers } from 'redux';
import CalculatorReducer from './calculatorReducer';
import InformationReducer from './informationReducer';

export default combineReducers({
    calculator: CalculatorReducer,
    userinformation: InformationReducer,
});
