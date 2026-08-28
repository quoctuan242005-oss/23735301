import {
    PRICE_MULTIPLIER,
} from '@constants/student';

export type CategoryId =
    | 'all'
    | 'food'
    | 'drink'
    | 'study';

export type Product = {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    category: CategoryId;
};

type FakeStoreProduct = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

export function getProductCategory(
    category: string,
): CategoryId {
    if (category === 'study' || category === 'drink' || category === 'food' || category === 'all') {
        return category;
    }
    if (category.includes('clothing') || category.includes('men') || category.includes('women')) {
        return 'study';
    }
    if (category.includes('jewel') || category.includes('drink')) {
        return 'drink';
    }
    return 'food';
}

function mapCategory(
    category: string,
): CategoryId {
    return getProductCategory(category);
}

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(
        'https://fakestoreapi.com/products?limit=8',
    );

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const data: FakeStoreProduct[] =
        await res.json();

    return data.map(item => ({
        id: item.id,
        title: item.title,
        price: Math.round(
            item.price * PRICE_MULTIPLIER,
        ),
        image: item.image,
        description: item.description,
        category: mapCategory(item.category),
    }));
}