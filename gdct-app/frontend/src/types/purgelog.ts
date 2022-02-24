export default interface PurgeLog {

    _id?: string,
    user: string,
    numberArchived: Number,
    numberDeleted: Number,
    archiveMarkerDate: string,
    purgeDate: string,
}