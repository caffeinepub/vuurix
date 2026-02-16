import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    sizes: Array<string>;
    imageUrl: string;
    category: string;
    colors: Array<string>;
    price: bigint;
}
export type Time = bigint;
export interface OrderItem {
    color?: string;
    size?: string;
    productId: ProductId;
    quantity: bigint;
}
export type ProductId = bigint;
export interface Order {
    id: OrderId;
    total: bigint;
    owner: Principal;
    timestamp: Time;
    items: Array<OrderItem>;
}
export type OrderId = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, category: string, imageUrl: string, sizes: Array<string>, colors: Array<string>): Promise<ProductId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(items: Array<OrderItem>, total: bigint): Promise<OrderId>;
    deleteProduct(id: ProductId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(id: OrderId): Promise<Order>;
    getOrders(): Promise<Array<Order>>;
    getProduct(id: ProductId): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: ProductId, name: string, description: string, price: bigint, category: string, imageUrl: string, sizes: Array<string>, colors: Array<string>): Promise<void>;
}
