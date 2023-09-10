import types from './types';

export function updateStatusMyName2(str) {
    return {
        type: types.INFORMATION_UPDATE_USER_NAME,
        return_name: str
    };
}

export function updateStatusMyName(str) {
    return async(dispatch, getState) => {
        try {
           const { userinformation } = getState();
           if ( userinformation.user_name === str )  return;
            //console.log("user_name___________",userinformation.user_name);
           dispatch({
                type: types.INFORMATION_UPDATE_USER_NAME,
                return_name : str
            });
        } catch (error) {
            console.error(error);
        }
    };
}

export function updateStatusMyBirthday(str) {
    return async(dispatch, getState) => {
        try {
            const { userinformation } = getState();
            dispatch({
                type: types.INFORMATION_UPDATE_USER_BIRTHDAY,
                return_birthday : str
            });
        } catch (error) {
            console.error(error);
        }
    };
}

export function tmp_updateStatusMyName(str) {
    return async(dispatch, getState) => {
        try {

            await fetch('https://reactserver.hackers.com:3001/getData?useridx=9')
                .then(response => response.json())
                .then(responseJson => {
                    dispatch({
                        type: types.INFORMATION_UPDATE_USER_NAME,
                        return_name : responseJson[0].Group_Name + " " + responseJson[0].Username
                    });
                })
                .catch(error => {
                    dispatch({
                        type: types.INFORMATION_UPDATE_USER_NAME,
                        return_name : "Result is Error"
                    });
                    console.error(error);
                });

        } catch (error) {
            console.error(error);
        }
    };
}
