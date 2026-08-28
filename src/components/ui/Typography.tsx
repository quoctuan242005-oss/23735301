import React, { memo } from 'react';
import {
    Text,
    TextProps,
    StyleSheet,
} from 'react-native';

import { COLORS, FONTS } from '@constants/theme';

type TypographyVariant =
    | 'title'
    | 'heading'
    | 'body'
    | 'button'
    | 'small'
    | 'caption';

type TypographyProps = TextProps & {
    variant?: TypographyVariant;
    color?: string;
    children: React.ReactNode;
};

function Typography({
    variant = 'body',
    color = COLORS.text,
    numberOfLines,
    children,
    style,
    ...props
}: TypographyProps) {
    return (
        <Text
            {...props}
            numberOfLines={numberOfLines}
            style={[
                styles.base,
                { fontSize: FONTS[variant], color },
                variant === 'title' && styles.title,
                variant === 'heading' && styles.heading,
                variant === 'button' && styles.button,
                style,
            ]}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        fontWeight: '400',
    },
    title: {
        fontWeight: '800',
    },
    heading: {
        fontWeight: '700',
    },
    button: {
        fontWeight: '700',
    },
});

export default memo(Typography);