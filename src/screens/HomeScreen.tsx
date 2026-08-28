import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ui/ShopButton';

import {
    BANNER_IMAGE_ID,
    FLASH_SECONDS,
    STUDENT,
    VARIANT,
    examStamp,
} from '@constants/student';

import { COLORS, SIZES } from '@constants/theme';

import {
    CategoryId,
    fetchProducts,
    Product,
} from '@services/productApi';

import { useCountdown } from '@hooks/useCountdown';
import { useTheme } from '@contexts/ThemeContext';


// ======================================================
// QUANTITY REDUCER
// ======================================================

type QuantityAction =
    | { type: 'ADD' }
    | { type: 'REMOVE' }
    | { type: 'RESET' };

function quantityReducer(
    state: number,
    action: QuantityAction,
): number {
    switch (action.type) {
        case 'ADD':
            return state + 1;

        case 'REMOVE':
            return Math.max(1, state - 1);

        case 'RESET':
            return 1;

        default:
            return state;
    }
}


// ======================================================
// CATEGORY CONFIG
// ======================================================

const CHIP_ORDER: CategoryId[] = [
    'all',
    'food',
    'drink',
    'study',
];

const CHIP_ORDER_REVERSED: CategoryId[] = [
    'study',
    'drink',
    'food',
    'all',
];

const CATEGORY_LABEL: Record<CategoryId, string> = {
    all: 'Tất cả',
    food: 'Đồ ăn',
    drink: 'Nước',
    study: 'Học tập',
};


// ======================================================
// PRODUCT CARD (Khối E)
// ======================================================

type ProductCardProps = {
    item: Product;
    onPress: (item: Product) => void;
    isDark: boolean;
    disabled?: boolean;
};

const ProductCard = memo(function ProductCard({
    item,
    onPress,
    isDark,
    disabled = false,
}: ProductCardProps) {
    const categoryLabel =
        item.category === 'study'
            ? 'Học tập'
            : item.category === 'drink'
                ? 'Nước'
                : 'Đồ ăn';

    return (
        <Pressable
            disabled={disabled}
            onPress={() => onPress(item)}
            style={({ pressed }) => [
                styles.card,
                {
                    backgroundColor: isDark
                        ? '#0B4F4A'
                        : COLORS.surface,
                    opacity: pressed && !disabled ? 0.85 : disabled ? 0.6 : 1,
                },
            ]}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
            />

            <View style={styles.cardContent}>
                <Typography
                    variant="body"
                    numberOfLines={1}
                    color={isDark ? '#F0FDFA' : COLORS.text}
                    style={styles.productTitle}
                >
                    {item.title}
                </Typography>

                <Typography
                    variant="small"
                    color={
                        isDark
                            ? '#B8D5D1'
                            : COLORS.textLight
                    }
                    style={styles.category}
                >
                    {categoryLabel}
                </Typography>

                <Typography
                    variant="body"
                    color={isDark ? '#5EEAD4' : COLORS.primary}
                    style={styles.priceText}
                >
                    {item.price.toLocaleString('vi-VN')} đ
                </Typography>
            </View>

            <Pressable
                disabled={disabled}
                onPress={() => onPress(item)}
                style={({ pressed }) => [
                    styles.orderButton,
                    {
                        backgroundColor: disabled
                            ? '#94A3B8'
                            : COLORS.primary,
                        opacity: pressed && !disabled ? 0.8 : 1,
                    },
                ]}
            >
                <Typography
                    variant="button"
                    color="#FFFFFF"
                >
                    Đặt
                </Typography>
            </Pressable>
        </Pressable>
    );
});


// ======================================================
// HOME SCREEN
// ======================================================

export default function HomeScreen() {
    const {
        colors,
        isDark,
        toggleTheme,
    } = useTheme();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [quantity, dispatchQuantity] = useReducer(quantityReducer, 1);

    const {
        formatted,
        isExpired,
    } = useCountdown(FLASH_SECONDS);


    // ==================================================
    // LOAD PRODUCTS (API FETCH)
    // ==================================================

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch {
            setError(
                `${STUDENT.mssv} — Không tải được dữ liệu món.`,
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let alive = true;

        (async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchProducts();
                if (alive) {
                    setProducts(data);
                }
            } catch {
                if (alive) {
                    setError(
                        `${STUDENT.mssv} — Không tải được dữ liệu món.`,
                    );
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            alive = false;
        };
    }, []);


    // ==================================================
    // SEARCH + CATEGORY FILTER (useMemo)
    // ==================================================

    const visibleProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return products.filter(item => {
            const matchesSearch =
                keyword.length === 0 ||
                item.title.toLowerCase().includes(keyword);

            const matchesCategory =
                selectedCategory === 'all' ||
                item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);


    // ==================================================
    // CHIP ORDER (MSSV 23735301 -> REVERSED)
    // ==================================================

    const chipOrder = VARIANT.chipsReversed
        ? CHIP_ORDER_REVERSED
        : CHIP_ORDER;


    // ==================================================
    // MODAL HANDLERS
    // ==================================================

    const openProduct = useCallback((item: Product) => {
        setSelectedProduct(item);
        dispatchQuantity({ type: 'RESET' });
        setModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setSelectedProduct(null);
        dispatchQuantity({ type: 'RESET' });
    }, []);

    const confirmOrder = useCallback(() => {
        if (!selectedProduct || isExpired) {
            return;
        }

        Alert.alert(
            `CampusMart · ${STUDENT.mssv}`,
            `${STUDENT.hoTen} (#${examStamp()}) đã ghi nhận: ${selectedProduct.title} × ${quantity}. Nhận tại quầy KTX.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        closeModal();
                    },
                },
            ],
        );
    }, [selectedProduct, quantity, isExpired, closeModal]);


    // ==================================================
    // RENDER PRODUCT ITEM
    // ==================================================

    const renderItem = useCallback(
        ({ item }: { item: Product }) => (
            <ProductCard
                item={item}
                onPress={openProduct}
                isDark={isDark}
                disabled={isExpired}
            />
        ),
        [openProduct, isDark, isExpired],
    );


    // ==================================================
    // WATERMARK COMPONENT
    // ==================================================

    const watermark = (
        <Typography
            variant="caption"
            color={isDark ? '#9FC4BF' : colors.textLight}
            style={styles.watermark}
        >
            TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
        </Typography>
    );


    // ==================================================
    // 1. SCENE: ĐANG TẢI (LOADING)
    // Giữa màn hình 1 ActivityIndicator + "Đang tải món…"
    // ==================================================

    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: isDark ? '#042F2E' : '#F0FDFA',
                    },
                ]}
            >
                {VARIANT.watermarkAtTop ? (
                    <View style={styles.topWatermark}>{watermark}</View>
                ) : null}

                <View style={styles.center}>
                    <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                        style={styles.spinner}
                    />
                    <Typography
                        variant="body"
                        color={isDark ? '#B8D5D1' : '#134E4A'}
                        style={styles.loadingText}
                    >
                        Đang tải món...
                    </Typography>
                </View>

                {!VARIANT.watermarkAtTop ? (
                    <View style={styles.bottomWatermark}>{watermark}</View>
                ) : null}
            </View>
        );
    }


    // ==================================================
    // 2. SCENE: LỖI MẠNG (ERROR)
    // Chữ "{MSSV}" màu đỏ + "Không tải được dữ liệu món." + nút đỏ "Thử lại"
    // ==================================================

    if (error) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: isDark ? '#042F2E' : '#F0FDFA',
                    },
                ]}
            >
                {VARIANT.watermarkAtTop ? (
                    <View style={styles.topWatermark}>{watermark}</View>
                ) : null}

                <View style={styles.center}>
                    <Typography
                        variant="heading"
                        color={COLORS.error}
                        style={styles.errorStudentCode}
                    >
                        {STUDENT.mssv}
                    </Typography>

                    <Typography
                        variant="heading"
                        color={isDark ? '#F0FDFA' : '#134E4A'}
                        style={styles.errorMessage}
                    >
                        Không tải được{'\n'}dữ liệu món.
                    </Typography>

                    <Pressable
                        onPress={loadProducts}
                        style={({ pressed }) => [
                            styles.retryButton,
                            {
                                opacity: pressed ? 0.85 : 1,
                            },
                        ]}
                    >
                        <Typography
                            variant="button"
                            color="#FFFFFF"
                            style={styles.retryButtonText}
                        >
                            Thử lại
                        </Typography>
                    </Pressable>
                </View>

                {!VARIANT.watermarkAtTop ? (
                    <View style={styles.bottomWatermark}>{watermark}</View>
                ) : null}
            </View>
        );
    }


    // ==================================================
    // 3. SCENE: CÓ DỮ LIỆU (MAIN LIST)
    // ==================================================

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isDark ? '#042F2E' : '#F0FDFA',
                },
            ]}
        >
            {/* Top Watermark (nếu watermarkAtTop = true) */}
            {VARIANT.watermarkAtTop ? (
                <View style={styles.topWatermark}>{watermark}</View>
            ) : null}

            {/* Khối (0): Header */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: isDark ? '#042F2E' : COLORS.surface,
                        borderBottomColor: isDark ? '#17665F' : COLORS.border,
                    },
                ]}
            >
                <View style={styles.headerTop}>
                    <Typography
                        variant="title"
                        color={COLORS.primary}
                    >
                        CAMPUSMART
                    </Typography>

                    {/* Theme Control: Pressable (MSSV cuối = 1) */}
                    {VARIANT.themeControl === 'pressable' ? (
                        <Pressable
                            onPress={toggleTheme}
                            style={({ pressed }) => [
                                styles.themeButton,
                                {
                                    borderColor: COLORS.primary,
                                    backgroundColor: isDark
                                        ? '#0B4F4A'
                                        : COLORS.surface,
                                    opacity: pressed ? 0.7 : 1,
                                },
                            ]}
                        >
                            <Typography
                                variant="small"
                                color={COLORS.primary}
                            >
                                {isDark ? 'Sáng' : 'Tối'}
                            </Typography>
                        </Pressable>
                    ) : null}
                </View>

                <Typography
                    variant="body"
                    color={isDark ? '#B8D5D1' : colors.textLight}
                >
                    Cửa hàng KTX 24/7
                </Typography>

                <View style={styles.flashRow}>
                    <Typography
                        variant="small"
                        color={COLORS.secondary}
                    >
                        Flash
                    </Typography>

                    <Typography
                        variant="heading"
                        color={COLORS.secondary}
                    >
                        {formatted}
                    </Typography>
                </View>
            </View>

            {/* FlatList danh sách sản phẩm */}
            <FlatList
                data={visibleProducts}
                keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
                renderItem={renderItem}
                ListHeaderComponent={
                    <View>
                        {/* Khối (A): Ô tìm kiếm controlled */}
                        <ShopInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder={`Tìm món ${STUDENT.mssv}...`}
                        />

                        {/* Khối (B): Banner ảnh */}
                        <Image
                            source={{
                                uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320`,
                            }}
                            style={styles.banner}
                            resizeMode="cover"
                            onError={() => {
                                // Tránh crash app khi banner lỗi mạng
                            }}
                        />

                        {/* Khối (C): Tiêu đề và Category Chips */}
                        <Typography
                            variant="heading"
                            color={isDark ? '#F0FDFA' : COLORS.text}
                            style={styles.sectionTitle}
                        >
                            Đặt nhanh · Nhận tại quầy
                        </Typography>

                        <View style={styles.chips}>
                            {chipOrder.map(cat => {
                                const selected = selectedCategory === cat;
                                return (
                                    <Pressable
                                        key={cat}
                                        onPress={() => setSelectedCategory(cat)}
                                        style={({ pressed }) => [
                                            styles.chip,
                                            {
                                                backgroundColor: selected
                                                    ? COLORS.primary
                                                    : isDark
                                                        ? '#0B4F4A'
                                                        : COLORS.surface,
                                                borderColor: COLORS.primary,
                                                opacity: pressed ? 0.7 : 1,
                                            },
                                        ]}
                                    >
                                        <Typography
                                            variant="small"
                                            color={
                                                selected
                                                    ? COLORS.surface
                                                    : COLORS.primary
                                            }
                                        >
                                            {CATEGORY_LABEL[cat]}
                                        </Typography>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    // Nếu API xong nhưng lọc không ra món: chữ "Không có món phù hợp"
                    <View style={styles.empty}>
                        <Typography
                            variant="body"
                            color={isDark ? '#B8D5D1' : colors.textLight}
                        >
                            Không có món phù hợp
                        </Typography>
                    </View>
                }
                contentContainerStyle={[
                    styles.listContent,
                    {
                        backgroundColor: isDark ? '#042F2E' : '#F0FDFA',
                    },
                ]}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Watermark (MSSV cuối = 1 -> luôn hiển thị ở dưới) */}
            {!VARIANT.watermarkAtTop ? (
                <View style={styles.bottomWatermark}>{watermark}</View>
            ) : null}

            {/* Order Modal (Kiểu mở đúng bảng số cuối: fade) */}
            <Modal
                visible={modalVisible}
                transparent
                animationType={VARIANT.modalAnimation}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalCard,
                            {
                                backgroundColor: isDark
                                    ? '#0B4F4A'
                                    : COLORS.surface,
                            },
                        ]}
                    >
                        {/* Dòng tên trong modal */}
                        <Typography
                            variant="caption"
                            color={isDark ? '#9FC4BF' : colors.textLight}
                            style={styles.modalStudent}
                        >
                            TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
                        </Typography>

                        {selectedProduct ? (
                            <>
                                <Image
                                    source={{ uri: selectedProduct.image }}
                                    style={styles.modalImage}
                                    resizeMode="cover"
                                />

                                <Typography
                                    variant="heading"
                                    color={isDark ? '#F0FDFA' : colors.text}
                                    numberOfLines={2}
                                    style={styles.modalTitle}
                                >
                                    {selectedProduct.title}
                                </Typography>

                                <Typography
                                    variant="heading"
                                    color={COLORS.primary}
                                    style={styles.modalPrice}
                                >
                                    {selectedProduct.price.toLocaleString('vi-VN')} đ
                                </Typography>

                                <Typography
                                    variant="small"
                                    color={isDark ? '#B8D5D1' : colors.textLight}
                                    style={styles.modalCategory}
                                >
                                    {selectedProduct.category === 'study'
                                        ? 'Học tập'
                                        : selectedProduct.category === 'drink'
                                            ? 'Nước'
                                            : 'Đồ ăn'}
                                </Typography>

                                <Typography
                                    variant="small"
                                    color={isDark ? '#B8D5D1' : colors.textLight}
                                    numberOfLines={2}
                                    style={styles.description}
                                >
                                    {selectedProduct.description}
                                </Typography>

                                {/* Bộ chọn số lượng − / số / + */}
                                <View style={styles.quantityRow}>
                                    <Pressable
                                        onPress={() => dispatchQuantity({ type: 'REMOVE' })}
                                        style={[
                                            styles.quantityButton,
                                            {
                                                backgroundColor: isDark
                                                    ? '#042F2E'
                                                    : '#E7F7F4',
                                                borderColor: COLORS.primary,
                                            },
                                        ]}
                                    >
                                        <Typography
                                            variant="heading"
                                            color={COLORS.primary}
                                        >
                                            −
                                        </Typography>
                                    </Pressable>

                                    <Typography
                                        variant="heading"
                                        color={isDark ? '#F0FDFA' : colors.text}
                                        style={styles.quantityText}
                                    >
                                        {quantity}
                                    </Typography>

                                    <Pressable
                                        onPress={() => dispatchQuantity({ type: 'ADD' })}
                                        style={[
                                            styles.quantityButton,
                                            {
                                                backgroundColor: isDark
                                                    ? '#042F2E'
                                                    : '#E7F7F4',
                                                borderColor: COLORS.primary,
                                            },
                                        ]}
                                    >
                                        <Typography
                                            variant="heading"
                                            color={COLORS.primary}
                                        >
                                            +
                                        </Typography>
                                    </Pressable>
                                </View>

                                {/* Tổng tiền */}
                                <Typography
                                    variant="heading"
                                    color={isDark ? '#F0FDFA' : colors.text}
                                    style={styles.totalText}
                                >
                                    Tổng: {(selectedProduct.price * quantity).toLocaleString('vi-VN')} đ
                                </Typography>

                                {/* Hết giờ Flash Sale */}
                                {isExpired ? (
                                    <Typography
                                        variant="small"
                                        color={COLORS.error}
                                        style={styles.expired}
                                    >
                                        Hết giờ flash-sale
                                    </Typography>
                                ) : null}

                                {/* Buttons: Đóng & Xác nhận */}
                                <View style={styles.modalButtons}>
                                    <ShopButton
                                        title="Đóng"
                                        variant="outline"
                                        onPress={closeModal}
                                        style={styles.modalButton}
                                    />

                                    <ShopButton
                                        title="Xác nhận"
                                        disabled={isExpired}
                                        onPress={confirmOrder}
                                        style={styles.modalButton}
                                    />
                                </View>
                            </>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </View>
    );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.lg,
    },

    spinner: {
        transform: [{ scale: 1.3 }],
    },

    loadingText: {
        marginTop: SIZES.md,
        fontSize: 16,
        fontWeight: '600',
    },

    errorStudentCode: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 6,
        textAlign: 'center',
    },

    errorMessage: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: SIZES.xl,
    },

    retryButton: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 48,
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    retryButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },

    topWatermark: {
        paddingHorizontal: SIZES.md,
        paddingTop: SIZES.xs,
    },

    bottomWatermark: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.xs,
    },

    watermark: {
        textAlign: 'center',
    },

    header: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.md,
        borderBottomWidth: 1,
    },

    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    themeButton: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.xs,
        borderWidth: 1,
        borderRadius: SIZES.sm,
    },

    flashRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
        marginTop: SIZES.xs,
    },

    listContent: {
        padding: SIZES.md,
        paddingBottom: SIZES.xxl,
    },

    banner: {
        width: '100%',
        height: 130,
        borderRadius: SIZES.md,
        marginBottom: SIZES.md,
    },

    sectionTitle: {
        marginBottom: SIZES.sm,
    },

    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SIZES.sm,
        marginBottom: SIZES.md,
    },

    chip: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.xs,
        borderRadius: 999,
        borderWidth: 1,
    },

    empty: {
        alignItems: 'center',
        paddingVertical: SIZES.xxl,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: SIZES.md,
        padding: SIZES.md,
        marginBottom: SIZES.md,
        minHeight: 90,
    },

    productImage: {
        width: 65,
        height: 65,
        borderRadius: SIZES.sm,
        backgroundColor: '#FDE68A',
    },

    cardContent: {
        flex: 1,
        marginHorizontal: SIZES.md,
    },

    productTitle: {
        fontWeight: '700',
        marginBottom: 2,
    },

    category: {
        marginBottom: 2,
    },

    priceText: {
        fontWeight: '700',
    },

    orderButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.lg,
    },

    modalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: SIZES.lg,
        padding: SIZES.lg,
    },

    modalStudent: {
        marginBottom: SIZES.sm,
        textAlign: 'center',
    },

    modalImage: {
        width: '100%',
        height: 150,
        borderRadius: SIZES.md,
        marginBottom: SIZES.sm,
    },

    modalTitle: {
        marginBottom: SIZES.xs,
    },

    modalPrice: {
        marginBottom: SIZES.xs,
    },

    modalCategory: {
        marginBottom: SIZES.xs,
    },

    description: {
        marginBottom: SIZES.md,
    },

    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SIZES.lg,
        marginBottom: SIZES.sm,
    },

    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quantityText: {
        minWidth: 28,
        textAlign: 'center',
    },

    totalText: {
        textAlign: 'center',
        marginBottom: SIZES.sm,
    },

    expired: {
        textAlign: 'center',
        marginBottom: SIZES.sm,
    },

    modalButtons: {
        flexDirection: 'row',
        gap: SIZES.sm,
        marginTop: SIZES.xs,
    },

    modalButton: {
        flex: 1,
    },
});