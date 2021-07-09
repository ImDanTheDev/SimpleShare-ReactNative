import firestore from '@react-native-firebase/firestore';
import IDatabaseProvider from './IDatabaseProvider';
import IUserData from './IUserData';

export default class FirestoreDatabaseProvider implements IDatabaseProvider {
    getUserData = async (uid: string): Promise<IUserData> => {
        const userDocument = await firestore()
            .collection('users')
            .doc(uid)
            .get();
        if (userDocument.exists) {
            const userDocumentData = userDocument.data();
            if (userDocumentData) {
                return {
                    isProfileComplete: userDocumentData.isProfileComplete,
                    num: userDocumentData.num,
                };
            }
        }

        return {
            isProfileComplete: false,
            num: undefined,
        };
    };

    setUserData = async (
        uid: string,
        userData: IUserData
    ): Promise<boolean> => {
        try {
            await firestore().collection('users').doc(uid).set(userData);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };
}
