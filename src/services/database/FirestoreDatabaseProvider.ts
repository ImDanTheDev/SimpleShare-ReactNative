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
            const profileData = profileDoc.data();
            if (profileData) {
                return {
                    id: profileDoc.id,
                    name: profileData.name,
                };
            }
        } catch (e) {
            console.log(e);
        }
        return undefined;
    };

    getAllProfiles = async (uid: string): Promise<IProfile[] | undefined> => {
        const profilesCollection = await firestore()
            .collection('accounts')
            .doc(uid)
            .collection('profiles')
            .get();
        const profileDocs = profilesCollection.docs;

        const profiles: IProfile[] = profileDocs.map((doc): IProfile => {
            const profileData = doc.data();
            return {
                id: doc.id,
                name: profileData.name,
            };
        });

        return profiles;
    };

    getProfile = async (
        uid: string,
        profileId: string
    ): Promise<IProfile | undefined> => {
        const profileDoc = await firestore()
            .collection('accounts')
            .doc(uid)
            .collection('profiles')
            .doc(profileId)
            .get();

        const profileData = profileDoc.data();
        if (!profileData) return undefined;

        return {
            id: profileData.id,
            name: profileData.name,
        };
    };

    deleteProfile = async (
        uid: string,
        profileId: string
    ): Promise<boolean> => {
        try {
            await firestore()
                .collection('accounts')
                .doc(uid)
                .collection('profiles')
                .doc(profileId)
                .delete();
            return true;
        } catch (e) {
            return false;
        }
    };
}
