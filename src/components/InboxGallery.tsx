import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { IShare } from 'simpleshare-common';
import { InboxCard } from './InboxCard';

export interface Props {
    inbox: IShare[];
    onCardViewPress: (share: IShare) => void;
}

const cardWidth = EStyleSheet.value(`230rem`);
const cardHeight = cardWidth * (10 / 7);

export const InboxGallery: React.FC<Props> = (props: Props) => {
    const [galleryPosition, setGalleryPosition] = useState<number>(0);
    const scrollView = useRef<ScrollView>(null);

    useEffect(() => {
        scrollView.current?.scrollTo({ x: 1, animated: true });
    }, [props.inbox]);

    const renderCards = (): ReactNode[] => {
        const cards: ReactNode[] = [];

        cards.push(
            props.inbox.map((share, i) => {
                return (
                    <InboxCard
                        key={share.id}
                        share={share}
                        index={i}
                        width={cardWidth}
                        galleryPosition={galleryPosition}
                        onViewPress={props.onCardViewPress}
                    />
                );
            })
        );

        return cards;
    };

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const position = e.nativeEvent.contentOffset.x;
        setGalleryPosition(position);
    };

    if (props.inbox.length > 0) {
        return (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContainer}
                alwaysBounceHorizontal={true}
                centerContent={true}
                snapToInterval={cardWidth}
                onScroll={handleScroll}
                decelerationRate='normal'
                disableIntervalMomentum={true}
                showsHorizontalScrollIndicator={false}
                ref={scrollView}
                horizontal={true}
            >
                {renderCards()}
            </ScrollView>
        );
    } else {
        return <Text style={styles.emptyInboxText}>Inbox Empty</Text>;
    }
};
const styles = EStyleSheet.create({
    scrollView: {
        width: '100%',
        height: cardHeight + EStyleSheet.value('32rem'),
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Dimensions.get('screen').width / 2 - cardWidth / 2, // Add padding to push the selected card into the center
        paddingVertical: '16rem',
    },
    emptyInboxText: {
        color: '#BDBDBD',
        fontSize: '18rem',
        paddingTop: '16rem',
        alignSelf: 'center',
    },
});
