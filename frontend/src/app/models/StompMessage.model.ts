export interface StompMessage {
    body: string | null;
    headers: any; // Replace 'any' with a more specific type if possible
}