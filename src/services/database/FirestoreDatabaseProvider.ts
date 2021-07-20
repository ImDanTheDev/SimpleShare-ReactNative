import firestore from '@react-native-firebase/firestore';
import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';
import IShare from '../../api/IShare';

interface IShareListener {
    uid: string;
    profileId: string;
    unsubscribe: () => void;
}

export default class FirestoreDatabaseProvider implements IDatabaseProvider {
    private shareListeners: IShareListener[] = [];

    private onShareAddedCallback: (share: IShare) => void;
    private onShareDeletedCallback: (share: IShare) => void;
    private onShareModifiedCallback: (share: IShare) => void;

    constructor(
        onShareAdded: (share: IShare) => void,
        onShareDeleted: (share: IShare) => void,
        onShareModified: (share: IShare) => void
    ) {
        this.onShareAddedCallback = onShareAdded;
        this.onShareDeletedCallback = onShareDeleted;
        this.onShareModifiedCallback = onShareModified;
    }

    getAccountInfo = async (uid: string): Promise<IAccountInfo | undefined> => {
        const accountDoc = await firestore()
            .collection('accounts')
            .doc(uid)
            .get();
        if (accountDoc.exists) {
            const accountDocData = accountDoc.data();
            if (accountDocData) {
                return {
                    isAccountComplete: accountDocData.isAccountComplete,
                    phoneNumber: accountDocData.phoneNumber,
                    num: accountDocData.num,
                };
            }
        }

        return undefined;
    };

    initializeAccount = async (
        uid: string,
        accountInfo: IAccountInfo
    ): Promise<boolean> => {
        const setAccountInfo = await this.setAccountInfo(uid, accountInfo);
        if (!setAccountInfo) return false;

        return await this.createDefaultProfile(uid);
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

    getUidByPhoneNumber = async (
        phoneNumber: string
    ): Promise<string | undefined> => {
        const matchingAccountDocs = await firestore()
            .collection('accounts')
            .where('phoneNumber', '==', phoneNumber)
            .limit(1)
            .get();
        if (matchingAccountDocs.size <= 0) return undefined;
        const matchingAccountDoc = matchingAccountDocs.docs[0];
        return matchingAccountDoc.id;
    };

    createDefaultProfile = async (uid: string): Promise<boolean> => {
        try {
            await firestore()
                .collection('accounts')
                .doc(uid)
                .collection('profiles')
                .doc('default')
                .set({
                    name: 'default',
                } as IProfile);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    createProfile = async (
        uid: string,
        profile: IProfile
    ): Promise<boolean> => {
        try {
            const createdProfileRef = await firestore()
                .collection('accounts')
                .doc(uid)
                .collection('profiles')
                .add(profile);
            const profileDoc = await createdProfileRef.get();
            const profileData = profileDoc.data();
            if (profileData) {
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    };

    getAllProfiles = async (uid: string): Promise<IProfile[]> => {
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

        return profiles || [];
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

    getProfileIdByName = async (
        uid: string,
        name: string
    ): Promise<string | undefined> => {
        const matchingProfileDocs = await firestore()
            .collection('accounts')
            .doc(uid)
            .collection('profiles')
            .where('name', '==', name)
            .limit(1)
            .get();

        if (matchingProfileDocs.size <= 0) return undefined;
        const matchingProfileDoc = matchingProfileDocs.docs[0];
        return matchingProfileDoc.id;
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

    createShare = async (share: IShare): Promise<boolean> => {
        try {
            await firestore()
                .collection('shares')
                .doc(share.toUid)
                .collection(share.toProfileId)
                .add(share);
            return true;
        } catch (e) {
            return false;
        }
    };

    addShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        const unsubscribe = firestore()
            .collection('shares')
            .doc(uid)
            .collection(profileId)
            .onSnapshot((snapshot) => {
                const docChanges = snapshot.docChanges();
                docChanges.forEach((change) => {
                    const changedShareId = change.doc.id;
                    const shareData = change.doc.data();
                    const share: IShare = {
                        id: changedShareId,
                        type: shareData.type,
                        content: shareData.content,
                        fromUid: shareData.fromUid,
                        fromProfileId: shareData.fromProfileId,
                        toUid: shareData.toUid,
                        toProfileId: shareData.toProfileId,
                    };
                    switch (change.type) {
                        case 'added':
                            // Add share to redux state.
                            this.onShareAddedCallback(share);
                            break;
                        case 'modified':
                            // Update share in redux state.
                            this.onShareModifiedCallback(share);
                            break;
                        case 'removed':
                            // Remove share from redux state.
                            this.onShareDeletedCallback(share);
                            break;
                    }
                });
            });

        this.shareListeners.push({
            uid: uid,
            profileId: profileId,
            unsubscribe: unsubscribe,
        });
    };

    removeShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        const listener = this.shareListeners.find(
            (x) => x.uid === uid && x.profileId === profileId
        );
        listener?.unsubscribe();
        this.shareListeners = this.shareListeners.filter(
            (x) => x.uid !== uid && x.profileId !== profileId
        );
    };

    removeAllShareListeners = async (): Promise<void> => {
        for (let listener; (listener = this.shareListeners.pop()); ) {
            listener.unsubscribe();
        }
    };
}
