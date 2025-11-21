import React from 'react';
import { View, Text, Modal as RNModal, StyleSheet } from 'react-native';
import { Button } from '../Button';
import { useRewardedAd } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../../../constants/AdMobConfig';
import { COLORS } from '../../../constants/colors';

interface LifeRecoveryModalProps {
    visible: boolean;
    onRevive: () => void;
    onBack: () => void;
}

export const LifeRecoveryModal: React.FC<LifeRecoveryModalProps> = ({
    visible,
    onRevive,
    onBack,
}) => {
    const { isLoaded, isEarnedReward, load, show } = useRewardedAd(
        AdMobConfig.rewardedAdUnitId,
        {
            requestNonPersonalizedAdsOnly: true,
        }
    );

    // Load ad when modal becomes visible
    React.useEffect(() => {
        if (visible) {
            load();
        }
    }, [visible, load]);

    // Handle reward
    React.useEffect(() => {
        if (isEarnedReward) {
            onRevive();
        }
    }, [isEarnedReward, onRevive]);

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onBack}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>NO LIVES</Text>

                    <Text style={styles.message}>
                        You have 0 lives remaining.
                        {"\n"}
                        Watch an ad to recover lives!
                    </Text>

                    <View style={styles.buttonContainer}>
                        {/* Watch Ad Button */}
                        {isLoaded ? (
                            <Button
                                title="Watch Ad to Recover"
                                onPress={() => show()}
                                variant="primary"
                                style={{ marginBottom: 10 }}
                            />
                        ) : (
                            <Text style={styles.loadingText}>Loading Ad...</Text>
                        )}

                        <Button title="Back to Title" onPress={onBack} variant="secondary" />
                    </View>
                </View>
            </View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 26,
    },
    buttonContainer: {
        width: '100%',
        gap: 10,
    },
    loadingText: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 10,
        fontStyle: 'italic',
    },
});
