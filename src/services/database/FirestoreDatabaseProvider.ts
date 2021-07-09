import firestore from '@react-native-firebase/firestore';
import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';

export default class FirestoreDatabaseProvider implements IDatabaseProvider {
    getAccountInfo = async (uid: string): Promise<IAccountInfo> => {
        const accountDoc = await firestore()
            .collection('accounts')
            .doc(uid)
            .get();
        if (accountDoc.exists) {
            const accountDocData = accountDoc.data();
            if (accountDocData) {
                return {
                    isAccountComplete: accountDocData.isAccountComplete,
                    num: accountDocData.num,
                };
            }
        }

        return {
            isAccountComplete: false,
            num: undefined,
        };
    };

    setAccountInfo = async (
        uid: string,
        accountInfo: IAccountInfo
    ): Promise<boolean> => {
        try {
            await firestore().collection('accounts').doc(uid).set(accountInfo);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };
}
