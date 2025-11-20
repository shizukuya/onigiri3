import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';

export const GameStatusBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

    useEffect(() => {
        // Update time every minute
        const timer = setInterval(() => {
            setTime(new Date());
        }, 60000);

        // Get initial battery level
        const getBattery = async () => {
            try {
                const level = await Battery.getBatteryLevelAsync();
                setBatteryLevel(level);
            } catch (e) {
                console.log('Battery API not available');
            }
        };
        getBattery();

        // Subscribe to battery changes
        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }: { batteryLevel: number }) => {
            setBatteryLevel(batteryLevel);
        });

        return () => {
            clearInterval(timer);
            subscription && subscription.remove();
        };
    }, []);

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{formatTime(time)}</Text>
            <View style={styles.batteryContainer}>
                <Text style={styles.text}>
                    {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '--%'}
                </Text>
                <Ionicons
                    name={batteryLevel && batteryLevel < 0.2 ? 'battery-dead' : 'battery-full'}
                    size={16}
                    color="#fff"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    batteryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
