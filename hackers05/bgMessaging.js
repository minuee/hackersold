import firebase from 'react-native-firebase';

export default async (message) => {
    // handle your message
    // you can't see this message, because debugger may off when app closed
    // but you can use react native code like fetch, etc ...

    console.log(message);
    // fetch('http://YOUR_SERVER/api/regist/something')
    const {contact} = message.data;
    await fetch(`https://reactserver.hackers.com:3001/emergency/${contact}`);

    return Promise.resolve();
}
