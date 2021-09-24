import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { RNErrorCode, RNSimpleShareError } from './RNSimpleShareError';

export const download = async (url: string, dest: string): Promise<void> => {
    let permissionGranted = false;
    if (Platform.OS === 'android') {
        const writeGranted = await PermissionsAndroid.request(
            'android.permission.WRITE_EXTERNAL_STORAGE',
            {
                title: 'Simple Share Permission',
                message:
                    'Simple Share needs access to save files to your device.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
                buttonNeutral: 'Ask Me Later',
            }
        );
        const readGranted = await PermissionsAndroid.request(
            'android.permission.READ_EXTERNAL_STORAGE',
            {
                title: 'Simple Share Permission',
                message:
                    'Simple Share needs access to save files to your device.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
                buttonNeutral: 'Ask Me Later',
            }
        );
        permissionGranted =
            (writeGranted === 'granted' ||
                writeGranted === 'never_ask_again') &&
            (readGranted === 'granted' || readGranted === 'never_ask_again');
    }

    if (permissionGranted) {
        const absDestination = `${RNFS.DownloadDirectoryPath}/${dest}`;
        await RNFS.writeFile(absDestination, '');
        await RNFS.downloadFile({
            fromUrl: url,
            toFile: absDestination,
        }).promise;
    } else {
        throw new RNSimpleShareError(RNErrorCode.PERMISSION_DENIED);
    }
};
