import { NextResponse } from 'next/server';

export async function GET() {
    const products = [
        {
            id: 1,
            name: "Premium Plywood",
            price: "₹1,200",
            image: "/commercial-plywood.jpeg",
            rating: 5,
            isNew: true
        },
        {
            id: 2,
            name: "Door Lock Set",
            price: "₹850",
            image: "/locks1.jpg",
            rating: 4,
            isNew: false
        },
        {
            id: 3,
            name: "Hammer Drill",
            price: "₹2,500",
            image: "/tools.png",
            rating: 5,
            isNew: true
        },
        {
            id: 4,
            name: "Designer Handle",
            price: "₹450",
            image: "/furniture.jpg",
            rating: 4,
            isNew: false
        }
    ];

    return NextResponse.json(products);
}
