import firestore from '@react-native-firebase/firestore';
import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';

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

    createProfile = async (
        uid: string,
        profile: IProfile
    ): Promise<IProfile | undefined> => {
        try {
            const createdProfileRef = await firestore()
                .collection('accounts')
                .doc(uid)
                .collection('profiles')
                .add(profile);
            const profileDoc = await createdProfileRef.get();
            if (profileDoc.exists) {
                const profileData = profileDoc.data();
                if (profileData) {
                    return {
                        id: profileDoc.id,
                        name: profileData.name,
                    };
                }
            }
        } catch (e) {
            console.log(e);
        }
        return undefined;
    };

    getAllProfiles = async (uid: string): Promise<IProfile[] | undefined> => {
        const collectionRef = await firestore()
            .collection('accounts')
            .doc(uid)
            .collection('profiles');
        const collection = await collectionRef.get();
        const profileDocs = collection.docs;

        const profiles: IProfile[] = profileDocs.map((doc): IProfile => {
            const profileData = doc.data();
            return {
                id: doc.id,
                name: profileData.name,
            };
        });

        return profiles;
    };
}
