import MaskedView from '@react-native-masked-view/masked-view';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { IProfile, searchProfiles } from 'simpleshare-common';
import { RootState } from '../../redux/store';
import { CircleButton } from '../common/CircleButton';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
    phoneNumber: string;
    onContinue: (profileName: string) => void;
}

const SearchProfilesScreen: NavigationFunctionComponent<Props> = (
    props: Props
) => {
    const dispatch = useDispatch();

    const profiles = useSelector((state: RootState) => state.search.profiles);

    const [profileName, setProfileName] = useState<string>('');
    const [filteredProfiles, setFilteredProfiles] = useState<IProfile[]>([]);
    const [hideResults, setHideResults] = useState<boolean>(false);

    useEffect(() => {
        dispatch(searchProfiles(props.phoneNumber));
    }, [dispatch, props.phoneNumber]);

    useEffect(() => {
        setFilteredProfiles(
            profiles.filter((x) => x.name.startsWith(profileName))
        );
    }, [profileName, profiles]);

    const handleBack = async () => {
        await Navigation.pop(props.componentId);
    };

    const handleContinueButtonPress = async () => {
        props.onContinue(profileName);
        await Navigation.pop(props.componentId);
    };

    return (
        <SafeAreaView style={styles.root}>
            <LinearGradient
                colors={['#7f5a83', '#0d324d']}
                angle={50}
                useAngle={true}
                style={styles.backgroundGradient}
            >
                <View style={styles.headerSection}>
                    <CircleButton
                        size={56}
                        style={styles.settingsButton}
                        onPress={handleBack}
                    >
                        <MaterialIcons
                            name='arrow-back'
                            color='#EAEAEA'
                            size={EStyleSheet.value('42rem')}
                        />
                    </CircleButton>
                    <Text style={styles.welcomeText}>Search Profiles</Text>
                </View>
                <MaskedView
                    style={styles.mask}
                    maskElement={
                        <LinearGradient
                            style={styles.maskGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.05 }}
                            colors={['#FFFFFF00', '#FFFFFFFF']}
                        />
                    }
                >
                    <View style={styles.body}>
                        <Text style={styles.fieldLabel}>Profile Name:</Text>
                        <View style={styles.profileSearchHack}>
                            <AutocompleteInput
                                inputContainerStyle={
                                    styles.profileSearchInputContainer
                                }
                                style={styles.profileSearchInput}
                                containerStyle={styles.profileSearchContainer}
                                data={filteredProfiles}
                                value={profileName}
                                onChangeText={(text) => {
                                    setProfileName(text);
                                    setHideResults(false);
                                }}
                                onFocus={() => setHideResults(false)}
                                hideResults={hideResults}
                                flatListProps={{
                                    style: styles.profileSearchResults,
                                    keyExtractor: (item) => item.id,
                                    renderItem: ({ item }) => (
                                        <TouchableOpacity
                                            style={
                                                styles.profileSearchResultButton
                                            }
                                            onPress={() => {
                                                setProfileName(item.name);
                                                setHideResults(true);
                                            }}
                                        >
                                            <Text
                                                style={
                                                    styles.profileSearchResultLabel
                                                }
                                            >
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ),
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinueButtonPress}
                        >
                            <Text style={styles.continueButtonLabel}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                </MaskedView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = EStyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#264653',
    },
    backgroundGradient: {
        flex: 1,
    },
    /* Header */
    headerSection: {
        paddingHorizontal: '24rem',
        height: '72rem',
        flexDirection: 'row',
        borderBottomWidth: '1rem',
        borderColor: '#0D161F7F',
        backgroundColor: '#0000001F',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: '28rem',
        marginLeft: '16rem',
        color: '#FFF',
    },
    settingsButton: {
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
    },
    /* Body */
    body: {
        flex: 1,
        margin: '24rem',
    },
    fieldLabel: {
        color: '#FFF',
        fontSize: '16rem',
        paddingBottom: '4rem',
    },
    profileSearchHack: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 32,
    },
    profileSearchInputContainer: {
        borderWidth: 0,
        marginBottom: 0,
    },
    profileSearchInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
        color: '#FFF',
    },
    profileSearchResults: {
        padding: 0,
        margin: 0,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    profileSearchContainer: {},
    profileSearchResultButton: {
        marginTop: '4rem',
        backgroundColor: '#2d3341',
        padding: '10rem',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
    },
    profileSearchResultLabel: {
        color: '#FFF',
    },
    continueButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#0D161F',
        width: '50%',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50rem',
    },
    continueButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '8rem',
    },
    /* Mask */
    mask: {
        flex: 1,
    },
    maskGradient: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default SearchProfilesScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.SearchProfilesScreen';
