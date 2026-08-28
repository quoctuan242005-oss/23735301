import React, { memo } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    ViewStyle,
} from 'react-native';

import { COLORS, FONTS, SIZES } from '@constants/theme';
import Typography from './Typography';

type ButtonVariant = 'primary' | 'outline';

type ShopButtonProps = {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: ButtonVariant;
    style?: ViewStyle;
};

function ShopButton({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    variant = 'primary',
    style,
}: ShopButtonProps) {
    const isOutline = variant === 'outline';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || isLoading}
            style={({ pressed }) => [
                styles.button,
                isOutline
                    ? styles.outlineButton
                    : styles.primaryButton,
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={
                        isOutline
                            ? COLORS.primary
                            : COLORS.surface
                    }
                />
            ) : (
                <Typography
                    variant="button"
                    color={
                        isOutline
                            ? COLORS.primary
                            : COLORS.surface
                    }
                >
                    {title}
                </Typography>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 44,
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },

    primaryButton: {
        backgroundColor: COLORS.primary,
    },

    outlineButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },

    pressed: {
        opacity: 0.8,
    },

    disabled: {
        opacity: 0.5,
    },
});

export default memo(ShopButton);