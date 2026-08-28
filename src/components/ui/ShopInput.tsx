import React, { memo } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { COLORS, FONTS, SIZES } from '@constants/theme';
import Typography from './Typography';

type ShopInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
};

function ShopInput({
    value,
    onChangeText,
    placeholder,
    label,
    error,
}: ShopInputProps) {
    return (
        <View style={styles.container}>
            {label ? (
                <Typography
                    variant="small"
                    color={COLORS.text}
                    style={styles.label}
                >
                    {label}
                </Typography>
            ) : null}

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textLight}
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                ]}
            />

            {error ? (
                <Typography
                    variant="caption"
                    color={COLORS.error}
                    style={styles.error}
                >
                    {error}
                </Typography>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SIZES.md,
    },

    label: {
        marginBottom: SIZES.xs,
        fontWeight: '600',
    },

    input: {
        height: 48,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.sm,
        paddingHorizontal: SIZES.md,
        fontSize: FONTS.body,
        color: COLORS.text,
    },

    inputError: {
        borderColor: COLORS.error,
    },

    error: {
        marginTop: SIZES.xs,
    },
});

export default memo(ShopInput);