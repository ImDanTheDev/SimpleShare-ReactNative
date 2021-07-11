export default interface IShare {
    id?: string;
    type: string;
    content: string;
    fromUid: string;
    fromProfileId: string;
    toUid: string;
    toProfileId: string;
}
